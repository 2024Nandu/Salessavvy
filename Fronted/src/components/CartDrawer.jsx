import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatINR, getProductImage } from '../utils/helpers';
import { api } from '../api/api';

const RAZORPAY_KEY = 'rzp_test_LqWBBDbgwot5lh'; // Matches backend application.properties

export default function CartDrawer({ onOrderSuccess, onOpenAuth }) {
  const { 
    cart, 
    cartCount, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    fetchCart 
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isDrawerOpen) return null;

  const products = cart?.products || [];
  const totalPrice = cart?.overall_total_price || 0;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsDrawerOpen(false);
      onOpenAuth();
      showToast('Please sign in to proceed with checkout', 'info');
      return;
    }

    if (products.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Prepare cart items for backend PaymentController
      const formattedCartItems = products.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price_per_unit
      }));

      // 2. Call backend POST /api/payment/create
      const razorpayOrderId = await api.payment.createOrder(totalPrice, formattedCartItems);

      if (!razorpayOrderId) {
        throw new Error('Could not generate payment order');
      }

      // 3. Check if Razorpay script is loaded
      if (typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: RAZORPAY_KEY,
          amount: Math.round(totalPrice * 100),
          currency: 'INR',
          name: 'SalesSavvy Store',
          description: `Order checkout (${products.length} items)`,
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // 4. Verify payment via backend POST /api/payment/verify
              await api.payment.verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );

              showToast('Payment verified successfully!', 'success');
              clearCart();
              setIsDrawerOpen(false);
              onOrderSuccess({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: totalPrice
              });
            } catch (vErr) {
              showToast(vErr.message || 'Payment verification failed', 'error');
            }
          },
          prefill: {
            name: user.username,
            email: `${user.username}@salessavvy.com`,
          },
          theme: {
            color: '#2563eb'
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              showToast('Payment process cancelled', 'info');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (response) {
          showToast(response.error?.description || 'Payment Failed', 'error');
          setIsProcessing(false);
        });
        razorpayInstance.open();
      } else {
        // Fallback if Razorpay SDK script is blocked or offline
        showToast('Razorpay SDK unavailable. Make sure your internet connection allows checkout.razorpay.com', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error creating checkout order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Shopping Cart</h3>
              <p className="text-xs text-slate-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-slate-200 text-lg">Your cart is empty</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Looks like you haven't added anything to your cart yet. Explore our catalog!
              </p>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="mt-5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            products.map((item) => {
              const imageSrc = getProductImage(item.image_url, item.name, item.product_id);
              return (
                <div
                  key={item.product_id}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex gap-3.5 items-center group hover:border-slate-700 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
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

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-white text-sm truncate">
                      {item.name}
                    </h5>
                    <div className="text-xs text-blue-400 font-bold mt-0.5">
                      {formatINR(item.price_per_unit)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-800 bg-slate-900 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs text-slate-400 ml-auto font-medium">
                        {formatINR(item.total_price)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {products.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/70 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-200">{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping & Delivery</span>
                <span className="font-semibold text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-800/80 font-bold text-white">
                <span>Total Amount</span>
                <span className="text-blue-400 text-base">{formatINR(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with Razorpay</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Razorpay 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
