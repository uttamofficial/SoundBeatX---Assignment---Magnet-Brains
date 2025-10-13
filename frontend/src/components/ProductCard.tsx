import { Product } from '../types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-red-100 hover:border-red-300">
      <div 
        onClick={() => onViewDetails(product)}
        className="cursor-pointer"
      >
        {imageError ? (
          <div className="w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-red-100 to-yellow-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl mb-1 sm:mb-2">📦</div>
              <p className="text-gray-600 font-medium text-xs sm:text-sm px-2">{product.name}</p>
            </div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 sm:h-40 lg:h-48 object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        )}
        <div className="p-2 sm:p-3 lg:p-4">
          <h3 className="font-semibold text-xs sm:text-sm lg:text-base hover:text-red-600 transition-colors line-clamp-1">{product.name}</h3>
          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-2 sm:mt-3">
            <span className="font-bold text-sm sm:text-base lg:text-lg text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
      <div className="px-2 pb-2 sm:px-3 sm:pb-3 lg:px-4 lg:pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg hover:from-red-700 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;