import { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import PriceRangeSlider from "./components/PriceRangeSlider";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import ProductDetailModal from "./components/ProductDetailModal";
import { Product } from "./types";
import { productService } from "./services/productService";
import { useCart } from './components/CartContext';

function GadgetsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5010';
        const response = await fetch(`${API}/api/products`);
        if (response.ok) {
          const fetchedProducts = await response.json();
          setProducts(fetchedProducts);
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error in fetchProducts:', err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map(product => product.category)));

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAddToCart = (product: Product) => {
    console.log("Adding product to cart:", product);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    
    // Show toast notification
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      (!selectedCategories.length ||
        selectedCategories.includes(product.category)) &&
      product.price <= priceRange
  );

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-[72px] flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
            <p className="text-2xl font-bold text-gray-800">Loading amazing gadgets...</p>
            <p className="text-gray-600 mt-2">Please wait a moment</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-[72px] flex-1 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md border border-red-200">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-yellow-600 transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 min-h-screen flex flex-col">
      <Navbar />
      
      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      <div className="pt-24 py-8">
        <main className="flex-1 max-w-7xl mx-auto px-6 pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-80">
              {/* Mobile Filter Toggle */}
              <div className="md:hidden mb-2">
                <button
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-3 px-4 font-bold rounded-xl shadow-lg flex justify-center items-center gap-2 focus:outline-none hover:from-red-700 hover:to-yellow-600 transition-all text-base"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <span className="text-lg">{isFilterOpen ? "✕" : "🔍"}</span>
                  {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </button>
              </div>

              {/* Desktop & Mobile Filters */}
              <div className={`bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>🎧</span>
                    SoundBeatX Filters
                  </h2>
                </div>

                <div className="p-6 space-y-8">
                  {/* Categories */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">📂</span>
                      Categories
                    </h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center cursor-pointer group hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      Price Range
                    </h3>
                    <PriceRangeSlider
                      value={priceRange}
                      onChange={setPriceRange}
                      max={5000}
                    />
                    <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-600">
                        Maximum Price: <span className="font-bold text-red-600 text-lg">₹{priceRange.toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-gray-700">
                      <span className="text-green-600 text-2xl">✓</span> {filteredProducts.length} Gadgets Found
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Section */}
            <section className="flex-1">
              <div className="mb-3 bg-white rounded-xl p-4 shadow-lg border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
                      SoundBeatX Collection
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-md">
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold">{filteredProducts.length}</p>
                      <p className="text-[10px] sm:text-xs font-medium opacity-90">Gadgets</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="transform hover:scale-105 transition-transform duration-300"
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-red-200">
                      <div className="text-6xl mb-4">🎧</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Gadgets Found</h3>
                      <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                      <button
                        onClick={() => {
                          setSelectedCategories([]);
                          setPriceRange(5000);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-yellow-600 transition-all shadow-lg"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default GadgetsPage;

