import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, Zap, Terminal } from 'lucide-react';

export default function Footer({ onSwitchToAdmin, isAdmin }) {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 text-slate-400 text-xs py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>SalesSavvy</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Enterprise grade modern e-commerce platform with automated cart synchronization and Razorpay checkout.
            </p>
          </div>

          {/* Quick backend connectivity info */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Backend Port:</span>
              <code className="bg-slate-950 px-1.5 py-0.5 rounded text-blue-400 border border-slate-800">
                localhost:9090
              </code>
            </div>

            <div className="text-slate-600">|</div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="font-semibold text-slate-200">Frontend Port:</span>
              <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-400 border border-slate-800">
                localhost:5174
              </code>
            </div>

            {isAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="ml-auto px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-semibold transition-colors"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} SalesSavvy Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Secure 256-bit SSL
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Razorpay Test Key Enabled
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
