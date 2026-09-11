import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, ShoppingBag } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 180px)',
        padding: '3rem 1rem',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: 'var(--surface-color)',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'var(--primary-color)',
          }}
        >
          <Compass size={32} />
        </div>

        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: 'var(--primary-color)',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9375rem',
            marginBottom: '2rem',
            lineHeight: 1.5,
          }}
        >
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn’t exist.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            <ShoppingBag size={16} />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
