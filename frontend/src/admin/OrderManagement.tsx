import React, { useState, useEffect } from 'react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Custom dropdown component
const CustomDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; color?: string }[];
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, options, placeholder, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options.find(opt => opt.value === value) || null);

  useEffect(() => {
    const selected = options.find(opt => opt.value === value);
    setSelectedOption(selected || null);
  }, [value, options]);

  const handleSelect = (option: { value: string; label: string; color?: string }) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {selectedOption ? (
            <>
              {selectedOption.color && (
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: selectedOption.color }}
                ></span>
              )}
              <span className="block truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="block truncate text-gray-400">{placeholder}</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {options.map((option) => (
              <li
                key={option.value}
                className={`cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                  selectedOption?.value === option.value ? 'bg-indigo-50' : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                <div className="flex items-center">
                  {option.color && (
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: option.color }}
                    ></span>
                  )}
                  <span className={`${selectedOption?.value === option.value ? 'font-semibold' : 'font-normal'} block truncate`}>
                    {option.label}
                  </span>
                </div>

                {selectedOption?.value === option.value && (
                  <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
  const runtimeApi = typeof window !== 'undefined' && (window as any).__env?.VITE_API_URL;
  let url = `${runtimeApi || import.meta.env.VITE_API_URL || 'http://localhost:5010'}/api/admin/orders`;
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching orders');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Function to open delete confirmation modal
  const openDeleteModal = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  // Function to close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  // Function to handle order deletion
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        // Remove the deleted order from the list
        setOrders(orders.filter(order => order.id !== orderToDelete));
        // Close the modal
        closeDeleteModal();
        // If the deleted order was selected, close the details view
        if (selectedOrder && selectedOrder.id === orderToDelete) {
          setSelectedOrder(null);
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete order');
        closeDeleteModal();
      }
    } catch (err) {
      setError('An error occurred while deleting the order');
      console.error('Error:', err);
      closeDeleteModal();
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        // Update the order in the list
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, ...updatedOrder } : order
        ));
        
        // If the selected order is the one being updated, update it too
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, ...updatedOrder } as Order);
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update order status');
      }
    } catch (err) {
      setError('An error occurred while updating status');
      console.error('Error:', err);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Processing': return '#3b82f6';
      case 'Shipped': return '#8b5cf6';
      case 'Delivered': return '#10b981';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status options for dropdowns
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'Pending', label: 'Pending', color: getStatusColor('Pending') },
    { value: 'Processing', label: 'Processing', color: getStatusColor('Processing') },
    { value: 'Shipped', label: 'Shipped', color: getStatusColor('Shipped') },
    { value: 'Delivered', label: 'Delivered', color: getStatusColor('Delivered') },
    { value: 'Cancelled', label: 'Cancelled', color: getStatusColor('Cancelled') },
  ];

  const orderStatusOptions = [
    { value: 'Pending', label: 'Pending', color: getStatusColor('Pending') },
    { value: 'Processing', label: 'Processing', color: getStatusColor('Processing') },
    { value: 'Shipped', label: 'Shipped', color: getStatusColor('Shipped') },
    { value: 'Delivered', label: 'Delivered', color: getStatusColor('Delivered') },
    { value: 'Cancelled', label: 'Cancelled', color: getStatusColor('Cancelled') },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">Order Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all customer orders</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          <div className="flex">
            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search Bar */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm placeholder-gray-400"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="w-full sm:w-48 flex-shrink-0">
          <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <CustomDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="All Orders"
            className="text-sm"
          />
        </div>
      </div>

      {/* Orders Grid - Mobile First */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                {/* Order Icon */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                
                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">Order #{order.id.substring(0, 8)}</h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">{order.shippingAddress.email}</p>
                      
                      {/* Status and Total Row */}
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">₹{order.total.toFixed(2)}</span>
                      </div>
                      
                      {/* Date and Payment Method */}
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.paymentMethod}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View order details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteModal(order.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No orders match your search or filter criteria.' 
                : 'No orders have been placed yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Details - {selectedOrder.id.substring(0, 8)}...
                </h2>
                <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},<br />
                        {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode},<br />
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order ID</p>
                      <p className="text-sm text-gray-900">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Date</p>
                      <p className="text-sm text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Method</p>
                      <p className="text-sm text-gray-900">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                        selectedOrder.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Update */}
                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-2">
                      Update Order Status
                    </label>
                    <div className="flex">
                      <div className="flex-1">
                        <CustomDropdown
                          value={selectedOrder.orderStatus}
                          onChange={(value) => {
                            const updatedOrder = { ...selectedOrder, orderStatus: value as Order['orderStatus'] };
                            setSelectedOrder(updatedOrder);
                          }}
                          options={orderStatusOptions}
                          placeholder="Select status"
                        />
                      </div>
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.orderStatus)}
                        className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ordered Items */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Ordered Items
                </h3>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item) => (
                      <li key={item.id}>
                        <div className="px-4 py-4 flex items-center sm:px-6">
                          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.name} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'; }} />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                              <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-sm text-gray-500">(₹{item.price.toFixed(2)} each)</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Order Totals */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">₹{selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="text-lg font-medium text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-indigo-600">₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mr-2"
              >
                Close
              </button>
              <button
                onClick={() => openDeleteModal(selectedOrder.id)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete this order? All associated data will be permanently removed from the system.
              </p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;