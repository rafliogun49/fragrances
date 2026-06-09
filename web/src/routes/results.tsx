import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { RecommendationHero } from '../components/RecommendationHero';
import { ProductCard } from '../components/ProductCard';
import { LangToggle } from '../components/LangToggle';
import { useLang } from '../lib/langContext';
import { t } from '../lib/translations';
import { getPersona, derivePersona } from '../lib/personas';
import type { RecommendResponse } from '../lib/api';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
});

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-md animate-pulse ${className ?? ''}`}
      style={{ backgroundColor: 'var(--color-surface-soft)' }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12">
      <SkeletonBlock className="h-6 w-32 mb-8" />
      <SkeletonBlock className="h-96 w-full mb-6" />
      <SkeletonBlock className="h-5 w-48 mb-4" />
      <div className="grid md:grid-cols-2 gap-4">
        <SkeletonBlock className="h-64" />
        <SkeletonBlock className="h-64" />
      </div>
    </div>
  );
}

function ResultsPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tr = t[lang];

  const rawResult = sessionStorage.getItem('hmns_result');
  const result: RecommendResponse | null = rawResult ? JSON.parse(rawResult) : null;

  // Derive persona: prefer stored value, fall back to deriving from stored answers
  const storedPersonaTag = sessionStorage.getItem('hmns_persona');
  const rawAnswers = sessionStorage.getItem('hmns_quiz_answers');
  const parsedAnswers = rawAnswers ? JSON.parse(rawAnswers) : {};
  const personaTag = storedPersonaTag ?? derivePersona(parsedAnswers);
  const persona = getPersona(personaTag as ReturnType<typeof derivePersona>);

  if (!result) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: 'var(--color-canvas)' }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-ink)' }}>
          {tr.noResults}
        </h2>
        <p className="text-base mb-8" style={{ color: 'var(--color-muted)' }}>
          {tr.noResultsSub}
        </p>
        <button onClick={() => navigate({ to: '/quiz' })} className="btn-primary">
          {tr.takeTheQuiz}
        </button>
      </div>
    );
  }

  if (!result.primary) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-canvas)' }}>
      {/* Header */}
      <header
        className="px-6 py-4 border-b"
        style={{ borderColor: 'var(--color-hairline)' }}
      >
        <div className="page-container flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--color-ink)' }}>
            HMNS
          </span>
          <div className="flex items-center gap-4">
            <LangToggle />
            <button
              onClick={() => navigate({ to: '/quiz' })}
              className="text-sm font-medium"
              style={{ color: 'var(--color-muted)' }}
            >
              {tr.retakeQuiz}
            </button>
          </div>
        </div>
      </header>

      <div className="page-container py-12">
        {/* Persona reveal */}
        <div
          className="rounded-xl p-8 mb-10 border"
          style={{
            borderColor: 'var(--color-hairline)',
            backgroundColor: 'var(--color-surface-soft)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            {tr.youAre}
          </p>
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: 'var(--color-ink)', lineHeight: '1.15' }}
          >
            {persona.name[lang]}
          </h1>
          <p className="text-base" style={{ color: 'var(--color-muted)' }}>
            {persona.tagline[lang]}
          </p>
        </div>

        {/* Match label */}
        <div className="mb-8">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-primary)' }}
          >
            {tr.yourMatch}
          </span>
          <h2 className="text-2xl font-bold mt-1" style={{ color: 'var(--color-ink)' }}>
            {tr.weFoundYourScent}
          </h2>
          {result.fallback_used && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
              {tr.matchedByAlgorithm}
            </p>
          )}
        </div>

        {/* Primary recommendation */}
        <div className="mb-12">
          <RecommendationHero
            product={result.primary}
            explanation={result.explanation}
          />
        </div>

        {/* Alternates */}
        {result.alternates && result.alternates.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-ink)' }}>
              {tr.yourScentProfile}
            </h2>
            <p className="text-base mb-6" style={{ color: 'var(--color-muted)' }}>
              {tr.twoMoreFragrances}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {result.alternates.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  explanation={result.alt_explanations?.[i]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer CTAs */}
        <div
          className="border-t pt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
          style={{ borderColor: 'var(--color-hairline)' }}
        >
          <button
            onClick={() => {
              sessionStorage.removeItem('hmns_quiz_answers');
              sessionStorage.removeItem('hmns_result');
              sessionStorage.removeItem('hmns_persona');
              navigate({ to: '/quiz' });
            }}
            className="btn-outline py-3 px-8"
          >
            {tr.retakeQuiz}
          </button>
          <a
            href="https://madeforhmns.com/collections/all"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-3 px-8"
          >
            {tr.shopAll}
          </a>
        </div>
      </div>
    </div>
  );
}
