import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Headphones } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  statusCounts: {
    Pending: number;
    Processing: number;
    Shipped: number;
    Delivered: number;
    Cancelled: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const runtimeApi = typeof window !== 'undefined' && (window as any).__env?.VITE_API_URL;
  const API = runtimeApi || import.meta.env.VITE_API_URL || 'http://localhost:5010';
    const fetchStats = async () => {
      try {
        // Fetch product stats
        const productResponse = await fetch(`${API}/api/admin/products/stats/overview`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        
        const orderResponse = await fetch(`${API}/api/admin/orders/stats/overview`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        if (productResponse.ok && orderResponse.ok) {
          const productData = await productResponse.json();
          const orderData = await orderResponse.json();
          
          setStats({
            totalProducts: productData.totalProducts,
            totalOrders: orderData.totalOrders,
            totalRevenue: orderData.totalRevenue,
            statusCounts: orderData.statusCounts,
          });
        } else {
          throw new Error('Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Chart data for order status
  const statusData = [
    { name: 'Pending', value: stats?.statusCounts?.Pending || 0, color: 'bg-yellow-500' },
    { name: 'Processing', value: stats?.statusCounts?.Processing || 0, color: 'bg-blue-500' },
    { name: 'Shipped', value: stats?.statusCounts?.Shipped || 0, color: 'bg-purple-500' },
    { name: 'Delivered', value: stats?.statusCounts?.Delivered || 0, color: 'bg-green-500' },
    { name: 'Cancelled', value: stats?.statusCounts?.Cancelled || 0, color: 'bg-red-500' },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Branded header */}
      <div className="mb-6">
        <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-yellow-50 to-orange-50 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <RouterLink to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 p-2.5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900 group-hover:from-red-800 group-hover:via-orange-600 group-hover:to-yellow-800 transition-colors">
                  SoundBeatX
                </span>
                <span className="text-xs text-gray-600 font-medium hidden sm:block">Admin Dashboard</span>
              </div>
            </RouterLink>
            <div className="flex items-center gap-3">
              <RouterLink
                to="/admin/products"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-white/70 hover:bg-white shadow border border-red-200 text-red-700 hover:text-red-800 transition-colors"
              >
                Manage Products
              </RouterLink>
              <RouterLink
                to="/admin/orders"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-white/70 hover:bg-white shadow border border-yellow-200 text-yellow-700 hover:text-yellow-800 transition-colors"
              >
                View Orders
              </RouterLink>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - themed cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-red-100">
          <div className="flex items-center">
            <div className="rounded-lg bg-gradient-to-br from-red-100 to-yellow-100 p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Products</h2>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-green-100">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Orders</h2>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-yellow-100">
          <div className="flex items-center">
            <div className="rounded-lg bg-yellow-100 p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Total Revenue</h2>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-red-100">
          <div className="flex items-center">
            <div className="rounded-lg bg-red-100 p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">Pending Orders</h2>
              <p className="text-2xl font-bold text-gray-900">{stats?.statusCounts?.Pending || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Overview */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {statusData.map((status, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                <div className={`mx-auto h-3 w-3 rounded-full ${status.color} mb-2`}></div>
                <p className="text-2xl font-bold text-gray-900">{status.value}</p>
                <p className="text-xs text-gray-600">{status.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Distribution</h2>
          <div className="space-y-4">
            {statusData.map((status, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-600 truncate">{status.name}</div>
                <div className="flex-1 ml-2">
                  <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${status.color}`} 
                      style={{ width: `${stats ? (status.value / stats.totalOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-900">{status.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <div className="rounded-full bg-indigo-100 p-3 mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Add Product</h3>
            <p className="mt-1 text-sm text-gray-500 text-center">Add new products to your store</p>
          </button>
          
          <button 
            onClick={() => navigate('/admin/orders')}
            className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">View Orders</h3>
            <p className="mt-1 text-sm text-gray-500 text-center">Manage customer orders</p>
          </button>
          
          <button 
            onClick={() => navigate('/admin/products')}
            className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="rounded-full bg-purple-100 p-3 mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Manage Products</h3>
            <p className="mt-1 text-sm text-gray-500 text-center">Edit or delete existing products</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;