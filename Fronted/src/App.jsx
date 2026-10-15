
import React, { useState } from 'react';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIShoppingAssistant from './components/AIShoppingAssistant';

import CustomerStore from './pages/CustomerStore';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';

import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CheckoutSuccessModal from './components/CheckoutSuccessModal';

function AppContent() {
  const { user, isAdmin, isCustomer } = useAuth();

  const [currentTab, setCurrentTab] = useState('shop');
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);

  // Open the sign-in or registration modal.
  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  // Handle successful checkout.
  const handleOrderSuccess = (details) => {
    setSuccessOrderDetails(details);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAuth={handleOpenAuth}
        isAdminPortal={isAdminPortal}
        setIsAdminPortal={setIsAdminPortal}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isAdminPortal && isAdmin ? (
          <AdminDashboard
            onSwitchToStore={() => setIsAdminPortal(false)}
          />
        ) : currentTab === 'orders' ? (
          <OrdersPage
            onGoShopping={() => setCurrentTab('shop')}
          />
        ) : (
          <CustomerStore
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenAuth={handleOpenAuth}
          />
        )}
      </main>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        onOrderSuccess={handleOrderSuccess}
        onOpenAuth={handleOpenAuth}
      />

      {/* Sign In / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Order Confirmed & Confetti Modal */}
      {successOrderDetails && (
        <CheckoutSuccessModal
          orderDetails={successOrderDetails}
          onClose={() => setSuccessOrderDetails(null)}
          onViewOrders={() => {
            setSuccessOrderDetails(null);
            setCurrentTab('orders');
          }}
        />
      )}

      {/* AI Shopping Assistant */}
      {!isAdminPortal && isCustomer && (
        <AIShoppingAssistant />
      )}

      {/* Footer */}
      <Footer
        isAdmin={isAdmin}
        onSwitchToAdmin={() => setIsAdminPortal(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
