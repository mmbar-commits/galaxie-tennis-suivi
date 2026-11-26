import { useState } from 'react';
import {
  Award,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Cloud,
  CloudOff,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Wand2,
} from 'lucide-react';
import { useTennisStore } from '../../lib/store';
import { InitialAssessmentModal } from '../shared/InitialAssessmentModal';
import { ParentChallenges } from './ParentChallenges';
import { ParentDashboard } from './ParentDashboard';
import { ParentNotebook } from './ParentNotebook';
import { ParentSessions } from './ParentSessions';
import { ParentSettings } from './ParentSettings';
import { ParentSkills } from './ParentSkills';
import { ParentStudio } from './ParentStudio';
import { ParentTournaments } from './ParentTournaments';

type ParentTab =
  | 'dashboard'
  | 'skills'
  | 'sessions'
  | 'challenges'
  | 'tournaments'
  | 'notebook'
  | 'studio'
  | 'settings';

interface ParentLayoutProps {
  onSwitchToChild: (lockTablet?: boolean) => void;
  onOpenPrintReport: () => void;
  onOpenAuthModal: () => void;
}

export function ParentLayout({
  onSwitchToChild,
  onOpenPrintReport,
  onOpenAuthModal,
}: ParentLayoutProps) {
  const {
    state,
    currentUser,
    visibleChildren,
    hasVisibleChildren,
    activeChild,
    pendingApprovalCount,
    supabaseUser,
    syncStatus,
    setActiveChildId,
    logoutAccount,
  } = useTennisStore();

  const [activeTab, setActiveTab] = useState<ParentTab>('dashboard');
  const [assessmentModal, setAssessmentModal] = useState<
    { mode: 'create' } | { mode: 'reevaluate'; childId: string; childName: string } | null
  >(null);

  const childNavItems: {
    id: Exclude<ParentTab, 'studio' | 'settings'>;
    label: string;
    shortLabel: string;
    icon: typeof LayoutDashboard;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      shortLabel: 'Accueil',
      icon: LayoutDashboard,
      badge: hasVisibleChildren ? pendingApprovalCount : 0,
    },
    { id: 'skills', label: 'Galaxie & TTCA', shortLabel: 'TTCA', icon: TrendingUp },
    { id: 'sessions', label: 'Séances (30s)', shortLabel: 'Séances', icon: CalendarDays },
    { id: 'challenges', label: 'Défis & Boutique', shortLabel: 'Défis', icon: Target },
    { id: 'tournaments', label: 'Plateaux & Photos', shortLabel: 'Plateaux', icon: Award },
    {
      id: 'notebook',
      label: hasVisibleChildren ? `Carnet de ${activeChild.name}` : 'Carnet Enfant',
      shortLabel: 'Carnet',
      icon: BookOpen,
    },
  ];

  const isGlobalTab = activeTab === 'studio' || activeTab === 'settings';

  return (
    <div className="parent-world flex min-h-dvh flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-68 shrink-0 flex-col border-r border-[#E8DDD0] bg-[#1E4D3B] text-white lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <img
            src="./app-icon.jpg"
            alt="Galaxie Tennis"
            className="h-10 w-10 rounded-xl object-cover shadow"
          />
          <div className="min-w-0">
            <p className="parent-display truncate text-lg font-bold leading-tight">
              {currentUser?.fullName || state.familyName}
            </p>
            <p className="truncate text-[11px] font-medium text-emerald-200">
              {currentUser?.email || 'Compte Parent'}
            </p>
          </div>
        </div>

        {/* Multi-child selector + Add child button */}
        <div className="border-b border-white/10 px-4 py-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/80">
              Enfant sélectionné
            </label>
            <button
              type="button"
              onClick={() => setAssessmentModal({ mode: 'create' })}
              className="inline-flex items-center gap-0.5 rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-white/25"
              title="Créer un nouvel enfant avec le questionnaire d'évaluation"
            >
              <Plus className="h-3 w-3" /> Enfant
            </button>
          </div>
          {hasVisibleChildren ? (
            <select
              value={activeChild.id}
              onChange={(e) => setActiveChildId(e.target.value)}
              className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white outline-none ring-1 ring-white/15 focus:ring-[#F4B942]"
            >
              {visibleChildren.map((c) => (
                <option key={c.id} value={c.id} className="text-[#1F2421]">
                  🎾 {c.name} ({c.age} ans)
                </option>
              ))}
            </select>
          ) : (
            <button
              type="button"
              onClick={() => setAssessmentModal({ mode: 'create' })}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#C85A32] px-3 py-2 text-xs font-bold text-white hover:bg-[#A54522]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Ajouter mon 1er enfant
            </button>
          )}
        </div>

        {/* Nav Links — Separated into Child-specific & General (Studio -> Settings) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation parent">
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-200/75">
            {hasVisibleChildren ? `Suivi de ${activeChild.name}` : 'Suivi Enfant'}
          </p>
          <div className="space-y-1">
            {childNavItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-[#C85A32] text-white shadow-sm'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F4B942] px-1.5 text-[11px] font-extrabold text-[#1F2421]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-200/75">
              Famille & Application
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('studio')}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'studio'
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Wand2 className="h-4 w-4 shrink-0" />
                <span className="truncate">Studio Défis & Récomp.</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'settings'
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>Réglages généraux</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="flex w-full items-center justify-between rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-emerald-100 hover:bg-white/15"
          >
            <span className="flex items-center gap-2">
              {supabaseUser ? (
                <Cloud className="h-4 w-4 text-emerald-300" />
              ) : (
                <CloudOff className="h-4 w-4 text-amber-300" />
              )}
              {supabaseUser ? 'Cloud Supabase' : 'Mode Démo Local'}
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
              {supabaseUser ? (syncStatus === 'synced' ? 'Actif' : syncStatus) : 'Configurer'}
            </span>
          </button>

          {hasVisibleChildren && (
            <>
              <button
                type="button"
                onClick={() => onSwitchToChild(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F4B942] px-3.5 py-2.5 text-xs font-extrabold text-[#1F2421] shadow-xs transition hover:bg-[#E5AA33]"
              >
                <Sparkles className="h-4 w-4" />
                Ouvrir Vue Enfant ({activeChild.name})
              </button>

              <button
                type="button"
                onClick={() => onSwitchToChild(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/20 px-3 py-2 text-[11px] font-semibold text-emerald-100 hover:bg-white/10"
              >
                <Lock className="h-3.5 w-3.5" />
                Verrouiller Tablette Enfant
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => void logoutAccount()}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-black/15 px-3 py-2 text-[11px] font-semibold text-emerald-100 hover:bg-black/25"
          >
            <LogOut className="h-3.5 w-3.5" />
            Déconnexion / Changer de compte
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E8DDD0] bg-[#1E4D3B] px-3 py-3 text-white lg:hidden">
        <div className="flex items-center gap-2">
          <img src="./app-icon.jpg" alt="" className="h-8 w-8 rounded-lg object-cover" />
          {hasVisibleChildren ? (
            <select
              value={activeChild.id}
              onChange={(e) => setActiveChildId(e.target.value)}
              className="rounded-lg bg-white/10 px-2 py-1 text-sm font-bold text-white outline-none"
            >
              {visibleChildren.map((c) => (
                <option key={c.id} value={c.id} className="text-[#1F2421]">
                  {c.name} ({c.age}a)
                </option>
              ))}
            </select>
          ) : (
            <button
              type="button"
              onClick={() => setAssessmentModal({ mode: 'create' })}
              className="rounded-lg bg-[#C85A32] px-2.5 py-1 text-xs font-bold text-white"
            >
              + Enfant
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasVisibleChildren && (
            <button
              type="button"
              onClick={onOpenPrintReport}
              className="rounded-lg bg-white/10 p-2 text-white"
              title="Fiche Bilan PDF"
            >
              <FileText className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`rounded-lg p-2 text-white ${
              activeTab === 'studio' ? 'bg-[#C85A32]' : 'bg-white/10'
            }`}
            title="Studio Défis & Récompenses"
          >
            <Wand2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`rounded-lg p-2 text-white ${
              activeTab === 'settings' ? 'bg-[#C85A32]' : 'bg-white/10'
            }`}
            title="Réglages généraux"
          >
            <Settings className="h-4 w-4" />
          </button>
          {hasVisibleChildren && (
            <button
              type="button"
              onClick={() => onSwitchToChild(false)}
              className="inline-flex items-center gap-1 rounded-xl bg-[#F4B942] px-2.5 py-1.5 text-xs font-extrabold text-[#1F2421]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Enfant
            </button>
          )}
          <button
            type="button"
            onClick={() => void logoutAccount()}
            className="rounded-lg bg-white/10 p-2 text-white"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-10">
        {!hasVisibleChildren && !isGlobalTab ? (
          <div className="parent-card mx-auto max-w-xl p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FDF0EB] text-[#C85A32]">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h1 className="parent-display mt-4 text-3xl font-bold text-[#1F2421]">
              Bienvenue {currentUser?.fullName || 'Parent'} !
            </h1>
            <p className="mt-2 text-sm text-[#5C6660]">
              Crée le profil de ton premier enfant et réponds au{' '}
              <strong>questionnaire d’évaluation initial FFT Galaxie Tennis</strong> (6 questions)
              pour déterminer sa balle de départ et préparer sa carte d’aventure !
            </p>
            <button
              type="button"
              onClick={() => setAssessmentModal({ mode: 'create' })}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#C85A32] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#A54522]"
            >
              <UserPlus className="h-5 w-5" />
              Ajouter mon enfant & lancer le questionnaire
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <ParentDashboard
                onNavigate={setActiveTab}
                onOpenPrintReport={onOpenPrintReport}
              />
            )}
            {activeTab === 'skills' && <ParentSkills key={activeChild.id} />}
            {activeTab === 'sessions' && <ParentSessions key={activeChild.id} />}
            {activeTab === 'challenges' && (
              <ParentChallenges onOpenStudio={() => setActiveTab('studio')} />
            )}
            {activeTab === 'tournaments' && <ParentTournaments />}
            {activeTab === 'notebook' && (
              <ParentNotebook
                key={activeChild.id}
                onOpenSettings={() => setActiveTab('settings')}
                onOpenAssessment={() =>
                  setAssessmentModal({
                    mode: 'reevaluate',
                    childId: activeChild.id,
                    childName: activeChild.name,
                  })
                }
              />
            )}
            {activeTab === 'studio' && <ParentStudio />}
            {activeTab === 'settings' && (
              <ParentSettings
                onOpenAuthModal={onOpenAuthModal}
                onOpenNewChildWizard={() => setAssessmentModal({ mode: 'create' })}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E8DDD0] bg-white/95 px-1.5 py-2 backdrop-blur-md lg:hidden"
        aria-label="Navigation mobile parent"
      >
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
          {childNavItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center rounded-xl py-1.5 ${
                  active ? 'bg-[#FDF0EB] text-[#C85A32]' : 'text-[#5C6660]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="mt-1 text-[10px] font-bold leading-none">{item.shortLabel}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute right-1.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C85A32] px-1 text-[9px] font-extrabold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Initial Assessment / New Child Wizard Modal */}
      {assessmentModal && (
        <InitialAssessmentModal
          mode={assessmentModal.mode}
          existingChildId={
            assessmentModal.mode === 'reevaluate' ? assessmentModal.childId : undefined
          }
          existingChildName={
            assessmentModal.mode === 'reevaluate' ? assessmentModal.childName : undefined
          }
          onClose={() => setAssessmentModal(null)}
        />
      )}
    </div>
  );
}
