import { Minus, Plus, X, Printer, FileText, MapPin, Phone, Mail, User, CreditCard, Truck, ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useCart } from './components/CartContext';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ShippingAddress } from './types';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout'>('cart');
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // Migrate old cart items that have _id but not id
  useEffect(() => {
    const migrateCart = () => {
      const cartData = localStorage.getItem('shopping-cart');
      if (cartData) {
        try {
          const cartItems = JSON.parse(cartData);
          let needsMigration = false;
          
          const migratedItems = cartItems.map((item: any) => {
            if (!item.id && item._id) {
              needsMigration = true;
              return { ...item, id: item._id };
            }
            return item;
          });
          
          if (needsMigration) {
            console.log('Migrating cart items to include id field');
            localStorage.setItem('shopping-cart', JSON.stringify(migratedItems));
            window.location.reload();
          }
        } catch (error) {
          console.error('Error migrating cart:', error);
        }
      }
    };
    
    migrateCart();
  }, []);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = 'Email is invalid';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^[0-9]{10}$/.test(shippingAddress.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'Online') {
        // Create Stripe Checkout Session
  const runtimeApi = typeof window !== 'undefined' && (window as any).__env?.VITE_API_URL;
  const API = runtimeApi || import.meta.env.VITE_API_URL || 'http://localhost:5010';
  const response = await fetch(`${API}/api/orders/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart,
            userId: user?.id || 'guest',
            email: shippingAddress.email,
            shippingAddress,
            subtotal,
            shipping,
            total,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        console.log('Cart items before mapping:', cart);
        const orderData = {
          userId: user?.id || 'guest',
          items: cart.map(item => {
            console.log('Mapping cart item:', item);
            // Use _id as fallback if id is not present (for old cart items)
            // Handle both string and ObjectId formats
            let itemId: any = item.id;
            if (!itemId) {
              const anyItem = item as any;
              itemId = anyItem._id || anyItem.id;
              // If _id is an object, convert to string
              if (itemId && typeof itemId === 'object' && itemId.$oid) {
                itemId = itemId.$oid;
              }
            }
            
            console.log('Item ID resolved to:', itemId);
            
            if (!itemId) {
              console.error('Cart item missing ID - item:', JSON.stringify(item));
              // Use a fallback - item name + price as a temp ID
              itemId = `temp-${item.name}-${item.price}`.replace(/\s+/g, '-');
              console.warn('Using fallback ID:', itemId);
            }
            
            return {
              id: itemId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            };
          }),
          shippingAddress,
          subtotal,
          shipping,
          total,
          paymentMethod: 'COD',
        };

  console.log('Sending order data:', JSON.stringify(orderData, null, 2));
  const runtimeApi = typeof window !== 'undefined' && (window as any).__env?.VITE_API_URL;
  const API = runtimeApi || import.meta.env.VITE_API_URL || 'http://localhost:5010';
  const response = await fetch(`${API}/api/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Order creation failed:', errorData);
          throw new Error(errorData.error || 'Failed to create order');
        }

        const result = await response.json();
        clearCart();
        navigate('/order-success', { state: { orderId: result.order.id } });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process order';
      alert(`Failed to process order: ${errorMessage}. Please check the console for details.`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-[80vh] pt-20">
          <div className="text-center p-12">
            <ShoppingCart className="w-24 h-24 text-red-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything yet!</p>
            <button
              onClick={() => navigate('/stationery')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-xl hover:from-red-700 hover:to-yellow-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      <Navbar />
      {/* Progress Steps */}
      <div className="bg-white border-b border-red-200 shadow-sm sticky top-16 z-40 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                currentStep === 'cart' 
                  ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg' 
                  : 'bg-green-500 text-white'
              }`}>
                {currentStep === 'checkout' ? <Check size={20} /> : '1'}
              </div>
              <span className={`ml-2 font-semibold ${currentStep === 'cart' ? 'text-red-600' : 'text-green-600'}`}>
                Shopping Cart
              </span>
            </div>

            {/* Divider */}
            <div className={`w-16 h-1 rounded ${currentStep === 'checkout' ? 'bg-green-500' : 'bg-gray-300'}`}></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                currentStep === 'checkout' 
                  ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white shadow-lg' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className={`ml-2 font-semibold ${currentStep === 'checkout' ? 'text-red-600' : 'text-gray-500'}`}>
                Checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: CART VIEW */}
      {currentStep === 'cart' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
              Shopping Cart
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (window.confirm('Clear all items from cart?')) {
                    clearCart();
                  }
                }}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
              >
                Clear Cart
              </button>
              <span className="text-gray-600 font-semibold">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border border-red-200">
                {cart.map((item, index) => {
                  const isPrintJob = item.name.includes('Print Job');
                  
                  return (
                    <div
                      key={`cart-item-${item.id}-${index}`}
                      className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-red-50 to-yellow-50 hover:from-yellow-50 hover:to-orange-50 transition-all border border-red-200"
                    >
                      {/* First Row: Image and Product Details */}
                      <div className="flex items-center gap-3 mb-3">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md ${isPrintJob ? 'border-2 border-red-400' : ''}`}
                          />
                          {isPrintJob && (
                            <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-lg">
                              <Printer size={12} />
                            </div>
                          )}
                        </div>

                        {/* Product Details - Name and Badge */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {isPrintJob && <FileText key="icon" size={16} className="text-red-600 flex-shrink-0" />}
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">{item.name}</h3>
                          </div>
                          {isPrintJob && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                              📄 Print Work
                            </span>
                          )}
                          <p className="text-red-600 font-semibold text-sm mt-1">₹{item.price.toLocaleString('en-IN')} each</p>
                        </div>
                      </div>

                      {/* Second Row: Quantity Controls, Price, and Delete Button */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-red-200">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-0.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            <Minus size={16} className="text-red-600" />
                          </button>
                          <span className="text-base font-bold text-gray-800 min-w-[28px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-0.5 hover:bg-red-50 rounded transition-colors"
                          >
                            <Plus size={16} className="text-red-600" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-lg sm:text-xl font-bold text-red-600 flex-1 text-center">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl p-6 pt-8 border border-red-200 sticky top-36">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ShoppingCart className="text-red-600" />
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-700 text-lg">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-lg">
                    <span>Shipping</span>
                    <span className="font-semibold">₹{shipping.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t-2 border-red-200 pt-4 flex justify-between text-gray-900 font-bold text-2xl">
                    <span>Total</span>
                    <span className="text-red-600">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentStep('checkout')}
                    className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-4 rounded-xl hover:from-red-700 hover:to-yellow-600 transition-all transform hover:scale-105 font-bold text-lg shadow-lg mt-6"
                  >
                    Proceed to Checkout →
                  </button>

                  <button 
                    onClick={() => navigate('/stationery')}
                    className="w-full bg-white border-2 border-red-600 text-red-600 py-3 rounded-xl hover:bg-red-50 transition-all font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: CHECKOUT VIEW */}
      {currentStep === 'checkout' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setCurrentStep('cart')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-red-200">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
                  Customer Information
                </h1>

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="text-red-600" size={24} />
                    Contact Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                          errors.fullName ? 'border-red-500' : 'border-red-200 focus:border-red-500'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
                        <input
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                            errors.email ? 'border-red-500' : 'border-red-200 focus:border-red-500'
                          }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
                        <input
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                            errors.phone ? 'border-red-500' : 'border-red-200 focus:border-red-500'
                          }`}
                          placeholder="9876543210"
                          maxLength={10}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="text-red-600" size={24} />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={shippingAddress.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                          errors.address ? 'border-red-500' : 'border-red-200 focus:border-red-500'
                        }`}
                        rows={3}
                        placeholder="House no., Street, Area"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                            errors.city ? 'border-red-500' : 'border-red-200 focus:border-red-500'
                          }`}
                          placeholder="Mumbai"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1 font-semibold">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                            errors.state ? 'border-red-500' : 'border-red-200 focus:border-red-500'
                          }`}
                          placeholder="Maharashtra"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1 font-semibold">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 transition-all ${
                            errors.pincode ? 'border-red-500' : 'border-red-200 focus:border-red-500'
                          }`}
                          placeholder="400001"
                          maxLength={6}
                        />
                        {errors.pincode && (
                          <p className="text-red-500 text-sm mt-1 font-semibold">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="text-red-600" size={24} />
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'COD' 
                        ? 'border-red-600 bg-red-50' 
                        : 'border-red-200 hover:border-red-400 hover:bg-red-50'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'COD')}
                        className="w-5 h-5 text-red-600"
                      />
                      <div className="ml-3 flex items-center gap-2">
                        <Truck size={24} className="text-red-600" />
                        <span className="font-bold text-gray-800">Cash on Delivery (COD)</span>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'Online' 
                        ? 'border-red-600 bg-red-50' 
                        : 'border-red-200 hover:border-red-400 hover:bg-red-50'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={paymentMethod === 'Online'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'Online')}
                        className="w-5 h-5 text-red-600"
                      />
                      <div className="ml-3 flex items-center gap-2">
                        <CreditCard size={24} className="text-red-600" />
                        <span className="font-bold text-gray-800">Online Payment (Cards, UPI, Wallets)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-yellow-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isProcessing ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
                </button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 pt-8 border border-red-200 sticky top-36">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="text-red-600" />
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                  {cart.map((item, index) => {
                    const isPrintJob = item.name.includes('Print Job');
                    return (
                      <div key={`checkout-item-${item.id}-${index}`} className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-yellow-50 border border-red-200">
                        {/* Product Image and Name */}
                        <div className="flex gap-3 mb-3">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className={`w-20 h-20 object-cover rounded-lg shadow-md ${isPrintJob ? 'border-2 border-red-400' : ''}`}
                            />
                            {isPrintJob && (
                              <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-lg">
                                <Printer size={12} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 bg-red-100 rounded-lg text-red-600 hover:bg-red-200 transition-colors flex-shrink-0"
                                title="Remove item"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            {isPrintJob && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                                📄 Print
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-red-200">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-0.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            >
                              <Minus size={14} className="text-red-600" />
                            </button>
                            <span className="text-base font-bold text-gray-800 min-w-[24px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-0.5 hover:bg-red-50 rounded transition-colors"
                            >
                              <Plus size={14} className="text-red-600" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-600">₹{item.price.toLocaleString('en-IN')} each</p>
                            <p className="text-base font-bold text-red-600">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t-2 border-red-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">₹{shipping.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t-2 border-red-200 pt-2 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-red-600">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;