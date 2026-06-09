import { useState } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api';
import { CatalogTable } from '../../components/CatalogTable';
import { ProductEditForm } from '../../components/ProductEditForm';
import type { Product } from '../../lib/api';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/catalog',
  component: AdminCatalogPage,
});

function AdminCatalogPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminApi.getProducts(),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
      adminApi.createProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  if (isError && (error as Error).message === 'Unauthorized') {
    navigate({ to: '/admin' });
    return null;
  }

  async function handleSave(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    if (editTarget) {
      await updateMutation.mutateAsync({ id: editTarget.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  function handleEdit(product: Product) {
    setEditTarget(product);
    setDrawerOpen(true);
  }

  function handleAdd() {
    setEditTarget(null);
    setDrawerOpen(true);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await deleteMutation.mutateAsync(product.id);
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
              style={{ color: 'var(--color-muted)' }}
            >
              Leads
            </button>
            <button
              onClick={() => navigate({ to: '/admin/catalog' })}
              style={{ color: 'var(--color-primary)' }}
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
            Catalog
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Manage HMNS fragrance products
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-6 h-6 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--color-hairline)', borderTopColor: 'var(--color-primary)' }}
            />
          </div>
        )}

        {isError && (error as Error).message !== 'Unauthorized' && (
          <div className="p-4 rounded-md bg-red-50 text-red-600 text-sm">
            Failed to load products: {(error as Error).message}
          </div>
        )}

        {!isLoading && (
          <CatalogTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
        )}
      </main>

      {/* Slide-over drawer */}
      {drawerOpen && (
        <ProductEditForm
          product={editTarget}
          onSave={handleSave}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}
