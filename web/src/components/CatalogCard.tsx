import type { Product } from '../lib/api';

const TYPE_LABELS: Record<string, string> = {
  edp: 'Eau de Parfum',
  extrait: 'Extrait de Parfum',
  mist: 'Body Mist',
  hair: 'Hair Perfume',
  set: 'Set',
};

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export function CatalogCard({ product }: { product: Product }) {
  const allNotes = [...(product.top_notes ?? []), ...(product.heart_notes ?? []), ...(product.base_notes ?? [])];
  const notesPreview = allNotes.slice(0, 5);

  return (
    <a
      href={product.product_url || 'https://madeforhmns.com/collections/all'}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col"
      style={{
        backgroundColor: 'var(--color-surface-card)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,169,110,0.4)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-hairline)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '1 / 1',
          backgroundColor: 'var(--color-surface-soft)',
          borderRadius: '12px',
          margin: '10px 10px 0',
          width: 'calc(100% - 20px)',
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            style={{  }}
          />
        ) : (
          <PlaceholderImage name={product.name} />
        )}

        {/* Out of stock overlay */}
        {product.in_stock === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(12,11,9,0.55)' }}
          >
            <span
              className="text-xs tracking-widest uppercase px-3 py-1"
              style={{
                border: '1px solid var(--color-muted)',
                color: 'var(--color-muted)',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.6rem',
                letterSpacing: '0.14em',
              }}
            >
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Type + intensity */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              border: '1px solid rgba(201,169,110,0.3)',
              backgroundColor: 'rgba(201,169,110,0.08)',
              borderRadius: 'var(--r-sm)',
              padding: '2px 7px',
            }}
          >
            {TYPE_LABELS[product.type] ?? product.type}
          </span>
          {product.intensity && (
            <span
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--r-sm)',
                padding: '2px 7px',
              }}
            >
              {product.intensity}
            </span>
          )}
        </div>

        {/* Name */}
        <div>
          <h3
            className="font-display text-lg leading-snug"
            style={{ color: 'var(--color-ink)', lineHeight: '1.25' }}
          >
            {product.name}
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
            {product.scent_family}
            {product.volume_ml ? ` · ${product.volume_ml} ml` : ''}
          </p>
        </div>

        {/* Description */}
        {product.description && (
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'var(--color-muted)',
              lineHeight: '1.65',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>
        )}

        {/* Notes */}
        {notesPreview.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {notesPreview.map(note => (
              <span
                key={note}
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.07em',
                  color: 'var(--color-muted)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--r-sm)',
                  padding: '2px 6px',
                }}
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--color-hairline)' }}>
          <span className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
            {formatPrice(product.price_idr)}
          </span>
          <span
            className="text-xs font-medium tracking-wider uppercase transition-colors"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.1em' }}
          >
            View →
          </span>
        </div>
      </div>
    </a>
  );
}

function PlaceholderImage({ name }: { name: string }) {
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
      className="w-full h-full flex items-center justify-center font-display text-4xl"
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        color: 'rgba(201,169,110,0.15)',
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
