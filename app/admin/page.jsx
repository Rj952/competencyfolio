'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) { router.push('/login'); return; }
        const meData = await meRes.json();

        if (meData.user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setUser(meData.user);

        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data.users);
        }
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const refreshUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        await refreshUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete user');
      }
    } finally {
      setActionLoading('');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        await refreshUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update role');
      }
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="heading-display text-2xl text-brand-700 mb-3">Admin Panel</div>
          <div className="text-sm text-stone-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto border-b border-stone-200">
        <div className="flex items-center gap-4">
          <Link href="/" className="heading-display text-xl text-brand-700 no-underline">CompetencyFolio</Link>
          <span className="text-xs bg-coral-100 text-coral-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900 transition-colors font-medium">
            My Portfolio
          </Link>
          <span className="text-sm text-stone-400">{user?.name}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 text-center">
            <div className="heading-display text-3xl text-brand-600">{users.length}</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-1">Total Users</div>
          </div>
          <div className="card p-5 text-center">
            <div className="heading-display text-3xl text-sea-600">{users.filter(u => u.portfolio).length}</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-1">With Portfolios</div>
          </div>
          <div className="card p-5 text-center">
            <div className="heading-display text-3xl text-coral-500">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-1">Admins</div>
          </div>
          <div className="card p-5 text-center">
            <div className="heading-display text-3xl text-emerald-600">{users.reduce((a, u) => a + (u.shareLinks?.reduce((b, s) => b + s.viewCount, 0) || 0), 0)}</div>
            <div className="text-xs text-stone-500 uppercase tracking-wider mt-1">Portfolio Views</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="heading-display text-lg text-stone-900">User Management</h2>
            <button onClick={refreshUsers} className="btn-secondary text-xs px-3 py-1.5">
              Refresh
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Portfolio</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Share Links</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-900">{u.name}</div>
                      <div className="text-xs text-stone-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-coral-100 text-coral-700' : 'bg-brand-50 text-brand-700'
                      }`}>
                        {u.role === 'admin' ? '🔑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {u.portfolio ? (
                        <span className="text-xs text-emerald-600 font-medium">
                          v{u.portfolio.version} · saved {new Date(u.portfolio.lastSavedAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400">No portfolio</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-500">
                      {u._count?.shareLinks || 0} links · {u.shareLinks?.reduce((a, s) => a + s.viewCount, 0) || 0} views
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user?.id && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRoleChange(u.id, u.role === 'admin' ? 'user' : 'admin')}
                            disabled={actionLoading === u.id}
                            className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors disabled:opacity-50"
                          >
                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            disabled={actionLoading === u.id}
                            className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      {u.id === user?.id && (
                        <span className="text-xs text-stone-400 italic">You</span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-stone-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
