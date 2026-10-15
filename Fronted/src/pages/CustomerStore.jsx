import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Search, 
  Layers, 
  AlertTriangle, 
  RefreshCw, 
  SlidersHorizontal,
  PackageOpen,
  ServerOff
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Footwear',
  'Home',
  'Books',
  'Accessories'
];

export default function CustomerStore({ searchTerm, setSearchTerm, onOpenAuth }) {
  const { isAuthenticated, isCustomer } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProductModal, setActiveProductModal] = useState(null);

  const fetchProducts = async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.products.getAll(cat === 'All' ? null : cat);
      // data format: { user: { name, role }, products: [...] }
      if (data && data.products) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // Note: Backend ProductController requires authenticated customer
      if (err.status === 401 || err.status === 403) {
        setError('unauthorized');
      } else {
        setError(err.message || 'Failed to connect to backend server');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory, isAuthenticated]);

  // Client-side search filtering
  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Smart Shopping Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Shop with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">Savvy</span> Precision.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Discover handpicked premium electronics, apparel, and lifestyle essentials. Seamless cart synchronization and instant Razorpay payment verification.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isAuthenticated && (
              <button
                onClick={onOpenAuth}
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Catalog & Filter Bar */}
      <section id="catalog-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Featured Collection
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing {filteredProducts.length} verified products
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="h-80 rounded-2xl bg-slate-900/40 border border-slate-800/50 animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="w-full h-44 rounded-xl bg-slate-800/60" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-slate-800/60 rounded w-3/4" />
                  <div className="h-3 bg-slate-800/40 rounded w-1/2" />
                </div>
                <div className="h-8 bg-slate-800/60 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : error === 'unauthorized' ? (
          <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Sign In to View Products</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              The SalesSavvy catalog is personalized for verified customer sessions. Please sign in with your customer account to browse products and place orders.
            </p>
            <button
              onClick={onOpenAuth}
              className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
            >
              Sign In Now
            </button>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-900/40 text-center max-w-lg mx-auto my-12">
            <ServerOff className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h4 className="font-bold text-rose-300 text-base">Backend Connection Notice</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {error}. Ensure your Spring Boot backend is active on <code className="text-rose-300 bg-rose-950/60 px-1 py-0.5 rounded">http://localhost:9090</code>.
            </p>
            <button
              onClick={() => fetchProducts(selectedCategory)}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 my-8">
            <PackageOpen className="w-14 h-14 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm 
                ? `No products match "${searchTerm}". Try a different search term or category.`
                : 'No products are currently available in this category.'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onQuickView={(p) => setActiveProductModal(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {activeProductModal && (
        <ProductModal
          product={activeProductModal}
          onClose={() => setActiveProductModal(null)}
        />
      )}
    </div>
  );
}
