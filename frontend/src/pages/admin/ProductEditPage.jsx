import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Save,
  Package,
} from 'lucide-react';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isNew) {
      api
        .get(`/api/products/${id}`)
        .then((product) => {
          setName(product.name || '');
          setPrice(product.price || 0);
          setImage(product.image || '');
          setBrand(product.brand || '');
          setCategory(product.category || '');
          setCountInStock(product.countInStock || 0);
          setDescription(product.description || '');
        })
        .catch((err) => {
          console.error('Failed to load product for editing:', err);
          setError(err.message || 'Product not found');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg('');

    const payload = {
      name,
      price: Number(price),
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      description,
    };

    try {
      if (isNew) {
        await api.post('/api/products', payload);
        setSuccessMsg('Product created successfully!');
      } else {
        await api.put(`/api/products/${id}`, payload);
        setSuccessMsg('Product updated successfully!');
      }
      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
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
          gap: '10px',
          color: 'var(--primary-color)',
        }}
      >
        <Loader2 size={32} className="animate-spin" />
        <span>Loading product details...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '700px' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}
        >
          <ArrowLeft size={14} /> Back to Products List
        </Link>
      </div>

      <div
        style={{
          backgroundColor: 'var(--surface-color)',
          padding: '2.5rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <Package size={22} color="var(--primary-color)" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
            {isNew ? 'Create New Product' : 'Edit Product'}
          </h1>
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

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="product-name"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
            >
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wireless Noise Cancelling Headphones"
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

          {/* Price & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label
                htmlFor="product-price"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
              >
                Price ($)
              </label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
                htmlFor="product-stock"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
              >
                Stock Quantity
              </label>
              <input
                id="product-stock"
                type="number"
                min="0"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
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

          {/* Image URL */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="product-image"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
            >
              Image URL
            </label>
            <input
              id="product-image"
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                fontSize: '0.9375rem',
                backgroundColor: 'var(--bg-color)',
              }}
            />
            {image && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={image}
                  alt="Preview"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Brand & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label
                htmlFor="product-brand"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
              >
                Brand
              </label>
              <input
                id="product-brand"
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Apple, Sony, Samsung..."
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
                htmlFor="product-category"
                style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
              >
                Category
              </label>
              <input
                id="product-category"
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Electronics, Audio, Wearables..."
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

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="product-desc"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '6px' }}
            >
              Description
            </label>
            <textarea
              id="product-desc"
              rows="4"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive product description..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--bg-color)',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
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
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving Product...
              </>
            ) : (
              <>
                <Save size={18} /> {isNew ? 'Create Product' : 'Save Changes'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;
