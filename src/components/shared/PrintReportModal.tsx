import { useState } from 'react';
import { Printer, X } from 'lucide-react';
import {
  ACQUISITION_STATUS_META,
  BADGE_CATALOG,
  GALAXIE_LEVELS,
  SKILL_CATALOG,
  TTCA_AXES,
} from '../../data/galaxieCatalog';
import { computeUnlockedBadgeIds } from '../../lib/badges';
import { useTennisStore } from '../../lib/store';
import { AvatarSvg } from './AvatarSvg';
import { SkillRadarChart } from './SkillRadarChart';

interface PrintReportModalProps {
  onClose: () => void;
}

export function PrintReportModal({ onClose }: PrintReportModalProps) {
  const [printedDate] = useState(() => new Date().toLocaleDateString('fr-FR'));
  const {
    activeChild,
    activeChildClub,
    childSessions,
    childChallenges,
    childTournaments,
    childMemories,
    childQuizAttempts,
  } = useTennisStore();

  const ballInfo =
    GALAXIE_LEVELS.find((l) => l.id === activeChild.currentBall) ?? GALAXIE_LEVELS[2];
  const unlockedBadges = computeUnlockedBadgeIds({
    child: activeChild,
    sessions: childSessions,
    challenges: childChallenges,
    tournaments: childTournaments,
    memories: childMemories,
    quizAttempts: childQuizAttempts,
  });

  const currentMilestonesDone = ballInfo.milestones.filter((m) =>
    activeChild.milestonesCompleted.includes(m.id),
  ).length;
  const totalMinutes = childSessions.reduce((acc, s) => acc + s.durationMin, 0);
  const completedChallenges = childChallenges.filter((c) => c.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl">
        {/* Top Action Bar (hidden on print) */}
        <div className="no-print mb-3 flex items-center justify-between rounded-2xl bg-[#1E4D3B] px-5 py-3 text-white shadow-lg">
          <div>
            <p className="text-sm font-bold">Fiche Bilan Imprimable / PDF</p>
            <p className="text-xs text-emerald-100">
              Idéale pour partager au coach ou aux grands-parents (Imprimer → Enregistrer en PDF)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-[#C85A32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#A54522]"
            >
              <Printer className="h-4 w-4" />
              Imprimer / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/15 p-2 text-white hover:bg-white/25"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable A4 Sheet */}
        <div
          id="printable-report"
          className="rounded-3xl border border-[#E8DDD0] bg-white p-8 text-[#1F2421] shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#C85A32] pb-5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-[#FAF6F0] p-1">
                <AvatarSvg config={activeChild.avatarConfig} size={86} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
                  Bilan de Progression Galaxie Tennis
                </p>
                <h1 className="parent-display text-3xl font-bold text-[#1F2421]">
                  {activeChild.name}, {activeChild.age} ans
                </h1>
                <p className="mt-0.5 text-sm text-[#5C6660]">
                  {activeChildClub?.name || activeChild.clubInfo.clubName || 'Club de Tennis'} •{' '}
                  {activeChildClub?.coachName || activeChild.clubInfo.coachName || 'Coach'} • Édité
                  le {printedDate}
                </p>
              </div>
            </div>
            <div
              className="rounded-2xl px-4 py-2.5 text-center"
              style={{ backgroundColor: ballInfo.bgSoft, border: `2px solid ${ballInfo.ringColor}` }}
            >
              <div className="text-2xl">{ballInfo.emoji}</div>
              <div className="text-sm font-bold" style={{ color: ballInfo.color }}>
                {ballInfo.name}
              </div>
              <div className="text-xs text-[#5C6660]">
                {currentMilestonesDone}/{ballInfo.milestones.length} étapes validées
              </div>
            </div>
          </div>

          {/* Summary KPIs */}
          <div className="my-6 grid grid-cols-4 gap-3">
            <div className="rounded-xl bg-[#FAF6F0] p-3 text-center">
              <p className="text-2xl font-bold text-[#1E4D3B]">{childSessions.length}</p>
              <p className="text-xs text-[#5C6660]">Séances jouées</p>
            </div>
            <div className="rounded-xl bg-[#FAF6F0] p-3 text-center">
              <p className="text-2xl font-bold text-[#C85A32]">
                {Math.round(totalMinutes / 60)}h{String(totalMinutes % 60).padStart(2, '0')}
              </p>
              <p className="text-xs text-[#5C6660]">Temps sur le court</p>
            </div>
            <div className="rounded-xl bg-[#FAF6F0] p-3 text-center">
              <p className="text-2xl font-bold text-[#D99B26]">{activeChild.totalStarsEarned} ⭐</p>
              <p className="text-xs text-[#5C6660]">Étoiles gagnées</p>
            </div>
            <div className="rounded-xl bg-[#FAF6F0] p-3 text-center">
              <p className="text-2xl font-bold text-[#1E4D3B]">{unlockedBadges.size}</p>
              <p className="text-xs text-[#5C6660]">Badges débloqués</p>
            </div>
          </div>

          {/* Skills + Radar */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="parent-display mb-3 text-lg font-bold text-[#1E4D3B]">
                Acquis Techniques & TTCA ({ballInfo.name})
              </h2>
              <div className="mb-3 grid grid-cols-2 gap-2">
                {TTCA_AXES.map((axis) => {
                  const items = ballInfo.milestones.filter((m) => m.axis === axis.id);
                  const acquis = items.filter(
                    (m) =>
                      (activeChild.milestoneEvaluations?.[m.id]?.status ??
                        (activeChild.milestonesCompleted.includes(m.id)
                          ? 'acquis'
                          : 'non_evalue')) === 'acquis',
                  ).length;
                  return (
                    <div
                      key={axis.id}
                      className="rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-2.5 py-1.5 text-xs"
                    >
                      <span className="font-bold" style={{ color: axis.color }}>
                        {axis.emoji} {axis.label}
                      </span>
                      <p className="font-bold text-[#1F2421]">
                        {acquis}/{items.length} acquis
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                {SKILL_CATALOG.map((sk) => {
                  const entry = activeChild.skillLevels[sk.key];
                  const st = entry?.status ?? 'non_evalue';
                  const meta = ACQUISITION_STATUS_META[st];
                  return (
                    <div key={sk.key} className="rounded-xl border border-[#EFE6DA] p-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>
                          {sk.emoji} {sk.label}
                        </span>
                        <span
                          className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: meta.bg,
                            color: meta.text,
                            borderColor: meta.border,
                          }}
                        >
                          {meta.emoji} {meta.shortLabel}
                        </span>
                      </div>
                      {entry?.note && (
                        <p className="mt-1 text-[11px] text-[#5C6660]">{entry.note}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAF6F0] p-4">
              <h2 className="parent-display mb-2 text-base font-bold text-[#1E4D3B]">
                Profil de Joueuse
              </h2>
              <SkillRadarChart skills={activeChild.skillLevels} size={235} />
              <div className="mt-3 w-full border-t border-[#E8DDD0] pt-3 text-xs text-[#5C6660]">
                <p>
                  <strong>Raquette :</strong> {activeChild.equipmentInfo.racketModel} (
                  {activeChild.equipmentInfo.racketSize})
                </p>
                <p>
                  <strong>Défis réussis :</strong> {completedChallenges.length} •{' '}
                  <strong>Plateaux :</strong> {childTournaments.length}
                </p>
              </div>
            </div>
          </div>

          {/* Badges earned */}
          <div className="mt-6 border-t border-[#E8DDD0] pt-5">
            <h2 className="parent-display mb-2.5 text-lg font-bold text-[#1E4D3B]">
              Trophées & Badges Débloqués
            </h2>
            <div className="flex flex-wrap gap-2">
              {BADGE_CATALOG.filter((b) => unlockedBadges.has(b.id)).map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-1 text-xs font-semibold"
                >
                  <span>{b.emoji}</span>
                  <span>{b.title}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Recent Coach Notes */}
          {childSessions.length > 0 && (
            <div className="mt-6 border-t border-[#E8DDD0] pt-5">
              <h2 className="parent-display mb-2.5 text-lg font-bold text-[#1E4D3B]">
                Dernières Séances & Remarques
              </h2>
              <div className="space-y-2">
                {childSessions.slice(0, 4).map((s) => (
                  <div key={s.id} className="rounded-xl bg-[#FAF6F0] px-3.5 py-2.5 text-xs">
                    <div className="flex justify-between font-bold text-[#1F2421]">
                      <span>{new Date(s.sessionDate).toLocaleDateString('fr-FR')}</span>
                      <span>
                        {s.durationMin} min • Effort {s.effortRating}/5
                      </span>
                    </div>
                    {s.coachNote && (
                      <p className="mt-1 text-[#1E4D3B]">
                        <strong>Coach :</strong> {s.coachNote}
                      </p>
                    )}
                    {s.parentNote && (
                      <p className="mt-0.5 text-[#5C6660]">
                        <strong>Parent :</strong> {s.parentNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
