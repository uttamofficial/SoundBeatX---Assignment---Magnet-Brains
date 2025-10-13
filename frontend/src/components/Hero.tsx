import { Link } from './Link';
import { ArrowRight, Sparkles, Zap, Headphones, Watch, Speaker } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Floating Gadget Images - Left Side */}
      <div className="hidden lg:block absolute left-24 xl:left-48 top-1/2 -translate-y-1/2 space-y-8">
        {/* Headphones Card */}
        <div className="group relative animate-float">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-2 border-red-200 hover:border-red-400 transition-all hover:scale-110 transform">
            <Headphones className="w-16 h-16 text-red-600" />
            <p className="mt-2 text-sm font-bold text-gray-800">Premium<br/>Headphones</p>
          </div>
        </div>
        
        {/* Smartwatch Card */}
        <div className="group relative animate-float animation-delay-2000 ml-12">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-2 border-yellow-200 hover:border-yellow-400 transition-all hover:scale-110 transform">
            <Watch className="w-16 h-16 text-yellow-600" />
            <p className="mt-2 text-sm font-bold text-gray-800">Smart<br/>Watches</p>
          </div>
        </div>
      </div>

      {/* Floating Gadget Images - Right Side */}
      <div className="hidden lg:block absolute right-24 xl:right-48 top-1/2 -translate-y-1/2 space-y-8">
        {/* Speaker Card */}
        <div className="group relative animate-float animation-delay-1000 mr-12">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-2 border-orange-200 hover:border-orange-400 transition-all hover:scale-110 transform">
            <Speaker className="w-16 h-16 text-orange-600" />
            <p className="mt-2 text-sm font-bold text-gray-800">Wireless<br/>Speakers</p>
          </div>
        </div>
        
        {/* Earbuds Card */}
        <div className="group relative animate-float animation-delay-3000">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-2 border-red-200 hover:border-red-400 transition-all hover:scale-110 transform">
            <div className="w-16 h-16 flex items-center justify-center text-4xl">🎧</div>
            <p className="mt-2 text-sm font-bold text-gray-800">True Wireless<br/>Earbuds</p>
          </div>
        </div>
      </div>

      {/* Mobile Gadget Icons - Simplified for Mobile */}
      <div className="lg:hidden absolute top-20 left-0 right-0 flex justify-around px-4 opacity-20">
        <div className="animate-float">
          <Headphones className="w-12 h-12 text-red-600" />
        </div>
        <div className="animate-float animation-delay-1000">
          <Watch className="w-12 h-12 text-yellow-600" />
        </div>
        <div className="animate-float animation-delay-2000">
          <Speaker className="w-12 h-12 text-orange-600" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-red-200 text-red-900 shadow-lg">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium">Premium Audio Experience</span>
            <Zap className="w-4 h-4 text-yellow-600" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900 leading-tight tracking-tight">
            SoundBeatX
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-yellow-500 to-orange-600">
              Audio Revolution
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-light">
            Experience the ultimate in audio technology with our premium collection of earbuds, headphones, speakers, and smartwatches. Where sound meets innovation.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link href="/gadgets">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            
            <Link href="/gadgets">
              <button className="group px-8 py-4 bg-white/90 backdrop-blur-md text-red-700 border-2 border-red-300 rounded-xl text-lg font-bold shadow-xl hover:bg-white hover:border-red-500 transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '100K+', label: 'Happy Customers' },
              { value: '500K+', label: 'Gadgets Sold' },
              { value: '24/7', label: 'Support' },
              { value: '4.9★', label: 'Rating' }
            ].map((stat, index) => (
              <div key={index} className="p-4 bg-white/80 backdrop-blur-md rounded-xl border border-red-200 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on Mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-red-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-red-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
