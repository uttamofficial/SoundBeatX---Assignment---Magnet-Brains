import { Facebook, Twitter, Instagram, Linkedin, Headphones, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-8 md:pb-12 border-b border-white/10">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Headphones className="w-6 md:w-8 h-6 md:h-8 text-red-400" />
              <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400">
                SoundBeatX
              </h3>
            </div>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Experience the ultimate in audio technology with our premium collection of gadgets. Where sound meets innovation.
            </p>
            <div className="space-y-2 pt-2 md:pt-4">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                <Mail className="w-3 md:w-4 h-3 md:h-4 text-red-400" />
                <span>support@soundbeatx.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                <Phone className="w-3 md:w-4 h-3 md:h-4 text-red-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300 md:hidden">
                <MapPin className="w-3 h-3 text-red-400" />
                <span>Global Delivery</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Global Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Hidden on Mobile */}
          <div className="hidden md:block">
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {['Gadgets', 'Audio Collection', 'Support', 'About Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-px bg-gradient-to-r from-red-400 to-orange-400 group-hover:w-4 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support - Hidden on Mobile */}
          <div className="hidden md:block">
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {['FAQ', 'Shipping', 'Returns', 'Payment Options'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-0 h-px bg-gradient-to-r from-red-400 to-orange-400 group-hover:w-4 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6 relative inline-block">
              Follow Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full"></span>
            </h3>
            <div className="flex gap-3 md:gap-4">
              {[
                { Icon: Facebook, label: 'Facebook', color: 'hover:bg-red-600' },
                { Icon: Twitter, label: 'Twitter', color: 'hover:bg-orange-500' },
                { Icon: Instagram, label: 'Instagram', color: 'hover:bg-red-500' },
                { Icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-red-700' }
              ].map(({ Icon, label, color }) => (
                <a
                  key={label}
                  href="#"
                  className={`p-2 md:p-3 bg-white/5 border border-white/10 rounded-lg ${color} hover:border-transparent transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group`}
                  aria-label={label}
                >
                  <Icon className="w-4 md:w-5 h-4 md:h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
            <div className="hidden md:block mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs text-gray-300 mb-3">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="flex-1 min-w-0 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors duration-300"
                />
                <button className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg text-sm font-semibold hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-md">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-xs md:text-sm text-gray-300 text-center md:text-left">
            &copy; {currentYear} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 font-semibold">SoundBeatX</span>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="#" className="text-xs md:text-sm text-gray-300 hover:text-red-400 transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-xs md:text-sm text-gray-300 hover:text-red-400 transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-xs md:text-sm text-gray-300 hover:text-red-400 transition-colors duration-300 hidden md:inline">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;