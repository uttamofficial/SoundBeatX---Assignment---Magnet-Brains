import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useUser } from '@clerk/clerk-react';
import { useCart } from './CartContext';

interface StripePaymentFormProps {
  shippingAddress: any;
  cart: any[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentIntentId: string;
}

export default function StripePaymentForm({
  shippingAddress,
  cart,
  subtotal,
  shipping,
  total,
  paymentIntentId,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useUser();
  const { clearCart } = useCart();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/payment-processing',
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
      setIsLoading(false);
    } else {
      // Payment succeeded, create order
      try {
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
          paymentMethod: 'Online',
          stripePaymentIntentId: paymentIntentId,
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
      } catch (error) {
        console.error('Error creating order:', error);
        setMessage('Payment successful but failed to create order. Please contact support.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
      
      <PaymentElement id="payment-element" />
      
      {message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {message}
        </div>
      )}
      
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
      </button>

      <p className="mt-4 text-sm text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}
