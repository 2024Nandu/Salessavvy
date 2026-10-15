import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  User, 
  LogOut, 
  ShieldCheck, 
  Search, 
  Menu, 
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  searchTerm, 
  setSearchTerm,
  onOpenAuth,
  isAdminPortal,
  setIsAdminPortal 
}) {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();
  const { cartCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setIsAdminPortal(false);
                setCurrentTab('shop');
              }}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  SalesSavvy
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-blue-400 font-semibold -mt-1">
                  Smart E-Commerce
                </span>
              </div>
            </button>
          </div>

          {/* Search bar (Store view) */}
          {!isAdminPortal && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, brands, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 focus:border-blue-500 rounded-full text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAdminPortal ? (
              <>
                <button
                  onClick={() => setCurrentTab('shop')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'shop'
                      ? 'text-white bg-slate-800/80 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  Store
                </button>

                {isAuthenticated && isCustomer && (
                  <button
                    onClick={() => setCurrentTab('orders')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === 'orders'
                        ? 'text-white bg-slate-800/80 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <Package className="w-4 h-4 text-blue-400" />
                    <span>My Orders</span>
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console Mode</span>
              </div>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Switch Toggle (Visible if Admin) */}
            {isAdmin && (
              <button
                onClick={() => setIsAdminPortal(!isAdminPortal)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  isAdminPortal
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdminPortal ? 'Go to Store' : 'Admin Panel'}</span>
              </button>
            )}

            {/* Shopping Cart Button (Customer) */}
            {!isAdminPortal && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all shadow-sm group"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform text-blue-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user?.username}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-500/40"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          {/* Mobile search */}
          {!isAdminPortal && (
            <div className="relative w-full mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-400"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                setIsAdminPortal(false);
                setCurrentTab('shop');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <span>Store Catalog</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {isAuthenticated && isCustomer && (
              <button
                onClick={() => {
                  setCurrentTab('orders');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
              >
                <span>My Orders</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  setIsAdminPortal(!isAdminPortal);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
              >
                <span>{isAdminPortal ? 'Switch to Store' : 'Admin Console'}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
