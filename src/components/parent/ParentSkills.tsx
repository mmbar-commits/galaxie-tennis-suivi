import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { GALAXIE_LEVELS, SKILL_CATALOG } from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { BallLevel, SkillKey } from '../../types/tennis';

export function ParentSkills() {
  const { activeChild, updateChildProfile, toggleMilestone, updateSkillLevel } = useTennisStore();
  const [selectedBall, setSelectedBall] = useState<BallLevel>(activeChild.currentBall);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const ballInfo = GALAXIE_LEVELS.find((l) => l.id === selectedBall) ?? GALAXIE_LEVELS[2];

  const handleToggleMilestone = (id: string) => {
    const wasDone = activeChild.milestonesCompleted.includes(id);
    toggleMilestone(id);
    if (!wasDone) {
      fireStarCelebration();
    }
  };

  const handleSaveSkill = (key: SkillKey, level: number) => {
    const currentNote = noteDrafts[key] ?? activeChild.skillLevels[key]?.note ?? '';
    updateSkillLevel(key, level, currentNote);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
          Référentiel FFT Galaxie Tennis
        </p>
        <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
          Progression & Compétences
        </h1>
        <p className="mt-1 text-sm text-[#5C6660]">
          Chaque étape Galaxie validée attribue automatiquement <strong>+10 étoiles</strong> dans
          l’espace de {activeChild.name}.
        </p>
      </div>

      {/* Ball Level Selector */}
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
            const done = lvl.milestones.filter((m) =>
              activeChild.milestonesCompleted.includes(m.id),
            ).length;
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
                <div className="mt-0.5 text-[11px] font-semibold text-[#5C6660]">
                  {done}/{lvl.milestones.length}
                </div>
                {isCurrent && (
                  <span className="mt-1 inline-block rounded-full bg-[#1E4D3B] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                    Actuel
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Ball Milestones Checklist */}
        <div className="mt-5 rounded-2xl border border-[#EFE6DA] bg-[#FAF6F0] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-[#1F2421]">
                {ballInfo.emoji} {ballInfo.name} — {ballInfo.ageHint}
              </h3>
              <p className="text-xs text-[#5C6660]">
                {ballInfo.courtSize} • {ballInfo.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {ballInfo.milestones.map((m) => {
              const checked = activeChild.milestonesCompleted.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleToggleMilestone(m.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                    checked
                      ? 'border-[#1E4D3B]/30 bg-[#E9F3EE]'
                      : 'border-[#E8DDD0] bg-white hover:border-[#C85A32]'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                      checked
                        ? 'border-[#1E4D3B] bg-[#1E4D3B] text-white'
                        : 'border-[#C9BCAD] bg-white'
                    }`}
                  >
                    {checked && <Check className="h-4 w-4 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        checked ? 'text-[#1E4D3B]' : 'text-[#1F2421]'
                      }`}
                    >
                      {m.label}
                    </p>
                    <p className="text-xs text-[#5C6660]">Vue enfant : « {m.kidLabel} »</p>
                  </div>
                  {!checked && (
                    <span className="shrink-0 rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-xs font-bold text-[#9A6700]">
                      +10 ⭐
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 Technical Skills Grid */}
      <section>
        <h2 className="parent-display mb-3 text-xl font-bold text-[#1F2421]">
          Évaluation des 6 piliers techniques
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SKILL_CATALOG.map((sk) => {
            const entry = activeChild.skillLevels[sk.key] ?? {
              level: 1,
              note: '',
              updatedAt: '',
            };
            const draft = noteDrafts[sk.key] ?? entry.note;

            return (
              <div key={sk.key} className="parent-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-[#1F2421]">
                      {sk.emoji} {sk.label}
                    </h3>
                    <p className="text-xs text-[#5C6660]">{sk.description}</p>
                  </div>
                  <span className="rounded-lg bg-[#FDF0EB] px-2.5 py-1 text-xs font-bold text-[#C85A32]">
                    {entry.level}/5
                  </span>
                </div>

                {/* 1-5 Star Selector */}
                <div className="my-3 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSaveSkill(sk.key, lvl)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                        lvl <= entry.level
                          ? 'border-[#D99B26] bg-[#FEF7E6] text-[#D99B26]'
                          : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#B8ADA0] hover:border-[#D99B26]'
                      }`}
                      aria-label={`Niveau ${lvl} sur 5 pour ${sk.label}`}
                    >
                      <Star
                        className={`h-4 w-4 ${lvl <= entry.level ? 'fill-[#D99B26]' : ''}`}
                      />
                    </button>
                  ))}
                  {entry.updatedAt && (
                    <span className="ml-auto text-[11px] text-[#5C6660]">
                      MàJ {new Date(entry.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>

                {/* Coach / Parent Note */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) =>
                      setNoteDrafts((d) => ({ ...d, [sk.key]: e.target.value }))
                    }
                    onBlur={() => {
                      if (draft !== entry.note) {
                        updateSkillLevel(sk.key, entry.level, draft);
                      }
                    }}
                    placeholder="Observation technique ou conseil du coach..."
                    className="flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-1.5 text-xs outline-none focus:border-[#C85A32]"
                  />
                  {draft !== entry.note && (
                    <button
                      type="button"
                      onClick={() => updateSkillLevel(sk.key, entry.level, draft)}
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
