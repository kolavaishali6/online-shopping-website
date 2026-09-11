import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Rating from '../components/Rating';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Loader2,
  AlertCircle,
  Star,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProduct = async () => {
    try {
      const data = await api.get(`/api/products/₹{id}`);
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.countInStock === 0) return;
    addToCart(product, qty);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 6000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!rating || !comment.trim()) {
      setReviewError('Please provide both a star rating and a comment.');
      return;
    }

    setReviewSubmitting(true);
    try {
      await api.post(`/api/products/₹{id}/reviews`, {
        rating,
        comment: comment.trim(),
      });
      setReviewSuccess('Thank you! Your review has been submitted.');
      setComment('');
      setRating(5);
      // Refresh product details to show updated reviews & score
      await fetchProduct();
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
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
        <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
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
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            {error || 'The product you are looking for does not exist or has been removed.'}
          </p>
          <Link
            to="/products"
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
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Back Button & Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            color: 'var(--text-main)',
            fontWeight: '500',
            padding: '4px 8px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <span>/</span>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>
          Home
        </Link>
        <span>/</span>
        <Link to="/products" style={{ color: 'var(--text-muted)' }}>
          Products
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{product.name}</span>
      </div>

      {/* Added to Cart Feedback Banner */}
      {addedMessage && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            padding: '12px 18px',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            <span style={{ fontWeight: '600' }}>
              Added {qty} item(s) to your cart!
            </span>
          </div>

          <Link
            to="/cart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            <ShoppingCart size={16} />
            View Cart & Checkout
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Product Main Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
          marginBottom: '3.5rem',
        }}
      >
        {/* Product Image */}
        <div
          style={{
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '420px',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              backgroundColor: '#f8fafc',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        </div>

        {/* Product Details & Purchase Card */}
        <div>
          {/* Category & Brand Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {product.category}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              {product.brand}
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              marginBottom: '1rem',
              lineHeight: 1.3,
            }}
          >
            {product.name}
          </h1>

          {/* Rating Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Rating value={product.rating} text={`₹{product.rating.toFixed(1)} / 5`} size={18} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: 'var(--text-main)',
              marginBottom: '1.5rem',
            }}
          >
            ₹{product.price?.toFixed(2)}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: '600', marginBottom: '6px' }}>
              Description
            </h3>
            <p style={{ color: 'var(--secondary-color)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
              {product.description}
            </p>
          </div>

          {/* Order Actions Box */}
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '1.5rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>Availability</span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: isOutOfStock ? '#fee2e2' : '#dcfce7',
                  color: isOutOfStock ? '#b91c1c' : '#15803d',
                }}
              >
                {isOutOfStock ? 'Out of Stock' : `In Stock (₹{product.countInStock} available)`}
              </span>
            </div>

            {!isOutOfStock && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>Quantity</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9375rem',
                    backgroundColor: 'var(--bg-color)',
                    outline: 'none',
                    fontWeight: '600',
                  }}
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: isOutOfStock ? '#cbd5e1' : 'var(--primary-color)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
            >
              <ShoppingCart size={18} />
              {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
            </button>
          </div>

          {/* Guarantee Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="var(--primary-color)" />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Fast Free Delivery
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--primary-color)" />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                1 Year Warranty
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={20} color="var(--primary-color)" />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                30-Day Returns
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <section
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '3rem',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={22} color="var(--primary-color)" />
            Customer Reviews & Ratings ({product.numReviews})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Read real feedback from verified customers or leave your own review.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Reviews List */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Verified Reviews
            </h3>

            {product.reviews.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--surface-color)',
                  padding: '2rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                No customer reviews yet. Be the first to review this product!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[...product.reviews].reverse().map((rev) => (
                  <div
                    key={rev._id}
                    style={{
                      backgroundColor: 'var(--surface-color)',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <strong style={{ fontSize: '0.9375rem' }}>{rev.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <Rating value={rev.rating} size={14} />
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--secondary-color)', lineHeight: 1.5 }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review Form */}
          <div
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '2rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Write a Review
            </h3>

            {user ? (
              <form onSubmit={handleReviewSubmit}>
                {reviewSuccess && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: '#f0fdf4',
                      color: '#166534',
                      border: '1px solid #bbf7d0',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <CheckCircle size={16} />
                    <span>{reviewSuccess}</span>
                  </div>
                )}

                {reviewError && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: '#fef2f2',
                      color: '#991b1b',
                      border: '1px solid #fecaca',
                      fontSize: '0.875rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{reviewError}</span>
                  </div>
                )}

                {/* Interactive Star Picker */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '6px',
                    }}
                  >
                    Your Rating:
                  </label>
                  <div style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '2px',
                          cursor: 'pointer',
                        }}
                      >
                        <Star
                          size={24}
                          fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                          color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                        />
                      </button>
                    ))}
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginLeft: '8px', alignSelf: 'center' }}>
                      {hoverRating || rating} out of 5 stars
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    htmlFor="review-comment"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '6px',
                    }}
                  >
                    Your Feedback:
                  </label>
                  <textarea
                    id="review-comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe what you liked or disliked about this product..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-color)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--primary-color)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {reviewSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--bg-color)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Please sign in to your account to leave a customer review.
                </p>
                <Link
                  to={`/login?redirect=/product/₹{id}`}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: 'var(--primary-color)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
