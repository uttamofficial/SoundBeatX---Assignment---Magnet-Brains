const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyAdminToken } = require('./adminAuth');

// Get all orders with pagination and filtering
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Build query filter
    const filter = {};
    if (status) {
      filter.order_status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    // Format the response to match frontend expectations
    const formattedOrders = orders.map(order => ({
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
      updatedAt: order.updated_at
    }));

    res.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

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
      updatedAt: order.updated_at
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.patch('/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const updateData = {
      updated_at: new Date()
    };

    if (orderStatus !== undefined) updateData.order_status = orderStatus;
    if (paymentStatus !== undefined) updateData.payment_status = paymentStatus;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const formattedOrder = {
      id: updatedOrder._id,
      userId: updatedOrder.user_id,
      items: updatedOrder.items,
      shippingAddress: updatedOrder.shipping_address,
      subtotal: updatedOrder.subtotal,
      shipping: updatedOrder.shipping,
      total: updatedOrder.total,
      paymentMethod: updatedOrder.payment_method,
      paymentStatus: updatedOrder.payment_status,
      orderStatus: updatedOrder.order_status,
      stripePaymentIntentId: updatedOrder.stripe_payment_intent_id,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get order statistics
router.get('/stats/overview', verifyAdminToken, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({}, { total: 1, order_status: 1 });
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const statusCounts = orders.reduce((acc, o) => {
      acc[o.order_status] = (acc[o.order_status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalOrders,
      totalRevenue,
      statusCounts
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

// Delete an order
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order: ' + error.message });
  }
});

module.exports = router;