import type { Product } from '../lib/api';

type RecommendationHeroProps = {
  product: Product;
  explanation: string;
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

function GradientHero({ name }: { name: string }) {
  const palettes = [
    ['#1a1a2e', '#16213e', '#0f3460'],
    ['#2d1b69', '#11998e', '#38ef7d'],
    ['#4a1942', '#c94b4b', '#4b134f'],
    ['#0f0c29', '#302b63', '#24243e'],
    ['#0a3d62', '#60a3bc', '#f9ca24'],
  ];
  const idx = name.charCodeAt(0) % palettes.length;
  const [a, b, c] = palettes[idx];
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${a}, ${b}, ${c})` }}
    >
      <span className="text-6xl font-bold text-white opacity-20">{name.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function RecommendationHero({ product, explanation }: RecommendationHeroProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--color-hairline)',
        backgroundColor: 'var(--color-surface-card)',
        overflow: 'hidden',
      }}
    >
      <div className="grid md:grid-cols-2">
        {/* Image panel */}
        <div
          className="relative flex items-center justify-center"
          style={{ minHeight: '380px', backgroundColor: 'var(--color-surface-card)', padding: '16px' }}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{ minHeight: '348px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '12px' }}
          >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-10"
              style={{  }}
            />
          ) : (
            <GradientHero name={product.name} />
          )}
          {product.in_stock === 0 && (
            <span
              className="absolute top-4 right-4 text-xs tracking-widest uppercase px-3 py-1"
              style={{
                backgroundColor: 'rgba(201,169,110,0.1)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(201,169,110,0.3)',
                borderRadius: 'var(--r-sm)',
                letterSpacing: '0.1em',
              }}
            >
              Sold out
            </span>
          )}
          </div>
        </div>

        {/* Info panel */}
        <div
          className="p-10 flex flex-col gap-6 justify-center"
          style={{ backgroundColor: 'var(--color-surface-card)', borderLeft: '1px solid var(--color-hairline)' }}
        >
          <div>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.15em' }}
            >
              {TYPE_LABELS[product.type] ?? product.type}
            </span>
          </div>

          <div>
            <h2
              className="font-display text-4xl mb-2"
              style={{ color: 'var(--color-ink)', lineHeight: '1.15' }}
            >
              {product.name}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
              {product.scent_family}
              {product.volume_ml ? ` · ${product.volume_ml}ml` : ''}
              {product.gender ? ` · ${product.gender === 'masc' ? 'Masculine' : product.gender === 'fem' ? 'Feminine' : 'Unisex'}` : ''}
            </p>
          </div>

          <p
            className="font-display text-2xl"
            style={{ color: 'var(--color-primary)' }}
          >
            {formatPrice(product.price_idr)}
          </p>

          {explanation && (
            <div
              className="p-5"
              style={{
                backgroundColor: 'rgba(201,169,110,0.05)',
                border: '1px solid rgba(201,169,110,0.15)',
                borderRadius: 'var(--r-sm)',
              }}
            >
              <p
                className="text-xs tracking-widest uppercase mb-2"
                style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
              >
                Why this suits you
              </p>
              <p className="text-sm" style={{ color: 'var(--color-ink)', lineHeight: '1.8' }}>
                {explanation}
              </p>
            </div>
          )}

          {(product.top_notes.length > 0 || product.heart_notes.length > 0) && (
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
            className="btn-primary text-center"
          >
            View on HMNS
          </a>
        </div>
      </div>
    </div>
  );
}
