import { motion } from "framer-motion";
import { Clock, Award, Tag, Shield, Star } from "lucide-react";

const features = [
  {
    icon: <Clock className="w-8 h-8 text-white" />,
    title: "Fast Delivery",
    description: "Quick shipping and same-day dispatch for all orders",
        gradient: "from-red-500 to-yellow-500",
        badge: "Fast",
      },
      {
        icon: <Award className="w-8 h-8 text-white" />,
        title: "Premium Quality",
        description: "High-quality audio gadgets with advanced technology",
        gradient: "from-yellow-500 to-orange-500",
        badge: "Premium",
      },
      {
        icon: <Tag className="w-8 h-8 text-white" />,
        title: "Best Prices",
        description: "Competitive pricing with exclusive deals and offers",
        gradient: "from-orange-500 to-red-500",
        badge: "Affordable",
      },
];

export function Features() {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-red-50 via-yellow-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full border border-red-200 mb-4 md:mb-6 shadow-sm">
              <Star className="w-3 md:w-4 h-3 md:h-4 text-red-600" />
              <span className="text-xs md:text-sm font-semibold text-red-900">Why Choose SoundBeatX</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900 mb-3 md:mb-6">
              Exceptional Features
            </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our premium audio gadgets designed for modern lifestyle
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              {/* Card */}
              <div className="relative h-full p-6 md:p-8 bg-white rounded-xl md:rounded-2xl border border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 overflow-hidden">
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Badge */}
                <div className="absolute top-3 md:top-4 right-3 md:right-4 flex items-center gap-1 px-2 md:px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                  <Shield className="w-2.5 md:w-3 h-2.5 md:h-3 text-blue-600" />
                  <span className="text-[10px] md:text-xs font-semibold text-blue-900">{feature.badge}</span>
                </div>

                {/* Icon */}
                <div className={`relative inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 md:mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md`}>
                  <div className="[&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8 text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-sm md:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated Bottom Line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
