import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState(
    paymentMethod || 'PayPal / Credit Card'
  );

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/payment');
      return;
    }
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [user, shippingAddress, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    savePaymentMethod(selectedMethod);
    navigate('/placeorder');
  };

  const paymentOptions = [
    {
      id: 'paypal',
      name: 'PayPal / Credit Card',
      desc: 'Pay securely using PayPal balance or major credit/debit cards',
    },
    {
      id: 'stripe',
      name: 'Stripe / Direct Card',
      desc: 'Instant checkout with Visa, MasterCard, or American Express',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      desc: 'Pay cash upon package arrival at your delivery address',
    },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <CheckoutSteps step1 step2 step3 />

      <div
        style={{
          maxWidth: '520px',
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
            <CreditCard size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Payment Method</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Choose how you would like to pay for your items
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {paymentOptions.map((opt) => (
              <label
                key={opt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  border: `2px solid ${
                    selectedMethod === opt.name ? 'var(--primary-color)' : 'var(--border-color)'
                  }`,
                  backgroundColor:
                    selectedMethod === opt.name ? '#eff6ff' : 'var(--surface-color)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background-color 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.name}
                  checked={selectedMethod === opt.name}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  style={{ marginTop: '3px' }}
                />
                <div>
                  <strong style={{ fontSize: '0.9375rem', display: 'block', color: 'var(--text-main)' }}>
                    {opt.name}
                  </strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {opt.desc}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/shipping')}
              style={{
                padding: '12px 16px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-main)',
                fontSize: '0.9375rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
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
              Review Order
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
