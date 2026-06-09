import { useState } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import { LeadsTable } from '../../components/LeadsTable';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/leads',
  component: AdminLeadsPage,
});

function AdminLeadsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-leads', page],
    queryFn: () => adminApi.getLeads(page, 50),
    retry: false,
  });

  // Redirect to login if unauthorized
  if (isError && (error as Error).message === 'Unauthorized') {
    navigate({ to: '/admin' });
    return null;
  }

  async function handleLogout() {
    try {
      await adminApi.logout();
    } finally {
      navigate({ to: '/admin' });
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
      {/* Top bar */}
      <header
        className="bg-white border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: 'var(--color-hairline)' }}
      >
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg" style={{ color: 'var(--color-ink)' }}>
            HMNS Admin
          </span>
          <nav className="flex gap-4 text-sm font-medium">
            <button
              onClick={() => navigate({ to: '/admin/leads' })}
              style={{ color: 'var(--color-primary)' }}
            >
              Leads
            </button>
            <button
              onClick={() => navigate({ to: '/admin/catalog' })}
              style={{ color: 'var(--color-muted)' }}
            >
              Catalog
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm"
          style={{ color: 'var(--color-muted)' }}
        >
          Sign out
        </button>
      </header>

      <main className="page-container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
            Leads
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            All quiz submissions and email captures
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-hairline)', borderTopColor: 'var(--color-primary)' }} />
          </div>
        )}

        {isError && !((error as Error).message === 'Unauthorized') && (
          <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm">
            Failed to load leads: {(error as Error).message}
          </div>
        )}

        {data && (
          <LeadsTable
            leads={data.leads}
            total={data.total}
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            onExport={() => adminApi.exportLeads()}
          />
        )}
      </main>
    </div>
  );
}
