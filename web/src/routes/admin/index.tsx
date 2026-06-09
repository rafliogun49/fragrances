import { useState } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { adminApi } from '../../lib/api';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminApi.login(username, password);
      navigate({ to: '/admin/leads' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-surface-soft)' }}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-sm border"
        style={{ borderColor: 'var(--color-hairline)', borderRadius: 'var(--r-md)' }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
            Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            HMNS Recommender Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-base outline-none transition-all"
              style={{ borderColor: 'var(--color-hairline)', borderRadius: 'var(--r-sm)', color: 'var(--color-ink)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-hairline)')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md text-base outline-none transition-all"
              style={{ borderColor: 'var(--color-hairline)', borderRadius: 'var(--r-sm)', color: 'var(--color-ink)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e => (e.target.style.borderColor = 'var(--color-hairline)')}
            />
          </div>

          {error && (
            <p className="text-sm bg-red-50 text-red-600 px-4 py-3 rounded-md">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
