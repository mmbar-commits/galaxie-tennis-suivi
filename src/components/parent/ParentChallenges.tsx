import { useState } from 'react';
import { Check, Gift, Plus, Sparkles, Target, Trash2, X } from 'lucide-react';
import { CHALLENGE_TEMPLATES } from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { Challenge } from '../../types/tennis';

const REWARD_EMOJIS = ['🍦', '🎬', '🎨', '🥞', '📚', '🧸', '🏊‍♀️', '🍕', '🎁'];

export function ParentChallenges() {
  const {
    activeChild,
    childChallenges,
    childRewards,
    childRedemptions,
    addChallenge,
    deleteChallenge,
    approveChallenge,
    declineChallengeRequest,
    addReward,
    deleteReward,
    deliverRewardRedemption,
    cancelRewardRedemption,
  } = useTennisStore();

  // Challenge form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Challenge['category']>('technique');
  const [starsReward, setStarsReward] = useState(15);

  // Reward form
  const [rewTitle, setRewTitle] = useState('');
  const [rewDesc, setRewDesc] = useState('');
  const [rewEmoji, setRewEmoji] = useState('🍦');
  const [rewCost, setRewCost] = useState(30);

  const handleAddChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addChallenge({
      title: title.trim(),
      description: description.trim(),
      category,
      starsReward,
      weekLabel: 'Cette semaine',
    });
    setTitle('');
    setDescription('');
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewTitle.trim()) return;
    addReward({
      title: rewTitle.trim(),
      description: rewDesc.trim(),
      emoji: rewEmoji,
      starCost: rewCost,
    });
    setRewTitle('');
    setRewDesc('');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
          Motivation & Économie d’Étoiles
        </p>
        <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
          Défis & Boutique de Récompenses
        </h1>
        <p className="mt-1 text-sm text-[#5C6660]">
          Crée des missions ludiques pour la semaine et configure les vraies surprises que{' '}
          {activeChild.name} peut obtenir avec ses étoiles.
        </p>
      </div>

      {/* SECTION 1: WEEKLY CHALLENGES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-[#C85A32]" />
          <h2 className="parent-display text-xl font-bold text-[#1F2421]">Défis de la semaine</h2>
        </div>

        {/* Quick 1-click templates */}
        <div className="parent-card p-5">
          <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#5C6660]">
            Idées prêtes à l’emploi (Galaxie 6–9 ans) — 1 clic pour ajouter
          </p>
          <div className="flex flex-wrap gap-2">
            {CHALLENGE_TEMPLATES.map((tpl) => (
              <button
                key={tpl.title}
                type="button"
                onClick={() =>
                  addChallenge({
                    ...tpl,
                    weekLabel: 'Cette semaine',
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-1.5 text-xs font-semibold text-[#1F2421] transition hover:border-[#C85A32] hover:bg-[#FDF0EB]"
              >
                <Plus className="h-3.5 w-3.5 text-[#C85A32]" />
                {tpl.title} (+{tpl.starsReward}⭐)
              </button>
            ))}
          </div>

          <form
            onSubmit={handleAddChallenge}
            className="mt-4 grid gap-3 border-t border-[#EFE6DA] pt-4 md:grid-cols-12"
          >
            <div className="md:col-span-5">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du défi personnalisé..."
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
            </div>
            <div className="md:col-span-4">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détail court (optionnel)..."
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
            </div>
            <div className="flex gap-2 md:col-span-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Challenge['category'])}
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-2 py-2 text-xs font-semibold outline-none"
              >
                <option value="technique">Technique</option>
                <option value="echanges">Échanges</option>
                <option value="service">Service</option>
                <option value="fairplay">Fair-play</option>
                <option value="jeu">Jeu</option>
              </select>
              <select
                value={starsReward}
                onChange={(e) => setStarsReward(Number(e.target.value))}
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-2 py-2 text-xs font-bold text-[#9A6700] outline-none"
              >
                <option value={10}>10 ⭐</option>
                <option value={15}>15 ⭐</option>
                <option value={20}>20 ⭐</option>
                <option value={30}>30 ⭐</option>
              </select>
              <button
                type="submit"
                className="rounded-xl bg-[#C85A32] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#A54522]"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>

        {/* Challenge List */}
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
                  {ch.description && <p className="mt-0.5 text-xs text-[#5C6660]">{ch.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => deleteChallenge(ch.id)}
                  className="rounded-lg p-1 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                  title="Supprimer"
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
            Boutique de récompenses réelles
          </h2>
        </div>

        <form onSubmit={handleAddReward} className="parent-card p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#5C6660]">
            Ajouter une surprise échangeable contre des étoiles
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {REWARD_EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setRewEmoji(em)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border text-lg transition ${
                  rewEmoji === em
                    ? 'border-[#C85A32] bg-[#FDF0EB] scale-105'
                    : 'border-[#E8DDD0] bg-[#FAF6F0]'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-12">
            <input
              type="text"
              required
              value={rewTitle}
              onChange={(e) => setRewTitle(e.target.value)}
              placeholder="Ex : Choisir le dessert, Nouveau surgrip rose..."
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32] md:col-span-5"
            />
            <input
              type="text"
              value={rewDesc}
              onChange={(e) => setRewDesc(e.target.value)}
              placeholder="Petite description motivante..."
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32] md:col-span-4"
            />
            <div className="flex gap-2 md:col-span-3">
              <input
                type="number"
                min={5}
                max={500}
                step={5}
                value={rewCost}
                onChange={(e) => setRewCost(Number(e.target.value))}
                className="w-20 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-2.5 py-2 text-sm font-bold text-[#9A6700] outline-none"
                title="Coût en étoiles"
              />
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#1E4D3B] px-3 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
              >
                + Boutique
              </button>
            </div>
          </div>
        </form>

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
