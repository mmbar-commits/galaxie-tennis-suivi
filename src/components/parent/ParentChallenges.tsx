import { Check, Gift, Plus, Sparkles, Target, Trash2, Wand2, X } from 'lucide-react';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';

interface ParentChallengesProps {
  onOpenStudio: () => void;
}

export function ParentChallenges({ onOpenStudio }: ParentChallengesProps) {
  const {
    state,
    activeChild,
    childChallenges,
    childRewards,
    childRedemptions,
    assignStudioChallengeToChildren,
    assignStudioRewardToChildren,
    deleteChallenge,
    approveChallenge,
    declineChallengeRequest,
    deleteReward,
    deliverRewardRedemption,
    cancelRewardRedemption,
  } = useTennisStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
            Assignés à {activeChild.name}
          </p>
          <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
            Défis & Boutique de {activeChild.name}
          </h1>
          <p className="mt-1 text-sm text-[#5C6660]">
            Valide ses réussites ou assigne rapidement des défis et récompenses depuis ton Studio.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenStudio}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E4D3B] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#163A2C]"
        >
          <Wand2 className="h-4 w-4" />
          Créer dans le Studio Défis & Récompenses
        </button>
      </div>

      {/* SECTION 1: WEEKLY CHALLENGES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-[#C85A32]" />
          <h2 className="parent-display text-xl font-bold text-[#1F2421]">
            Défis de {activeChild.name}
          </h2>
        </div>

        {/* Assign from Studio Catalog */}
        <div className="parent-card p-5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C6660]">
              Assigner depuis le Studio ({state.studioChallenges.length} modèles)
            </p>
            <button
              type="button"
              onClick={onOpenStudio}
              className="text-xs font-bold text-[#C85A32] hover:underline"
            >
              Modifier le Studio →
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.studioChallenges.map((tpl) => {
              const alreadyActive = childChallenges.some(
                (c) =>
                  c.status !== 'completed' &&
                  (c.templateId === tpl.id || c.title.toLowerCase() === tpl.title.toLowerCase()),
              );
              return (
                <button
                  key={tpl.id}
                  type="button"
                  disabled={alreadyActive}
                  onClick={() => assignStudioChallengeToChildren(tpl.id, [activeChild.id])}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    alreadyActive
                      ? 'border-[#1E4D3B]/20 bg-[#E9F3EE] text-[#1E4D3B]'
                      : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#1F2421] hover:border-[#C85A32] hover:bg-[#FDF0EB]'
                  }`}
                >
                  {alreadyActive ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 text-[#C85A32]" />
                  )}
                  {tpl.title} (+{tpl.starsReward}⭐)
                </button>
              );
            })}
          </div>
        </div>

        {/* Child Challenge List */}
        <div className="grid gap-3 md:grid-cols-2">
          {childChallenges.map((ch) => (
            <div
              key={ch.id}
              className={`parent-card p-4 ${
                ch.status === 'pending_approval'
                  ? 'border-[#E9BE70] bg-[#FEF9EC]'
                  : ch.status === 'completed'
                    ? 'bg-[#F5FAF7]'
                    : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-xs font-bold text-[#9A6700]">
                      +{ch.starsReward} ⭐
                    </span>
                    {ch.status === 'pending_approval' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#C85A32] px-2.5 py-0.5 text-[11px] font-bold text-white">
                        <Sparkles className="h-3 w-3" /> Demandé par {activeChild.name}
                      </span>
                    )}
                    {ch.status === 'completed' && (
                      <span className="rounded-full bg-[#1E4D3B] px-2.5 py-0.5 text-[11px] font-bold text-white">
                        Validé ✓
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-bold text-[#1F2421]">{ch.title}</h3>
                  {ch.description && (
                    <p className="mt-0.5 text-xs text-[#5C6660]">{ch.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteChallenge(ch.id)}
                  className="rounded-lg p-1 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                  title="Retirer ce défi"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {ch.status !== 'completed' && (
                <div className="mt-3 flex gap-2 border-t border-black/5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      approveChallenge(ch.id);
                      fireStarCelebration();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#163A2C]"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Valider & donner {ch.starsReward} ⭐
                  </button>
                  {ch.status === 'pending_approval' && (
                    <button
                      type="button"
                      onClick={() => declineChallengeRequest(ch.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#E8DDD0] bg-white px-3 py-1.5 text-xs font-semibold text-[#5C6660]"
                    >
                      <X className="h-3.5 w-3.5" /> Pas encore
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: REAL-WORLD REWARDS BOUTIQUE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-[#1E4D3B]" />
          <h2 className="parent-display text-xl font-bold text-[#1F2421]">
            Boutique de {activeChild.name}
          </h2>
        </div>

        {/* Assign Rewards from Studio */}
        <div className="parent-card p-5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C6660]">
              Ajouter à sa boutique depuis le Studio ({state.studioRewards.length} modèles)
            </p>
            <button
              type="button"
              onClick={onOpenStudio}
              className="text-xs font-bold text-[#1E4D3B] hover:underline"
            >
              Créer une récompense →
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.studioRewards.map((tpl) => {
              const alreadyInShop = childRewards.some(
                (r) =>
                  r.templateId === tpl.id || r.title.toLowerCase() === tpl.title.toLowerCase(),
              );
              return (
                <button
                  key={tpl.id}
                  type="button"
                  disabled={alreadyInShop}
                  onClick={() => assignStudioRewardToChildren(tpl.id, [activeChild.id])}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    alreadyInShop
                      ? 'border-[#1E4D3B]/20 bg-[#E9F3EE] text-[#1E4D3B]'
                      : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#1F2421] hover:border-[#1E4D3B] hover:bg-[#E9F3EE]'
                  }`}
                >
                  {alreadyInShop ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 text-[#1E4D3B]" />
                  )}
                  {tpl.emoji} {tpl.title} ({tpl.starCost}⭐)
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {childRewards.map((rew) => (
            <div key={rew.id} className="parent-card flex items-start justify-between gap-2 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-2xl">
                  {rew.emoji}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2421]">{rew.title}</h3>
                  {rew.description && <p className="text-xs text-[#5C6660]">{rew.description}</p>}
                  <span className="mt-1.5 inline-block rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-xs font-bold text-[#9A6700]">
                    {rew.starCost} ⭐
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteReward(rew.id)}
                className="rounded-lg p-1 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                title="Retirer de sa boutique"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Redemptions Tracker */}
        {childRedemptions.length > 0 && (
          <div className="parent-card p-5">
            <h3 className="parent-display mb-3 text-base font-bold text-[#1F2421]">
              Demandes de récompenses
            </h3>
            <div className="space-y-2">
              {childRedemptions.map((red) => (
                <div
                  key={red.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{red.rewardEmoji}</span>
                    <div>
                      <p className="text-sm font-bold">{red.rewardTitle}</p>
                      <p className="text-xs text-[#5C6660]">
                        {red.starCost} ⭐ • {new Date(red.requestedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {red.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => deliverRewardRedemption(red.id)}
                        className="rounded-lg bg-[#1E4D3B] px-3 py-1.5 text-xs font-bold text-white"
                      >
                        Remise ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => cancelRewardRedemption(red.id)}
                        className="rounded-lg border border-[#E8DDD0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#5C6660]"
                      >
                        Rembourser
                      </button>
                    </div>
                  ) : (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1E4D3B]">
                      {red.status === 'delivered' ? 'Remise ✓' : 'Annulée'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
