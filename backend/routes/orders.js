const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart, userId, email, shippingAddress, subtotal, shipping, total } = req.body;

    console.log('=== Create Checkout Session ===');
    console.log('User ID:', userId);
    console.log('Email:', email);
    console.log('Cart items:', cart.length);

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is required and cannot be empty' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create line items for Stripe checkout
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-failure?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      metadata: {
        userId: userId || 'guest',
        cart: JSON.stringify(cart),
        shippingAddress: JSON.stringify(shippingAddress),
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
      },
    });

    console.log('Stripe session created:', session.id);
    console.log('Metadata includes userId:', session.metadata.userId);

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create payment intent for Stripe
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise/cents
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
router.post('/create', async (req, res) => {
  try {
    console.log('=== Incoming Order Request ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    const {
      userId,
      items,
      shippingAddress,
      subtotal,
      shipping,
      total,
      paymentMethod,
      stripePaymentIntentId,
    } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    // Create order data for MongoDB
    const orderData = {
      user_id: userId,
      items: items.map(item => ({
        id: item.id,
        product_id: item.id, // Store id in both fields for compatibility
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        image: item.image,
      })),
      shipping_address: {
        fullName: shippingAddress.fullName || shippingAddress.name,
        name: shippingAddress.fullName || shippingAddress.name,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India',
      },
      subtotal: parseFloat(subtotal),
      shipping: parseFloat(shipping),
      total: parseFloat(total),
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      order_status: 'Pending',
      stripe_payment_intent_id: stripePaymentIntentId || null,
    };

    console.log('=== Creating Order with Data ===');
    console.log(JSON.stringify(orderData, null, 2));

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    console.log('=== Order Created Successfully ===');
    console.log('Order ID:', savedOrder._id);

    res.json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error('=== Error Creating Order ===');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    if (error.errors) {
      console.error('Validation Errors:', error.errors);
    }
    
    res.status(500).json({ 
      error: error.message,
      details: error.errors || 'No additional details',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user_id: userId })
      .sort({ created_at: -1 });

    // Convert to camelCase for frontend compatibility
    const formattedOrders = orders.map(order => ({
      id: order._id,
      userId: order.user_id,
      items: order.items,
      shippingAddress: order.shipping_address,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.payment_method, // Convert to camelCase
      paymentStatus: order.payment_status, // Convert to camelCase
      orderStatus: order.order_status, // Convert to camelCase
      stripePaymentIntentId: order.stripe_payment_intent_id,
      createdAt: order.created_at, // Convert to camelCase
      updatedAt: order.updated_at, // Convert to camelCase
    }));

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if it's a valid MongoDB ObjectId
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Convert to camelCase for frontend compatibility
    const formattedOrder = {
      id: order._id,
      userId: order.user_id,
      items: order.items,
      shippingAddress: order.shipping_address,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      stripePaymentIntentId: order.stripe_payment_intent_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    res.json({ order: formattedOrder });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    // Check if it's a valid MongoDB ObjectId
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const updateData = {
      updated_at: new Date(),
    };

    if (orderStatus) updateData.order_status = orderStatus;
    if (paymentStatus) updateData.payment_status = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify Stripe session and get order details
router.post('/verify-session', async (req, res) => {
  try {
    const { sessionId } = req.body;

    console.log('=== Verify Session Request ===');
    console.log('Session ID:', sessionId);

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    });

    console.log('Stripe session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent
    });

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Try to find existing order by payment intent ID
    let order = await Order.findOne({ 
      stripe_payment_intent_id: session.payment_intent 
    });

    // If order doesn't exist, create it from session metadata
    if (!order) {
      console.log('Order not found, creating from session metadata');
      
      try {
        const { userId, cart, shippingAddress, subtotal, shipping, total } = session.metadata || {};
        
        if (!cart || !shippingAddress) {
          return res.status(400).json({ 
            error: 'Session metadata incomplete. Order cannot be created.' 
          });
        }

        const orderData = {
          user_id: userId || session.customer_email || session.customer || 'guest',
          items: JSON.parse(cart),
          shipping_address: JSON.parse(shippingAddress),
          subtotal: parseFloat(subtotal || 0),
          shipping: parseFloat(shipping || 0),
          total: parseFloat(total || session.amount_total / 100),
          payment_method: 'Online',
          payment_status: 'Paid',
          order_status: 'Pending',
          stripe_payment_intent_id: session.payment_intent,
        };

        console.log('Creating new order with user_id:', orderData.user_id);
        console.log('Order data:', JSON.stringify(orderData, null, 2));

        order = new Order(orderData);
        await order.save();

        console.log('Order created successfully:', order._id);
      } catch (createError) {
        console.error('Error creating order from session:', createError);
        return res.status(500).json({ 
          error: 'Failed to create order',
          details: createError.message 
        });
      }
    }

    // Convert to camelCase for frontend compatibility
    const formattedOrder = {
      id: order._id,
      userId: order.user_id,
      items: order.items,
      shippingAddress: order.shipping_address,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      stripePaymentIntentId: order.stripe_payment_intent_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    console.log('Returning order:', formattedOrder.id);
    res.json({ order: formattedOrder });
  } catch (error) {
    console.error('=== Error verifying session ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded:', session.id);
      
      // Create order from session metadata
      try {
        const { cart, shippingAddress, subtotal, shipping, total } = session.metadata;
        
        const orderData = {
          user_id: session.customer_email || 'guest',
          items: JSON.parse(cart),
          shipping_address: JSON.parse(shippingAddress),
          subtotal: parseFloat(subtotal),
          shipping: parseFloat(shipping),
          total: parseFloat(total),
          payment_method: 'Online',
          payment_status: 'Paid',
          order_status: 'Pending',
          stripe_payment_intent_id: session.payment_intent,
        };

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        console.log('Order created from webhook:', savedOrder);
      } catch (error) {
        console.error('Error processing webhook order creation:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      // Handle failed payment - could update order status to failed
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
