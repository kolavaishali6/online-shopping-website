import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin, ArrowRight } from 'lucide-react';

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/shipping');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <CheckoutSteps step1 step2 />

      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          backgroundColor: 'var(--surface-color)',
          padding: '2.5rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: 'var(--primary-color)',
            }}
          >
            <MapPin size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Shipping Address</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Where should we deliver your order?
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="address"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
            >
              Street Address
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Shopping Blvd, Apt 4B"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9375rem',
                backgroundColor: 'var(--bg-color)',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label
                htmlFor="city"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
              >
                City
              </label>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9375rem',
                  backgroundColor: 'var(--bg-color)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="postalCode"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
              >
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="10001"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9375rem',
                  backgroundColor: 'var(--bg-color)',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="country"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9375rem',
                backgroundColor: 'var(--bg-color)',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Continue to Payment
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
