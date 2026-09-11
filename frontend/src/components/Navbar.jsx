import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User,
  LogOut,
  ShieldCheck,
  ShoppingCart,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      style={{
        backgroundColor: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--primary-color)',
          }}
        >
          <ShoppingBag size={24} />
          <span>ShopEase</span>
        </Link>

        {/* Center Desktop Links */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '20px' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: location.pathname === '/' ? 'var(--primary-color)' : 'var(--text-main)',
            }}
          >
            Home
          </Link>
          <Link
            to="/products"
            style={{
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: location.pathname.startsWith('/products') ? 'var(--primary-color)' : 'var(--text-main)',
            }}
          >
            Products
          </Link>

          {/* Admin Panel shortcut */}
          {user && user.isAdmin && (
            <Link
              to="/admin/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: '#1d4ed8',
                backgroundColor: '#eff6ff',
                padding: '4px 10px',
                borderRadius: 'var(--radius)',
                border: '1px solid #bfdbfe',
              }}
            >
              <LayoutDashboard size={15} />
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right Desktop Actions */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '16px' }}>
          {/* Cart Link */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: 'var(--radius)',
              color: 'var(--text-main)',
              backgroundColor: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
            }}
            title="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {itemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                {itemsCount}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  color: 'var(--text-main)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <User size={16} />
                <span>{user.name}</span>
                {user.isAdmin && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '0.6875rem',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      marginLeft: '4px',
                    }}
                    title="Administrator"
                  >
                    <ShieldCheck size={12} />
                    Admin
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '0.875rem',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #fca5a5',
                  borderRadius: 'var(--radius)',
                  fontWeight: '500',
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/login"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  fontWeight: '500',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--surface-color)',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  color: '#ffffff',
                  fontWeight: '500',
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: 'var(--radius)',
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Header Bar (Cart + Hamburger Button) */}
        <div className="mobile-only" style={{ alignItems: 'center', gap: '12px' }}>
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: 'var(--radius)',
              color: 'var(--text-main)',
            }}
          >
            <ShoppingCart size={22} />
            {itemsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                  fontSize: '0.625rem',
                  fontWeight: '700',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2px',
                }}
              >
                {itemsCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-only animate-fade-in"
          style={{
            flexDirection: 'column',
            backgroundColor: 'var(--surface-color)',
            borderTop: '1px solid var(--border-color)',
            padding: '1.25rem 1rem',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={closeMobileMenu}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              padding: '8px 0',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={closeMobileMenu}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              padding: '8px 0',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            Products Catalog
          </Link>

          {user && user.isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={closeMobileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1d4ed8',
                padding: '8px 0',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <LayoutDashboard size={18} />
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                }}
              >
                <User size={18} />
                <span>My Profile ({user.name})</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', paddingTop: '0.5rem' }}>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px',
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
