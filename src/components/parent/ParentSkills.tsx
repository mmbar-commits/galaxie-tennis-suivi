import { useState } from 'react';
import { Award, ClipboardCheck } from 'lucide-react';
import {
  ACQUISITION_STATUS_META,
  GALAXIE_LEVELS,
  SKILL_CATALOG,
  TTCA_AXES,
} from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { AcquisitionStatus, BallLevel, SkillKey } from '../../types/tennis';

const STATUS_ORDER: AcquisitionStatus[] = ['non_evalue', 'en_cours', 'acquis'];

interface ParentSkillsProps {
  onOpenCoachMode?: () => void;
}

export function ParentSkills({ onOpenCoachMode }: ParentSkillsProps) {
  const { activeChild, updateChildProfile, setMilestoneStatus, updateSkillStatus } =
    useTennisStore();
  const [selectedBall, setSelectedBall] = useState<BallLevel>(activeChild.currentBall);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const ballInfo = GALAXIE_LEVELS.find((l) => l.id === selectedBall) ?? GALAXIE_LEVELS[2];

  const getEval = (id: string) => {
    const ev = activeChild.milestoneEvaluations?.[id];
    if (ev) return ev;
    if (activeChild.milestonesCompleted.includes(id)) {
      return { status: 'acquis' as AcquisitionStatus, updatedAt: '' };
    }
    return { status: 'non_evalue' as AcquisitionStatus, updatedAt: '' };
  };

  const handleSetMilestone = (id: string, status: AcquisitionStatus) => {
    const prev = getEval(id).status;
    setMilestoneStatus(id, status, { validatedBy: 'parent', validatorName: 'Parent' });
    if (status === 'acquis' && prev !== 'acquis') {
      fireStarCelebration();
    }
  };

  const handleSaveSkill = (key: SkillKey, status: AcquisitionStatus) => {
    const currentNote = noteDrafts[key] ?? activeChild.skillLevels[key]?.note ?? '';
    updateSkillStatus(key, status, currentNote, { validatedBy: 'parent', validatorName: 'Parent' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
            Référentiel Officiel FFT Galaxie Tennis • Critères T(T)CA
          </p>
          <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
            Progression & Acquis TTCA
          </h1>
          <p className="mt-1 text-sm text-[#5C6660]">
            Évaluation officielle sur les 4 axes (<strong>Technique, Tactique, Comportement, Arbitrage</strong>) avec statuts <strong>À travailler / En cours / Acquis</strong> (+10 ⭐ par critère acquis).
          </p>
        </div>

        {onOpenCoachMode && (
          <button
            type="button"
            onClick={onOpenCoachMode}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E4D3B] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#163A2C]"
          >
            <ClipboardCheck className="h-4 w-4" />
            Passer la main au Coach (Vue Coach)
          </button>
        )}
      </div>

      {/* Ball Level Selector & TTCA Progress */}
      <section className="parent-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="parent-display text-lg font-bold text-[#1F2421]">
            Paliers Galaxie Tennis (Blanc → Vert)
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5C6660]">Balle actuelle :</span>
            <select
              value={activeChild.currentBall}
              onChange={(e) => {
                const next = e.target.value as BallLevel;
                updateChildProfile({ currentBall: next });
                setSelectedBall(next);
              }}
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-1.5 font-bold text-[#1F2421] outline-none focus:border-[#C85A32]"
            >
              {GALAXIE_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.emoji} {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {GALAXIE_LEVELS.map((lvl) => {
            const done = lvl.milestones.filter((m) => getEval(m.id).status === 'acquis').length;
            const inProg = lvl.milestones.filter((m) => getEval(m.id).status === 'en_cours').length;
            const isSelected = lvl.id === selectedBall;
            const isCurrent = lvl.id === activeChild.currentBall;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedBall(lvl.id)}
                className={`rounded-2xl border p-3 text-center transition ${
                  isSelected
                    ? 'border-[#C85A32] bg-[#FDF0EB] shadow-xs'
                    : 'border-[#E8DDD0] bg-[#FAF6F0] hover:bg-white'
                }`}
              >
                <div className="text-xl">{lvl.emoji}</div>
                <div className="mt-1 text-xs font-bold text-[#1F2421]">
                  {lvl.name.replace('Niveau ', '')}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-[#1E4D3B]">
                  {done}/{lvl.milestones.length} acquis
                </div>
                {inProg > 0 && (
                  <div className="text-[10px] font-semibold text-[#9A6700]">{inProg} en cours</div>
                )}
                {isCurrent && (
                  <span className="mt-1 inline-block rounded-full bg-[#1E4D3B] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                    Actuel
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Ball Summary */}
        <div className="mt-5 rounded-2xl border border-[#EFE6DA] bg-[#FAF6F0] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-[#1F2421]">
                {ballInfo.emoji} {ballInfo.name} ({ballInfo.ageHint}) — {ballInfo.racketHint}
              </h3>
              <p className="text-xs text-[#5C6660]">
                {ballInfo.courtSize} • {ballInfo.description}
              </p>
            </div>
          </div>

          {/* 4 Official TTCA Axes Progress Cards */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TTCA_AXES.map((axis) => {
              const axisItems = ballInfo.milestones.filter((m) => m.axis === axis.id);
              const acquis = axisItems.filter((m) => getEval(m.id).status === 'acquis').length;
              const enCours = axisItems.filter((m) => getEval(m.id).status === 'en_cours').length;
              return (
                <div
                  key={axis.id}
                  className="rounded-xl border border-[#E8DDD0] bg-white px-3 py-2"
                >
                  <p className="text-xs font-extrabold" style={{ color: axis.color }}>
                    {axis.emoji} {axis.label}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-[#1F2421]">
                    {acquis}/{axisItems.length} acquis
                    {enCours > 0 && (
                      <span className="ml-1 font-semibold text-[#9A6700]">({enCours} en cours)</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Grouped Checklists by TTCA Axis */}
          <div className="space-y-4">
            {TTCA_AXES.map((axis) => {
              const axisItems = ballInfo.milestones.filter((m) => m.axis === axis.id);
              if (axisItems.length === 0) return null;
              return (
                <div key={axis.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-extrabold text-white"
                      style={{ backgroundColor: axis.color }}
                    >
                      {axis.letter}
                    </span>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: axis.color }}>
                      {axis.label}
                    </h4>
                  </div>

                  {axisItems.map((m) => {
                    const ev = getEval(m.id);
                    return (
                      <div
                        key={m.id}
                        className="flex flex-col gap-2.5 rounded-xl border border-[#E8DDD0] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          {m.subGroup && (
                            <span className="mr-1.5 inline-block rounded bg-[#FAF6F0] px-1.5 py-0.5 text-[10px] font-bold text-[#5C6660]">
                              {m.subGroup}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-[#1F2421]">{m.label}</span>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                            {ev.validatedBy === 'coach' && ev.status !== 'non_evalue' && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F3EE] px-2 py-0.5 font-bold text-[#1E4D3B]">
                                <Award className="h-3 w-3" />
                                Validé par {ev.validatorName || 'Coach'}
                              </span>
                            )}
                            {ev.note && (
                              <span className="text-[#5C6660]">💬 {ev.note}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-1">
                          {STATUS_ORDER.map((st) => {
                            const meta = ACQUISITION_STATUS_META[st];
                            const active = ev.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleSetMilestone(m.id, st)}
                                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                                  active ? 'shadow-2xs' : 'opacity-60 hover:opacity-100'
                                }`}
                                style={{
                                  backgroundColor: active ? meta.bg : '#FAF6F0',
                                  color: active ? meta.text : '#5C6660',
                                  borderColor: active ? meta.border : '#E8DDD0',
                                }}
                              >
                                {meta.emoji} {meta.shortLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 Technical Pillars (Acquis / En cours / À travailler) */}
      <section>
        <h2 className="parent-display mb-3 text-xl font-bold text-[#1F2421]">
          Synthèse par coup & domaine (En cours / Acquis)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SKILL_CATALOG.map((sk) => {
            const entry = activeChild.skillLevels[sk.key];
            const status: AcquisitionStatus = entry?.status ?? 'non_evalue';
            const meta = ACQUISITION_STATUS_META[status];
            const draft = noteDrafts[sk.key] ?? entry?.note ?? '';

            return (
              <div key={sk.key} className="parent-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-[#1F2421]">
                      {sk.emoji} {sk.label}
                    </h3>
                    <p className="text-xs text-[#5C6660]">{sk.description}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
                    style={{
                      backgroundColor: meta.bg,
                      color: meta.text,
                      borderColor: meta.border,
                    }}
                  >
                    {meta.emoji} {meta.shortLabel}
                  </span>
                </div>

                {/* 3-State Acquisition Selector */}
                <div className="my-3 grid grid-cols-3 gap-1.5">
                  {STATUS_ORDER.map((st) => {
                    const stMeta = ACQUISITION_STATUS_META[st];
                    const active = status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleSaveSkill(sk.key, st)}
                        className={`rounded-xl border py-1.5 text-xs font-bold transition ${
                          active ? 'shadow-2xs' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: active ? stMeta.bg : '#FFFFFF',
                          color: active ? stMeta.text : '#5C6660',
                          borderColor: active ? stMeta.border : '#E8DDD0',
                        }}
                      >
                        {stMeta.emoji} {stMeta.shortLabel}
                      </button>
                    );
                  })}
                </div>

                {entry?.validatedBy === 'coach' && (
                  <p className="mb-2 text-[11px] font-semibold text-[#1E4D3B]">
                    🏅 Évalué par {entry.validatorName || 'Coach'}
                    {entry.updatedAt
                      ? ` le ${new Date(entry.updatedAt).toLocaleDateString('fr-FR')}`
                      : ''}
                  </p>
                )}

                {/* Observation Note */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) =>
                      setNoteDrafts((d) => ({ ...d, [sk.key]: e.target.value }))
                    }
                    onBlur={() => {
                      if (draft !== (entry?.note ?? '')) {
                        updateSkillStatus(sk.key, status, draft, {
                          validatedBy: 'parent',
                          validatorName: 'Parent',
                        });
                      }
                    }}
                    placeholder="Observation technique ou conseil du coach..."
                    className="flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-1.5 text-xs outline-none focus:border-[#C85A32]"
                  />
                  {draft !== (entry?.note ?? '') && (
                    <button
                      type="button"
                      onClick={() =>
                        updateSkillStatus(sk.key, status, draft, {
                          validatedBy: 'parent',
                          validatorName: 'Parent',
                        })
                      }
                      className="rounded-xl bg-[#1E4D3B] px-3 py-1.5 text-xs font-bold text-white"
                    >
                      OK
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
