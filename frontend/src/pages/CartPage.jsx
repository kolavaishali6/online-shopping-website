import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
} from 'lucide-react';

const CartPage = () => {
  const {
    cartItems,
    itemsCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQty,
    removeFromCart,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/shipping');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            backgroundColor: 'var(--surface-color)',
            padding: '3rem 2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
            <ShoppingBag size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            Looks like you haven't added anything to your cart yet. Explore our collection of premium items.
          </p>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '0.9375rem',
            }}
          >
            Start Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '0.5rem',
          }}
        >
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '800' }}>
          Shopping Cart ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {/* Cart Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div
              key={item.product}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'var(--surface-color)',
                padding: '1.25rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                flexWrap: 'wrap',
              }}
            >
              {/* Product Thumbnail */}
              <Link
                to={`/product/${item.product}`}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=200&q=80';
                  }}
                />
              </Link>

              {/* Product Info */}
              <div style={{ flex: '1 1 200px' }}>
                <Link to={`/product/${item.product}`}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      marginBottom: '4px',
                    }}
                  >
                    {item.name}
                  </h3>
                </Link>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Unit Price: ${item.price?.toFixed(2)}
                </span>
              </div>

              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label
                  htmlFor={`qty-${item.product}`}
                  style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}
                >
                  Qty:
                </label>
                <select
                  id={`qty-${item.product}`}
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    outline: 'none',
                  }}
                >
                  {[...Array(Math.min(item.countInStock || 10, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtotal & Delete */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginLeft: 'auto',
                }}
              >
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    minWidth: '80px',
                    textAlign: 'right',
                  }}
                >
                  ${(item.price * item.qty).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.product)}
                  style={{
                    padding: '8px',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              onClick={clearCart}
              style={{
                fontSize: '0.8125rem',
                color: '#dc2626',
                background: 'none',
                fontWeight: '500',
                padding: '4px 8px',
              }}
            >
              Clear Entire Cart
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: '80px',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Order Summary
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal ({itemsCount})</span>
              <span style={{ fontWeight: '600' }}>${itemsPrice.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping</span>
              <span style={{ fontWeight: '600', color: shippingPrice === 0 ? '#15803d' : 'inherit' }}>
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            {shippingPrice > 0 && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#15803d',
                  backgroundColor: '#f0fdf4',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #bbf7d0',
                }}
              >
                Add ${(100 - itemsPrice).toFixed(2)} more to qualify for <strong>FREE Shipping</strong>!
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (10%)</span>
              <span style={{ fontWeight: '600' }}>${taxPrice.toFixed(2)}</span>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '800',
              }}
            >
              <span>Order Total</span>
              <span style={{ color: 'var(--primary-color)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: 'var(--radius)',
              marginBottom: '1.25rem',
            }}
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>

          {/* Guarantee Badges */}
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--primary-color)" />
              <span>Encrypted & secure checkout</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={16} color="var(--primary-color)" />
              <span>Standard delivery within 2-4 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
