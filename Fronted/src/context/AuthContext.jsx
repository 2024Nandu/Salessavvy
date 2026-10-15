import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sales_savvy_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.auth.login(username, password);
      // Response format: { message: "Login successful", role: "CUSTOMER" | "ADMIN", username: "..." }
      const userData = {
        username: data.username,
        role: data.role
      };
      setUser(userData);
      localStorage.setItem('sales_savvy_user', JSON.stringify(userData));
      showToast(`Welcome back, ${data.username}!`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role = 'CUSTOMER') => {
    setLoading(true);
    try {
      const data = await api.users.register({ username, email, password, role });
      showToast('Registration successful! Please sign in.', 'success');
      return { success: true, data };
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.auth.logout();
    } catch (err) {
      // Backend may throw 403 for Admin on /api/auth/logout due to role check, safe to ignore
      console.warn('Logout API warning:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem('sales_savvy_user');
      showToast('Logged out successfully', 'info');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isCustomer: user?.role === 'CUSTOMER',
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
