import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';

const CATEGORY_EMOJI: Record<string, string> = {
  technique: '🎾',
  echanges: '🔥',
  service: '🚀',
  fairplay: '💛',
  jeu: '🎮',
};

export function ChildChallenges() {
  const { childChallenges, requestChallengeApproval } = useTennisStore();

  const active = childChallenges.filter((c) => c.status === 'active');
  const pending = childChallenges.filter((c) => c.status === 'pending_approval');
  const completed = childChallenges.filter((c) => c.status === 'completed');

  const handleClaim = (id: string) => {
    requestChallengeApproval(id);
    fireStarCelebration();
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="child-card p-5 sm:p-6">
        <h1 className="child-display text-2xl font-bold sm:text-3xl">🎯 Mes Défis de la Semaine</h1>
        <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
          Quand tu as réussi un défi sur le court, clique sur « J’ai réussi ! » pour demander tes
          étoiles à Papa ou Maman.
        </p>
      </div>

      {/* Active Missions */}
      <section className="space-y-3">
        <h2 className="child-display px-1 text-xl font-bold">✨ Missions en cours ({active.length})</h2>
        {active.length === 0 ? (
          <div className="child-card p-6 text-center">
            <p className="text-3xl">🌟</p>
            <p className="child-display mt-2 text-lg font-bold">
              Tu as tenté tous tes défis de la semaine !
            </p>
            <p className="text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
              Demande à Papa ou Maman de t’ajouter un nouveau défi.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((ch) => (
              <div key={ch.id} className="child-card flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4E0] text-2xl">
                      {CATEGORY_EMOJI[ch.category] ?? '🎾'}
                    </span>
                    <span className="rounded-full bg-[#FFF3CC] px-3 py-1 text-sm font-extrabold text-[#9A6700]">
                      +{ch.starsReward} ⭐
                    </span>
                  </div>
                  <h3 className="child-display mt-3 text-xl font-bold">{ch.title}</h3>
                  {ch.description && (
                    <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
                      {ch.description}
                    </p>
                  )}
                  {ch.parentFeedback && (
                    <p className="mt-3 rounded-2xl bg-[#FFF6E8] p-3 text-xs font-bold text-[#9A5A20]">
                      💬 Petit mot : {ch.parentFeedback}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleClaim(ch.id)}
                  className="child-btn child-btn-primary mt-4 flex w-full items-center justify-center gap-2 py-3 text-base font-bold"
                >
                  <Sparkles className="h-5 w-5" />
                  J’ai réussi ! 🎉
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Parent Approval */}
      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="child-display px-1 text-xl font-bold">
            ⏳ En attente de validation ({pending.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pending.map((ch) => (
              <div
                key={ch.id}
                className="rounded-3xl border-2 border-[#F4B942] bg-[#FFFDF5] p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF2C9] px-3 py-1 text-xs font-extrabold text-[#9A6700]">
                    <Clock className="h-3.5 w-3.5" />
                    Envoyé à Papa / Maman
                  </span>
                  <span className="text-sm font-extrabold text-[#9A6700]">+{ch.starsReward} ⭐</span>
                </div>
                <h3 className="child-display mt-2.5 text-lg font-bold">{ch.title}</h3>
                <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
                  Dès qu’ils valident, tes étoiles arrivent ici avec des confettis !
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Missions */}
      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="child-display px-1 text-xl font-bold">
            🏆 Défis déjà gagnés ({completed.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {completed.map((ch) => (
              <div
                key={ch.id}
                className="rounded-3xl border-2 border-[#BCE7D0] bg-[#F2FBF6] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#15803D]">
                    <CheckCircle2 className="h-4 w-4" />
                    Réussi !
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-[#9A6700]">
                    +{ch.starsReward} ⭐ gagnées
                  </span>
                </div>
                <h3 className="child-display mt-2 text-lg font-bold text-[#14532D]">{ch.title}</h3>
                {ch.parentFeedback && (
                  <p className="mt-2 rounded-xl bg-white/80 px-3 py-2 text-xs font-bold text-[#166534]">
                    💌 « {ch.parentFeedback} »
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
