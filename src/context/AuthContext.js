import React, { createContext, useState, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage'));
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage'));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems_guest');
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);