import { X, ShoppingCart, Package, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    // Optional: close modal after adding to cart
    // onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category Badge */}
              <div className="inline-block mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-yellow-100 text-red-700 text-sm font-semibold rounded-full border border-red-200">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900 mb-4">
                {product.name}
              </h2>

              {/* Rating (mock) */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                </div>
                <span className="ml-2 text-sm text-gray-600">(4.8 out of 5)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-500 ml-2">(Inclusive of all taxes)</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features/Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Package className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">High-quality materials for durability</span>
                  </li>
                  <li className="flex items-start">
                    <Package className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Perfect for professional and personal use</span>
                  </li>
                  <li className="flex items-start">
                    <Package className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Fast shipping and secure packaging</span>
                  </li>
                  <li className="flex items-start">
                    <Package className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">100% satisfaction guaranteed</span>
                  </li>
                </ul>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <p className="text-green-600 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  In Stock - Ready to Ship
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="w-full px-6 py-3 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
