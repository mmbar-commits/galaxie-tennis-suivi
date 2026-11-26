import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Sparkles, X } from 'lucide-react';
import { GALAXIE_LEVELS } from '../../data/galaxieCatalog';
import {
  computeInitialAssessment,
  INITIAL_ASSESSMENT_QUESTIONS,
  type InitialAssessmentResult,
} from '../../data/initialAssessment';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { BallLevel } from '../../types/tennis';

interface InitialAssessmentModalProps {
  mode: 'create' | 'reevaluate';
  existingChildId?: string;
  existingChildName?: string;
  onClose: () => void;
}

export function InitialAssessmentModal({
  mode,
  existingChildId,
  existingChildName,
  onClose,
}: InitialAssessmentModalProps) {
  const { state, addChild, applyInitialAssessment } = useTennisStore();

  // Step: 'info' (create mode only) -> 'questions' -> 'result'
  const [step, setStep] = useState<'info' | 'questions' | 'result'>(
    mode === 'create' ? 'info' : 'questions',
  );

  // Child basics (for create mode)
  const [name, setName] = useState(existingChildName || '');
  const [age, setAge] = useState(7);
  const [clubId, setClubId] = useState(state.clubs[0]?.id ?? '');

  // Questionnaire answers
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<InitialAssessmentResult | null>(null);
  const [overrideBall, setOverrideBall] = useState<BallLevel>('rouge');

  const currentQuestion = INITIAL_ASSESSMENT_QUESTIONS[qIndex];
  const totalQ = INITIAL_ASSESSMENT_QUESTIONS.length;

  const handleSelectOption = (points: number) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: points };
    setAnswers(nextAnswers);

    if (qIndex + 1 < totalQ) {
      setQIndex((i) => i + 1);
    } else {
      const computed = computeInitialAssessment(nextAnswers);
      setResult(computed);
      setOverrideBall(computed.recommendedBall);
      setStep('result');
      fireStarCelebration();
    }
  };

  const handleSkipAssessment = () => {
    if (!name.trim()) return;
    addChild({
      name: name.trim(),
      age,
      currentBall: overrideBall,
      clubId: clubId || undefined,
    });
    onClose();
  };

  const handleConfirmResult = () => {
    if (!result) return;
    const finalResult: InitialAssessmentResult = {
      ...result,
      recommendedBall: overrideBall,
    };

    if (mode === 'create') {
      addChild({
        name: name.trim() || 'Nouvel enfant',
        age,
        currentBall: overrideBall,
        clubId: clubId || undefined,
        assessment: finalResult,
      });
    } else if (existingChildId) {
      applyInitialAssessment(existingChildId, finalResult);
    }
    fireStarCelebration();
    onClose();
  };

  const recommendedBallMeta =
    GALAXIE_LEVELS.find((l) => l.id === overrideBall) ?? GALAXIE_LEVELS[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="animate-pop-in my-auto w-full max-w-xl rounded-3xl border border-[#E8DDD0] bg-[#FAF6F0] p-6 text-[#1F2421] shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E4D3B] text-white">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#C85A32]">
                Évaluation Initiale FFT Galaxie Tennis
              </p>
              <h2 className="parent-display text-xl font-bold">
                {mode === 'create'
                  ? 'Ajouter un enfant & évaluer son niveau'
                  : `Questionnaire initial — ${existingChildName}`}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#5C6660] hover:bg-black/5"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: CHILD BASICS */}
        {step === 'info' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                    Prénom de l’enfant *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex : Chloé, Lucas..."
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#5C6660]">Âge</label>
                  <input
                    type="number"
                    min={3}
                    max={18}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                  Club assigné (optionnel)
                </label>
                <select
                  value={clubId}
                  onChange={(e) => setClubId(e.target.value)}
                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none"
                >
                  <option value="">— Aucun club pour l’instant —</option>
                  {state.clubs.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      🏟️ {cl.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-[#EFE2C6] bg-[#FEF9EC] p-4 text-xs text-[#7C4D06]">
              <p className="font-bold">✨ Questionnaire d’évaluation rapide (6 questions — 1 min)</p>
              <p className="mt-1">
                Il estime automatiquement la couleur de balle Galaxie FFT et pré-remplit les acquis
                de départ avant validation par le coach.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <select
                  value={overrideBall}
                  onChange={(e) => setOverrideBall(e.target.value as BallLevel)}
                  className="rounded-xl border border-[#E8DDD0] bg-white px-2.5 py-2 text-xs font-semibold outline-none"
                >
                  {GALAXIE_LEVELS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.emoji} {l.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={handleSkipAssessment}
                  className="rounded-xl border border-[#E8DDD0] bg-white px-3 py-2 text-xs font-semibold text-[#5C6660] hover:bg-[#F4EDE3] disabled:opacity-40"
                >
                  Passer le questionnaire
                </button>
              </div>
              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep('questions')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C85A32] px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#A54522] disabled:opacity-40"
              >
                Démarrer l’évaluation
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 6 QUESTIONS */}
        {step === 'questions' && currentQuestion && (
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs font-bold text-[#5C6660]">
              <span>
                {currentQuestion.emoji} {currentQuestion.axisLabel}
              </span>
              <span>
                Question {qIndex + 1} / {totalQ}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E8DDD0]">
              <div
                className="h-full rounded-full bg-[#1E4D3B] transition-all"
                style={{ width: `${((qIndex + 1) / totalQ) * 100}%` }}
              />
            </div>

            <h3 className="parent-display text-xl font-bold text-[#1F2421]">
              {currentQuestion.question}
            </h3>

            <div className="space-y-2">
              {currentQuestion.options.map((opt) => {
                const selected = answers[currentQuestion.id] === opt.points;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSelectOption(opt.points)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selected
                        ? 'border-[#C85A32] bg-[#FDF0EB] shadow-2xs'
                        : 'border-[#E8DDD0] bg-white hover:border-[#1E4D3B] hover:bg-[#F5FAF7]'
                    }`}
                  >
                    <p className="text-sm font-bold text-[#1F2421]">{opt.label}</p>
                    <p className="mt-0.5 text-xs text-[#5C6660]">{opt.hint}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  if (qIndex > 0) setQIndex((i) => i - 1);
                  else if (mode === 'create') setStep('info');
                  else onClose();
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-[#E8DDD0] bg-white px-3.5 py-2 text-xs font-bold text-[#5C6660]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Retour
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RECOMMENDED LEVEL RESULT */}
        {step === 'result' && result && (
          <div className="space-y-4">
            <div
              className="rounded-3xl p-5 text-center"
              style={{
                backgroundColor: recommendedBallMeta.bgSoft,
                border: `2px solid ${recommendedBallMeta.ringColor}`,
              }}
            >
              <div className="text-5xl">{recommendedBallMeta.emoji}</div>
              <p className="mt-2 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-[#5C6660]">
                <Sparkles className="h-3.5 w-3.5 text-[#D99B26]" />
                Niveau Galaxie Tennis recommandé
              </p>
              <h3
                className="parent-display mt-1 text-2xl font-bold"
                style={{ color: recommendedBallMeta.color }}
              >
                {recommendedBallMeta.name}
              </h3>
              <p className="mt-1 text-xs font-semibold text-[#5C6660]">
                {recommendedBallMeta.courtSize} • {recommendedBallMeta.racketHint}
              </p>
              <p className="mx-auto mt-3 max-w-md text-xs text-[#1F2421]">{result.summary}</p>
            </div>

            <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
              <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">
                Ajuster la balle si nécessaire avant d’enregistrer :
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {GALAXIE_LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setOverrideBall(l.id)}
                    className={`rounded-xl border py-2 text-center text-xs font-bold transition ${
                      overrideBall === l.id
                        ? 'border-[#C85A32] bg-[#FDF0EB] text-[#C85A32]'
                        : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#5C6660]'
                    }`}
                  >
                    <div>{l.emoji}</div>
                    <div className="mt-0.5 text-[10px]">{l.name.replace('Niveau ', '')}</div>
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[11px] text-[#5C6660]">
                ✓ {result.milestonesCompleted.length} critères TTCA pré-validés • Les objectifs en
                cours pourront ensuite être confirmés par le coach.
              </p>
            </div>

            <div className="flex justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('questions');
                  setQIndex(0);
                }}
                className="rounded-xl border border-[#E8DDD0] bg-white px-4 py-2.5 text-xs font-bold text-[#5C6660]"
              >
                Refaire les questions
              </button>
              <button
                type="button"
                onClick={handleConfirmResult}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E4D3B] px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-[#163A2C]"
              >
                <CheckCircle2 className="h-4 w-4" />
                {mode === 'create'
                  ? `Créer le profil de ${name.trim()}`
                  : 'Appliquer cette évaluation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
