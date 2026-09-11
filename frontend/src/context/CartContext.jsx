import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse cartItems from localStorage:', e);
      return [];
    }
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const stored = localStorage.getItem('shippingAddress');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('paymentMethod') || 'PayPal / Credit Card';
  });

  // Sync cartItems with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart items to localStorage:', e);
    }
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === (product._id || product.product));

      if (existItem) {
        const newQty = Math.min(existItem.qty + qty, product.countInStock);
        return prevItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: newQty } : x
        );
      } else {
        const newItem = {
          product: product._id || product.product,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          qty: Math.min(qty, product.countInStock),
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Update item quantity
  const updateQty = (productId, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x.product === productId ? { ...x, qty: Number(qty) } : x))
    );
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Shipping address action
  const saveShippingAddress = (address) => {
    setShippingAddress(address);
    localStorage.setItem('shippingAddress', JSON.stringify(address));
  };

  // Payment method action
  const savePaymentMethodAction = (method) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', method);
  };

  // Pricing calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  );
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod: savePaymentMethodAction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
