import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './components/StripePaymentForm';
import Footer from './components/Footer';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);

  const { shippingAddress, cart, subtotal, shipping, total } = location.state || {};

  useEffect(() => {
    if (!shippingAddress || !cart || cart.length === 0) {
      navigate('/checkout');
      return;
    }

    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5010';
        const response = await fetch(
          `${API}/api/orders/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: total }),
          }
        );

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        setLoading(false);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        alert('Failed to initialize payment. Please try again.');
        navigate('/checkout');
      }
    };

    createPaymentIntent();
  }, [shippingAddress, cart, total, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Payment</h1>

        <div className="bg-white rounded-lg shadow p-6 pt-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>₹{shipping.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <StripePaymentForm
              shippingAddress={shippingAddress}
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              paymentIntentId={paymentIntentId}
            />
          </Elements>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PaymentPage;
