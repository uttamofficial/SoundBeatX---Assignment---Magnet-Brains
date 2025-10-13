import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Footer from './components/Footer';

function PaymentFailurePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { error: initialError, orderId } = location.state || {};
  const [error, setError] = useState(initialError);

  useEffect(() => {
    // Check for session_id in URL params (from Stripe redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId && !error) {
      setError('Payment was cancelled or failed');
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const handleRetryPayment = () => {
    navigate('/cart');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-28">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border border-red-200">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>

          <p className="text-gray-600 mb-2">We're sorry, but your payment could not be processed.</p>
          
          {error && (
            <p className="text-sm text-red-600 mb-4 font-medium">
              Error: {error}
            </p>
          )}

          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <XCircle className="inline-block mr-2" size={16} />
              Don't worry, no charges have been made to your account. You can try again or contact support if the problem persists.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-yellow-600 transition-colors"
            >
              <RefreshCw size={20} />
              Try Payment Again
            </button>

            <button
              onClick={handleGoHome}
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@printnsupply.com" className="text-blue-600 hover:underline">
                support@printnsupply.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentFailurePage;
