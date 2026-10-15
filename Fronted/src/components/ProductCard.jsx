import React, { useState } from 'react';
import { ShoppingCart, Eye, Check, Plus, Minus, AlertCircle } from 'lucide-react';
import { formatINR, getProductImage } from '../utils/helpers';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const imageUrl = getProductImage(product.images, product.name, product.product_id);
  const inStock = (product.stock ?? 0) > 0;
  const isLowStock = inStock && product.stock <= 5;

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (!inStock) return;
    setIsAdding(true);
    await addToCart(product.product_id, quantity);
    setIsAdding(false);
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getProductImage(null, product.name, product.product_id);
          }}
        />

        {/* Stock Badge Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!inStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-800/60 backdrop-blur-md">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-800/60 backdrop-blur-md">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 backdrop-blur-md">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-white backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-white text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description || 'Premium quality product with guaranteed authentic performance.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Price
            </span>
            <div className="text-lg font-bold text-white tracking-tight">
              {formatINR(product.price)}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            disabled={!inStock || isAdding || loading}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-md ${
              !inStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-blue-600/25'
            }`}
            title={inStock ? 'Add to Cart' : 'Item Sold Out'}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">
              {isAdding ? 'Adding...' : 'Add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
