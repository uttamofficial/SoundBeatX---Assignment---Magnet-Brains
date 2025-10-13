import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, Clock, Headphones } from 'lucide-react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import emailjs from 'emailjs-com';

const ContactUs = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    Email: '',
    Message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('pNve9185cw30hDUqv');
  }, []);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    console.log('📧 Attempting to send email...');
    console.log('Service ID:', 'service_pji711e');
    console.log('Template ID:', 'template_fw9hhw2');
    console.log('Form data:', formData);

    // Log form fields for debugging
    if (form.current) {
      const formDataObj = new FormData(form.current);
      console.log('Form fields being sent:');
      formDataObj.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
    }

    emailjs
      .sendForm(
        'service_pji711e',           // Your Service ID
        'template_fw9hhw2',          // Your Template ID
        form.current!
        // Public key already initialized in useEffect
      )
      .then(
        (result) => {
          console.log('✅ Email sent successfully:', result);
          setShowSuccess(true);
          setFormData({ name: '', phone: '', Email: '', Message: '' });
          form.current?.reset();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            setShowSuccess(false);
          }, 5000);
        },
        (error) => {
          console.error('❌ Email send failed - Full error:', error);
          console.error('Error text:', error.text);
          console.error('Error status:', error.status);
          
          let errorMessage = '❌ Failed to send message. ';
          
          if (error.text === 'The public key is invalid') {
            errorMessage += 'Invalid API key. Please check your EmailJS configuration.';
          } else if (error.text === 'Template not found') {
            errorMessage += 'Email template not found. Please create "template_contact_form" in EmailJS dashboard.';
          } else if (error.text === 'Service not found') {
            errorMessage += 'Email service not found. Please verify your Service ID.';
          } else {
            errorMessage += error.text || 'Please try again later.';
          }
          
          alert(errorMessage);
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      <Navbar />
      
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 sm:top-24 right-4 sm:right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl z-50 flex items-center gap-2 sm:gap-3 animate-slide-in border-2 border-green-300">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          <span className="font-semibold text-sm sm:text-base">Message sent successfully! We'll get back to you soon.</span>
        </div>
      )}

      {/* Hero Section - Reduced Size */}
      <div className="relative pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-10 lg:pb-12 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-40 sm:w-56 h-40 sm:h-56 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-40 sm:w-56 h-40 sm:h-56 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-40 sm:w-56 h-40 sm:h-56 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-red-200 mb-3 sm:mb-4 shadow-md">
            <Headphones className="w-3 h-3 text-red-600" />
            <span className="text-xs font-semibold text-red-900">SoundBeatX Support</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-orange-700 to-yellow-900 mb-2 sm:mb-3 lg:mb-4 leading-tight">
            Get In Touch With Us
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
            Have questions about our audio products? Need support? We're here to help you 24/7. Reach out to our team!
          </p>
        </div>
      </div>

      {/* Main Content - New Layout */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {/* Contact Information Cards - Left Side */}
          <div className="flex flex-col space-y-4 sm:space-y-5">
            {/* Phone Card */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-red-200 hover:border-red-400 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex-1">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Phone</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">+1 (555) 123-4567</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    Mon-Fri, 9AM-6PM
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-yellow-200 hover:border-yellow-400 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex-1">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium break-all">SoundBeatX@gmail.com</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5">24/7 support available</p>
                </div>
              </div>
            </div>

            {/* Office Card */}
            <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-orange-200 hover:border-orange-400 p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex-1">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-lg flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Office</h3>
                  <p className="text-sm sm:text-base text-gray-600 font-medium">123 Business Street<br />New York, NY 10001</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5">Visit during business hours</p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl sm:rounded-2xl border-2 border-red-200 p-4 sm:p-5 shadow-md flex-1">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="bg-gradient-to-br from-red-500 to-yellow-500 p-2 sm:p-2.5 rounded-lg flex-shrink-0">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5">Quick Response</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    We typically respond within 24 hours during business days. For urgent matters, call us directly!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="w-full flex">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-red-200 p-5 sm:p-7 lg:p-8 w-full flex flex-col">
              <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500 mb-2">
                  Send Us A Message
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              <form ref={form} onSubmit={sendEmail} className="space-y-4 flex-1 flex flex-col">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all hover:border-red-300 bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all hover:border-red-300 bg-gray-50 focus:bg-white"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="Email" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="Email"
                      name="Email"
                      value={formData.Email}
                      onChange={(e) => setFormData({...formData, Email: e.target.value})}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all hover:border-red-300 bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="flex-1 flex flex-col">
                  <label htmlFor="Message" className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="Message"
                    name="Message"
                    value={formData.Message}
                    onChange={(e) => setFormData({...formData, Message: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all hover:border-red-300 resize-none bg-gray-50 focus:bg-white flex-1 min-h-[120px]"
                    placeholder="Tell us how we can help you with our audio products..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-3 sm:py-3.5 px-4 rounded-lg hover:from-red-700 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transform hover:scale-[1.02] ${
                      isSending ? 'opacity-50 cursor-not-allowed scale-100' : ''
                    }`}
                  >
                    <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                  
                  <p className="text-xs text-center text-gray-500">
                    <span className="text-red-500">*</span> All fields are required
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
  
};

export default ContactUs;
