import React, { useEffect } from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../utils/helpers';

export default function CheckoutSuccessModal({ orderDetails, onClose, onViewOrders }) {
  if (!orderDetails) return null;

  useEffect(() => {
    // Fire confetti cannons
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.5 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.5 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          Payment Successful!
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Thank you for shopping with SalesSavvy. Your order is confirmed and is being processed.
        </p>

        {/* Order Details Receipt Box */}
        <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Order ID:</span>
            <span className="font-mono font-bold text-blue-400 select-all">
              {orderDetails.orderId || 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase()}
            </span>
          </div>

          {orderDetails.paymentId && (
            <div className="flex justify-between items-center text-slate-400">
              <span>Payment ID:</span>
              <span className="font-mono text-slate-300 select-all">
                {orderDetails.paymentId}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-800">
            <span className="font-semibold text-slate-200">Amount Paid:</span>
            <span className="text-sm font-bold text-emerald-400">
              {formatINR(orderDetails.amount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onViewOrders}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <PackageCheck className="w-4 h-4" />
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
