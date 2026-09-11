import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  PlusCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/products');
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await api.delete(`/api/products/${id}`);
        setActionSuccess(`Product "${name}" deleted successfully.`);
        setTimeout(() => setActionSuccess(''), 4000);
        fetchProducts();
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
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
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Manage Products</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Create, update, and manage your inventory catalog
            </p>
          </div>

          <Link
            to="/admin/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            <PlusCircle size={18} />
            Create Product
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
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
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
          }}
        >
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            No products found in inventory.
          </p>
          <Link
            to="/admin/products/new"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              borderRadius: 'var(--radius)',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            Add Your First Product
          </Link>
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
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Product</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Brand</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Price</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Stock</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <div>
                        <strong style={{ display: 'block', color: 'var(--text-main)' }}>
                          {p.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: {p._id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                      }}
                    >
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{p.brand}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                    ${p.price?.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        fontWeight: '600',
                        color: p.countInStock === 0 ? '#b91c1c' : '#15803d',
                      }}
                    >
                      {p.countInStock} units
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        style={{
                          padding: '6px',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        title="Edit product"
                      >
                        <Edit2 size={16} />
                      </Link>

                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default ProductListPage;
