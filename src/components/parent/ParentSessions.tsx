import { useState } from 'react';
import { Clock, Plus, Star, Trash2 } from 'lucide-react';
import {
  CHILD_MOOD_OPTIONS,
  SESSION_TYPE_LABELS,
  SKILL_CATALOG,
} from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { SessionType, SkillKey } from '../../types/tennis';

const DURATIONS = [30, 45, 60, 90];

export function ParentSessions() {
  const { activeChild, childSessions, addSession, deleteSession } = useTennisStore();

  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sessionType, setSessionType] = useState<SessionType>('cours_club');
  const [durationMin, setDurationMin] = useState(60);
  const [focusSkills, setFocusSkills] = useState<SkillKey[]>(['coup_droit']);
  const [effortRating, setEffortRating] = useState(5);
  const [starsAwarded, setStarsAwarded] = useState(15);
  const [coachNote, setCoachNote] = useState('');
  const [parentNote, setParentNote] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const toggleSkill = (key: SkillKey) => {
    setFocusSkills((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSession({
      sessionDate,
      sessionType,
      durationMin,
      focusSkills,
      effortRating,
      starsAwarded,
      coachNote: coachNote.trim(),
      parentNote: parentNote.trim(),
    });
    fireStarCelebration();
    setCoachNote('');
    setParentNote('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
          Saisie rapide 30 secondes
        </p>
        <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
          Journal des Séances
        </h1>
        <p className="mt-1 text-sm text-[#5C6660]">
          Enregistre un cours ou une partie en famille : {activeChild.name} pourra ensuite ajouter son
          humeur (+5 ⭐) dans son espace !
        </p>
      </div>

      {/* Quick Log Form */}
      <form onSubmit={handleSubmit} className="parent-card p-5 sm:p-6">
        <h2 className="parent-display mb-4 text-lg font-bold text-[#1E4D3B]">
          + Nouvelle séance
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Type */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">Type de séance</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SESSION_TYPE_LABELS) as SessionType[]).map((type) => {
                const info = SESSION_TYPE_LABELS[type];
                const active = sessionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSessionType(type)}
                    className={`rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                      active
                        ? 'border-[#C85A32] bg-[#FDF0EB] text-[#C85A32]'
                        : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#1F2421] hover:bg-white'
                    }`}
                  >
                    {info.emoji} {info.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Duration */}
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">Durée</label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurationMin(d)}
                    className={`flex-1 rounded-xl border py-1.5 text-xs font-bold transition ${
                      durationMin === d
                        ? 'border-[#1E4D3B] bg-[#1E4D3B] text-white'
                        : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#1F2421]'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Worked */}
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">
            Points travaillés
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_CATALOG.map((sk) => {
              const active = focusSkills.includes(sk.key);
              return (
                <button
                  key={sk.key}
                  type="button"
                  onClick={() => toggleSkill(sk.key)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    active
                      ? 'border-[#1E4D3B] bg-[#E9F3EE] text-[#1E4D3B]'
                      : 'border-[#E8DDD0] bg-white text-[#5C6660]'
                  }`}
                >
                  {sk.emoji} {sk.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Effort & Stars */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">
              Implication & sourire ({effortRating}/5)
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEffortRating(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    n <= effortRating
                      ? 'border-[#D99B26] bg-[#FEF7E6] text-[#D99B26]'
                      : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#B8ADA0]'
                  }`}
                >
                  <Star className={`h-4 w-4 ${n <= effortRating ? 'fill-[#D99B26]' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">
              Étoiles offertes à {activeChild.name}
            </label>
            <div className="flex gap-2">
              {[10, 15, 20, 25].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStarsAwarded(st)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                    starsAwarded === st
                      ? 'border-[#D99B26] bg-[#FEF7E6] text-[#9A6700]'
                      : 'border-[#E8DDD0] bg-[#FAF6F0] text-[#5C6660]'
                  }`}
                >
                  +{st} ⭐
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#5C6660]">
              Remarque du coach (optionnel)
            </label>
            <textarea
              rows={2}
              value={coachNote}
              onChange={(e) => setCoachNote(e.target.value)}
              placeholder="Ex : Beau progrès sur le lancer de service..."
              className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-[#5C6660]">
              Note personnelle parent (optionnel)
            </label>
            <textarea
              rows={2}
              value={parentNote}
              onChange={(e) => setParentNote(e.target.value)}
              placeholder="Ex : Super énergie malgré la fatigue..."
              className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C85A32] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#A54522]"
          >
            <Plus className="h-4 w-4" />
            Enregistrer la séance (+{starsAwarded} ⭐)
          </button>
          {savedToast && (
            <span className="animate-pop-in rounded-xl bg-[#E9F3EE] px-3.5 py-1.5 text-xs font-bold text-[#1E4D3B]">
              ✓ Séance ajoutée et étoiles envoyées à {activeChild.name} !
            </span>
          )}
        </div>
      </form>

      {/* Sessions History */}
      <section className="space-y-3">
        <h2 className="parent-display text-xl font-bold text-[#1F2421]">
          Historique ({childSessions.length})
        </h2>
        {childSessions.map((s) => {
          const meta = SESSION_TYPE_LABELS[s.sessionType];
          const moodObj = CHILD_MOOD_OPTIONS.find((m) => m.id === s.childMood);
          return (
            <article key={s.id} className="parent-card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[#FAF6F0] px-2.5 py-1 text-xs font-bold text-[#1F2421]">
                      {meta.emoji} {meta.label}
                    </span>
                    <span className="text-sm font-bold text-[#1F2421]">
                      {new Date(s.sessionDate).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[#5C6660]">
                      <Clock className="h-3.5 w-3.5" /> {s.durationMin} min
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {s.focusSkills.map((skKey) => {
                      const sk = SKILL_CATALOG.find((x) => x.key === skKey);
                      return sk ? (
                        <span
                          key={skKey}
                          className="rounded-full bg-[#E9F3EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#1E4D3B]"
                        >
                          {sk.emoji} {sk.shortLabel}
                        </span>
                      ) : null;
                    })}
                    <span className="rounded-full bg-[#FEF7E6] px-2.5 py-0.5 text-[11px] font-bold text-[#9A6700]">
                      +{s.starsAwarded} ⭐
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteSession(s.id)}
                  className="rounded-lg p-1.5 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                  title="Supprimer cette séance"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {(s.coachNote || s.parentNote) && (
                <div className="mt-3 space-y-1.5 border-t border-[#EFE6DA] pt-3 text-sm">
                  {s.coachNote && (
                    <p className="text-[#1E4D3B]">
                      <strong>Coach :</strong> {s.coachNote}
                    </p>
                  )}
                  {s.parentNote && (
                    <p className="text-[#5C6660]">
                      <strong>Note :</strong> {s.parentNote}
                    </p>
                  )}
                </div>
              )}

              {/* Daughter's own check-in */}
              {moodObj && (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-[#FEF9EC] px-3.5 py-2 text-xs">
                  <span className="font-bold text-[#8A5A0A]">
                    Ressenti de {activeChild.name} :
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-0.5 font-bold text-[#1F2421]">
                    {moodObj.emoji} {moodObj.label}
                  </span>
                  {s.childFavoriteMoment && (
                    <span className="rounded-full bg-white px-2.5 py-0.5 font-semibold text-[#5C6660]">
                      Moment préféré : {s.childFavoriteMoment}
                    </span>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
