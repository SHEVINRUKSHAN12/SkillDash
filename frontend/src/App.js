import React from 'react';
import { 
  Navigate,
  Route,  // Add this import
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider 
} from 'react-router-dom';
import './App.css';
import Home from './Components/Home/home';
import HomeNav from './Components/Nav/HomeNav';
import Footer from './Components/Footer/footer.js';
import Contact from './Components/Contact Us/contact.js';
import Cregister from './Components/Customer screens/Cregister';
import SProviderRegister from './Components/Service provider screens/sprovider_register';
import CustomerLogin from './Components/Customer screens/Customer_login';
import ServiceProviderLogin from './Components/Service provider screens/ServiceProvider_login';
import HappyCustomers from './Components/HappyCustomers/HappyCustomers';
import CustomerDashboard from './Components/Customer screens/customer_dashboard';
import PostJob from './Components/Customer screens/PostJob';
import CustomerProfile from './Components/Customer screens/CustomerProfile';
import ServiceProviderDashboard from './Components/Service provider screens/ServiceProviderDashboard';
import ServiceProviderProfile from './Components/Service provider screens/ServiceProviderProfile';
import ServiceManagement from './Components/Service provider screens/ServiceManagement';
import FindServiceProviders from './Components/Customer screens/FindServiceProviders'; // Import FindServiceProviders
import AllMessages from './Components/Chat/AllMessages'; // Import AllMessages
import AdminLogin from './Components/Admin/AdminLogin'; // Import AdminLogin
import AdminDashboard from './Components/Admin/AdminDashboard'; // Import AdminDashboard
import AdminCustomers from './Components/Admin/AdminCustomers'; // Import AdminCustomers
import AdminProviders from './Components/Admin/AdminProviders'; // Import AdminProviders
import AdminAnalytics from './Components/Admin/AdminAnalytics'; // Import AdminAnalytics
import AdminMetrics from './Components/Admin/AdminMetrics'; // Import AdminMetrics

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('serviceProviderToken');
  if (!token) {
    return <Navigate to="/service-provider/login" />;
  }
  return children;
};

// Create router with updated configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<><HomeNav /><Home /></>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/customer-register" element={<Cregister />} />
      <Route path="/provider-register" element={<SProviderRegister />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/provider-login" element={<ServiceProviderLogin />} />
      <Route path="/happy-customers" element={<HappyCustomers />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/customer-profile" element={<CustomerProfile />} />
      <Route path="/find-service-providers" element={<FindServiceProviders />} /> {/* Add FindServiceProviders route */}
      <Route path="/register" element={<Cregister />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/service-provider/login" element={<ServiceProviderLogin />} />
      <Route 
        path="/service-provider/dashboard" 
        element={
          <ProtectedRoute>
            <ServiceProviderDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/service-provider/profile" 
        element={
          <ProtectedRoute>
            <ServiceProviderProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/service-provider/services" 
        element={
          <ProtectedRoute>
            <ServiceManagement />
          </ProtectedRoute>
        } 
      />
      <Route path="/customer/all-messages" element={<AllMessages userType="Customer" />} /> {/* Add AllMessages route for Customer */}
      <Route path="/service-provider/all-messages" element={<AllMessages userType="ServiceProvider" />} /> {/* Add AllMessages route for ServiceProvider */}
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/providers" element={<AdminProviders />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/metrics" element={<AdminMetrics />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <div>
      <RouterProvider 
        router={router}
        fallbackElement={<div>Loading...</div>}
      />
      <Footer />
    </div>
  );
}

export default App;
