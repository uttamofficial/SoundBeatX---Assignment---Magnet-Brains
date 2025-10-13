import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Footer from './components/Footer';
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 text-center">
        <h1 className="text-4xl font-bold">Welcome to PrintNSupply</h1>
        <p className="text-lg mt-2">Please sign in to access your account</p>
      </div>

      {/* Login Section */}
      <main className="flex flex-grow items-center justify-center py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
                formFieldInput: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
                footerActionLink: "text-indigo-500 hover:text-indigo-700"
              }
            }}
          />
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default LoginPage;
