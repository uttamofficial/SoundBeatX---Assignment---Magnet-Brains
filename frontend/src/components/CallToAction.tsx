import { Link } from './Link';
import { ShoppingBag, ArrowRight, Zap, Sparkles } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="hidden md:block relative py-24 bg-gradient-to-br from-red-600 via-orange-700 to-yellow-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-8 animate-fade-in-up">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">Get Started Today</span>
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        {/* Heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Ready to Experience
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-100 to-white">
                SoundBeatX?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-yellow-100 max-w-2xl mx-auto mb-12 leading-relaxed">
              Discover our premium collection of audio gadgets and tech accessories. Where sound meets innovation.
            </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/gadgets">
            <button className="group relative px-10 py-5 bg-white text-red-700 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                Shop SoundBeatX Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          
          <Link href="/gadgets">
            <button className="group px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-2xl text-lg font-bold shadow-xl hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300">
              <span className="flex items-center justify-center gap-3">
                Browse Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-yellow-100 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Fast Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
