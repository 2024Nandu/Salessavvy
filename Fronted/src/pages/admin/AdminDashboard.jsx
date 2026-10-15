import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShieldCheck, 
  Layers, 
  Store 
} from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';

export default function AdminDashboard({ onSwitchToStore }) {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                SalesSavvy Admin Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
                Staff Access
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Oversee store revenue analytics, inventory management, and user permissions
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToStore}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors w-fit"
        >
          <Store className="w-4 h-4 text-blue-400" />
          <span>View Customer Store</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Revenue & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Administration</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
}
