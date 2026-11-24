import { useState } from 'react';
import { Check, Flame, Sparkles, Star } from 'lucide-react';
import {
  CHILD_MOOD_OPTIONS,
  FAVORITE_MOMENT_CHIPS,
  GALAXIE_LEVELS,
} from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { BallLevel, ChildMood } from '../../types/tennis';
import { AvatarSvg } from '../shared/AvatarSvg';

interface ChildGalaxyMapProps {
  onNavigate: (tab: 'map' | 'challenges' | 'avatar' | 'trophies' | 'shop' | 'quiz') => void;
}

export function ChildGalaxyMap({ onNavigate }: ChildGalaxyMapProps) {
  const {
    activeChild,
    childSessions,
    childChallenges,
    submitChildMoodCheckIn,
  } = useTennisStore();

  const [selectedPlanet, setSelectedPlanet] = useState<BallLevel>(activeChild.currentBall);
  const [selectedMood, setSelectedMood] = useState<ChildMood | null>(null);
  const [favoriteMoment, setFavoriteMoment] = useState<string>(FAVORITE_MOMENT_CHIPS[0]);
  const [moodJustSaved, setMoodJustSaved] = useState(false);

  const latestSessionWithoutMood = childSessions.find((s) => !s.childMood);
  const activeChallengesCount = childChallenges.filter((c) => c.status === 'active').length;
  const currentBallInfo =
    GALAXIE_LEVELS.find((l) => l.id === activeChild.currentBall) ?? GALAXIE_LEVELS[2];
  const selectedPlanetInfo =
    GALAXIE_LEVELS.find((l) => l.id === selectedPlanet) ?? currentBallInfo;

  const handleSaveMood = () => {
    if (!latestSessionWithoutMood || !selectedMood) return;
    submitChildMoodCheckIn(latestSessionWithoutMood.id, selectedMood, favoriteMoment);
    fireStarCelebration();
    setMoodJustSaved(true);
    setTimeout(() => setMoodJustSaved(false), 3200);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Banner with Avatar & Quick Stats */}
      <section className="child-card relative overflow-hidden p-5 sm:p-7">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-20"
          style={{ background: 'var(--c-accent)' }}
        />
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <button
              type="button"
              onClick={() => onNavigate('avatar')}
              className="group relative rounded-3xl bg-[#FFF6E8] p-2 transition hover:scale-105"
              title="Personnaliser mon avatar"
            >
              <AvatarSvg config={activeChild.avatarConfig} size={136} className="animate-float-slow" />
              <span className="absolute -bottom-1 right-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-[#2C211E] shadow-sm">
                ✏️ Look
              </span>
            </button>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide" style={{ color: 'var(--c-secondary)' }}>
                {currentBallInfo.emoji} {currentBallInfo.planetName}
              </p>
              <h1 className="child-display mt-0.5 text-3xl font-bold sm:text-4xl">
                Coucou {activeChild.name} !
              </h1>
              <p className="mt-1 max-w-md text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
                {activeChallengesCount > 0
                  ? `Tu as ${activeChallengesCount} mission${activeChallengesCount > 1 ? 's' : ''} prête${activeChallengesCount > 1 ? 's' : ''} sur le court cette semaine !`
                  : 'Bravo championne ! Explore les planètes Galaxie Tennis ou tente un Mini-Quiz !'}
              </p>

              <div className="mt-3.5 flex flex-wrap justify-center gap-2.5 sm:justify-start">
                <div className="inline-flex items-center gap-1.5 rounded-2xl bg-[#FFF4D6] px-3.5 py-1.5 text-sm font-extrabold text-[#9A6700]">
                  <Star className="h-4 w-4 fill-[#F4B942] text-[#F4B942]" />
                  {activeChild.starsBalance} étoiles
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-2xl bg-[#FFE8E0] px-3.5 py-1.5 text-sm font-extrabold text-[#C85A32]">
                  <Flame className="h-4 w-4 fill-[#EE6C4D] text-[#EE6C4D]" />
                  Série : {activeChild.streakCount}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('challenges')}
              className="child-btn child-btn-primary px-5 py-3 text-base font-bold"
            >
              🎯 Mes Défis ({activeChallengesCount})
            </button>
            <button
              type="button"
              onClick={() => onNavigate('quiz')}
              className="child-btn border-2 border-[var(--c-border)] bg-white px-5 py-2.5 text-sm font-bold text-[var(--c-ink)] hover:bg-[#FFF9F0]"
            >
              🧠 Mini-Quiz Tennis (+⭐)
            </button>
          </div>
        </div>
      </section>

      {/* Check-in Humeur Enfant (if latest session awaits mood) */}
      {latestSessionWithoutMood && (
        <section className="child-card animate-pop-in border-[#F4B942] bg-gradient-to-br from-[#FFFDF7] to-[#FFF4D9] p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#E59A00]" />
            <h2 className="child-display text-xl font-bold">
              Comment tu t’es sentie à ta dernière séance ?
            </h2>
          </div>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
            Séance du {new Date(latestSessionWithoutMood.sessionDate).toLocaleDateString('fr-FR')} —
            Gagne <strong>+5 étoiles</strong> en racontant ton cours !
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {CHILD_MOOD_OPTIONS.map((m) => {
              const active = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMood(m.id)}
                  className={`child-btn flex flex-col items-center gap-1 border-2 p-3 text-center transition ${
                    active
                      ? 'scale-[1.03] border-[#EE6C4D] bg-white shadow-md'
                      : 'border-white/80 bg-white/75 hover:bg-white'
                  }`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-xs font-extrabold">{m.label}</span>
                </button>
              );
            })}
          </div>

          {selectedMood && (
            <div className="mt-4 space-y-3 border-t border-[#F2DCAB] pt-4">
              <p className="text-sm font-extrabold">Ton moment préféré du cours :</p>
              <div className="flex flex-wrap gap-2">
                {FAVORITE_MOMENT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setFavoriteMoment(chip)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
                      favoriteMoment === chip
                        ? 'bg-[#2A9D8F] text-white shadow-sm'
                        : 'bg-white text-[#2C211E] hover:bg-[#F7EFE6]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSaveMood}
                className="child-btn child-btn-primary w-full py-3 text-base font-bold sm:w-auto sm:px-7"
              >
                Envoyer mon humeur (+5 ⭐)
              </button>
            </div>
          )}
        </section>
      )}

      {moodJustSaved && (
        <div className="animate-pop-in rounded-2xl bg-[#2A9D8F] p-4 text-center text-sm font-extrabold text-white shadow-md">
          🎉 Merci {activeChild.name} ! Ton humeur est enregistrée et tu as gagné +5 étoiles !
        </div>
      )}

      {/* Carte d'Aventure Galaxie Tennis */}
      <section className="child-card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="child-display text-2xl font-bold">🪐 Ma Carte Galaxie Tennis</h2>
            <p className="text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
              Clique sur une planète pour voir tes pouvoirs débloqués !
            </p>
          </div>
          <span className="rounded-full bg-[#FFF4D6] px-3.5 py-1 text-xs font-extrabold text-[#9A6700]">
            {activeChild.milestonesCompleted.length} étapes réussies ⭐
          </span>
        </div>

        {/* Planet Orbit Trail */}
        <div className="relative my-5">
          <div className="hidden sm:block absolute left-10 right-10 top-10 h-2 rounded-full bg-[#F3E5D5]" />
          <div className="relative grid grid-cols-5 gap-2 sm:gap-4">
            {GALAXIE_LEVELS.map((lvl, idx) => {
              const doneCount = lvl.milestones.filter((m) =>
                activeChild.milestonesCompleted.includes(m.id),
              ).length;
              const isCurrent = lvl.id === activeChild.currentBall;
              const isSelected = lvl.id === selectedPlanet;
              const isAllDone = doneCount === lvl.milestones.length;

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedPlanet(lvl.id)}
                  className={`group flex flex-col items-center rounded-2xl p-2 transition ${
                    isSelected ? 'bg-[#FFF6E8] ring-2 ring-[#EE6C4D]' : 'hover:bg-black/3'
                  }`}
                >
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-md transition sm:h-16 sm:w-16 sm:text-3xl ${
                      isCurrent ? 'scale-110 ring-4 ring-[#F4B942]' : ''
                    }`}
                    style={{
                      backgroundColor: lvl.bgSoft,
                      border: `3px solid ${lvl.color}`,
                    }}
                  >
                    <span>{lvl.emoji}</span>
                    {isAllDone && (
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#16A34A] text-white shadow">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                    )}
                    {isCurrent && (
                      <span className="absolute -bottom-2 rounded-full bg-[#EE6C4D] px-2 py-0.5 text-[10px] font-extrabold text-white shadow">
                        ICI
                      </span>
                    )}
                  </div>
                  <span className="child-display mt-3 text-xs font-bold sm:text-sm">
                    {idx + 1}. {lvl.id.charAt(0).toUpperCase() + lvl.id.slice(1)}
                  </span>
                  <span className="text-[11px] font-bold" style={{ color: lvl.color }}>
                    {doneCount}/{lvl.milestones.length} ⭐
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Planet Detail */}
        <div
          className="mt-5 rounded-3xl p-4 sm:p-5"
          style={{
            backgroundColor: selectedPlanetInfo.bgSoft,
            border: `2px solid ${selectedPlanetInfo.ringColor}`,
          }}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="child-display text-xl font-bold" style={{ color: selectedPlanetInfo.color }}>
                {selectedPlanetInfo.emoji} {selectedPlanetInfo.planetName}
              </h3>
              <p className="text-xs font-bold text-[#5C5468]">{selectedPlanetInfo.courtSize}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#2C211E] shadow-xs">
              {selectedPlanetInfo.milestones.filter((m) =>
                activeChild.milestonesCompleted.includes(m.id),
              ).length}{' '}
              / {selectedPlanetInfo.milestones.length} pouvoirs
            </span>
          </div>

          <div className="space-y-2.5">
            {selectedPlanetInfo.milestones.map((m) => {
              const done = activeChild.milestonesCompleted.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    done ? 'bg-white shadow-xs' : 'bg-white/60'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${
                      done ? 'bg-[#FFF3CC]' : 'bg-[#EFEAE4]'
                    }`}
                  >
                    {done ? '⭐' : '🔒'}
                  </div>
                  <p
                    className={`text-sm font-bold ${
                      done ? 'text-[#2C211E]' : 'text-[#73697E]'
                    }`}
                  >
                    {m.kidLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
