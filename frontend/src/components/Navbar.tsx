import { ShoppingCart, Sparkles, Package, Menu, X, Home, Headphones, Zap, Bell } from 'lucide-react';
import { Link } from './Link';
import { Link as RouterLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { useCart } from './CartContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { getCartCount } = useCart();
  const { user } = useUser();
  const cartCount = getCartCount();
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCartDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-50 via-yellow-50 to-orange-50 shadow-md border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <RouterLink to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 p-2.5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900 group-hover:from-red-800 group-hover:via-orange-600 group-hover:to-yellow-800 transition-colors">
                  SoundBeatX
                </span>
                <span className="text-xs text-gray-600 font-medium hidden sm:block">Professional Audio Services</span>
              </div>
            </RouterLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                href="/gadgets" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-700 font-semibold rounded-lg hover:bg-white/80 transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                <span>Products</span>
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-700 font-semibold rounded-lg hover:bg-white/80 transition-all duration-200"
              >
                <Bell className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-red-700 hover:bg-white/80 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold rounded-full hover:from-red-700 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    <Sparkles className="w-4 h-4" />
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full pl-1 pr-4 py-1 shadow-md hover:bg-white/80 transition-all duration-200 cursor-pointer group">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 rounded-full ring-2 ring-red-400 group-hover:ring-red-500 transition-all duration-300"
                      }
                    }} 
                  />
                  <span 
                    className="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors duration-200"
                    onClick={(e) => {
                      // Find and click the UserButton to open the menu
                      const userButton = e.currentTarget.parentElement?.querySelector('[data-clerk-user-button]') as HTMLElement;
                      if (!userButton) {
                        // Fallback: find the button by its visual appearance
                        const avatarButton = e.currentTarget.parentElement?.querySelector('button') as HTMLElement;
                        avatarButton?.click();
                      } else {
                        userButton.click();
                      }
                    }}
                  >
                    {user?.firstName || user?.username || 'User'}
                  </span>
                </div>
                {/* Mobile: Only avatar without name */}
                <div className="sm:hidden bg-white/60 backdrop-blur-sm rounded-full p-1 shadow-md">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 rounded-full ring-2 ring-red-400 hover:ring-red-500 transition-all duration-300"
                      }
                    }} 
                  />
                </div>
              </SignedIn>
              
              {/* Cart Button */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)} 
                  className="relative p-2.5 bg-white/60 backdrop-blur-sm text-red-700 rounded-full hover:bg-white hover:text-red-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105" 
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                {isCartDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden z-50 animate-[slideDown_0.2s_ease-out]">
                    <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-3">
                      <h3 className="text-white font-bold text-sm">Quick Actions</h3>
                    </div>
                    <Link 
                      href="/checkout" 
                      onClick={() => setIsCartDropdownOpen(false)} 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all duration-200 group border-b border-gray-100"
                    >
                      <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                        <ShoppingCart className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800 block">View Cart</span>
                        <span className="text-xs text-gray-500">Check your items</span>
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <SignedIn>
                      <Link 
                        href="/orders" 
                        onClick={() => setIsCartDropdownOpen(false)} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all duration-200 group"
                      >
                        <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                          <Package className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-800 block">Order History</span>
                          <span className="text-xs text-gray-500">Track your orders</span>
                        </div>
                      </Link>
                    </SignedIn>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-red-200 bg-gradient-to-r from-red-50 to-yellow-50">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 p-2.5 rounded-2xl shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900">
                  SoundBeatX
                </span>
                <p className="text-xs text-gray-600">Professional Audio</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200" 
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="space-y-2 px-4">
              

              <Link 
                href="/gadgets" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <span className="font-semibold block">Products</span>
                  <span className="text-xs text-gray-500">Audio devices</span>
                </div>
              </Link>

              <Link 
                href="/contact" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <span className="font-semibold block">Contact Us</span>
                  <span className="text-xs text-gray-500">Get in touch</span>
                </div>
              </Link>

              <Link 
                href="/checkout" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <ShoppingCart className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold block">Shopping Cart</span>
                  <span className="text-xs text-gray-500">View your items</span>
                </div>
                {cartCount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              <SignedIn>
                <Link 
                  href="/orders" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-4 px-4 py-4 text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <Package className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <span className="font-semibold block">Order History</span>
                    <span className="text-xs text-gray-500">Track orders</span>
                  </div>
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="p-6 border-t border-red-200 bg-gradient-to-r from-red-50 to-yellow-50">
            <SignedOut>
              <SignInButton mode="modal">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold rounded-xl hover:from-red-700 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  Sign In to Continue
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-center p-3 bg-white rounded-xl border border-red-200 shadow-sm">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12 rounded-full ring-2 ring-red-400"
                    }
                  }} 
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </>
  );
}
