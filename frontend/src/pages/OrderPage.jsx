import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Package,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Loader2,
  DollarSign,
} from 'lucide-react';

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const fetchOrder = async () => {
    try {
      const data = await api.get(`/api/orders/${id}`);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
      setError(err.message || 'Order could not be found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/order/${id}`);
      return;
    }
    fetchOrder();
  }, [id, user, navigate]);

  const handleSimulatePayment = async () => {
    setPaying(true);
    setPaySuccess(false);

    try {
      const paymentResult = {
        id: `PAY-SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user.email,
      };

      const updated = await api.put(`/api/orders/${id}/pay`, paymentResult);
      setOrder(updated);
      setPaySuccess(true);
      setTimeout(() => setPaySuccess(false), 5000);
    } catch (err) {
      console.error('Payment simulation failed:', err);
      alert(err.message || 'Payment simulation failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          gap: '12px',
          color: 'var(--primary-color)',
        }}
      >
        <Loader2 size={36} className="animate-spin" />
        <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: 'var(--surface-color)',
            padding: '2.5rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
          }}
        >
          <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Order Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            {error || 'Unable to retrieve the requested order details.'}
          </p>
          <Link
            to="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <Link
            to="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
            }}
          >
            <ArrowLeft size={14} /> My Profile & Orders
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Order #{order._id}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2px' }}>
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {paySuccess && (
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
            fontWeight: '500',
          }}
        >
          <CheckCircle size={20} />
          <span>Payment successful! Your order has been marked as Paid.</span>
        </div>
      )}

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Shipping Status Card */}
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MapPin size={18} color="var(--primary-color)" />
              Shipping Information
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--secondary-color)', lineHeight: 1.5, marginBottom: '1rem' }}>
              <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
              <br />
              <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: order.isDelivered ? '#f0fdf4' : '#fffbeb',
                color: order.isDelivered ? '#166534' : '#b45309',
                border: `1px solid ${order.isDelivered ? '#bbf7d0' : '#fde68a'}`,
              }}
            >
              {order.isDelivered ? <CheckCircle size={16} /> : <Clock size={16} />}
              <span>
                {order.isDelivered
                  ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                  : 'In Transit / Preparing for Shipment'}
              </span>
            </div>
          </div>

          {/* Payment Status Card */}
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CreditCard size={18} color="var(--primary-color)" />
              Payment Information
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--secondary-color)', marginBottom: '1rem' }}>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: order.isPaid ? '#f0fdf4' : '#fef2f2',
                color: order.isPaid ? '#166534' : '#b91c1c',
                border: `1px solid ${order.isPaid ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              {order.isPaid ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>
                {order.isPaid
                  ? `Paid on ${new Date(order.paidAt).toLocaleDateString()} (Ref: ${
                      order.paymentResult?.id || 'Completed'
                    })`
                  : 'Not Paid'}
              </span>
            </div>
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
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Package size={18} color="var(--primary-color)" />
              Ordered Items ({order.orderItems.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
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

        {/* Right Column: Order Summary */}
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
            Payment Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items</span>
              <span style={{ fontWeight: '600' }}>${order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontWeight: '600' }}>
                {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tax (10%)</span>
              <span style={{ fontWeight: '600' }}>${order.taxPrice?.toFixed(2)}</span>
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
              <span>Total Paid/Due</span>
              <span style={{ color: 'var(--primary-color)' }}>${order.totalPrice?.toFixed(2)}</span>
            </div>
          </div>

          {/* Simulate Payment Action if Not Paid */}
          {!order.isPaid && (
            <button
              onClick={handleSimulatePayment}
              disabled={paying}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontSize: '0.9375rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: 'var(--radius)',
              }}
            >
              {paying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <DollarSign size={18} />
                  Simulate Payment (${order.totalPrice?.toFixed(2)})
                </>
              )}
            </button>
          )}

          {order.isPaid && (
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                fontSize: '0.9375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle size={18} />
              Payment Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
