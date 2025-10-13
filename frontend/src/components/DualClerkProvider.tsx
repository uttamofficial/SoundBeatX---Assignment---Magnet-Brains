import { ClerkProvider } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface DualClerkProviderProps {
  children: ReactNode;
}

export default function DualClerkProvider({ children }: DualClerkProviderProps) {
  const location = useLocation();
  
  // Determine if current route is admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Select appropriate Clerk keys based on route
  const publishableKey = (
    isAdminRoute 
      ? (import.meta.env.VITE_CLERK_ADMIN_PUBLISHABLE_KEY || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
      : (import.meta.env.VITE_CLERK_USER_PUBLISHABLE_KEY || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
  );

  // In development, avoid hard crash if keys are missing; render children without Clerk
  if (!publishableKey) {
    if (import.meta.env.DEV) {
      console.warn(`Clerk publishable key missing for ${isAdminRoute ? 'admin' : 'user'} routes. Rendering without Clerk.`);
      return <>{children}</>;
    }
    throw new Error(`Missing Clerk ${isAdminRoute ? 'Admin' : 'User'} Publishable Key`);
  }

  // Configure different settings for admin vs user
  const clerkConfig = isAdminRoute 
    ? {
        publishableKey,
        afterSignOutUrl: '/admin/login',
        signInUrl: '/admin/sign-in',
        signUpUrl: '/admin/sign-up',
        afterSignInUrl: '/admin/dashboard',
        afterSignUpUrl: '/admin/dashboard',
      }
    : {
        publishableKey,
        afterSignOutUrl: '/',
        signInUrl: '/sign-in',
        signUpUrl: '/sign-up',
        afterSignInUrl: '/dashboard',
        afterSignUpUrl: '/dashboard',
      };

  return (
    <ClerkProvider {...clerkConfig}>
      {children}
    </ClerkProvider>
  );
}
