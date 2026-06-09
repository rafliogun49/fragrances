import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { EmailGate } from '../../components/EmailGate';
import { LangToggle } from '../../components/LangToggle';
import { useLang } from '../../lib/langContext';
import { t } from '../../lib/translations';
import type { QuizAnswers, RecommendResponse } from '../../lib/api';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz/email',
  component: EmailGatePage,
});

function EmailGatePage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tr = t[lang];

  const rawAnswers = sessionStorage.getItem('hmns_quiz_answers');
  const answers: Partial<QuizAnswers> = rawAnswers ? JSON.parse(rawAnswers) : {};

  function handleSuccess(result: RecommendResponse) {
    sessionStorage.setItem('hmns_result', JSON.stringify(result));
    navigate({ to: '/results' });
  }

  // 10 questions total; array fields count as 1 key each
  const answerKeys = Object.keys(answers).filter(k => k !== 'lang');
  if (answerKeys.length < 10) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: 'var(--color-canvas)' }}
      >
        <p className="text-base mb-4" style={{ color: 'var(--color-muted)' }}>
          {tr.notComplete}
        </p>
        <button onClick={() => navigate({ to: '/quiz' })} className="btn-primary">
          {tr.backToQuiz}
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-canvas)' }}
    >
      {/* Header */}
      <header
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--color-hairline)' }}
      >
        <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--color-ink)' }}>
          HMNS
        </span>
        <LangToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div
            className="w-12 h-1 rounded-full mb-8"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />

          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: 'var(--color-ink)', lineHeight: '1.2' }}
          >
            {tr.matchReady}
          </h1>
          <p className="text-base mb-10" style={{ color: 'var(--color-muted)', lineHeight: '1.6' }}>
            {tr.matchReadySub}
          </p>

          <EmailGate
            answers={answers as QuizAnswers}
            lang={lang}
            onSuccess={handleSuccess}
          />

          <p className="text-xs text-center mt-6" style={{ color: 'var(--color-muted)' }}>
            {tr.privacyNote}
          </p>
        </div>
      </div>
    </div>
  );
}
