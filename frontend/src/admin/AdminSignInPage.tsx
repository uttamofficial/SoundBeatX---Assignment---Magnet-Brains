import { SignIn } from '@clerk/clerk-react';
import { Shield, Headphones } from 'lucide-react';

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-red-500" />
            <Headphones className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-300">SoundBeatX Management System</p>
          <div className="mt-4 inline-block px-4 py-2 bg-red-900/30 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-300">⚠️ Authorized Personnel Only</p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          <SignIn 
            routing="path" 
            path="/admin/sign-in" 
            signUpUrl="/admin/sign-up"
            afterSignInUrl="/admin/dashboard"
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-transparent shadow-none',
                formButtonPrimary: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700',
                footerActionLink: 'text-red-400 hover:text-red-300',
                formFieldInput: 'bg-gray-700 border-gray-600 text-white',
                formFieldLabel: 'text-gray-300',
                identityPreviewText: 'text-white',
                formHeaderTitle: 'text-white',
                formHeaderSubtitle: 'text-gray-400',
                socialButtonsBlockButton: 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600',
                dividerLine: 'bg-gray-600',
                dividerText: 'text-gray-400',
              }
            }}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            This portal uses a separate authentication system
          </p>
        </div>
      </div>
    </div>
  );
}
