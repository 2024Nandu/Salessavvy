import React, { useState } from 'react';
import { X, ShoppingCart, Check, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { formatINR, getProductImage } from '../utils/helpers';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [getProductImage(null, product.name, product.product_id)];

  const [activeImage, setActiveImage] = useState(images[0] || getProductImage(null, product.name, product.product_id));
  const inStock = (product.stock ?? 0) > 0;

  const handleAdd = async () => {
    if (!inStock) return;
    setIsAdding(true);
    await addToCart(product.product_id, quantity);
    setIsAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Image Side */}
        <div className="w-full md:w-1/2 bg-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 mb-4">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getProductImage(null, product.name, product.product_id);
              }}
            />
          </div>

          {/* Thumbnails if multiple */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-blue-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                inStock ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {inStock ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
              <span className="text-xs text-slate-500">
                Item #{product.product_id}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-400">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-slate-500">inclusive of all taxes</span>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-2">
                {product.description || 'Elevate your daily experience with this genuine, verified SalesSavvy product.'}
              </p>
            </div>

            {/* Perks badges */}
            <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-slate-800/80 text-center">
              <div className="flex flex-col items-center text-[11px] text-slate-400 gap-1">
                <Truck className="w-4 h-4 text-blue-400" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-[11px] text-slate-400 gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine</span>
              </div>
              <div className="flex flex-col items-center text-[11px] text-slate-400 gap-1">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-2">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-semibold text-slate-400">Quantity</span>
              <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-xs text-slate-400 ml-auto">
                Subtotal: <span className="font-bold text-white">{formatINR(product.price * quantity)}</span>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!inStock || isAdding || loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isAdding ? 'Adding to Cart...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
