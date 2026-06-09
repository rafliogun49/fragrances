import { createRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import { Route as rootRoute } from './__root';
import { CatalogCard } from '../components/CatalogCard';
import { api } from '../lib/api';
import type { Product } from '../lib/api';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: CatalogPage,
});

const TYPE_LABELS: Record<string, string> = {
  edp: 'Eau de Parfum',
  extrait: 'Extrait de Parfum',
  mist: 'Body Mist',
  hair: 'Hair Perfume',
  set: 'Set',
};

function CatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const types = useMemo(() => Array.from(new Set(products.map(p => p.type))).sort(), [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (selectedType !== 'all' && p.type !== selectedType) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.scent_family ?? '').toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedType, search]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-canvas)' }}>
      {/* Nav */}
      <header
        className="px-6 py-4"
        style={{ borderBottom: '1px solid var(--color-hairline)' }}
      >
        <div className="page-container flex items-center justify-between">
          <button
            onClick={() => navigate({ to: '/' })}
            className="font-display tracking-[0.3em] uppercase text-base"
            style={{ color: 'var(--color-primary)', background: 'none', border: 'none' }}
          >
            HMNS
          </button>
          <button
            onClick={() => navigate({ to: '/quiz' })}
            className="btn-primary py-2 px-5 text-xs"
          >
            Find my scent
          </button>
        </div>
      </header>

      <div className="page-container py-16">
        {/* Page heading */}
        <div className="mb-12">
          <p
            className="text-xs tracking-[0.22em] uppercase mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            Collection
          </p>
          <h1
            className="font-display text-4xl md:text-5xl mb-4"
            style={{ color: 'var(--color-ink)', lineHeight: '1.1' }}
          >
            All Fragrances
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {loading ? 'Loading…' : `${products.length} products`}
          </p>
        </div>

        {/* Filter bar */}
        <div
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10 pb-8"
          style={{ borderBottom: '1px solid var(--color-hairline)' }}
        >
          <input
            type="text"
            placeholder="Search by name, family, or description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 text-sm"
            style={{
              backgroundColor: 'var(--color-surface-soft)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--color-ink)',
              outline: 'none',
              colorScheme: 'dark',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-hairline)')}
          />

          <div className="flex flex-wrap gap-2">
            <Chip label="All" value="all" active={selectedType === 'all'} onClick={setSelectedType} />
            {types.map(type => (
              <Chip
                key={type}
                label={TYPE_LABELS[type] ?? type}
                value={type}
                active={selectedType === type}
                onClick={setSelectedType}
              />
            ))}
          </div>

          {!loading && filtered.length !== products.length && (
            <span className="text-xs ml-auto" style={{ color: 'var(--color-muted)' }}>
              {filtered.length} of {products.length}
            </span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  backgroundColor: 'var(--color-surface-soft)',
                  borderRadius: 'var(--r-md)',
                  height: '480px',
                  border: '1px solid var(--color-hairline)',
                }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="text-center py-20"
            style={{ color: 'var(--color-muted)' }}
          >
            <p className="text-sm">Failed to load products — {error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="font-display text-2xl mb-3" style={{ color: 'var(--color-ink)' }}>
              No results
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
              Try a different search or filter
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedType('all'); }}
              className="text-xs tracking-wider uppercase"
              style={{ color: 'var(--color-primary)', background: 'none', border: 'none', letterSpacing: '0.1em' }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <CatalogCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="px-8 py-8 mt-20 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--color-hairline)' }}
      >
        <span
          className="font-display text-sm tracking-widest uppercase"
          style={{ color: 'var(--color-muted)', letterSpacing: '0.2em' }}
        >
          HMNS
        </span>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          © {new Date().getFullYear()} HMNS. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function Chip({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: (v: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '5px 12px',
        borderRadius: 'var(--r-sm)',
        border: `1px solid ${active ? 'rgba(201,169,110,0.5)' : 'var(--color-hairline)'}`,
        backgroundColor: active ? 'rgba(201,169,110,0.1)' : 'transparent',
        color: active ? 'var(--color-primary)' : 'var(--color-muted)',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}
