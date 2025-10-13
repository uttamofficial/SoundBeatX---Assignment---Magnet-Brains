// App.tsx (Main Application)
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './LandingPage';  // Import the Landing Page component
import GadgetsPage from './GadgetsPage';  // Import the Gadgets Page component
import ContactUs from './ContactUs';  // Import the Contact Us component
import Navbar from './components/Navbar';  // Import the Navbar that will be used in both pages
import CartPage from './CartPage';
import LoginPage from './LoginPage.tsx';
import PaymentPage from './PaymentPage';
import OrderSuccessPage from './OrderSuccessPage';
import PaymentFailurePage from './PaymentFailurePage';
import OrdersPage from './OrdersPage';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { RouteLoader } from './components/RouteLoader';
import DualClerkProvider from './components/DualClerkProvider';

// Admin Components
import AdminLogin from './AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductManagement from './admin/ProductManagement';
import OrderManagement from './admin/OrderManagement';

// Protected Route Component for Admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  useEffect(() => {
    // Prevent automatic scroll to top on route navigation
    window.history.scrollRestoration = 'manual';
  }, []);

  return (
    <Router>
      <DualClerkProvider>
        <RouteLoader />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/gadgets" element={<><Navbar /><GadgetsPage /></>} />
        <Route path="/contact" element={<><Navbar /><ContactUs /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /></>} />
        <Route path="/cart" element={<><Navbar /><CartPage /></>} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
        
        {/* Protected Customer Routes */}
        <Route path="/checkout" element={
          <SignedIn>
            <><Navbar /><CartPage /></>
          </SignedIn>
        } />
        
        <Route path="/payment" element={
          <SignedIn>
            <><Navbar /><PaymentPage /></>
          </SignedIn>
        } />
        
        <Route path="/order-success" element={
          <SignedIn>
            <><Navbar /><OrderSuccessPage /></>
          </SignedIn>
        } />
        
        <Route path="/payment-failure" element={
          <SignedIn>
            <><Navbar /><PaymentFailurePage /></>
          </SignedIn>
        } />
        
        <Route path="/orders" element={
          <SignedIn>
            <><Navbar /><OrdersPage /></>
          </SignedIn>
        } />
        </Routes>
      </DualClerkProvider>
    </Router>
  );
}

export default App;