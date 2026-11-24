import { useState } from 'react';
import { CheckCircle2, Clock, Gift, Star } from 'lucide-react';
import { fireBigTrophyCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';

export function ChildRewardShop() {
  const { activeChild, childRewards, childRedemptions, requestRewardRedemption } = useTennisStore();
  const [banner, setBanner] = useState<string | null>(null);

  const handleRequest = (rewardId: string, title: string) => {
    const ok = requestRewardRedemption(rewardId);
    if (ok) {
      fireBigTrophyCelebration();
      setBanner(`🎁 Génial ! Ta demande pour « ${title} » a été envoyée à Papa / Maman !`);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <section className="child-card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div>
          <h1 className="child-display text-2xl font-bold sm:text-3xl">
            🎁 Ma Boutique de Récompenses
          </h1>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
            Échange tes étoiles contre de vraies surprises préparées par Papa et Maman !
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-[#FFF3CC] px-4 py-2.5 text-lg font-extrabold text-[#9A6700]">
          <Star className="h-5 w-5 fill-[#F4B942] text-[#F4B942]" />
          {activeChild.starsBalance} étoiles
        </div>
      </section>

      {banner && (
        <div className="animate-pop-in rounded-3xl bg-[#2A9D8F] p-4 text-center text-sm font-extrabold text-white shadow-md">
          {banner}
        </div>
      )}

      {/* Available real-world rewards */}
      <section className="grid gap-4 sm:grid-cols-2">
        {childRewards.map((rew) => {
          const canAfford = activeChild.starsBalance >= rew.starCost;
          const pct = Math.min(100, Math.round((activeChild.starsBalance / rew.starCost) * 100));
          const missing = Math.max(0, rew.starCost - activeChild.starsBalance);

          return (
            <div key={rew.id} className="child-card flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF5E4] text-3xl">
                    {rew.emoji}
                  </div>
                  <span className="rounded-full bg-[#FFF3CC] px-3.5 py-1 text-sm font-extrabold text-[#9A6700]">
                    {rew.starCost} ⭐
                  </span>
                </div>
                <h2 className="child-display mt-3 text-xl font-bold">{rew.title}</h2>
                {rew.description && (
                  <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
                    {rew.description}
                  </p>
                )}
              </div>

              <div className="mt-4">
                {canAfford ? (
                  <button
                    type="button"
                    onClick={() => handleRequest(rew.id, rew.title)}
                    className="child-btn child-btn-primary flex w-full items-center justify-center gap-2 py-3 text-base font-bold"
                  >
                    <Gift className="h-5 w-5" />
                    Demander cette surprise !
                  </button>
                ) : (
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs font-extrabold text-[#7B6F85]">
                      <span>Progression</span>
                      <span>Encore {missing} ⭐</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[#F1E8DF]">
                      <div
                        className="h-full rounded-full bg-[#F4B942] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Redemption History */}
      {childRedemptions.length > 0 && (
        <section className="child-card p-5">
          <h2 className="child-display mb-3 text-xl font-bold">📦 Mes demandes de surprises</h2>
          <div className="space-y-2.5">
            {childRedemptions.map((red) => (
              <div
                key={red.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--c-border)] bg-[#FFFBF6] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{red.rewardEmoji}</span>
                  <div>
                    <p className="text-sm font-extrabold">{red.rewardTitle}</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
                      {red.starCost} ⭐ • Demandé le{' '}
                      {new Date(red.requestedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                {red.status === 'pending' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF2C9] px-3 py-1 text-xs font-extrabold text-[#9A6700]">
                    <Clock className="h-3.5 w-3.5" /> En attente de Papa/Maman
                  </span>
                )}
                {red.status === 'delivered' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-extrabold text-[#15803D]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Reçue ! 🎉
                  </span>
                )}
                {red.status === 'declined' && (
                  <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-bold text-[#6B7280]">
                    Étoiles rendues
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
