import { motion } from "framer-motion";
import { Upload, Settings, CreditCard, Package, ArrowRight, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-8 h-8 text-white" />,
    title: "Upload",
    description: "Upload your files securely",
    gradient: "from-blue-500 to-cyan-500",
    number: "01",
  },
  {
    icon: <Settings className="w-8 h-8 text-white" />,
    title: "Customize",
    description: "Choose your specifications",
    gradient: "from-purple-500 to-pink-500",
    number: "02",
  },
  {
    icon: <CreditCard className="w-8 h-8 text-white" />,
    title: "Pay",
    description: "Secure payment processing",
    gradient: "from-orange-500 to-red-500",
    number: "03",
  },
  {
    icon: <Package className="w-8 h-8 text-white" />,
    title: "Receive",
    description: "Get your prints delivered",
    gradient: "from-green-500 to-emerald-500",
    number: "04",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to get your documents printed and delivered
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
            >
              {/* Card */}
              <div className="group relative h-full p-4 md:p-6 bg-white rounded-2xl border border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500">
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-black text-white text-base md:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Icon Container */}
                <div className="relative mb-4 md:mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${step.gradient} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Arrow Indicator */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-600" />
                  </div>
                )}

                {/* Animated Bottom Line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${step.gradient} group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
