import { useState, useEffect } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { ProgressBar } from '../components/ProgressBar';
import { OptionCard } from '../components/OptionCard';
import { LangToggle } from '../components/LangToggle';
import { QUIZ_QUESTIONS } from '../lib/quizData';
import { useLang } from '../lib/langContext';
import { t } from '../lib/translations';
import { derivePersona } from '../lib/personas';
import type { QuizAnswers } from '../lib/api';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: QuizPage,
});

type PartialAnswers = Partial<Omit<QuizAnswers, 'occasion' | 'notes_love' | 'notes_avoid'> & {
  occasion: string[];
  notes_love: string[];
  notes_avoid: string[];
}>;

function QuizPage() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const tr = t[lang];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [visible, setVisible] = useState(true);
  const [customInput, setCustomInput] = useState('');

  const question = QUIZ_QUESTIONS[currentQ];
  const isLast = currentQ === QUIZ_QUESTIONS.length - 1;

  const currentValue = answers[question.key as keyof PartialAnswers];
  const hasAnswer = question.multiSelect
    ? Array.isArray(currentValue) && (currentValue as string[]).length > 0
    : !!currentValue;

  // Reset custom input when question changes
  useEffect(() => {
    setCustomInput('');
  }, [currentQ]);

  useEffect(() => {
    sessionStorage.setItem('hmns_quiz_answers', JSON.stringify(answers));
  }, [answers]);

  function getMultiValue(): string[] {
    return (answers[question.key as keyof PartialAnswers] as string[] | undefined) ?? [];
  }

  function selectAnswer(value: string) {
    if (question.multiSelect) {
      const prev = getMultiValue();
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      setAnswers(prev => ({ ...prev, [question.key]: next }));
    } else {
      setAnswers(prev => ({ ...prev, [question.key]: value }));
    }
  }

  function addCustomNote(raw: string) {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    const current = getMultiValue();
    if (!current.includes(value)) {
      setAnswers(p => ({ ...p, [question.key]: [...(p[question.key as keyof PartialAnswers] as string[] ?? []), value] }));
    }
    setCustomInput('');
  }

  function removeCustomNote(value: string) {
    setAnswers(p => ({
      ...p,
      [question.key]: (p[question.key as keyof PartialAnswers] as string[] ?? []).filter(v => v !== value),
    }));
  }

  function isSelected(value: string): boolean {
    if (question.multiSelect) return getMultiValue().includes(value);
    return answers[question.key as keyof PartialAnswers] === value;
  }

  // Custom tags are values in the array that don't match any predefined option value
  const predefinedValues = new Set(question.options.map(o => o.value));
  const customTags = question.allowCustom
    ? getMultiValue().filter(v => !predefinedValues.has(v))
    : [];

  function goNext() {
    if (!hasAnswer) return;
    if (isLast) {
      const persona = derivePersona({
        vibe: answers.vibe,
        scene: answers.scene,
        how_people_see: answers.how_people_see,
        hidden_self: answers.hidden_self,
      });
      sessionStorage.setItem('hmns_persona', persona);
      navigate({ to: '/quiz/email' });
      return;
    }
    setVisible(false);
    setTimeout(() => {
      setCurrentQ(q => q + 1);
      setVisible(true);
    }, 180);
  }

  function goBack() {
    if (currentQ === 0) return;
    setVisible(false);
    setTimeout(() => {
      setCurrentQ(q => q - 1);
      setVisible(true);
    }, 180);
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
        <div className="flex items-center gap-4">
          <LangToggle />
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            {tr.exit}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="mb-10">
            <ProgressBar current={currentQ + 1} total={QUIZ_QUESTIONS.length} />
          </div>

          {/* Question */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.18s ease, transform 0.18s ease',
            }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-ink)', lineHeight: '1.3' }}
            >
              {tr[question.questionKey as keyof typeof tr]}
            </h2>

            {question.multiSelect && (
              <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
                {tr.selectAll}
              </p>
            )}

            {!question.multiSelect && <div className="mb-6" />}

            <div className="flex flex-col gap-3">
              {question.options.map(opt => (
                <OptionCard
                  key={opt.value}
                  value={opt.value}
                  label={tr[opt.labelKey as keyof typeof tr] as string}
                  selected={isSelected(opt.value)}
                  onClick={() => selectAnswer(opt.value)}
                  multiSelect={question.multiSelect}
                />
              ))}
            </div>

            {/* Custom note input for Q9/Q10 */}
            {question.allowCustom && (
              <div className="mt-4">
                {/* Existing custom tags */}
                {customTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {customTags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border-2"
                        style={{
                          borderColor: 'var(--color-primary)',
                          color: 'var(--color-primary)',
                          backgroundColor: 'rgba(255,56,92,0.04)',
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeCustomNote(tag)}
                          className="ml-1 leading-none"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Text input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomNote(customInput);
                      }
                    }}
                    placeholder={tr.customNotePlaceholder}
                    className="flex-1 px-4 py-3 border rounded-md text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      borderColor: 'var(--color-hairline)',
                      borderRadius: 'var(--r-sm)',
                      color: 'var(--color-ink)',
                      colorScheme: 'dark',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--color-hairline)';
                      if (customInput.trim()) addCustomNote(customInput);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-10">
            <button
              onClick={goBack}
              disabled={currentQ === 0}
              className="btn-outline py-3 px-6 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {tr.back}
            </button>
            <button
              onClick={goNext}
              disabled={!hasAnswer}
              className="btn-primary flex-1 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLast ? tr.seeMyMatch : (question.multiSelect ? tr.continue : tr.next)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
