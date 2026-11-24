import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles, Star } from 'lucide-react';
import {
  DAILY_QUIZ_STAR_CAP,
  TENNIS_QUIZ_BANK,
  type QuizQuestion,
} from '../../data/galaxieCatalog';
import { fireBigTrophyCelebration, fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';

function pickFiveQuestions(): QuizQuestion[] {
  const copy = [...TENNIS_QUIZ_BANK];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 5);
}

export function ChildQuiz() {
  const { todayQuizStarsEarned, recordQuizAttempt } = useTennisStore();
  const [roundSeed, setRoundSeed] = useState(0);
  const questions = useMemo(() => {
    void roundSeed;
    return pickFiveQuestions();
  }, [roundSeed]);

  const [step, setStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  const current = questions[step];
  const remainingDailyStars = Math.max(0, DAILY_QUIZ_STAR_CAP - todayQuizStarsEarned);

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    if (idx === current.correctIndex) {
      setScore((s) => s + 1);
      fireStarCelebration();
    }
  };

  const handleNext = () => {
    if (step + 1 < questions.length) {
      setStep((s) => s + 1);
      setSelectedIdx(null);
    } else {
      const stars = recordQuizAttempt(score, questions.length);
      setEarnedStars(stars);
      setFinished(true);
      if (score >= 4) {
        fireBigTrophyCelebration();
      }
    }
  };

  const handleRestart = () => {
    setRoundSeed((r) => r + 1);
    setStep(0);
    setSelectedIdx(null);
    setScore(0);
    setFinished(false);
    setEarnedStars(0);
  };

  return (
    <div className="space-y-6 pb-8">
      <section className="child-card flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
        <div>
          <h1 className="child-display text-2xl font-bold sm:text-3xl">🧠 Mini-Quiz Tennis</h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
            Réponds aux 5 questions rigolotes pour devenir incollable sur le tennis !
          </p>
        </div>
        <div className="rounded-2xl bg-[#FFF3CC] px-4 py-2 text-xs font-extrabold text-[#9A6700]">
          <Star className="mr-1 inline h-4 w-4 fill-[#F4B942] text-[#F4B942]" />
          Bonus du jour restant : {remainingDailyStars} / {DAILY_QUIZ_STAR_CAP} ⭐
        </div>
      </section>

      {finished ? (
        <section className="child-card animate-pop-in p-7 text-center">
          <div className="text-6xl">{score >= 4 ? '🏆' : score >= 2 ? '🎾' : '🌟'}</div>
          <h2 className="child-display mt-3 text-3xl font-bold">
            Bravo ! Tu as eu {score} / {questions.length} !
          </h2>
          <p className="mt-2 text-base font-bold" style={{ color: 'var(--c-ink-soft)' }}>
            {earnedStars > 0
              ? `Tu gagnes +${earnedStars} étoiles bonus aujourd’hui !`
              : 'Tu as déjà gagné toutes tes étoiles quiz du jour, mais tu peux rejouer pour t’amuser !'}
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="child-btn child-btn-primary mt-6 inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold"
          >
            <RotateCcw className="h-5 w-5" />
            Rejouer un autre quiz
          </button>
        </section>
      ) : (
        <section className="child-card p-5 sm:p-7">
          {/* Progress dots */}
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-[#FFF4E0] px-3 py-1 text-xs font-extrabold text-[#9A5A20]">
              Question {step + 1} sur {questions.length}
            </span>
            <div className="flex gap-1.5">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className={`h-2.5 w-7 rounded-full transition ${
                    i < step
                      ? 'bg-[#2A9D8F]'
                      : i === step
                        ? 'bg-[#EE6C4D]'
                        : 'bg-[#ECE4DB]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-5xl">{current.emoji}</div>
            <h2 className="child-display mx-auto mt-3 max-w-xl text-2xl font-bold leading-snug">
              {current.question}
            </h2>
          </div>

          <div className="mx-auto mt-6 max-w-xl space-y-3">
            {current.options.map((opt, idx) => {
              const answered = selectedIdx !== null;
              const isCorrect = idx === current.correctIndex;
              const isChosen = idx === selectedIdx;

              let styleClass =
                'border-[var(--c-border)] bg-white hover:border-[#EE6C4D] hover:bg-[#FFF9F2]';
              if (answered) {
                if (isCorrect) {
                  styleClass = 'border-[#16A34A] bg-[#EAFBF0] text-[#14532D]';
                } else if (isChosen) {
                  styleClass = 'border-[#EF4444] bg-[#FEF2F2] text-[#991B1B]';
                } else {
                  styleClass = 'border-[#EAE4DD] bg-[#FAF8F6] opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={answered}
                  onClick={() => handleAnswer(idx)}
                  className={`child-btn flex w-full items-center justify-between border-2 px-5 py-4 text-left text-base font-extrabold transition ${styleClass}`}
                >
                  <span>{opt}</span>
                  {answered && isCorrect && <span className="text-xl">✅</span>}
                  {answered && isChosen && !isCorrect && <span className="text-xl">💡</span>}
                </button>
              );
            })}
          </div>

          {selectedIdx !== null && (
            <div className="animate-pop-in mx-auto mt-5 max-w-xl rounded-3xl bg-[#FFF6E5] p-4 text-center">
              <p className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-[#8A5410]">
                <Sparkles className="h-4 w-4" />
                {current.explanation}
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="child-btn child-btn-primary mt-4 inline-flex items-center gap-2 px-6 py-2.5 text-base font-bold"
              >
                {step + 1 < questions.length ? 'Question suivante' : 'Voir mon score !'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
