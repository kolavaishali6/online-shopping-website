import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored user info:', e);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login action
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, data };
    } catch (err) {
      const msg = err.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Register action
  const register = async (name, email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.post('/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, data };
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('userInfo');
  };

  // Update profile action
  const updateProfile = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.put('/api/auth/profile', userData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true, data };
    } catch (err) {
      const msg = err.message || 'Profile update failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
