import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  ArrowRight,
  Clock,
} from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setName(user.name || '');
    setEmail(user.email || '');

    // Fetch user order history
    api
      .get('/api/orders/myorders')
      .then((data) => setOrders(data || []))
      .catch((err) => console.error('Error loading orders:', err))
      .finally(() => setLoadingOrders(false));
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (password && password.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (password && password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsUpdating(true);
    const payload = { name, email };
    if (password) {
      payload.password = password;
    }

    const result = await updateProfile(payload);
    setIsUpdating(false);

    if (result.success) {
      setPassword('');
      setConfirmPassword('');
      setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setStatusMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>My Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage your personal profile, credentials, and order history
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            backgroundColor: user.isAdmin ? '#eff6ff' : '#f1f5f9',
            color: user.isAdmin ? '#1d4ed8' : '#475569',
            border: `1px solid ${user.isAdmin ? '#bfdbfe' : '#cbd5e1'}`,
          }}
        >
          {user.isAdmin && <ShieldCheck size={16} />}
          <span>{user.isAdmin ? 'Administrator' : 'Customer Account'}</span>
        </div>
      </div>

      {statusMessage.text && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            backgroundColor: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: statusMessage.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${statusMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Top Grid: Profile form & Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}
      >
        {/* Profile Edit Form */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Profile Details
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="name"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '6px',
                }}
              >
                <User size={15} /> Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '6px',
                }}
              >
                <Mail size={15} /> Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '6px',
                }}
              >
                <Lock size={15} /> New Password (optional)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
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

            {password && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
            )}

            <button
              type="submit"
              disabled={isUpdating}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--primary-color)',
                color: '#ffffff',
                fontSize: '0.9375rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isUpdating ? 0.7 : 1,
              }}
            >
              {isUpdating ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Account Overview</h2>

          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block' }}>
              Customer ID
            </span>
            <code
              style={{
                fontSize: '0.875rem',
                backgroundColor: 'var(--bg-color)',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                marginTop: '4px',
              }}
            >
              {user._id}
            </code>
          </div>

          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block' }}>
              Account Type
            </span>
            <p style={{ fontSize: '0.9375rem', marginTop: '4px' }}>
              {user.isAdmin
                ? 'Administrator Account with full system permissions.'
                : 'Standard Customer Account.'}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block' }}>
              Total Orders Placed
            </span>
            <p style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '4px' }}>
              {orders.length}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <section
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <Package size={22} color="var(--primary-color)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>My Orders ({orders.length})</h2>
        </div>

        {loadingOrders ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px auto' }} />
            Loading your order history...
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}
          >
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You have not placed any orders yet.
            </p>
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
              Browse Catalog
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Paid</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600' }}>Delivered</th>
                  <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr
                    key={ord._id}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                      <code>#{ord._id.slice(-6).toUpperCase()}</code>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                      ${ord.totalPrice?.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: ord.isPaid ? '#dcfce7' : '#fee2e2',
                          color: ord.isPaid ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {ord.isPaid ? 'Paid' : 'Not Paid'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: ord.isDelivered ? '#dcfce7' : '#fef3c7',
                          color: ord.isDelivered ? '#15803d' : '#b45309',
                        }}
                      >
                        {ord.isDelivered ? 'Delivered' : 'In Transit'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Link
                        to={`/order/${ord._id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          fontSize: '0.8125rem',
                          backgroundColor: 'var(--primary-color)',
                          color: '#ffffff',
                          borderRadius: 'var(--radius)',
                          fontWeight: '600',
                        }}
                      >
                        Receipt
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
