import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Shield, Truck, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const HomePage = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [healthStatus, setHealthStatus] = useState({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    // Health check
    api
      .get('/api/health')
      .then((data) => setHealthStatus({ loading: false, data, error: null }))
      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }));

    // Featured products preview
    api
      .get('/api/products')
      .then((res) => {
        setFeaturedProducts((res.products || []).slice(0, 4));
      })
      .catch((err) => {
        console.error('Failed to load featured products:', err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: '#ffffff',
          padding: '4rem 1rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Welcome to ShopEase
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              opacity: 0.9,
              marginBottom: '2rem',
            }}
          >
            A full-stack, secure, and modern online shopping platform built from scratch.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/products"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary-color)',
                padding: '12px 24px',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShoppingCart size={18} />
              Browse Products
            </Link>

            {user ? (
              <Link
                to="/profile"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                My Profile ({user.name})
              </Link>
            ) : (
              <Link
                to="/register"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* System Status Banner */}
      <section
        style={{
          padding: '1.5rem 0',
          backgroundColor: 'var(--surface-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius)',
              backgroundColor: healthStatus.error
                ? '#fef2f2'
                : healthStatus.data?.database === 'connected'
                ? '#f0fdf4'
                : '#fffbeb',
              border: `1px solid ${
                healthStatus.error
                  ? '#fecaca'
                  : healthStatus.data?.database === 'connected'
                  ? '#bbf7d0'
                  : '#fde68a'
              }`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {healthStatus.error ? (
                <AlertCircle color="#dc2626" size={20} />
              ) : (
                <CheckCircle2
                  color={healthStatus.data?.database === 'connected' ? '#16a34a' : '#d97706'}
                  size={20}
                />
              )}
              <div>
                <strong style={{ fontSize: '0.9375rem' }}>
                  {healthStatus.loading
                    ? 'Checking API & Database connectivity...'
                    : healthStatus.error
                    ? 'Backend API unreachable'
                    : 'Backend API & Database Active'}
                </strong>
                {healthStatus.data && (
                  <span style={{ fontSize: '0.8125rem', display: 'block', color: 'var(--text-muted)' }}>
                    Database: <strong>{healthStatus.data.database}</strong> | Product Catalog: <strong>Operational</strong>
                  </span>
                )}
                {healthStatus.error && (
                  <span style={{ fontSize: '0.8125rem', display: 'block', color: '#b91c1c' }}>
                    Make sure backend is running (`npm run backend`).
                  </span>
                )}
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Phase 3: Product Catalog & Search
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: 'var(--primary-color)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Curated Collection
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '4px' }}>
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--primary-color)',
                fontWeight: '600',
                fontSize: '0.9375rem',
              }}
            >
              View All Products
              <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'var(--surface-color)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
              }}
            >
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {loadingProducts
                  ? 'Loading featured collection...'
                  : 'No products found. Run seed script to populate sample inventory.'}
              </p>
              <Link
                to="/products"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                }}
              >
                Go to Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--surface-color)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                backgroundColor: 'var(--bg-color)',
              }}
            >
              <Shield
                size={36}
                color="var(--primary-color)"
                style={{ margin: '0 auto 1rem auto' }}
              />
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Secure JWT Auth</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Protected customer and admin sessions with bcrypt password encryption.
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                backgroundColor: 'var(--bg-color)',
              }}
            >
              <ShoppingCart
                size={36}
                color="var(--primary-color)"
                style={{ margin: '0 auto 1rem auto' }}
              />
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Product Catalog</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Browse, search, and filter a curated inventory of products across categories.
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                backgroundColor: 'var(--bg-color)',
              }}
            >
              <Truck
                size={36}
                color="var(--primary-color)"
                style={{ margin: '0 auto 1rem auto' }}
              />
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Orders & Checkout</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Streamlined checkout flow and detailed order history tracking (Phase 5).
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                backgroundColor: 'var(--bg-color)',
              }}
            >
              <Clock
                size={36}
                color="var(--primary-color)"
                style={{ margin: '0 auto 1rem auto' }}
              />
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Admin Control</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Dedicated dashboard to manage products, customers, and order statuses (Phase 6).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
