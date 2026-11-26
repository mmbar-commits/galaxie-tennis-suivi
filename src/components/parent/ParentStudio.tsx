import { useState } from 'react';
import { Check, Gift, Pencil, Plus, Send, Target, Trash2, Users, Wand2, X } from 'lucide-react';
import { useTennisStore } from '../../lib/store';
import type { Challenge } from '../../types/tennis';

const REWARD_EMOJIS = ['🍦', '🎬', '🎨', '🥞', '📚', '🧸', '🏊‍♀️', '🍕', '🎁', '🎾', '⭐'];

const CATEGORY_LABELS: Record<Challenge['category'], { label: string; emoji: string }> = {
  technique: { label: 'Technique', emoji: '🎾' },
  echanges: { label: 'Échanges', emoji: '🔥' },
  service: { label: 'Service', emoji: '🚀' },
  fairplay: { label: 'Fair-play', emoji: '💛' },
  jeu: { label: 'Jeu', emoji: '🎮' },
};

export function ParentStudio() {
  const {
    state,
    addStudioChallenge,
    updateStudioChallenge,
    deleteStudioChallenge,
    assignStudioChallengeToChildren,
    addStudioReward,
    updateStudioReward,
    deleteStudioReward,
    assignStudioRewardToChildren,
  } = useTennisStore();

  const [tab, setTab] = useState<'challenges' | 'rewards'>('challenges');
  const [toast, setToast] = useState<string | null>(null);

  // Challenge form state (create or edit)
  const [editingChId, setEditingChId] = useState<string | null>(null);
  const [chTitle, setChTitle] = useState('');
  const [chDesc, setChDesc] = useState('');
  const [chCat, setChCat] = useState<Challenge['category']>('technique');
  const [chStars, setChStars] = useState(15);

  // Reward form state (create or edit)
  const [editingRewId, setEditingRewId] = useState<string | null>(null);
  const [rewTitle, setRewTitle] = useState('');
  const [rewDesc, setRewDesc] = useState('');
  const [rewEmoji, setRewEmoji] = useState('🍦');
  const [rewCost, setRewCost] = useState(30);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const resetChForm = () => {
    setEditingChId(null);
    setChTitle('');
    setChDesc('');
    setChCat('technique');
    setChStars(15);
  };

  const resetRewForm = () => {
    setEditingRewId(null);
    setRewTitle('');
    setRewDesc('');
    setRewEmoji('🍦');
    setRewCost(30);
  };

  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitle.trim()) return;
    if (editingChId) {
      updateStudioChallenge(editingChId, {
        title: chTitle.trim(),
        description: chDesc.trim(),
        category: chCat,
        starsReward: chStars,
      });
      notify('Modèle de défi mis à jour !');
    } else {
      addStudioChallenge({
        title: chTitle.trim(),
        description: chDesc.trim(),
        category: chCat,
        starsReward: chStars,
      });
      notify('Nouveau défi créé dans le Studio !');
    }
    resetChForm();
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewTitle.trim()) return;
    if (editingRewId) {
      updateStudioReward(editingRewId, {
        title: rewTitle.trim(),
        description: rewDesc.trim(),
        emoji: rewEmoji,
        starCost: rewCost,
      });
      notify('Modèle de récompense mis à jour !');
    } else {
      addStudioReward({
        title: rewTitle.trim(),
        description: rewDesc.trim(),
        emoji: rewEmoji,
        starCost: rewCost,
      });
      notify('Nouvelle récompense créée dans le Studio !');
    }
    resetRewForm();
  };

  const isChallengeAssignedTo = (templateId: string, title: string, childId: string) => {
    return state.challenges.some(
      (c) =>
        c.childId === childId &&
        c.status !== 'completed' &&
        (c.templateId === templateId || c.title.toLowerCase() === title.toLowerCase()),
    );
  };

  const isRewardAssignedTo = (templateId: string, title: string, childId: string) => {
    return state.rewards.some(
      (r) =>
        r.childId === childId &&
        r.active &&
        (r.templateId === templateId || r.title.toLowerCase() === title.toLowerCase()),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
            Bibliothèque Famille • Création & Assignation
          </p>
          <h1 className="parent-display mt-0.5 flex items-center gap-2.5 text-3xl font-bold text-[#1F2421]">
            <Wand2 className="h-7 w-7 text-[#C85A32]" />
            Studio Défis & Récompenses
          </h1>
          <p className="mt-1 text-sm text-[#5C6660]">
            Crée tes propres défis et récompenses ici, puis assigne-les en 1 clic à chaque enfant.
          </p>
        </div>
        {toast && (
          <span className="animate-pop-in rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white shadow">
            ✓ {toast}
          </span>
        )}
      </div>

      {/* Studio Switcher Tabs */}
      <div className="inline-flex rounded-2xl border border-[#E8DDD0] bg-white p-1.5 shadow-2xs">
        <button
          type="button"
          onClick={() => setTab('challenges')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            tab === 'challenges'
              ? 'bg-[#C85A32] text-white shadow-xs'
              : 'text-[#5C6660] hover:text-[#1F2421]'
          }`}
        >
          <Target className="h-4 w-4" />
          Catalogue Défis ({state.studioChallenges.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('rewards')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
            tab === 'rewards'
              ? 'bg-[#1E4D3B] text-white shadow-xs'
              : 'text-[#5C6660] hover:text-[#1F2421]'
          }`}
        >
          <Gift className="h-4 w-4" />
          Catalogue Récompenses ({state.studioRewards.length})
        </button>
      </div>

      {/* CHALLENGES STUDIO */}
      {tab === 'challenges' && (
        <div className="space-y-5">
          <form onSubmit={handleSaveChallenge} className="parent-card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="parent-display text-lg font-bold text-[#1E4D3B]">
                {editingChId ? 'Modifier le modèle de défi' : '+ Créer un nouveau défi'}
              </h2>
              {editingChId && (
                <button
                  type="button"
                  onClick={resetChForm}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C6660] hover:text-[#1F2421]"
                >
                  <X className="h-3.5 w-3.5" /> Annuler
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-12">
              <input
                type="text"
                required
                value={chTitle}
                onChange={(e) => setChTitle(e.target.value)}
                placeholder="Titre du défi (ex : 10 échanges en coup droit)"
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32] md:col-span-5"
              />
              <input
                type="text"
                value={chDesc}
                onChange={(e) => setChDesc(e.target.value)}
                placeholder="Consigne motivante pour l'enfant..."
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32] md:col-span-4"
              />
              <select
                value={chCat}
                onChange={(e) => setChCat(e.target.value as Challenge['category'])}
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-2.5 py-2 text-xs font-semibold outline-none md:col-span-2"
              >
                {(Object.keys(CATEGORY_LABELS) as Challenge['category'][]).map((k) => (
                  <option key={k} value={k}>
                    {CATEGORY_LABELS[k].emoji} {CATEGORY_LABELS[k].label}
                  </option>
                ))}
              </select>
              <select
                value={chStars}
                onChange={(e) => setChStars(Number(e.target.value))}
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-2.5 py-2 text-xs font-bold text-[#9A6700] outline-none md:col-span-1"
              >
                {[5, 10, 15, 20, 25, 30, 50].map((v) => (
                  <option key={v} value={v}>
                    {v} ⭐
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C85A32] px-4 py-2 text-xs font-bold text-white hover:bg-[#A54522]"
            >
              <Plus className="h-4 w-4" />
              {editingChId ? 'Mettre à jour ce défi' : 'Ajouter au Studio'}
            </button>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {state.studioChallenges.map((tpl) => {
              const cat = CATEGORY_LABELS[tpl.category] ?? CATEGORY_LABELS.technique;
              return (
                <div key={tpl.id} className="parent-card flex flex-col justify-between p-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#FAF6F0] px-2.5 py-0.5 text-xs font-bold text-[#1F2421]">
                          {cat.emoji} {cat.label}
                        </span>
                        <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-xs font-bold text-[#9A6700]">
                          +{tpl.starsReward} ⭐
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingChId(tpl.id);
                            setChTitle(tpl.title);
                            setChDesc(tpl.description);
                            setChCat(tpl.category);
                            setChStars(tpl.starsReward);
                          }}
                          className="rounded-lg p-1.5 text-[#5C6660] hover:bg-[#FAF6F0] hover:text-[#1F2421]"
                          title="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteStudioChallenge(tpl.id)}
                          className="rounded-lg p-1.5 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                          title="Supprimer du Studio"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="mt-2 font-bold text-[#1F2421]">{tpl.title}</h3>
                    {tpl.description && (
                      <p className="mt-0.5 text-xs text-[#5C6660]">{tpl.description}</p>
                    )}
                  </div>

                  {/* Per-child assignment bar */}
                  <div className="mt-4 border-t border-[#EFE6DA] pt-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
                        <Users className="h-3 w-3" /> Assigner aux enfants
                      </span>
                      {state.children.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const count = assignStudioChallengeToChildren(
                              tpl.id,
                              state.children.map((c) => c.id),
                            );
                            notify(
                              count > 0
                                ? `Défi assigné à ${count} enfant${count > 1 ? 's' : ''} !`
                                : 'Déjà actif pour tous les enfants.',
                            );
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C85A32] hover:underline"
                        >
                          <Send className="h-3 w-3" /> Tous
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {state.children.map((child) => {
                        const assigned = isChallengeAssignedTo(tpl.id, tpl.title, child.id);
                        return (
                          <button
                            key={child.id}
                            type="button"
                            disabled={assigned}
                            onClick={() => {
                              const count = assignStudioChallengeToChildren(tpl.id, [child.id]);
                              if (count > 0) {
                                notify(`Défi « ${tpl.title} » assigné à ${child.name} !`);
                              }
                            }}
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                              assigned
                                ? 'bg-[#E9F3EE] text-[#1E4D3B]'
                                : 'border border-[#E8DDD0] bg-[#FAF6F0] text-[#1F2421] hover:border-[#C85A32] hover:bg-[#FDF0EB]'
                            }`}
                          >
                            {assigned ? (
                              <>
                                <Check className="h-3 w-3" /> Actif chez {child.name}
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3 text-[#C85A32]" /> {child.name}
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REWARDS STUDIO */}
      {tab === 'rewards' && (
        <div className="space-y-5">
          <form onSubmit={handleSaveReward} className="parent-card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="parent-display text-lg font-bold text-[#1E4D3B]">
                {editingRewId ? 'Modifier la récompense' : '+ Créer une nouvelle récompense'}
              </h2>
              {editingRewId && (
                <button
                  type="button"
                  onClick={resetRewForm}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C6660] hover:text-[#1F2421]"
                >
                  <X className="h-3.5 w-3.5" /> Annuler
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REWARD_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setRewEmoji(em)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border text-lg transition ${
                    rewEmoji === em
                      ? 'scale-105 border-[#C85A32] bg-[#FDF0EB]'
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
                placeholder="Titre (ex : Choisir le dessert, Nouveau surgrip...)"
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32] md:col-span-5"
              />
              <input
                type="text"
                value={rewDesc}
                onChange={(e) => setRewDesc(e.target.value)}
                placeholder="Description courte..."
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
                  {editingRewId ? 'Mettre à jour' : '+ Studio'}
                </button>
              </div>
            </div>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {state.studioRewards.map((tpl) => (
              <div key={tpl.id} className="parent-card flex flex-col justify-between p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-2xl">
                      {tpl.emoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-[#1F2421]">{tpl.title}</h3>
                      {tpl.description && (
                        <p className="mt-0.5 text-xs text-[#5C6660]">{tpl.description}</p>
                      )}
                      <span className="mt-1.5 inline-block rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-xs font-bold text-[#9A6700]">
                        {tpl.starCost} ⭐
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRewId(tpl.id);
                        setRewTitle(tpl.title);
                        setRewDesc(tpl.description);
                        setRewEmoji(tpl.emoji);
                        setRewCost(tpl.starCost);
                      }}
                      className="rounded-lg p-1.5 text-[#5C6660] hover:bg-[#FAF6F0] hover:text-[#1F2421]"
                      title="Modifier"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStudioReward(tpl.id)}
                      className="rounded-lg p-1.5 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                      title="Supprimer du Studio"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Per-child boutique assignment */}
                <div className="mt-4 border-t border-[#EFE6DA] pt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
                      <Users className="h-3 w-3" /> Boutique des enfants
                    </span>
                    {state.children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const count = assignStudioRewardToChildren(
                            tpl.id,
                            state.children.map((c) => c.id),
                          );
                          notify(
                            count > 0
                              ? `Récompense ajoutée à la boutique de ${count} enfant${count > 1 ? 's' : ''} !`
                              : 'Déjà dans la boutique de tous les enfants.',
                          );
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E4D3B] hover:underline"
                      >
                        <Send className="h-3 w-3" /> Tous
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {state.children.map((child) => {
                      const assigned = isRewardAssignedTo(tpl.id, tpl.title, child.id);
                      return (
                        <button
                          key={child.id}
                          type="button"
                          disabled={assigned}
                          onClick={() => {
                            const count = assignStudioRewardToChildren(tpl.id, [child.id]);
                            if (count > 0) {
                              notify(`Récompense ajoutée à la boutique de ${child.name} !`);
                            }
                          }}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition ${
                            assigned
                              ? 'bg-[#E9F3EE] text-[#1E4D3B]'
                              : 'border border-[#E8DDD0] bg-[#FAF6F0] text-[#1F2421] hover:border-[#1E4D3B] hover:bg-[#E9F3EE]'
                          }`}
                        >
                          {assigned ? (
                            <>
                              <Check className="h-3 w-3" /> Boutique de {child.name}
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 text-[#1E4D3B]" /> {child.name}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
