import { useState } from 'react';
import { Lock, Palette, ShieldCheck, Star } from 'lucide-react';
import { useTennisStore } from '../../lib/store';
import type { ChildTheme } from '../../types/tennis';
import { ChildAvatarStudio } from './ChildAvatarStudio';
import { ChildChallenges } from './ChildChallenges';
import { ChildGalaxyMap } from './ChildGalaxyMap';
import { ChildQuiz } from './ChildQuiz';
import { ChildRewardShop } from './ChildRewardShop';
import { ChildTrophies } from './ChildTrophies';

type ChildTab = 'map' | 'challenges' | 'avatar' | 'trophies' | 'shop' | 'quiz';

const THEMES: { id: ChildTheme; label: string; dot: string }[] = [
  { id: 'terre-battue', label: 'Terre Battue', dot: '#EE6C4D' },
  { id: 'galaxie', label: 'Galaxie', dot: '#3B73ED' },
  { id: 'gazon', label: 'Gazon', dot: '#2B9348' },
];

interface ChildLayoutProps {
  onRequestParentMode: () => void;
}

export function ChildLayout({ onRequestParentMode }: ChildLayoutProps) {
  const { state, activeChild, childChallenges, updateChildTheme } = useTennisStore();
  const [activeTab, setActiveTab] = useState<ChildTab>('map');
  const [showThemePicker, setShowThemePicker] = useState(false);

  const activeChallengesCount = childChallenges.filter((c) => c.status === 'active').length;

  const navItems: { id: ChildTab; label: string; emoji: string; badge?: number }[] = [
    { id: 'map', label: 'Galaxie', emoji: '🪐' },
    { id: 'challenges', label: 'Défis', emoji: '🎯', badge: activeChallengesCount },
    { id: 'avatar', label: 'Avatar', emoji: '🎾' },
    { id: 'trophies', label: 'Trophées', emoji: '🏆' },
    { id: 'shop', label: 'Boutique', emoji: '🎁' },
    { id: 'quiz', label: 'Quiz', emoji: '🧠' },
  ];

  return (
    <div className="child-world flex min-h-dvh flex-col" data-child-theme={activeChild.childTheme}>
      {/* Top Bar */}
      <header
        className="sticky top-0 z-30 border-b-2 border-[var(--c-border)] backdrop-blur-md"
        style={{ background: 'var(--c-nav-bg)' }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <img
              src="./app-icon.jpg"
              alt="Galaxie Tennis"
              className="h-10 w-10 rounded-2xl object-cover shadow-xs"
            />
            <div>
              <span className="child-display block text-lg font-bold leading-tight">
                {activeChild.name} • Galaxie Tennis
              </span>
              {state.tabletLocked && (
                <span className="text-[11px] font-bold" style={{ color: 'var(--c-secondary)' }}>
                  🔒 Mode Tablette Enfant
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Star Counter */}
            <div className="inline-flex items-center gap-1 rounded-full bg-[#FFF3CC] px-3 py-1.5 text-sm font-extrabold text-[#9A6700] shadow-xs">
              <Star className="h-4 w-4 fill-[#F4B942] text-[#F4B942]" />
              {activeChild.starsBalance}
            </div>

            {/* Child Theme Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowThemePicker((s) => !s)}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--c-border)] bg-white text-[var(--c-ink)] hover:bg-[#FFF9F2]"
                title="Changer les couleurs"
                aria-label="Changer le thème"
              >
                <Palette className="h-4 w-4" />
              </button>
              {showThemePicker && (
                <div className="animate-pop-in absolute right-0 mt-2 w-44 rounded-2xl border-2 border-[var(--c-border)] bg-white p-2 shadow-xl">
                  <p className="px-2 py-1 text-[11px] font-extrabold uppercase text-[#7C7287]">
                    Mon thème
                  </p>
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        updateChildTheme(t.id);
                        setShowThemePicker(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-extrabold transition ${
                        activeChild.childTheme === t.id
                          ? 'bg-[#FFF4E6] text-[#2C211E]'
                          : 'hover:bg-black/4'
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: t.dot }}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Discrete Parent Mode Switcher */}
            <button
              type="button"
              onClick={onRequestParentMode}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--c-border)] bg-white px-3 py-1.5 text-xs font-extrabold text-[var(--c-ink-soft)] transition hover:border-[#C85A32] hover:text-[#C85A32]"
              title="Accéder à l’espace Parent (Code PIN requis)"
            >
              {state.tabletLocked ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Parent</span>
            </button>
          </div>
        </div>

        {/* Desktop Pill Navigation */}
        <nav className="mx-auto hidden max-w-5xl gap-2 px-4 pb-3 md:flex" aria-label="Navigation enfant">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`child-btn relative flex items-center gap-2 px-4 py-2 text-sm font-bold ${
                  active
                    ? 'child-btn-primary'
                    : 'border-2 border-[var(--c-border)] bg-white text-[var(--c-ink)] hover:bg-[#FFF9F2]'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F4B942] px-1 text-[11px] font-extrabold text-[#2C211E]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-24 md:pb-10">
        {activeTab === 'map' && <ChildGalaxyMap onNavigate={setActiveTab} />}
        {activeTab === 'challenges' && <ChildChallenges />}
        {activeTab === 'avatar' && <ChildAvatarStudio />}
        {activeTab === 'trophies' && <ChildTrophies />}
        {activeTab === 'shop' && <ChildRewardShop />}
        {activeTab === 'quiz' && <ChildQuiz />}
      </main>

      {/* Mobile / Tablet Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-[var(--c-border)] px-2 py-2 backdrop-blur-md md:hidden"
        style={{ background: 'var(--c-nav-bg)' }}
        aria-label="Navigation mobile enfant"
      >
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center rounded-2xl py-1.5 transition ${
                  active
                    ? 'bg-[var(--c-primary)] text-white shadow-sm'
                    : 'text-[var(--c-ink-soft)]'
                }`}
              >
                <span className="text-xl leading-none">{item.emoji}</span>
                <span className="mt-1 text-[10px] font-extrabold leading-none">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute right-1.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F4B942] px-1 text-[9px] font-extrabold text-[#2C211E]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
