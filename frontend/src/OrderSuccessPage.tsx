import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Footer from './components/Footer';
import { useCart } from './components/CartContext';

function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const verificationStartedRef = useRef(false);
  const { clearCart } = useCart();

  useEffect(() => {
    // Prevent multiple verification attempts (React Strict Mode protection)
    if (verificationStartedRef.current) {
      console.log('Verification already started, skipping duplicate call');
      return;
    }

    // Check for session_id in URL params (from Stripe redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId && !orderId && !orderDetails) {
      // Mark verification as started BEFORE calling the function
      verificationStartedRef.current = true;
      // Handle Stripe checkout success
      handleStripeSuccess(sessionId);
    } else if (!orderId && !sessionId) {
      navigate('/');
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []); // Empty dependency array - only run once on mount

  const handleStripeSuccess = async (sessionId: string) => {
    setIsLoading(true);
    try {
      console.log('Verifying Stripe session:', sessionId);
      
      // Verify the session with Stripe and get order details
  const runtimeApi = typeof window !== 'undefined' && (window as any).__env?.VITE_API_URL;
  const API = runtimeApi || import.meta.env.VITE_API_URL || 'http://localhost:5010';
  const response = await fetch(`${API}/api/orders/verify-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order verified successfully:', data.order);
        setOrderDetails(data.order);
        
        // Clear the cart after successful payment
        console.log('Clearing cart after successful payment');
        clearCart();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to verify session:', errorData);
        navigate('/payment-failure', { state: { error: errorData.error || 'Failed to verify payment' } });
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      navigate('/payment-failure', { state: { error: 'Payment verification failed' } });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12 pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentOrderId = orderId || orderDetails?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-28">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border border-red-200">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-2">Thank you for your order.</p>
          <p className="text-sm text-gray-500 mb-6">
            Order ID: <span className="font-mono font-semibold">{currentOrderId}</span>
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <Package className="inline-block mr-2" size={16} />
              You will receive an order confirmation email with details of your order and tracking information.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-yellow-600 transition-colors"
            >
              View Order History
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => navigate('/gadgets')}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderSuccessPage;
