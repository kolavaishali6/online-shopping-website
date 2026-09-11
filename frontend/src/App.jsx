import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public / Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/placeorder" element={<PlaceOrderPage />} />
                <Route path="/order/:id" element={<OrderPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<ProductListPage />} />
                  <Route path="products/new" element={<ProductEditPage />} />
                  <Route path="products/:id/edit" element={<ProductEditPage />} />
                  <Route path="orders" element={<OrderListPage />} />
                  <Route path="users" element={<UserListPage />} />
                </Route>

                {/* Custom 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <footer
              style={{
                borderTop: '1px solid var(--border-color)',
                padding: '1.5rem 0',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--surface-color)',
              }}
            >
              <div className="container">
                ShopEase &copy; {new Date().getFullYear()} - Full Stack E-Commerce Platform
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
