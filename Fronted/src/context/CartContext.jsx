import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isCustomer } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState({ products: [], overall_total_price: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user || !isCustomer) {
      setCart({ products: [], overall_total_price: 0 });
      setCartCount(0);
      return;
    }

    try {
      const data = await api.cart.getItems();
      // data format: { username, role, cart: { products: [...], overall_total_price: number } }
      if (data && data.cart) {
        setCart(data.cart);
        // Calculate total count
        const totalItems = (data.cart.products || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      }
    } catch (err) {
      console.warn('Failed to fetch cart:', err);
    }
  }, [user, isCustomer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast('Please sign in to add items to cart', 'error');
      return false;
    }
    if (!isCustomer) {
      showToast('Admin accounts cannot purchase items', 'error');
      return false;
    }

    setLoading(true);
    try {
      await api.cart.addItem(user.username, productId, quantity);
      showToast('Item added to cart!', 'success');
      await fetchCart();
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to add item to cart', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user || !isCustomer) return;
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        await api.cart.updateQuantity(user.username, productId, quantity);
        await fetchCart();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (productId) => {
    if (!user || !isCustomer) return;
    try {
      await api.cart.removeItem(user.username, productId);
      showToast('Item removed from cart', 'info');
      await fetchCart();
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const clearCart = () => {
    setCart({ products: [], overall_total_price: 0 });
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        isDrawerOpen,
        setIsDrawerOpen,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
