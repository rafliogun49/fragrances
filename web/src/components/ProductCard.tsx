import type { Product } from '../lib/api';

type ProductCardProps = {
  product: Product;
  explanation?: string;
  size?: 'sm' | 'lg';
};

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

const TYPE_LABELS: Record<string, string> = {
  edp: 'Eau de Parfum',
  extrait: 'Extrait de Parfum',
  mist: 'Body Mist',
  hair: 'Hair Perfume',
  set: 'Set',
};

function GradientPlaceholder({ name }: { name: string }) {
  const palettes = [
    ['#1a1714', '#2a2318'],
    ['#141720', '#1e2030'],
    ['#1a1420', '#241830'],
    ['#1a1a14', '#24241a'],
    ['#141a1a', '#182424'],
  ];
  const idx = name.charCodeAt(0) % palettes.length;
  const [from, to] = palettes[idx];
  return (
    <div
      className="w-full h-full flex items-center justify-center font-display text-3xl"
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        color: 'rgba(201,169,110,0.2)',
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function ProductCard({ product, explanation, size = 'sm' }: ProductCardProps) {
  const isLarge = size === 'lg';

  return (
    <div className="card flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: isLarge ? '280px' : '200px', backgroundColor: 'var(--color-surface-soft)' }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-4"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                const fallback = document.createElement('div');
                fallback.style.cssText = 'position:absolute;inset:0';
                target.parentElement.appendChild(fallback);
              }
            }}
          />
        ) : (
          <GradientPlaceholder name={product.name} />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span
            className="text-xs tracking-widest uppercase px-2 py-0.5"
            style={{
              backgroundColor: 'rgba(201,169,110,0.12)',
              color: 'var(--color-primary)',
              border: '1px solid rgba(201,169,110,0.25)',
              borderRadius: 'var(--r-sm)',
              letterSpacing: '0.08em',
              fontSize: '0.6rem',
            }}
          >
            {TYPE_LABELS[product.type] ?? product.type.toUpperCase()}
          </span>
          {product.in_stock === 0 && (
            <span
              className="text-xs tracking-widest uppercase px-2 py-0.5"
              style={{
                backgroundColor: 'rgba(201,169,110,0.06)',
                color: 'var(--color-muted)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.6rem',
              }}
            >
              Sold out
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className={`font-bold ${isLarge ? 'text-xl' : 'text-base'}`} style={{ color: 'var(--color-ink)' }}>
            {product.name}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {product.scent_family} {product.volume_ml ? `· ${product.volume_ml}ml` : ''}
          </p>
        </div>

        <p className="font-semibold text-base" style={{ color: 'var(--color-ink)' }}>
          {formatPrice(product.price_idr)}
        </p>

        {explanation && (
          <div
            className="p-4"
            style={{
              backgroundColor: 'rgba(201,169,110,0.05)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 'var(--r-sm)',
            }}
          >
            <p
              className="text-xs tracking-widest uppercase mb-1.5"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
            >
              Why this suits you
            </p>
            <p className="text-sm" style={{ color: 'var(--color-ink)', lineHeight: '1.8' }}>
              {explanation}
            </p>
          </div>
        )}

        {(product.top_notes.length > 0 || product.heart_notes.length > 0 || product.base_notes.length > 0) && (
          <div className="flex flex-col gap-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
            {product.top_notes.length > 0 && (
              <p><span className="uppercase tracking-widest" style={{ color: 'var(--color-primary)', fontSize: '0.65rem' }}>Top</span>{'  '}{product.top_notes.join(', ')}</p>
            )}
            {product.heart_notes.length > 0 && (
              <p><span className="uppercase tracking-widest" style={{ color: 'var(--color-primary)', fontSize: '0.65rem' }}>Heart</span>{'  '}{product.heart_notes.join(', ')}</p>
            )}
            {product.base_notes.length > 0 && (
              <p><span className="uppercase tracking-widest" style={{ color: 'var(--color-primary)', fontSize: '0.65rem' }}>Base</span>{'  '}{product.base_notes.join(', ')}</p>
            )}
          </div>
        )}

        <a
          href={product.product_url || 'https://madeforhmns.com/collections/all'}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto btn-outline text-sm py-2.5 text-center"
        >
          View on HMNS →
        </a>
      </div>
    </div>
  );
}
