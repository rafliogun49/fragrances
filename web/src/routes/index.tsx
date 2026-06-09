import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-canvas)' }}>
      {/* Nav */}
      <header
        className="px-8 py-6 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--color-hairline)' }}
      >
        <span
          className="font-display text-lg tracking-[0.25em] uppercase"
          style={{ color: 'var(--color-primary)', letterSpacing: '0.3em' }}
        >
          HMNS
        </span>
        <nav className="flex items-center gap-8">
          <button
            onClick={() => navigate({ to: '/catalog' })}
            className="text-xs tracking-widest uppercase"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.1em', background: 'none', border: 'none' }}
          >
            Fragrances
          </button>
          <button
            onClick={() => navigate({ to: '/quiz' })}
            className="text-xs tracking-widest uppercase"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.1em', background: 'none', border: 'none' }}
          >
            Find my scent
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-40 flex-1"
        style={{ minHeight: '85vh' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,169,110,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-8">
          <p
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.22em' }}
          >
            AI Fragrance Matching
          </p>

          <h1
            className="font-display text-5xl md:text-6xl leading-tight"
            style={{ color: 'var(--color-ink)', letterSpacing: '-0.01em', lineHeight: '1.15' }}
          >
            Find your<br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>signature</em> scent.
          </h1>

          <p
            className="text-base max-w-xs leading-relaxed"
            style={{ color: 'var(--color-muted)', lineHeight: '1.8' }}
          >
            Ten questions. One fragrance that is unmistakably yours.
          </p>

          <button
            onClick={() => navigate({ to: '/quiz' })}
            className="btn-primary mt-4"
          >
            Begin the quiz
          </button>
        </div>

        {/* Thin decorative line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--color-hairline))' }}
        />
      </section>

      {/* How it works */}
      <section className="py-28 px-6" style={{ borderTop: '1px solid var(--color-hairline)' }}>
        <div className="page-container">
          <p
            className="text-xs tracking-[0.22em] uppercase text-center mb-16"
            style={{ color: 'var(--color-primary)' }}
          >
            The process
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Take the quiz',
                desc: 'Answer ten questions about your personality, lifestyle, and the way you move through the world.',
              },
              {
                step: '02',
                title: 'Leave your email',
                desc: 'Your results are personal and saved — we need your email to retrieve them.',
              },
              {
                step: '03',
                title: 'Receive your match',
                desc: 'Your primary fragrance, curated by AI from 25 HMNS scents — plus two alternatives.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-5">
                <span
                  className="font-display text-4xl"
                  style={{ color: 'var(--color-hairline)', lineHeight: 1 }}
                >
                  {step}
                </span>
                <div
                  className="w-8 h-px"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <h3
                  className="font-display text-xl"
                  style={{ color: 'var(--color-ink)' }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-muted)', lineHeight: '1.8' }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="py-10 px-6"
        style={{
          borderTop: '1px solid var(--color-hairline)',
          backgroundColor: 'var(--color-surface-soft)',
        }}
      >
        <div className="page-container flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
          {[
            '25 HMNS fragrances',
            'AI-matched to your character',
            'Delivered instantly',
          ].map((item, i) => (
            <span
              key={i}
              className="text-xs tracking-widest uppercase"
              style={{ color: 'var(--color-muted)', letterSpacing: '0.12em' }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className="py-24 px-6 text-center"
        style={{ borderTop: '1px solid var(--color-hairline)' }}
      >
        <h2
          className="font-display text-3xl mb-4"
          style={{ color: 'var(--color-ink)' }}
        >
          Your scent is waiting.
        </h2>
        <p className="text-sm mb-10" style={{ color: 'var(--color-muted)', lineHeight: '1.8' }}>
          Discover the fragrance that speaks before you do.
        </p>
        <button
          onClick={() => navigate({ to: '/quiz' })}
          className="btn-primary"
        >
          Begin the quiz
        </button>
      </section>

      {/* Footer */}
      <footer
        className="px-8 py-8 flex items-center justify-between"
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
