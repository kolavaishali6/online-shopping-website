import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Eye, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const isOutOfStock = product.countInStock === 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Product Image */}
      <Link
        to={`/product/${product._id}`}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Stock Badge */}
        <span
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '0.6875rem',
            fontWeight: '600',
            padding: '3px 8px',
            borderRadius: '9999px',
            backgroundColor: isOutOfStock ? '#fee2e2' : '#dcfce7',
            color: isOutOfStock ? '#b91c1c' : '#15803d',
            border: `1px solid ${isOutOfStock ? '#fca5a5' : '#86efac'}`,
          }}
        >
          {isOutOfStock ? 'Out of Stock' : 'In Stock'}
        </span>
      </Link>

      {/* Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                fontWeight: '600',
              }}
            >
              {product.category}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: '500',
              }}
            >
              {product.brand}
            </span>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                marginBottom: '8px',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.8em',
              }}
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          <div style={{ marginBottom: '12px' }}>
            <Rating
              value={product.rating}
              text={`(${product.numReviews || 0})`}
              size={14}
            />
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
              ${product.price?.toFixed(2)}
            </span>

            <Link
              to={`/product/${product._id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.8125rem',
                fontWeight: '600',
                backgroundColor: 'var(--primary-color)',
                color: '#ffffff',
                borderRadius: 'var(--radius)',
              }}
            >
              <Eye size={14} />
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
