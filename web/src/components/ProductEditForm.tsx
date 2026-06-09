import { useState } from 'react';
import type { Product } from '../lib/api';

type ProductEditFormProps = {
  product?: Product | null;
  onSave: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
};

const EMPTY_FORM = {
  name: '',
  slug: '',
  type: 'edp' as Product['type'],
  price_idr: 0,
  volume_ml: null as number | null,
  scent_family: '',
  scent_tags: [] as string[],
  scent_texture: null as Product['scent_texture'],
  gender: null as Product['gender'],
  intensity: null as Product['intensity'],
  top_notes: [] as string[],
  heart_notes: [] as string[],
  base_notes: [] as string[],
  occasion_tags: [] as string[],
  character_tags: [] as string[],
  time_of_day: 'all-day' as Product['time_of_day'],
  description: null as string | null,
  image_url: '',
  product_url: '',
  in_stock: 1 as 0 | 1,
  is_active: 1 as 0 | 1,
};

function tagsFromString(s: string): string[] {
  return s
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}

function tagsToString(tags: string[]): string {
  return tags.join(', ');
}

export function ProductEditForm({ product, onSave, onClose }: ProductEditFormProps) {
  const [form, setForm] = useState(() => {
    if (!product) return { ...EMPTY_FORM };
    return {
      name: product.name,
      slug: product.slug,
      type: product.type,
      price_idr: product.price_idr,
      volume_ml: product.volume_ml,
      scent_family: product.scent_family,
      scent_tags: [...product.scent_tags],
      scent_texture: product.scent_texture,
      gender: product.gender,
      intensity: product.intensity,
      top_notes: [...product.top_notes],
      heart_notes: [...product.heart_notes],
      base_notes: [...product.base_notes],
      occasion_tags: [...product.occasion_tags],
      character_tags: [...product.character_tags],
      time_of_day: product.time_of_day,
      description: product.description,
      image_url: product.image_url,
      product_url: product.product_url,
      in_stock: product.in_stock as 0 | 1,
      is_active: product.is_active as 0 | 1,
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { color: 'var(--color-ink)' };
  const inputStyle = {
    borderColor: 'var(--color-hairline)',
    borderRadius: 'var(--r-sm)',
    color: 'var(--color-ink)',
  };

  const inputClass = 'w-full px-3 py-2 border rounded text-sm outline-none transition-all';

  return (
    // Slide-over backdrop
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black bg-opacity-30"
        onClick={onClose}
      />
      <div
        className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col"
        style={{ maxHeight: '100vh' }}
      >
        {/* Drawer header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: 'var(--color-hairline)' }}
        >
          <h2 className="text-lg font-bold" style={labelStyle}>
            {product ? 'Edit product' : 'Add product'}
          </h2>
          <button onClick={onClose} className="text-xl font-light" style={{ color: 'var(--color-muted)' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6 flex-1">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={e => set('slug', e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. rose-noir"
            />
          </div>

          {/* Type + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Type *</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value as Product['type'])}
                className={inputClass}
                style={inputStyle}
              >
                {['edp', 'extrait', 'mist', 'hair', 'set'].map(t => (
                  <option key={t} value={t}>{t.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Gender</label>
              <select
                value={form.gender ?? ''}
                onChange={e => set('gender', (e.target.value || null) as Product['gender'])}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">—</option>
                <option value="masc">Masculine</option>
                <option value="fem">Feminine</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          {/* Price + Volume */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Price (IDR) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.price_idr}
                onChange={e => set('price_idr', parseInt(e.target.value, 10) || 0)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Volume (ml)</label>
              <input
                type="number"
                min={0}
                value={form.volume_ml ?? ''}
                onChange={e => set('volume_ml', e.target.value ? parseInt(e.target.value, 10) : null)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Scent family */}
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>Scent family *</label>
            <input
              type="text"
              required
              value={form.scent_family}
              onChange={e => set('scent_family', e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g. Floral Woody"
            />
          </div>

          {/* Texture + Intensity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Texture</label>
              <select
                value={form.scent_texture ?? ''}
                onChange={e => set('scent_texture', (e.target.value || null) as Product['scent_texture'])}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">—</option>
                {['fresh', 'soft', 'warm', 'sharp', 'deep', 'sweet'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Intensity</label>
              <select
                value={form.intensity ?? ''}
                onChange={e => set('intensity', (e.target.value || null) as Product['intensity'])}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">—</option>
                {['subtle', 'balanced', 'bold'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          {(['top_notes', 'heart_notes', 'base_notes'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                {field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} (comma-separated)
              </label>
              <input
                type="text"
                value={tagsToString(form[field])}
                onChange={e => set(field, tagsFromString(e.target.value))}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. Rose, Bergamot"
              />
            </div>
          ))}

          {/* Tags */}
          {(['scent_tags', 'occasion_tags', 'character_tags'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>
                {field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} (comma-separated)
              </label>
              <input
                type="text"
                value={tagsToString(form[field])}
                onChange={e => set(field, tagsFromString(e.target.value))}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. romantic, adventurous"
              />
            </div>
          ))}

          {/* Time of day */}
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>Time of day</label>
            <select
              value={form.time_of_day}
              onChange={e => set('time_of_day', e.target.value as Product['time_of_day'])}
              className={inputClass}
              style={inputStyle}
            >
              {['morning', 'evening', 'all-day'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>Description</label>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value || null)}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
          </div>

          {/* URLs */}
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => set('image_url', e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>Product URL</label>
            <input
              type="url"
              value={form.product_url}
              onChange={e => set('product_url', e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://madeforhmns.com/..."
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={labelStyle}>
              <input
                type="checkbox"
                checked={form.is_active === 1}
                onChange={e => set('is_active', e.target.checked ? 1 : 0)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              Active
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={labelStyle}>
              <input
                type="checkbox"
                checked={form.in_stock === 1}
                onChange={e => set('in_stock', e.target.checked ? 1 : 0)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              In stock
            </label>
          </div>

          {error && (
            <p className="text-sm bg-red-50 text-red-600 px-4 py-3 rounded-md">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'var(--color-hairline)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3 disabled:opacity-50"
            >
              {loading ? 'Saving…' : (product ? 'Save changes' : 'Add product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
