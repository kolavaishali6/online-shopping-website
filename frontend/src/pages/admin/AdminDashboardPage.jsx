import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  Clock,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsData, ordersData, usersData] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/orders'),
          api.get('/api/users'),
        ]);

        const allOrders = Array.isArray(ordersData) ? ordersData : [];
        const allProducts = productsData.products || [];
        const allUsers = Array.isArray(usersData) ? usersData : [];

        // Sum revenue of paid orders
        const revenue = allOrders
          .filter((o) => o.isPaid)
          .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

        setStats({
          revenue,
          totalOrders: allOrders.length,
          totalProducts: allProducts.length,
          totalUsers: allUsers.length,
        });

        setRecentOrders(allOrders.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck size={24} color="var(--primary-color)" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Admin Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Overview of store performance, inventory, customer orders, and registered accounts
          </p>
        </div>

        <Link
          to="/admin/products/new"
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
          <PlusCircle size={18} />
          Create New Product
        </Link>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Total Sales */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '1.5rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Total Revenue
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
            ${stats.revenue.toFixed(2)}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '500' }}>
            From paid orders
          </span>
        </div>

        {/* Total Orders */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '1.5rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Total Orders
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stats.totalOrders}</h2>
          <Link
            to="/admin/orders"
            style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '600' }}
          >
            Manage orders &rarr;
          </Link>
        </div>

        {/* Total Products */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '1.5rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Inventory Products
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fdf4ff',
                color: '#c026d3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingBag size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stats.totalProducts}</h2>
          <Link
            to="/admin/products"
            style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '600' }}
          >
            Manage catalog &rarr;
          </Link>
        </div>

        {/* Total Users */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            padding: '1.5rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Customer Accounts
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stats.totalUsers}</h2>
          <Link
            to="/admin/users"
            style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '600' }}
          >
            Manage users &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <Link
          to="/admin/products"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '4px' }}>
              Products Management
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Create, edit details, update stock, and delete items
            </p>
          </div>
          <ArrowRight size={20} color="var(--primary-color)" />
        </Link>

        <Link
          to="/admin/orders"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '4px' }}>
              Orders Supervision
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Track shipments, review receipts, and mark deliveries
            </p>
          </div>
          <ArrowRight size={20} color="var(--primary-color)" />
        </Link>

        <Link
          to="/admin/users"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '4px' }}>
              User Accounts
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              View registrations and assign administrative roles
            </p>
          </div>
          <ArrowRight size={20} color="var(--primary-color)" />
        </Link>
      </div>

      {/* Recent Orders Preview */}
      <div
        style={{
          backgroundColor: 'var(--surface-color)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Customer Orders</h2>
          <Link
            to="/admin/orders"
            style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: '600' }}
          >
            View All Orders &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
            No orders placed yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>Order ID</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>Customer</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>Payment</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600' }}>Delivery</th>
                  <th style={{ padding: '10px 14px', fontWeight: '600', textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <code>#{ord._id.slice(-6).toUpperCase()}</code>
                    </td>
                    <td style={{ padding: '10px 14px' }}>{ord.user?.name || 'Customer'}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '700' }}>
                      ${ord.totalPrice?.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
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
                        {ord.isPaid ? 'Paid' : 'Not Paid'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
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
                        {ord.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <Link
                        to={`/order/${ord._id}`}
                        style={{
                          padding: '4px 10px',
                          backgroundColor: 'var(--bg-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.8125rem',
                          fontWeight: '500',
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
      </div>
    </div>
  );
};

export default AdminDashboardPage;
