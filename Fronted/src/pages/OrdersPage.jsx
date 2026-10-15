import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  RefreshCw, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { formatINR, getProductImage } from '../utils/helpers';

export default function OrdersPage({ onGoShopping }) {
  const { user, isCustomer } = useAuth();
  const [ordersGrouped, setOrdersGrouped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.orders.getUserOrders();
      // data format: { username, role, products: [ { order_id, product_id, name, quantity, price_per_unit, total_price, image_url, description } ] }
      const items = data?.products || [];

      // Group items by order_id
      const groups = {};
      items.forEach((item) => {
        const orderId = item.order_id || 'ORDER-MISC';
        if (!groups[orderId]) {
          groups[orderId] = {
            orderId,
            items: [],
            totalAmount: 0,
            totalItems: 0
          };
        }
        groups[orderId].items.push(item);
        groups[orderId].totalAmount += Number(item.total_price || (item.quantity * item.price_per_unit) || 0);
        groups[orderId].totalItems += Number(item.quantity || 1);
      });

      setOrdersGrouped(Object.values(groups));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and review your completed SalesSavvy purchases
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-4 bg-slate-800 rounded w-1/6" />
              </div>
              <div className="h-16 bg-slate-800/50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-900/40 text-center">
          <p className="text-sm text-rose-300 font-semibold">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : ordersGrouped.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 my-8">
          <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No orders found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't placed any orders yet. Discover our latest items and place your first order today!
          </p>
          <button
            onClick={onGoShopping}
            className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {ordersGrouped.map((order) => (
            <div
              key={order.orderId}
              className="rounded-3xl bg-slate-900/70 border border-slate-800/80 overflow-hidden shadow-lg transition-all hover:border-slate-700"
            >
              {/* Order Card Header */}
              <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Order Reference
                    </span>
                    <span className="font-mono font-bold text-blue-400 text-sm">
                      {order.orderId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Status
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      Payment Verified
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Total Paid
                    </span>
                    <span className="text-sm font-bold text-white">
                      {formatINR(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-5 divide-y divide-slate-800/60">
                {order.items.map((item, idx) => {
                  const imageSrc = getProductImage(item.image_url, item.name, item.product_id);
                  return (
                    <div
                      key={idx}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getProductImage(null, item.name, item.product_id);
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Qty: <span className="text-slate-200 font-medium">{item.quantity}</span> × {formatINR(item.price_per_unit)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-200">
                          {formatINR(item.total_price || (item.quantity * item.price_per_unit))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
