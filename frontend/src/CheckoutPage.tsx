import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, User, CreditCard, Truck } from 'lucide-react';
import { useCart } from './components/CartContext';
import { useUser } from '@clerk/clerk-react';
import Footer from './components/Footer';
import { ShippingAddress } from './types';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  
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
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingAddress, boolean>>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 1660;
  const total = subtotal + shipping;

  // Enhanced validation functions
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit Indian mobile number';
    return null;
  };

  const validatePincode = (pincode: string): string | null => {
    if (!pincode.trim()) return 'Pincode is required';
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(pincode)) return 'Please enter a valid 6-digit pincode';
    return null;
  };

  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters long';
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
    return null;
  };

  const validateAddress = (address: string): string | null => {
    if (!address.trim()) return 'Address is required';
    if (address.trim().length < 10) return 'Please provide a complete address';
    return null;
  };

  const validateCity = (city: string): string | null => {
    if (!city.trim()) return 'City is required';
    if (city.trim().length < 2) return 'Please enter a valid city name';
    return null;
  };

  const validateState = (state: string): string | null => {
    if (!state.trim()) return 'State is required';
    if (state.trim().length < 2) return 'Please enter a valid state name';
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    newErrors.fullName = validateName(shippingAddress.fullName);
    newErrors.email = validateEmail(shippingAddress.email);
    newErrors.phone = validatePhone(shippingAddress.phone);
    newErrors.address = validateAddress(shippingAddress.address);
    newErrors.city = validateCity(shippingAddress.city);
    newErrors.state = validateState(shippingAddress.state);
    newErrors.pincode = validatePincode(shippingAddress.pincode);

    // Remove null values
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== null)
    ) as Partial<ShippingAddress>;

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  // Real-time validation for individual fields
  const validateField = (field: keyof ShippingAddress, value: string): string | null => {
    switch (field) {
      case 'fullName':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'address':
        return validateAddress(value);
      case 'city':
        return validateCity(value);
      case 'state':
        return validateState(value);
      case 'pincode':
        return validatePincode(value);
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Real-time validation
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ShippingAddress) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, shippingAddress[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    const requiredFields: (keyof ShippingAddress)[] = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    return requiredFields.every(field => {
      const error = validateField(field, shippingAddress[field]);
      return !error && shippingAddress[field].trim() !== '';
    });
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
        // Redirect to Stripe payment page
        navigate('/payment', {
          state: {
            shippingAddress,
            cart,
            subtotal,
            shipping,
            total,
          },
        });
      } else {
        // Process COD order
        const orderData = {
          userId: user?.id || 'guest',
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress,
          subtotal,
          shipping,
          total,
          paymentMethod: 'COD',
        };

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
          throw new Error('Failed to create order');
        }

        const result = await response.json();
        
        // Clear cart and redirect to success page
        clearCart();
        navigate('/order-success', { state: { orderId: result.order.id } });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <div className="text-center bg-white p-8 rounded-xl shadow-xl border-2 border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Add some items to get started!</p>
            <button
              onClick={() => navigate('/stationery')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-36">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-4 sm:p-6 space-y-5 sm:space-y-6 border-2 border-blue-100">
              {/* Form Validation Summary */}
              {!isFormValid() && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-amber-500 text-lg">⚠</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-800 mb-2">
                        Please complete the following required fields:
                      </h3>
                      <ul className="text-xs text-amber-700 space-y-1">
                        {!shippingAddress.fullName.trim() && <li>• Full Name</li>}
                        {!shippingAddress.email.trim() && <li>• Email Address</li>}
                        {!shippingAddress.phone.trim() && <li>• Phone Number</li>}
                        {!shippingAddress.address.trim() && <li>• Complete Address</li>}
                        {!shippingAddress.city.trim() && <li>• City</li>}
                        {!shippingAddress.state.trim() && <li>• State</li>}
                        {!shippingAddress.pincode.trim() && <li>• Pincode</li>}
                        {Object.values(errors).some(error => error) && (
                          <li>• Fix validation errors in the fields above</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <User size={20} className="sm:w-6 sm:h-6" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.fullName && touched.fullName 
                          ? 'border-red-500 bg-red-50' 
                          : touched.fullName && !errors.fullName 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && touched.fullName && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.fullName}
                      </p>
                    )}
                    {touched.fullName && !errors.fullName && shippingAddress.fullName && (
                      <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        Looks good!
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        errors.email && touched.email ? 'text-red-400' : 
                        touched.email && !errors.email ? 'text-green-400' : 'text-gray-400'
                      }`} />
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.email && touched.email 
                            ? 'border-red-500 bg-red-50' 
                            : touched.email && !errors.email 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.email}
                      </p>
                    )}
                    {touched.email && !errors.email && shippingAddress.email && (
                      <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        Valid email address
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        errors.phone && touched.phone ? 'text-red-400' : 
                        touched.phone && !errors.phone ? 'text-green-400' : 'text-gray-400'
                      }`} />
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.phone && touched.phone 
                            ? 'border-red-500 bg-red-50' 
                            : touched.phone && !errors.phone 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.phone}
                      </p>
                    )}
                    {touched.phone && !errors.phone && shippingAddress.phone && (
                      <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        Valid mobile number
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin size={20} className="sm:w-6 sm:h-6" />
                  Shipping Address
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Address *
                    </label>
                    <textarea
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                        errors.address && touched.address 
                          ? 'border-red-500 bg-red-50' 
                          : touched.address && !errors.address 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300'
                      }`}
                      rows={3}
                      placeholder="Enter complete address (House no., Street, Area, Landmark)"
                    />
                    {errors.address && touched.address && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-red-500">⚠</span>
                        {errors.address}
                      </p>
                    )}
                    {touched.address && !errors.address && shippingAddress.address && (
                      <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <span className="text-green-500">✓</span>
                        Complete address provided
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.city && touched.city 
                            ? 'border-red-500 bg-red-50' 
                            : touched.city && !errors.city 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter city name"
                      />
                      {errors.city && touched.city && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.city}
                        </p>
                      )}
                      {touched.city && !errors.city && shippingAddress.city && (
                        <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <span className="text-green-500">✓</span>
                          Valid city
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        onBlur={() => handleBlur('state')}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.state && touched.state 
                            ? 'border-red-500 bg-red-50' 
                            : touched.state && !errors.state 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter state name"
                      />
                      {errors.state && touched.state && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.state}
                        </p>
                      )}
                      {touched.state && !errors.state && shippingAddress.state && (
                        <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <span className="text-green-500">✓</span>
                          Valid state
                        </p>
                      )}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        onBlur={() => handleBlur('pincode')}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.pincode && touched.pincode 
                            ? 'border-red-500 bg-red-50' 
                            : touched.pincode && !errors.pincode 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter 6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && touched.pincode && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <span className="text-red-500">⚠</span>
                          {errors.pincode}
                        </p>
                      )}
                      {touched.pincode && !errors.pincode && shippingAddress.pincode && (
                        <p className="text-green-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                          <span className="text-green-500">✓</span>
                          Valid pincode
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="sm:w-6 sm:h-6" />
                  Payment Method
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'COD')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-2 sm:ml-3 flex items-center gap-2">
                      <Truck size={16} className="sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Cash on Delivery (COD)</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'Online')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-2 sm:ml-3 flex items-center gap-2">
                      <CreditCard size={16} className="sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Online Payment</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !isFormValid()}
                className={`w-full py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg ${
                  isProcessing || !isFormValid()
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : !isFormValid() ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>⚠</span>
                    Please fill all required fields correctly
                  </div>
                ) : paymentMethod === 'COD' ? (
                  'Place Order'
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 pt-8 sm:pt-10 lg:sticky lg:top-4 border-2 border-blue-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-60 sm:max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">₹{shipping.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base sm:text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
