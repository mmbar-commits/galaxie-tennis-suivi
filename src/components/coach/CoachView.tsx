import { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  KeyRound,
  LogOut,
  MessageSquarePlus,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  ACQUISITION_STATUS_META,
  GALAXIE_LEVELS,
  SKILL_CATALOG,
  TTCA_AXES,
} from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { AcquisitionStatus, BallLevel, SessionType, SkillKey } from '../../types/tennis';

interface CoachViewProps {
  onSwitchToChild: () => void;
}

const STATUS_ORDER: AcquisitionStatus[] = ['non_evalue', 'en_cours', 'acquis'];

export function CoachView({ onSwitchToChild }: CoachViewProps) {
  const {
    state,
    currentUser,
    visibleChildren,
    hasVisibleChildren,
    activeChild,
    coachPendingLinks,
    setActiveChildId,
    updateChildProfile,
    setMilestoneStatus,
    updateSkillStatus,
    addSession,
    respondToCoachLink,
    logoutAccount,
  } = useTennisStore();

  const [tab, setTab] = useState<'ttca' | 'pillars' | 'report'>('ttca');
  const [selectedBall, setSelectedBall] = useState<BallLevel>(activeChild?.currentBall ?? 'rouge');
  const [milestoneNoteDrafts, setMilestoneNoteDrafts] = useState<Record<string, string>>({});
  const [skillNoteDrafts, setSkillNoteDrafts] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState(false);

  // Quick coach session report form
  const [reportType, setReportType] = useState<SessionType>('cours_club');
  const [reportDuration, setReportDuration] = useState(60);
  const [reportSkills, setReportSkills] = useState<SkillKey[]>(['coup_droit', 'service']);
  const [reportNote, setReportNote] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const coachName = currentUser?.fullName || 'Coach';
  const coachCode = currentUser?.coachCode || 'COACH-DEMO';

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleCopyCode = () => {
    void navigator.clipboard?.writeText(coachCode);
    setCopiedCode(true);
    notify(`Code ${coachCode} copié ! Partage-le aux parents pour qu’ils t’assignent leurs enfants.`);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const ballInfo = GALAXIE_LEVELS.find((l) => l.id === selectedBall) ?? GALAXIE_LEVELS[2];

  const getMilestoneEval = (id: string) => {
    const ev = activeChild.milestoneEvaluations?.[id];
    if (ev) return ev;
    if (activeChild.milestonesCompleted.includes(id)) {
      return { status: 'acquis' as AcquisitionStatus, updatedAt: '' };
    }
    return { status: 'non_evalue' as AcquisitionStatus, updatedAt: '' };
  };

  const ballAcquisCount = hasVisibleChildren
    ? ballInfo.milestones.filter((m) => getMilestoneEval(m.id).status === 'acquis').length
    : 0;
  const ballEnCoursCount = hasVisibleChildren
    ? ballInfo.milestones.filter((m) => getMilestoneEval(m.id).status === 'en_cours').length
    : 0;
  const allBallAcquis = hasVisibleChildren && ballAcquisCount === ballInfo.milestones.length;

  const currentBallIdx = GALAXIE_LEVELS.findIndex((l) => l.id === activeChild?.currentBall);
  const nextBallInfo =
    currentBallIdx >= 0 && currentBallIdx < GALAXIE_LEVELS.length - 1
      ? GALAXIE_LEVELS[currentBallIdx + 1]
      : null;

  const handleSetMilestone = (milestoneId: string, status: AcquisitionStatus) => {
    const prevStatus = getMilestoneEval(milestoneId).status;
    const draftNote = milestoneNoteDrafts[milestoneId];
    setMilestoneStatus(milestoneId, status, {
      validatedBy: 'coach',
      validatorName: coachName,
      note: draftNote !== undefined ? draftNote : undefined,
    });
    if (status === 'acquis' && prevStatus !== 'acquis') {
      fireStarCelebration();
      notify(`Critère validé « Acquis » par ${coachName} (+10 ⭐ pour ${activeChild.name}) !`);
    }
  };

  const handleSaveMilestoneNote = (milestoneId: string) => {
    const ev = getMilestoneEval(milestoneId);
    const note = milestoneNoteDrafts[milestoneId] ?? ev.note ?? '';
    setMilestoneStatus(milestoneId, ev.status, {
      validatedBy: 'coach',
      validatorName: coachName,
      note,
    });
    notify('Observation enregistrée.');
  };

  const handleSaveCoachReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) return;
    addSession({
      sessionDate: new Date().toISOString().slice(0, 10),
      sessionType: reportType,
      clubId: activeChild.clubId,
      durationMin: reportDuration,
      focusSkills: reportSkills,
      effortRating: 5,
      starsAwarded: reportType === 'plateau' ? 20 : 15,
      coachNote: `[${coachName}] ${reportNote.trim()}`,
      parentNote: '',
    });
    fireStarCelebration();
    setReportNote('');
    notify(`Compte-rendu envoyé dans le journal de ${activeChild.name} !`);
  };

  return (
    <div className="parent-world flex min-h-dvh flex-col bg-[#F5F7F5]">
      {/* Court-side Coach Header */}
      <header className="sticky top-0 z-30 border-b border-[#163A2C] bg-[#1E4D3B] text-white shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C85A32] text-white shadow">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="parent-display text-lg font-bold leading-tight">{coachName}</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                  Coach FFT
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {currentUser?.clubName || 'Validation officielle des acquis TTCA'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Accepted pupils selector */}
            {hasVisibleChildren && (
              <select
                value={activeChild.id}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setActiveChildId(nextId);
                  const nextChild = visibleChildren.find((c) => c.id === nextId);
                  if (nextChild) setSelectedBall(nextChild.currentBall);
                }}
                className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white outline-none ring-1 ring-white/20"
              >
                {visibleChildren.map((c) => (
                  <option key={c.id} value={c.id} className="text-[#1F2421]">
                    🎾 {c.name} ({c.age} ans)
                  </option>
                ))}
              </select>
            )}

            {hasVisibleChildren && (
              <button
                type="button"
                onClick={onSwitchToChild}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F4B942] px-3 py-1.5 text-xs font-extrabold text-[#1F2421] hover:bg-[#E5AA33]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Vue {activeChild.name}
              </button>
            )}

            <button
              type="button"
              onClick={() => void logoutAccount()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Sub-nav Tabs (when coach has at least 1 accepted pupil) */}
        {hasVisibleChildren && (
          <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-3">
            <button
              type="button"
              onClick={() => setTab('ttca')}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                tab === 'ttca'
                  ? 'bg-white text-[#1E4D3B] shadow-xs'
                  : 'bg-white/10 text-emerald-100 hover:bg-white/15'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              Grille Officielle TTCA ({ballAcquisCount}/{ballInfo.milestones.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('pillars')}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                tab === 'pillars'
                  ? 'bg-white text-[#1E4D3B] shadow-xs'
                  : 'bg-white/10 text-emerald-100 hover:bg-white/15'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              6 Piliers & Conseils
            </button>
            <button
              type="button"
              onClick={() => setTab('report')}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                tab === 'report'
                  ? 'bg-white text-[#1E4D3B] shadow-xs'
                  : 'bg-white/10 text-emerald-100 hover:bg-white/15'
              }`}
            >
              <MessageSquarePlus className="h-4 w-4" />
              Compte-rendu Séance / Jeu & Matchs
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-5 px-4 py-6 pb-12">
        {/* Coach Unique Individual Code Banner */}
        <section className="parent-card flex flex-wrap items-center justify-between gap-4 border-[#1E4D3B]/25 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E9F3EE] text-[#1E4D3B]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
                Ton code unique individuel Coach
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <code className="rounded-lg bg-[#FAF6F0] px-2.5 py-1 text-base font-extrabold tracking-widest text-[#1E4D3B]">
                  {coachCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#1E4D3B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#163A2C]"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? 'Copié !' : 'Copier mon code'}
                </button>
              </div>
              <p className="mt-1 text-xs text-[#5C6660]">
                Communique ce code aux parents : ils le saisissent sur la fiche de leur enfant, puis
                tu acceptes l’assignation ci-dessous.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D3B]">
            <Users className="h-4 w-4" />
            {visibleChildren.length} élève{visibleChildren.length > 1 ? 's' : ''} suivi
            {visibleChildren.length > 1 ? 's' : ''}
          </div>
        </section>

        {toast && (
          <div className="animate-pop-in rounded-xl bg-[#1E4D3B] px-4 py-2.5 text-xs font-bold text-white shadow">
            ✓ {toast}
          </div>
        )}

        {/* PENDING PARENT ASSIGNMENT REQUESTS */}
        {coachPendingLinks.length > 0 && (
          <section className="rounded-2xl border-2 border-[#E9BE70] bg-[#FEF9EC] p-5 shadow-xs">
            <h2 className="parent-display mb-3 flex items-center gap-2 text-lg font-bold text-[#1F2421]">
              <UserCheck className="h-5 w-5 text-[#C85A32]" />
              Demandes d’assignation de parents en attente ({coachPendingLinks.length})
            </h2>
            <div className="space-y-2.5">
              {coachPendingLinks.map((link) => {
                const targetChild = state.children.find((c) => c.id === link.childId);
                const ball = GALAXIE_LEVELS.find((l) => l.id === targetChild?.currentBall);
                return (
                  <div
                    key={link.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#EFE2C6] bg-white p-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#1F2421]">
                        🎾 {targetChild?.name || 'Enfant'} ({targetChild?.age ?? '?'} ans) —{' '}
                        {ball?.emoji} {ball?.name || 'Galaxie'}
                      </p>
                      <p className="text-xs text-[#5C6660]">
                        Demandé par le parent <strong>{link.parentName}</strong> le{' '}
                        {new Date(link.requestedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          respondToCoachLink(link.id, true);
                          if (targetChild) {
                            setActiveChildId(targetChild.id);
                            setSelectedBall(targetChild.currentBall);
                          }
                          fireStarCelebration();
                          notify(
                            `Assignation acceptée ! Tu peux maintenant valider les acquis de ${targetChild?.name || 'cet enfant'}.`,
                          );
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
                      >
                        <Check className="h-4 w-4" />
                        Accepter l’élève
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          respondToCoachLink(link.id, false);
                          notify('Demande refusée.');
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-semibold text-[#5C6660] hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                        Refuser
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* EMPTY STATE WHEN NO ACCEPTED PUPILS YET */}
        {!hasVisibleChildren ? (
          <section className="parent-card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E9F3EE] text-3xl">
              🎾
            </div>
            <h2 className="parent-display mt-3 text-2xl font-bold text-[#1F2421]">
              Aucun élève assigné pour le moment
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#5C6660]">
              Les profils enfants sont créés par leurs parents. Partage ton code unique{' '}
              <strong className="text-[#1E4D3B]">{coachCode}</strong> à un parent : dès qu’il le
              saisira dans le Carnet de son enfant, sa demande apparaîtra juste au-dessus pour
              acceptation !
            </p>
          </section>
        ) : (
          <>
            {/* TAB 1: OFFICIAL FFT TTCA CHECKLIST */}
            {tab === 'ttca' && (
              <div className="space-y-5">
                <div className="parent-card p-4 sm:p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h1 className="parent-display text-xl font-bold text-[#1F2421]">
                        Validation des acquis TTCA — {activeChild.name}
                      </h1>
                      <p className="text-xs text-[#5C6660]">
                        {ballInfo.courtSize} • {ballInfo.racketHint}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="rounded-full bg-[#E9F3EE] px-2.5 py-1 text-[#1E4D3B]">
                        ✅ {ballAcquisCount} Acquis
                      </span>
                      <span className="rounded-full bg-[#FEF7E6] px-2.5 py-1 text-[#9A6700]">
                        🟡 {ballEnCoursCount} En cours
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {GALAXIE_LEVELS.map((lvl) => {
                      const done = lvl.milestones.filter(
                        (m) => getMilestoneEval(m.id).status === 'acquis',
                      ).length;
                      const isSel = lvl.id === selectedBall;
                      const isCurr = lvl.id === activeChild.currentBall;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setSelectedBall(lvl.id)}
                          className={`rounded-2xl border p-2.5 text-center transition ${
                            isSel
                              ? 'border-[#1E4D3B] bg-[#E9F3EE] shadow-xs'
                              : 'border-[#E8DDD0] bg-[#FAF6F0] hover:bg-white'
                          }`}
                        >
                          <div className="text-xl">{lvl.emoji}</div>
                          <div className="mt-0.5 text-xs font-bold text-[#1F2421]">
                            {lvl.name.replace('Niveau ', '')}
                          </div>
                          <div className="text-[11px] font-semibold text-[#5C6660]">
                            {done}/{lvl.milestones.length}
                          </div>
                          {isCurr && (
                            <span className="mt-1 inline-block rounded-full bg-[#C85A32] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                              Actuel
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedBall === activeChild.currentBall && allBallAcquis && nextBallInfo && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#1E4D3B] bg-[#E9F3EE] p-4">
                      <div className="flex items-center gap-2.5">
                        <Award className="h-6 w-6 text-[#1E4D3B]" />
                        <div>
                          <p className="text-sm font-bold text-[#1E4D3B]">
                            Tous les critères TTCA du {ballInfo.name} sont Acquis !
                          </p>
                          <p className="text-xs text-[#2D6B53]">
                            {activeChild.name} est prête à passer au {nextBallInfo.emoji}{' '}
                            {nextBallInfo.name}.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateChildProfile({ currentBall: nextBallInfo.id });
                          setSelectedBall(nextBallInfo.id);
                          fireStarCelebration();
                          notify(
                            `Félicitations ! ${activeChild.name} passe au ${nextBallInfo.name} !`,
                          );
                        }}
                        className="rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
                      >
                        Valider le passage en {nextBallInfo.name} →
                      </button>
                    </div>
                  )}
                </div>

                {TTCA_AXES.map((axis) => {
                  const items = ballInfo.milestones.filter((m) => m.axis === axis.id);
                  if (items.length === 0) return null;
                  return (
                    <section key={axis.id} className="parent-card overflow-hidden">
                      <div
                        className="flex items-center justify-between border-b border-[#EFE6DA] px-5 py-3"
                        style={{ backgroundColor: axis.bgSoft }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white"
                            style={{ backgroundColor: axis.color }}
                          >
                            {axis.letter}
                          </span>
                          <div>
                            <h2 className="text-sm font-extrabold" style={{ color: axis.color }}>
                              {axis.emoji} {axis.label}
                            </h2>
                            <p className="text-[11px] text-[#5C6660]">{axis.description}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-[#1F2421]">
                          {items.filter((m) => getMilestoneEval(m.id).status === 'acquis').length}/
                          {items.length} acquis
                        </span>
                      </div>

                      <div className="divide-y divide-[#F0E8DE]">
                        {items.map((m) => {
                          const ev = getMilestoneEval(m.id);
                          const noteVal = milestoneNoteDrafts[m.id] ?? ev.note ?? '';
                          return (
                            <div key={m.id} className="space-y-2.5 p-4">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                  {m.subGroup && (
                                    <span className="mb-1 inline-block rounded bg-[#FAF6F0] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5C6660]">
                                      {m.subGroup}
                                    </span>
                                  )}
                                  <p className="text-sm font-bold text-[#1F2421]">{m.label}</p>
                                  {ev.validatorName && ev.status !== 'non_evalue' && (
                                    <p className="mt-1 text-[11px] font-semibold text-[#1E4D3B]">
                                      {ev.validatedBy === 'coach'
                                        ? '🏅 Validé par '
                                        : '👤 Évalué par '}
                                      {ev.validatorName}
                                      {ev.updatedAt
                                        ? ` le ${new Date(ev.updatedAt).toLocaleDateString('fr-FR')}`
                                        : ''}
                                    </p>
                                  )}
                                </div>

                                <div className="flex shrink-0 gap-1.5">
                                  {STATUS_ORDER.map((st) => {
                                    const meta = ACQUISITION_STATUS_META[st];
                                    const active = ev.status === st;
                                    return (
                                      <button
                                        key={st}
                                        type="button"
                                        onClick={() => handleSetMilestone(m.id, st)}
                                        className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                                          active
                                            ? 'shadow-xs ring-2 ring-offset-1'
                                            : 'opacity-65 hover:opacity-100'
                                        }`}
                                        style={{
                                          backgroundColor: active ? meta.bg : '#FFFFFF',
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

                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={noteVal}
                                  onChange={(e) =>
                                    setMilestoneNoteDrafts((d) => ({ ...d, [m.id]: e.target.value }))
                                  }
                                  onBlur={() => {
                                    if (noteVal !== (ev.note ?? '')) {
                                      handleSaveMilestoneNote(m.id);
                                    }
                                  }}
                                  placeholder="Observation coach pour les parents (optionnel)..."
                                  className="flex-1 rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-3 py-1.5 text-xs outline-none focus:border-[#1E4D3B]"
                                />
                                {noteVal !== (ev.note ?? '') && (
                                  <button
                                    type="button"
                                    onClick={() => handleSaveMilestoneNote(m.id)}
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
                  );
                })}
              </div>
            )}

            {/* TAB 2: 6 PILLARS */}
            {tab === 'pillars' && (
              <div className="grid gap-4 md:grid-cols-2">
                {SKILL_CATALOG.map((sk) => {
                  const entry = activeChild.skillLevels[sk.key];
                  const status: AcquisitionStatus = entry?.status ?? 'non_evalue';
                  const draft = skillNoteDrafts[sk.key] ?? entry?.note ?? '';
                  return (
                    <div key={sk.key} className="parent-card space-y-3 p-4">
                      <div>
                        <h3 className="font-bold text-[#1F2421]">
                          {sk.emoji} {sk.label}
                        </h3>
                        <p className="text-xs text-[#5C6660]">{sk.description}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {STATUS_ORDER.map((st) => {
                          const meta = ACQUISITION_STATUS_META[st];
                          const active = status === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                updateSkillStatus(sk.key, st, draft, {
                                  validatedBy: 'coach',
                                  validatorName: coachName,
                                });
                                notify(`${sk.label} : ${meta.shortLabel}`);
                              }}
                              className={`rounded-xl border px-2.5 py-2 text-xs font-bold transition ${
                                active ? 'shadow-xs' : 'opacity-65 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: active ? meta.bg : '#FFFFFF',
                                color: active ? meta.text : '#5C6660',
                                borderColor: active ? meta.border : '#E8DDD0',
                              }}
                            >
                              {meta.emoji} {meta.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={draft}
                          onChange={(e) =>
                            setSkillNoteDrafts((d) => ({ ...d, [sk.key]: e.target.value }))
                          }
                          onBlur={() => {
                            if (draft !== (entry?.note ?? '')) {
                              updateSkillStatus(sk.key, status, draft, {
                                validatedBy: 'coach',
                                validatorName: coachName,
                              });
                            }
                          }}
                          placeholder="Conseil du coach..."
                          className="flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-1.5 text-xs outline-none focus:border-[#1E4D3B]"
                        />
                        {draft !== (entry?.note ?? '') && (
                          <button
                            type="button"
                            onClick={() => {
                              updateSkillStatus(sk.key, status, draft, {
                                validatedBy: 'coach',
                                validatorName: coachName,
                              });
                              notify('Conseil coach enregistré.');
                            }}
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
            )}

            {/* TAB 3: COACH REPORT */}
            {tab === 'report' && (
              <form onSubmit={handleSaveCoachReport} className="parent-card space-y-4 p-5 sm:p-6">
                <div>
                  <h2 className="parent-display text-xl font-bold text-[#1E4D3B]">
                    Compte-rendu fin de séance / Journée Jeu & Matchs
                  </h2>
                  <p className="text-xs text-[#5C6660]">
                    Ajoute directement ton retour dans le journal de {activeChild.name}.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReportType('cours_club')}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                          reportType === 'cours_club'
                            ? 'border-[#1E4D3B] bg-[#E9F3EE] text-[#1E4D3B]'
                            : 'border-[#E8DDD0] bg-[#FAF6F0]'
                        }`}
                      >
                        🎾 Cours Club
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportType('plateau')}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                          reportType === 'plateau'
                            ? 'border-[#1E4D3B] bg-[#E9F3EE] text-[#1E4D3B]'
                            : 'border-[#E8DDD0] bg-[#FAF6F0]'
                        }`}
                      >
                        🏅 Jeu & Matchs
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">Durée</label>
                    <div className="flex gap-2">
                      {[45, 60, 90].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setReportDuration(d)}
                          className={`flex-1 rounded-xl border py-2 text-xs font-bold ${
                            reportDuration === d
                              ? 'border-[#1E4D3B] bg-[#1E4D3B] text-white'
                              : 'border-[#E8DDD0] bg-[#FAF6F0]'
                          }`}
                        >
                          {d} min
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">
                    Axes travaillés
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_CATALOG.map((sk) => {
                      const on = reportSkills.includes(sk.key);
                      return (
                        <button
                          key={sk.key}
                          type="button"
                          onClick={() =>
                            setReportSkills((prev) =>
                              prev.includes(sk.key)
                                ? prev.filter((k) => k !== sk.key)
                                : [...prev, sk.key],
                            )
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                            on
                              ? 'border-[#1E4D3B] bg-[#E9F3EE] text-[#1E4D3B]'
                              : 'border-[#E8DDD0] bg-white text-[#5C6660]'
                          }`}
                        >
                          {sk.emoji} {sk.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">
                    Bilan & prochain objectif pour {activeChild.name}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Ex : Très belle journée Jeu & Matchs, service armé en net progrès."
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C85A32] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#A54522]"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Envoyer le bilan coach
                </button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
}
