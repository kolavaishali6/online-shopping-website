import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Search, X, SlidersHorizontal, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch distinct categories on mount
  useEffect(() => {
    api
      .get('/api/products/categories')
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products whenever filters or search query change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        if (keyword.trim()) query.set('keyword', keyword.trim());
        if (category && category !== 'all') query.set('category', category);
        if (sort) query.set('sort', sort);
        if (minPrice) query.set('minPrice', minPrice);
        if (maxPrice) query.set('maxPrice', maxPrice);

        const data = await api.get(`/api/products?${query.toString()}`);
        setProducts(data.products || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sort, minPrice, maxPrice, searchParams]);

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (keyword.trim()) {
      params.set('keyword', keyword.trim());
    } else {
      params.delete('keyword');
    }
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setKeyword('');
    const params = new URLSearchParams(searchParams);
    params.delete('keyword');
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat === 'all') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCategory('all');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Page Title & Search Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Explore Our Products
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
          Discover the latest electronics, wearables, accessories, and home goods.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            maxWidth: '600px',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '12px',
              color: 'var(--text-muted)',
            }}
          >
            <Search size={18} />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by product name, brand, or features..."
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              backgroundColor: 'transparent',
            }}
          />
          {keyword && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                background: 'none',
                padding: '0 10px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            style={{
              padding: '0 20px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '0.875rem',
              borderRadius: 0,
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter & Sort Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--surface-color)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          marginBottom: '2rem',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => handleCategoryChange('all')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: '600',
              borderRadius: '9999px',
              backgroundColor: category === 'all' ? 'var(--primary-color)' : 'var(--bg-color)',
              color: category === 'all' ? '#ffffff' : 'var(--text-main)',
              border: `1px solid ${category === 'all' ? 'var(--primary-color)' : 'var(--border-color)'}`,
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '6px 14px',
                fontSize: '0.8125rem',
                fontWeight: '600',
                borderRadius: '9999px',
                backgroundColor: category === cat ? 'var(--primary-color)' : 'var(--bg-color)',
                color: category === cat ? '#ffffff' : 'var(--text-main)',
                border: `1px solid ${category === cat ? 'var(--primary-color)' : 'var(--border-color)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Price Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Sort by:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                padding: '6px 10px',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                outline: 'none',
                color: 'var(--text-main)',
              }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {(keyword || category !== 'all' || minPrice || maxPrice) && (
            <button
              onClick={handleResetFilters}
              style={{
                padding: '6px 12px',
                fontSize: '0.8125rem',
                color: 'var(--danger-color)',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius)',
                fontWeight: '500',
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Error View */}
      {error && (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '2rem',
          }}
        >
          <AlertCircle size={24} />
          <div>
            <strong>Unable to load products:</strong> {error}
            <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
              Please make sure your backend is running and seeded with products.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5rem 0',
            color: 'var(--primary-color)',
            gap: '10px',
          }}
        >
          <Loader2 size={32} className="animate-spin" />
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>Loading products...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
          }}
        >
          <ShoppingBag
            size={48}
            color="var(--text-muted)"
            style={{ margin: '0 auto 1rem auto', opacity: 0.5 }}
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            No products match your criteria
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Try clearing filters or searching with different keywords.
          </p>
          <button
            onClick={handleResetFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
