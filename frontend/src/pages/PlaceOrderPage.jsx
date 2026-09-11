import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import api from '../services/api';
import {
  MapPin,
  CreditCard,
  Package,
  ArrowRight,
  Loader2,
  AlertCircle,
  Edit2,
} from 'lucide-react';

const PlaceOrderPage = () => {
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/placeorder');
      return;
    }
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [user, shippingAddress, paymentMethod, navigate]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const createdOrder = await api.post('/api/orders', orderData);
      clearCart();
      navigate(`/order/${createdOrder._id}`);
    } catch (err) {
      console.error('Failed to create order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <CheckoutSteps step1 step2 step3 step4 />

      <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>
        Review & Place Order
      </h1>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Order Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Details */}
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MapPin size={18} color="var(--primary-color)" />
                Shipping Destination
              </h2>
              <Link
                to="/shipping"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8125rem',
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                }}
              >
                <Edit2 size={12} /> Edit
              </Link>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--secondary-color)', lineHeight: 1.5 }}>
              <strong>Name:</strong> {user?.name} ({user?.email})
              <br />
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CreditCard size={18} color="var(--primary-color)" />
                Payment Method
              </h2>
              <Link
                to="/payment"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8125rem',
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                }}
              >
                <Edit2 size={12} /> Edit
              </Link>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--secondary-color)' }}>
              <strong>Selected:</strong> {paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Package size={18} color="var(--primary-color)" />
                Order Items ({cartItems.length})
              </h2>
              <Link
                to="/cart"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8125rem',
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                }}
              >
                <Edit2 size={12} /> Edit Cart
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <Link
                      to={`/product/${item.product}`}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                      }}
                    >
                      {item.name}
                    </Link>
                  </div>

                  <span style={{ fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    {item.qty} x ${item.price?.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
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
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span style={{ fontWeight: '600' }}>${itemsPrice.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontWeight: '600', color: shippingPrice === 0 ? '#15803d' : 'inherit' }}>
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tax (10%)</span>
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
              <span>Total Price</span>
              <span style={{ color: 'var(--primary-color)' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading || cartItems.length === 0}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                Place Order Now
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
