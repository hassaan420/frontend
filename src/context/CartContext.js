import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Get cart key based on logged in user
  const getCartKey = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return `cartItems_${user._id}`;
    }
    return 'cartItems_guest';
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const key = getCartKey();
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // When user logs in/out, reload their cart
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const key = getCartKey();
        const saved = localStorage.getItem(key);
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch {
        setCartItems([]);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveCart = (items) => {
    const key = getCartKey();
    setCartItems(items);
    localStorage.setItem(key, JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const exists = cartItems.find(x => x._id === product._id);
    let updatedCart;
    if (exists) {
      updatedCart = cartItems.map(x =>
        x._id === product._id ? { ...x, quantity: x.quantity + quantity } : x
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity }];
    }
    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    saveCart(cartItems.filter(x => x._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    saveCart(cartItems.map(x => x._id === id ? { ...x, quantity } : x));
  };

  const clearCart = () => {
    const key = getCartKey();
    setCartItems([]);
    localStorage.removeItem(key);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      updateQuantity, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);