import { useLang } from '../lib/langContext';

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      className="flex items-center rounded-full border overflow-hidden text-xs font-semibold"
      style={{ borderColor: 'var(--color-hairline)' }}
    >
      {(['en', 'id'] as const).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className="px-3 py-1 transition-colors duration-150 uppercase tracking-wide"
          style={{
            backgroundColor: lang === l ? 'var(--color-ink)' : 'transparent',
            color: lang === l ? 'var(--color-canvas)' : 'var(--color-muted)',
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
