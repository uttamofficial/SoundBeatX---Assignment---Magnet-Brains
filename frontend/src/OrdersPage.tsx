import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from './components/Footer';
import { Order } from './types';

function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/user/${user?.id}`
      );
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'Processing':
        return <Package className="text-orange-500" size={20} />;
      case 'Shipped':
        return <Truck className="text-red-500" size={20} />;
      case 'Delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Cancelled':
        return <XCircle className="text-gray-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-orange-100 text-orange-800';
      case 'Shipped':
        return 'bg-red-100 text-red-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pt-24 sm:pt-28">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
            My Orders
          </h1>
          <p className="text-sm text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-red-200">
            <Package size={48} className="sm:w-16 sm:h-16 mx-auto text-red-300 mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Start shopping to see your orders here.
            </p>
            <a
              href="/stationery"
              className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-xl hover:from-red-700 hover:to-yellow-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-200">
                <div className="p-4 sm:p-6">
                  {/* Order Header - Mobile Optimized */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                          Order #{order.id.substring(0, 8)}
                        </h3>
                        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="text-lg sm:text-xl font-bold text-red-600">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        {order.paymentMethod === 'COD' ? 'COD' : 'Online'}
                      </p>
                    </div>
                  </div>

                  {/* Status with Icon */}
                  <div className="flex items-center gap-2 mb-3 p-2 sm:p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-100">
                    {getStatusIcon(order.orderStatus)}
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">
                      {order.orderStatus === 'Pending' && 'Order being processed'}
                      {order.orderStatus === 'Processing' && 'Order being prepared'}
                      {order.orderStatus === 'Shipped' && 'Order on the way'}
                      {order.orderStatus === 'Delivered' && 'Order delivered'}
                      {order.orderStatus === 'Cancelled' && 'Order cancelled'}
                    </span>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm w-full justify-center sm:justify-start py-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {expandedOrder === order.id ? (
                      <>
                        <ChevronUp size={18} />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown size={18} />
                        View Details
                      </>
                    )}
                  </button>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-red-100">
                      <h4 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Order Items</h4>
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{item.name}</h5>
                              <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
                                Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs sm:text-sm font-bold text-red-600 mt-1">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Shipping Address</h4>
                      <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-gray-700 border border-red-100">
                        <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="mt-1">{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                        <p className="mt-2">
                          📞 {order.shippingAddress.phone}
                        </p>
                        <p>📧 {order.shippingAddress.email}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-red-100 bg-gradient-to-r from-red-50 to-yellow-50 p-3 rounded-lg">
                        <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">₹{order.shipping.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-red-200">
                          <span>Total</span>
                          <span className="text-red-600">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrdersPage;
