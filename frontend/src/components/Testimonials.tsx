import { motion } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Audio Enthusiast",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    text: "The wireless earbuds I purchased have incredible sound quality! Crystal clear audio and amazing bass. Best audio purchase I've ever made.",
    rating: 5,
    gradient: "from-red-500 to-orange-600",
  },
  {
    name: "Michael Chen",
    role: "Tech Reviewer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    text: "Got the premium headphones and a smartwatch from here. Exceptional build quality and the prices are unbeatable. Fast shipping too!",
    rating: 5,
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    name: "Emily Thompson",
    role: "Music Producer",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    text: "Their studio monitors and audio interfaces are professional grade. Perfect for my home studio setup. Highly recommend for all audio professionals!",
    rating: 5,
    gradient: "from-orange-500 to-red-600",
  },
];

export function Testimonials() {
  return (
    <section className="hidden md:block relative py-24 bg-gradient-to-b from-red-50 via-yellow-50 to-orange-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-red-200 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-900">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900 mb-6">
            Our Customer Review
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear what our customers say about their audio and gadget experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
            >
              {/* Card */}
              <div className="relative h-full p-8 bg-white rounded-2xl border border-red-200 hover:border-red-400 hover:shadow-xl transition-all duration-500 overflow-hidden">
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Quote className="w-16 h-16 text-red-600" />
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-red-200 group-hover:border-red-400 transition-colors duration-300 shadow-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-700 group-hover:to-yellow-700 transition-all duration-300">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Animated Bottom Line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${testimonial.gradient} group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
