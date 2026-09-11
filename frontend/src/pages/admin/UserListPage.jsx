import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const UserListPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (id === currentUser._id) {
      alert('You cannot delete your own logged-in admin account.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await api.delete(`/api/users/${id}`);
        setActionSuccess(`User "${name}" was deleted successfully.`);
        setTimeout(() => setActionSuccess(''), 4000);
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  const handleToggleAdmin = async (id, currentStatus, name) => {
    if (id === currentUser._id && currentStatus) {
      alert('You cannot revoke your own administrator privileges.');
      return;
    }

    const newStatus = !currentStatus;
    const confirmMsg = newStatus
      ? `Promote "${name}" to Administrator?`
      : `Demote "${name}" from Administrator to Customer?`;

    if (window.confirm(confirmMsg)) {
      try {
        await api.put(`/api/users/${id}`, { isAdmin: newStatus });
        setActionSuccess(`Role for "${name}" updated successfully.`);
        setTimeout(() => setActionSuccess(''), 4000);
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to update user role');
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

        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Manage Users</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Inspect registered accounts, assign administrative roles, or remove accounts
          </p>
        </div>
      </div>

      {actionSuccess && (
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
          <span style={{ fontSize: '1rem', fontWeight: '500' }}>Loading users...</span>
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
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>User</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Joined</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>{u.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {u._id}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: u.isAdmin ? '#eff6ff' : '#f1f5f9',
                        color: u.isAdmin ? '#1d4ed8' : '#475569',
                      }}
                    >
                      {u.isAdmin ? <ShieldCheck size={12} /> : null}
                      {u.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleToggleAdmin(u._id, u.isAdmin, u.name)}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: u.isAdmin ? '#fee2e2' : '#eff6ff',
                          color: u.isAdmin ? '#b91c1c' : '#1d4ed8',
                          border: `1px solid ${u.isAdmin ? '#fca5a5' : '#bfdbfe'}`,
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                        title={u.isAdmin ? 'Demote to Customer' : 'Promote to Admin'}
                      >
                        {u.isAdmin ? 'Demote' : 'Make Admin'}
                      </button>

                      {u._id !== currentUser._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
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

export default UserListPage;
