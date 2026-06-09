import { useState } from 'react';
import type { QuizAnswers, RecommendResponse } from '../lib/api';
import { api } from '../lib/api';
import { t } from '../lib/translations';
import type { Lang } from '../lib/personas';

type EmailGateProps = {
  answers: QuizAnswers;
  lang: Lang;
  onSuccess: (result: RecommendResponse) => void;
};

export function EmailGate({ answers, lang, onSuccess }: EmailGateProps) {
  const tr = t[lang];
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError(lang === 'id' ? 'Mohon setujui terlebih dahulu.' : 'Please agree to continue.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.recommend({ email, consent, answers: { ...answers, lang }, lang });
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={tr.emailPlaceholder}
          className="w-full px-4 py-3 border rounded-md text-base outline-none transition-all"
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            borderColor: 'var(--color-hairline)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--color-ink)',
            colorScheme: 'dark',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--color-hairline)')}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 flex-shrink-0"
          style={{ accentColor: 'var(--color-primary)' }}
        />
        <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {tr.consentLabel}
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-md">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="btn-primary text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {tr.loading}
          </span>
        ) : tr.seeResults}
      </button>
    </form>
  );
}
