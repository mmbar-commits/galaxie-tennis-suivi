import { useState } from 'react';
import {
  Calendar,
  Check,
  FileText,
  Flame,
  Gift,
  Plus,
  Sparkles,
  Star,
  Target,
  X,
} from 'lucide-react';
import {
  CHILD_MOOD_OPTIONS,
  GALAXIE_LEVELS,
  SESSION_TYPE_LABELS,
} from '../../data/galaxieCatalog';
import { computeUnlockedBadgeIds } from '../../lib/badges';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import { SkillRadarChart } from '../shared/SkillRadarChart';

type ParentTab = 'dashboard' | 'skills' | 'sessions' | 'challenges' | 'tournaments' | 'notebook';

interface ParentDashboardProps {
  onNavigate: (tab: ParentTab) => void;
  onOpenPrintReport: () => void;
}

export function ParentDashboard({ onNavigate, onOpenPrintReport }: ParentDashboardProps) {
  const {
    state,
    activeChild,
    activeChildClub,
    childSessions,
    childChallenges,
    childRedemptions,
    childTournaments,
    childMemories,
    childQuizAttempts,
    childEvents,
    approveChallenge,
    declineChallengeRequest,
    deliverRewardRedemption,
    cancelRewardRedemption,
  } = useTennisStore();

  const [encouragementMap, setEncouragementMap] = useState<Record<string, string>>({});

  const pendingChallenges = childChallenges.filter((c) => c.status === 'pending_approval');
  const pendingRedemptions = childRedemptions.filter((r) => r.status === 'pending');

  const ballInfo =
    GALAXIE_LEVELS.find((l) => l.id === activeChild.currentBall) ?? GALAXIE_LEVELS[2];
  const ballDone = ballInfo.milestones.filter((m) =>
    activeChild.milestonesCompleted.includes(m.id),
  ).length;

  const unlockedBadges = computeUnlockedBadgeIds({
    child: activeChild,
    sessions: childSessions,
    challenges: childChallenges,
    tournaments: childTournaments,
    memories: childMemories,
    quizAttempts: childQuizAttempts,
  });

  const totalHours = (childSessions.reduce((acc, s) => acc + s.durationMin, 0) / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
            Tableau de bord Parent & Coach
          </p>
          <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
            Suivi de {activeChild.name}
          </h1>
          <p className="mt-1 text-sm text-[#5C6660]">
            {ballInfo.emoji} {ballInfo.name} ({ballDone}/{ballInfo.milestones.length} étapes) •{' '}
            {activeChildClub?.name || activeChild.clubInfo.clubName || 'Aucun club assigné'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onOpenPrintReport}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8DDD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2421] shadow-2xs transition hover:bg-[#F4EDE3]"
          >
            <FileText className="h-4 w-4 text-[#1E4D3B]" />
            Fiche Bilan PDF
          </button>
          <button
            type="button"
            onClick={() => onNavigate('sessions')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C85A32] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#A54522]"
          >
            <Plus className="h-4 w-4" />
            Séance rapide (30s)
          </button>
        </div>
      </div>

      {/* Pending Approvals Inbox */}
      {(pendingChallenges.length > 0 || pendingRedemptions.length > 0) && (
        <section className="rounded-2xl border-2 border-[#E9BE70] bg-[#FEF9EC] p-5 shadow-xs">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#C87A0A]" />
            <h2 className="parent-display text-lg font-bold text-[#1F2421]">
              Demandes de {activeChild.name} en attente ({pendingChallenges.length + pendingRedemptions.length})
            </h2>
          </div>

          <div className="space-y-3">
            {pendingChallenges.map((ch) => (
              <div
                key={ch.id}
                className="flex flex-col gap-3 rounded-xl border border-[#EFE2C6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF0EB] px-2.5 py-0.5 text-xs font-bold text-[#C85A32]">
                      <Target className="h-3 w-3" /> Défi terminé ?
                    </span>
                    <span className="text-xs font-bold text-[#B47812]">+{ch.starsReward} ⭐</span>
                  </div>
                  <p className="mt-1 font-bold text-[#1F2421]">{ch.title}</p>
                  <input
                    type="text"
                    value={encouragementMap[ch.id] ?? ''}
                    onChange={(e) =>
                      setEncouragementMap((m) => ({ ...m, [ch.id]: e.target.value }))
                    }
                    placeholder="Petit mot d’encouragement (optionnel)..."
                    className="mt-2 w-full rounded-lg border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-1.5 text-xs outline-none focus:border-[#C85A32]"
                  />
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      approveChallenge(ch.id, encouragementMap[ch.id]);
                      fireStarCelebration();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#163A2C]"
                  >
                    <Check className="h-4 w-4" />
                    Valider (+{ch.starsReward}⭐)
                  </button>
                  <button
                    type="button"
                    onClick={() => declineChallengeRequest(ch.id, encouragementMap[ch.id])}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-semibold text-[#5C6660] hover:bg-[#EFE6DB]"
                    title="Remettre en cours"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {pendingRedemptions.map((red) => (
              <div
                key={red.id}
                className="flex flex-col gap-3 rounded-xl border border-[#EFE2C6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F3EE] px-2.5 py-0.5 text-xs font-bold text-[#1E4D3B]">
                      <Gift className="h-3 w-3" /> Récompense demandée
                    </span>
                    <span className="text-xs font-bold text-[#5C6660]">{red.starCost} ⭐ dépensées</span>
                  </div>
                  <p className="mt-1 font-bold text-[#1F2421]">
                    {red.rewardEmoji} {red.rewardTitle}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => deliverRewardRedemption(red.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#C85A32] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#A54522]"
                  >
                    <Check className="h-4 w-4" />
                    Marquer remise
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelRewardRedemption(red.id)}
                    className="rounded-xl border border-[#E8DDD0] px-3 py-2 text-xs font-semibold text-[#5C6660] hover:bg-[#FAF6F0]"
                  >
                    Annuler & rembourser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KPI Strip */}
      <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => onNavigate('skills')}
          className="parent-card p-4 text-left transition hover:border-[#C85A32]"
        >
          <p className="text-xs font-semibold text-[#5C6660]">Niveau Galaxie</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xl font-bold text-[#1F2421]">
            <span>{ballInfo.emoji}</span>
            <span>{ballInfo.name.replace('Niveau ', '')}</span>
          </p>
          <p className="mt-1 text-xs text-[#C85A32]">
            {ballDone}/{ballInfo.milestones.length} étapes validées
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('sessions')}
          className="parent-card p-4 text-left transition hover:border-[#1E4D3B]"
        >
          <p className="text-xs font-semibold text-[#5C6660]">Séances enregistrées</p>
          <p className="mt-1.5 text-xl font-bold text-[#1E4D3B]">{childSessions.length}</p>
          <p className="mt-1 text-xs text-[#5C6660]">{totalHours} h cumulées sur court</p>
        </button>

        <div className="parent-card p-4">
          <p className="text-xs font-semibold text-[#5C6660]">Banque d’étoiles</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xl font-bold text-[#B47812]">
            <Star className="h-5 w-5 fill-[#D99B26] text-[#D99B26]" />
            {activeChild.starsBalance}
          </p>
          <p className="mt-1 text-xs text-[#5C6660]">{activeChild.totalStarsEarned} gagnées au total</p>
        </div>

        <div className="parent-card p-4">
          <p className="text-xs font-semibold text-[#5C6660]">Série & Trophées</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xl font-bold text-[#C85A32]">
            <Flame className="h-5 w-5 fill-[#C85A32] text-[#C85A32]" />
            {activeChild.streakCount} séances
          </p>
          <p className="mt-1 text-xs text-[#5C6660]">{unlockedBadges.size} badges débloqués</p>
        </div>
      </section>

      {/* Main 2-column Overview */}
      <section className="grid gap-6 lg:grid-cols-12">
        {/* Radar */}
        <div className="parent-card p-5 lg:col-span-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="parent-display text-lg font-bold text-[#1F2421]">
              Profil technique (6 piliers)
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('skills')}
              className="text-xs font-bold text-[#C85A32] hover:underline"
            >
              Modifier →
            </button>
          </div>
          <SkillRadarChart skills={activeChild.skillLevels} size={255} />
        </div>

        {/* Recent Sessions + Upcoming Events */}
        <div className="space-y-5 lg:col-span-7">
          {/* Latest Sessions */}
          <div className="parent-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="parent-display text-lg font-bold text-[#1F2421]">
                Dernières séances
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('sessions')}
                className="text-xs font-bold text-[#C85A32] hover:underline"
              >
                Tout voir →
              </button>
            </div>
            {childSessions.length === 0 ? (
              <p className="text-sm text-[#5C6660]">Aucune séance encore enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {childSessions.slice(0, 3).map((s) => {
                  const meta = SESSION_TYPE_LABELS[s.sessionType];
                  const moodObj = CHILD_MOOD_OPTIONS.find((m) => m.id === s.childMood);
                  const sessClub = s.clubId ? state.clubs.find((c) => c.id === s.clubId) : undefined;
                  return (
                    <div
                      key={s.id}
                      className="rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] p-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base">{meta.emoji}</span>
                          <span className="text-sm font-bold text-[#1F2421]">{meta.label}</span>
                          <span className="text-xs text-[#5C6660]">
                            • {new Date(s.sessionDate).toLocaleDateString('fr-FR')} ({s.durationMin}{' '}
                            min){sessClub ? ` • ${sessClub.name}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {moodObj ? (
                            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-[#1F2421] shadow-2xs">
                              {moodObj.emoji} {moodObj.label}
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-[11px] font-semibold text-[#9A6700]">
                              Humeur enfant en attente
                            </span>
                          )}
                        </div>
                      </div>
                      {(s.coachNote || s.parentNote) && (
                        <p className="mt-2 line-clamp-2 text-xs text-[#5C6660]">
                          {s.coachNote ? `Coach : ${s.coachNote}` : s.parentNote}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="parent-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1F2421]">
                <Calendar className="h-4 w-4 text-[#1E4D3B]" />
                Prochains rendez-vous
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('notebook')}
                className="text-xs font-bold text-[#C85A32] hover:underline"
              >
                Gérer →
              </button>
            </div>
            {childEvents.length === 0 ? (
              <p className="text-sm text-[#5C6660]">Aucun cours ou plateau planifié.</p>
            ) : (
              <div className="space-y-2">
                {childEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between rounded-xl border border-[#EFE6DA] bg-white px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#1F2421]">{evt.title}</p>
                      <p className="text-xs text-[#5C6660]">
                        {new Date(evt.eventDate).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                        {evt.eventTime ? ` à ${evt.eventTime}` : ''} • {evt.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#E9F3EE] px-2.5 py-1 text-[11px] font-bold uppercase text-[#1E4D3B]">
                      {evt.eventType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
