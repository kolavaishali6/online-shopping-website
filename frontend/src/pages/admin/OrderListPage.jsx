import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Package,
  CheckCircle,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Truck,
} from 'lucide-react';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (id) => {
    try {
      await api.put(`/api/orders/${id}/deliver`);
      setSuccessMsg(`Order #${id.slice(-6).toUpperCase()} marked as delivered!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update delivery status');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <Link
            to="/admin/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Manage Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Monitor incoming customer purchases and update delivery statuses
          </p>
        </div>
      </div>

      {successMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

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
            fontSize: '0.875rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4rem 0',
            gap: '10px',
            color: 'var(--primary-color)',
          }}
        >
          <Loader2 size={32} className="animate-spin" />
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
          }}
        >
          <p style={{ color: 'var(--text-muted)' }}>No orders have been placed yet.</p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            overflowX: 'auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Total</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Paid</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Delivered</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                    <code>#{ord._id.slice(-6).toUpperCase()}</code>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                      {ord.user?.name || 'Customer'}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ord.user?.email || 'N/A'}
                    </span>
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
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: ord.isPaid ? '#dcfce7' : '#fee2e2',
                        color: ord.isPaid ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {ord.isPaid
                        ? `Paid (${new Date(ord.paidAt).toLocaleDateString()})`
                        : 'Not Paid'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: ord.isDelivered ? '#dcfce7' : '#fef3c7',
                        color: ord.isDelivered ? '#15803d' : '#b45309',
                      }}
                    >
                      {ord.isDelivered
                        ? `Delivered (${new Date(ord.deliveredAt).toLocaleDateString()})`
                        : 'In Transit'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Link
                        to={`/order/${ord._id}`}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: 'var(--bg-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.8125rem',
                          fontWeight: '500',
                          color: 'var(--text-main)',
                        }}
                      >
                        Receipt
                      </Link>

                      {!ord.isDelivered && (
                        <button
                          onClick={() => handleDeliver(ord._id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 10px',
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            borderRadius: 'var(--radius)',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                          }}
                          title="Mark as delivered"
                        >
                          <Truck size={14} /> Deliver
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
