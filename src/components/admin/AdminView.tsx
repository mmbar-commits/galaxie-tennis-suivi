import { useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  Clock,
  GitMerge,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { formatPhoneDisplay } from '../../data/phoneCountries';
import { useTennisStore } from '../../lib/store';
import type { Club, ClubProposal } from '../../types/tennis';

type AdminTab = 'proposals' | 'clubs' | 'accounts';

export function AdminView() {
  const {
    state,
    currentUser,
    officialClubs,
    pendingClubProposals,
    addClub,
    updateClub,
    deleteClub,
    approveClubProposal,
    mergeClubProposalToExisting,
    rejectClubProposal,
    logoutAccount,
  } = useTennisStore();

  const [activeTab, setActiveTab] = useState<AdminTab>(
    pendingClubProposals.length > 0 ? 'proposals' : 'clubs',
  );
  const [toast, setToast] = useState<string | null>(null);

  // Proposal moderation inline state
  const [approvingProposalId, setApprovingProposalId] = useState<string | null>(null);
  const [propClubName, setPropClubName] = useState('');
  const [propCity, setPropCity] = useState('');
  const [propPostalCode, setPropPostalCode] = useState('');
  const [propFftCode, setPropFftCode] = useState('');
  const [propSurface, setPropSurface] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propAdminNote, setPropAdminNote] = useState('');

  const [mergingProposalId, setMergingProposalId] = useState<string | null>(null);
  const [mergeTargetClubId, setMergeTargetClubId] = useState<string>('');

  // Official Clubs CRUD state
  const [clubSearch, setClubSearch] = useState('');
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [clubName, setClubName] = useState('');
  const [clubCity, setClubCity] = useState('');
  const [clubPostalCode, setClubPostalCode] = useState('');
  const [clubFftCode, setClubFftCode] = useState('');
  const [clubSurface, setClubSurface] = useState('');
  const [clubAddress, setClubAddress] = useState('');
  const [clubPhone, setClubPhone] = useState('');
  const [clubEmail, setClubEmail] = useState('');
  const [clubSchedule, setClubSchedule] = useState('');

  // Account directory filter
  const [accountSearch, setAccountSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'parent' | 'coach' | 'admin'>('all');

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const startApproveProposal = (prop: ClubProposal) => {
    setMergingProposalId(null);
    setApprovingProposalId(prop.id);
    setPropClubName(prop.proposedName);
    setPropCity(prop.proposedCity);
    setPropPostalCode('');
    setPropFftCode('');
    setPropSurface('Terre battue / Dur');
    setPropAddress(prop.proposedAddress || '');
    setPropAdminNote('');
  };

  const handleConfirmApprove = (e: React.FormEvent, prop: ClubProposal) => {
    e.preventDefault();
    if (!propClubName.trim()) return;
    const created = approveClubProposal(
      prop.id,
      {
        name: propClubName.trim(),
        city: propCity.trim(),
        postalCode: propPostalCode.trim(),
        fftCode: propFftCode.trim(),
        isOfficial: true,
        coachName: prop.requestedByCoachName,
        coachPhone: prop.requestedByCoachPhone || '',
        coachEmail: prop.requestedByCoachEmail,
        schedule: '',
        courtSurface: propSurface.trim(),
        address: propAddress.trim(),
      },
      propAdminNote,
    );
    if (created) {
      setApprovingProposalId(null);
      notify(
        `Club officiel « ${created.name} » créé en base et rattaché à ${prop.requestedByCoachName} !`,
      );
    }
  };

  const startMergeProposal = (prop: ClubProposal) => {
    setApprovingProposalId(null);
    setMergingProposalId(prop.id);
    setMergeTargetClubId(officialClubs[0]?.id || '');
  };

  const handleConfirmMerge = (prop: ClubProposal) => {
    if (!mergeTargetClubId) return;
    const target = officialClubs.find((c) => c.id === mergeTargetClubId);
    mergeClubProposalToExisting(prop.id, mergeTargetClubId);
    setMergingProposalId(null);
    notify(
      `${prop.requestedByCoachName} rattaché(e) au club officiel « ${target?.name || ''} » !`,
    );
  };

  const resetClubForm = () => {
    setEditingClubId(null);
    setClubName('');
    setClubCity('');
    setClubPostalCode('');
    setClubFftCode('');
    setClubSurface('');
    setClubAddress('');
    setClubPhone('');
    setClubEmail('');
    setClubSchedule('');
  };

  const startEditClub = (club: Club) => {
    setEditingClubId(club.id);
    setClubName(club.name);
    setClubCity(club.city || '');
    setClubPostalCode(club.postalCode || '');
    setClubFftCode(club.fftCode || '');
    setClubSurface(club.courtSurface || '');
    setClubAddress(club.address || '');
    setClubPhone(club.coachPhone || '');
    setClubEmail(club.coachEmail || '');
    setClubSchedule(club.schedule || '');
  };

  const handleSaveOfficialClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim()) return;
    const payload: Omit<Club, 'id'> = {
      name: clubName.trim(),
      city: clubCity.trim(),
      postalCode: clubPostalCode.trim(),
      fftCode: clubFftCode.trim(),
      isOfficial: true,
      coachName: '',
      coachPhone: clubPhone.trim(),
      coachEmail: clubEmail.trim(),
      schedule: clubSchedule.trim(),
      courtSurface: clubSurface.trim(),
      address: clubAddress.trim(),
    };
    if (editingClubId) {
      updateClub(editingClubId, payload);
      notify(`Club officiel « ${payload.name} » mis à jour !`);
    } else {
      addClub(payload);
      notify(`Club officiel « ${payload.name} » ajouté à la liste d’inscription !`);
    }
    resetClubForm();
  };

  const resolvedProposals = state.clubProposals.filter((p) => p.status !== 'pending');

  const filteredClubs = officialClubs.filter((c) => {
    const q = clubSearch.trim().toLowerCase();
    if (!q) return true;
    return [c.name, c.city, c.postalCode, c.fftCode, c.address]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(q));
  });

  const filteredAccounts = state.accounts.filter((a) => {
    if (roleFilter !== 'all' && a.role !== roleFilter) return false;
    const q = accountSearch.trim().toLowerCase();
    if (!q) return true;
    return [a.firstName, a.lastName, a.email, a.phoneNumber, a.clubName, a.coachCode]
      .filter(Boolean)
      .some((v) => v!.toLowerCase().includes(q));
  });

  const coachesCount = state.accounts.filter((a) => a.role === 'coach').length;
  const parentsCount = state.accounts.filter((a) => a.role === 'parent').length;
  const acceptedLinksCount = state.coachLinks.filter((l) => l.status === 'accepted').length;

  return (
    <div className="parent-world min-h-dvh bg-[#F6F5F1]">
      {/* Super Admin Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#152520] text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C85A32] text-white shadow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="parent-display text-lg font-bold leading-tight">
                  Administration Générale
                </span>
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                {currentUser?.firstName} {currentUser?.lastName} • {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void logoutAccount()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-white/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {/* Global KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="parent-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
              Clubs officiels
            </p>
            <p className="parent-display mt-1 text-2xl font-bold text-[#1E4D3B]">
              {officialClubs.length}
            </p>
          </div>
          <div
            className={`parent-card p-4 ${
              pendingClubProposals.length > 0 ? 'border-amber-300 bg-amber-50/70' : ''
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Clubs à valider
            </p>
            <p className="parent-display mt-1 text-2xl font-bold text-[#C85A32]">
              {pendingClubProposals.length}
            </p>
          </div>
          <div className="parent-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">Coachs</p>
            <p className="parent-display mt-1 text-2xl font-bold text-[#1F2421]">{coachesCount}</p>
          </div>
          <div className="parent-card p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
              Parents
            </p>
            <p className="parent-display mt-1 text-2xl font-bold text-[#1F2421]">{parentsCount}</p>
          </div>
          <div className="parent-card col-span-2 p-4 sm:col-span-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
              Enfants / Liens
            </p>
            <p className="parent-display mt-1 text-2xl font-bold text-[#1F2421]">
              {state.children.length}{' '}
              <span className="text-sm font-semibold text-[#5C6660]">
                ({acceptedLinksCount} liés)
              </span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs + Toast */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-[#E8DDD0] bg-white p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('proposals')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'proposals'
                  ? 'bg-[#C85A32] text-white shadow-xs'
                  : 'text-[#5C6660] hover:bg-[#FAF6F0] hover:text-[#1F2421]'
              }`}
            >
              <Clock className="h-4 w-4" />
              Demandes de clubs
              {pendingClubProposals.length > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    activeTab === 'proposals'
                      ? 'bg-white text-[#C85A32]'
                      : 'bg-[#C85A32] text-white'
                  }`}
                >
                  {pendingClubProposals.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('clubs')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'clubs'
                  ? 'bg-[#1E4D3B] text-white shadow-xs'
                  : 'text-[#5C6660] hover:bg-[#FAF6F0] hover:text-[#1F2421]'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Base officielle des clubs ({officialClubs.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('accounts')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'accounts'
                  ? 'bg-[#152520] text-white shadow-xs'
                  : 'text-[#5C6660] hover:bg-[#FAF6F0] hover:text-[#1F2421]'
              }`}
            >
              <Users className="h-4 w-4" />
              Annuaire comptes ({state.accounts.length})
            </button>
          </div>

          {toast && (
            <span className="animate-pop-in rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white shadow">
              ✓ {toast}
            </span>
          )}
        </div>

        {/* TAB 1: PENDING CLUB PROPOSALS FROM COACHES */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <section className="parent-card space-y-4 p-5">
              <div>
                <h2 className="parent-display text-xl font-bold text-[#1F2421]">
                  Nouveaux clubs proposés par les coachs ({pendingClubProposals.length} en attente)
                </h2>
                <p className="mt-0.5 text-xs text-[#5C6660]">
                  Lorsqu’un coach ne trouve pas son club à l’inscription, sa proposition arrive ici.
                  Tu peux l’éditer proprement pour la créer en base officielle, la rattacher à un
                  club existant ou la refuser.
                </p>
              </div>

              {pendingClubProposals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D8CBB8] bg-[#FAF6F0] p-8 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[#1E4D3B]" />
                  <p className="mt-2 text-sm font-bold text-[#1F2421]">
                    Aucune demande de club en attente !
                  </p>
                  <p className="mt-1 text-xs text-[#5C6660]">
                    Tous les nouveaux clubs proposés par les coachs ont été traités.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingClubProposals.map((prop) => {
                    const isApproving = approvingProposalId === prop.id;
                    const isMerging = mergingProposalId === prop.id;
                    return (
                      <div
                        key={prop.id}
                        className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                                En attente de validation
                              </span>
                              <h3 className="text-base font-bold text-[#1F2421]">
                                🏟️ {prop.proposedName}
                              </h3>
                            </div>
                            <p className="text-xs text-[#5C6660]">
                              {[prop.proposedCity, prop.proposedAddress]
                                .filter(Boolean)
                                .join(' • ') || 'Ville / adresse non précisée'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#1E4D3B]">
                              <span className="font-bold">
                                Proposé par : 🎾 {prop.requestedByCoachName}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[#5C6660]">
                                <Mail className="h-3 w-3" /> {prop.requestedByCoachEmail}
                              </span>
                              {prop.requestedByCoachPhone && (
                                <span className="inline-flex items-center gap-1 text-[#5C6660]">
                                  <Phone className="h-3 w-3" /> {prop.requestedByCoachPhone}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startApproveProposal(prop)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approuver & créer en base
                            </button>
                            {officialClubs.length > 0 && (
                              <button
                                type="button"
                                onClick={() => startMergeProposal(prop)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E4D3B]/30 bg-white px-3 py-2 text-xs font-bold text-[#1E4D3B] hover:bg-[#E9F3EE]"
                              >
                                <GitMerge className="h-3.5 w-3.5" />
                                Rattacher à un club existant
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Refuser la demande de club « ${prop.proposedName} » ?`,
                                  )
                                ) {
                                  rejectClubProposal(prop.id);
                                  notify(`Demande « ${prop.proposedName} » refusée.`);
                                }
                              }}
                              className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Refuser
                            </button>
                          </div>
                        </div>

                        {/* Inline Clean-up & Approve Form */}
                        {isApproving && (
                          <form
                            onSubmit={(e) => handleConfirmApprove(e, prop)}
                            className="mt-4 space-y-3 rounded-2xl border border-[#1E4D3B]/25 bg-white p-4 shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-extrabold uppercase tracking-wider text-[#1E4D3B]">
                                ✨ Vérifier & formater proprement avant insertion en base
                              </p>
                              <button
                                type="button"
                                onClick={() => setApprovingProposalId(null)}
                                className="rounded-lg p-1 text-[#5C6660] hover:bg-[#FAF6F0]"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <label className="mb-1 block text-[11px] font-bold text-[#5C6660]">
                                  Nom officiel du club *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={propClubName}
                                  onChange={(e) => setPropClubName(e.target.value)}
                                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none focus:border-[#1E4D3B]"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] font-bold text-[#5C6660]">
                                  Ville
                                </label>
                                <input
                                  type="text"
                                  value={propCity}
                                  onChange={(e) => setPropCity(e.target.value)}
                                  placeholder="Ex : Vincennes"
                                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#1E4D3B]"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] font-bold text-[#5C6660]">
                                  Code postal
                                </label>
                                <input
                                  type="text"
                                  value={propPostalCode}
                                  onChange={(e) => setPropPostalCode(e.target.value)}
                                  placeholder="Ex : 94300"
                                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#1E4D3B]"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] font-bold text-[#5C6660]">
                                  Code club FFT (optionnel)
                                </label>
                                <input
                                  type="text"
                                  value={propFftCode}
                                  onChange={(e) => setPropFftCode(e.target.value)}
                                  placeholder="Ex : 57 94 0108"
                                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#1E4D3B]"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] font-bold text-[#5C6660]">
                                  Surfaces
                                </label>
                                <input
                                  type="text"
                                  value={propSurface}
                                  onChange={(e) => setPropSurface(e.target.value)}
                                  placeholder="Ex : Terre battue & Résine"
                                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#1E4D3B]"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-[11px] font-bold text-[#5C6660]">
                                  Adresse
                                </label>
                                <input
                                  type="text"
                                  value={propAddress}
                                  onChange={(e) => setPropAddress(e.target.value)}
                                  placeholder="Rue, avenue..."
                                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#1E4D3B]"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <input
                                type="text"
                                value={propAdminNote}
                                onChange={(e) => setPropAdminNote(e.target.value)}
                                placeholder="Note interne admin (optionnel)"
                                className="min-w-60 flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs outline-none"
                              />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Valider & créer le club officiel
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Inline Merge to Existing Official Club */}
                        {isMerging && (
                          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[#1E4D3B]/25 bg-white p-4">
                            <span className="text-xs font-bold text-[#1E4D3B]">
                              Rattacher {prop.requestedByCoachName} au club existant :
                            </span>
                            <select
                              value={mergeTargetClubId}
                              onChange={(e) => setMergeTargetClubId(e.target.value)}
                              className="min-w-60 flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-semibold outline-none"
                            >
                              {officialClubs.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                  {c.city ? ` (${c.city})` : ''}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleConfirmMerge(prop)}
                              className="rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
                            >
                              Confirmer le rattachement
                            </button>
                            <button
                              type="button"
                              onClick={() => setMergingProposalId(null)}
                              className="rounded-xl border border-[#E8DDD0] px-3 py-2 text-xs font-semibold text-[#5C6660]"
                            >
                              Annuler
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Resolved History */}
            {resolvedProposals.length > 0 && (
              <section className="parent-card space-y-3 p-5">
                <h3 className="parent-display text-base font-bold text-[#1F2421]">
                  Historique des demandes traitées ({resolvedProposals.length})
                </h3>
                <div className="space-y-2">
                  {resolvedProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-3.5 py-2.5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#1F2421]">{prop.proposedName}</span>
                        <span className="text-[#5C6660]">
                          {' '}
                          • proposé par {prop.requestedByCoachName}
                        </span>
                        {prop.adminNote && (
                          <span className="text-[#5C6660]"> — {prop.adminNote}</span>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          prop.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prop.status === 'merged'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {prop.status === 'approved'
                          ? 'Approuvé & créé'
                          : prop.status === 'merged'
                            ? 'Rattaché à un existant'
                            : 'Refusé'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 2: OFFICIAL CLUBS DATABASE */}
        {activeTab === 'clubs' && (
          <div className="space-y-6">
            {/* Add / Edit Official Club Form */}
            <form onSubmit={handleSaveOfficialClub} className="parent-card space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="parent-display flex items-center gap-2 text-xl font-bold text-[#1E4D3B]">
                    <Building2 className="h-5 w-5" />
                    {editingClubId
                      ? 'Modifier le club officiel'
                      : 'Ajouter un club au référentiel officiel'}
                  </h2>
                  <p className="text-xs text-[#5C6660]">
                    Tous les clubs enregistrés ici apparaissent immédiatement dans la liste de choix
                    lors de l’inscription d’un coach et dans l’espace Parent.
                  </p>
                </div>
                {editingClubId && (
                  <button
                    type="button"
                    onClick={resetClubForm}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#E8DDD0] px-3 py-1.5 text-xs font-semibold text-[#5C6660]"
                  >
                    <X className="h-3.5 w-3.5" /> Annuler modification
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <input
                  type="text"
                  required
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="Nom officiel du club *"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="text"
                  value={clubCity}
                  onChange={(e) => setClubCity(e.target.value)}
                  placeholder="Ville (ex : Paris, Lyon...)"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="text"
                  value={clubPostalCode}
                  onChange={(e) => setClubPostalCode(e.target.value)}
                  placeholder="Code postal (ex : 75016)"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="text"
                  value={clubFftCode}
                  onChange={(e) => setClubFftCode(e.target.value)}
                  placeholder="Code club FFT (optionnel)"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="text"
                  value={clubSurface}
                  onChange={(e) => setClubSurface(e.target.value)}
                  placeholder="Surfaces (ex : Terre battue, Résine)"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="text"
                  value={clubAddress}
                  onChange={(e) => setClubAddress(e.target.value)}
                  placeholder="Adresse postale"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="text"
                  value={clubPhone}
                  onChange={(e) => setClubPhone(e.target.value)}
                  placeholder="Téléphone secrétariat / club"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="email"
                  value={clubEmail}
                  onChange={(e) => setClubEmail(e.target.value)}
                  placeholder="E-mail contact club"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
                <input
                  type="text"
                  value={clubSchedule}
                  onChange={(e) => setClubSchedule(e.target.value)}
                  placeholder="Horaires école de tennis"
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#163A2C]"
                >
                  <Plus className="h-4 w-4" />
                  {editingClubId ? 'Mettre à jour ce club officiel' : 'Créer ce club officiel'}
                </button>
              </div>
            </form>

            {/* Official Clubs List */}
            <section className="parent-card space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="parent-display text-lg font-bold text-[#1F2421]">
                  Référentiel actif ({filteredClubs.length} club
                  {filteredClubs.length > 1 ? 's' : ''})
                </h3>
                <div className="relative min-w-60">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C948A]" />
                  <input
                    type="text"
                    value={clubSearch}
                    onChange={(e) => setClubSearch(e.target.value)}
                    placeholder="Rechercher un club, une ville, un code FFT..."
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] py-2 pl-9 pr-3 text-xs outline-none focus:border-[#1E4D3B]"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {filteredClubs.map((club) => {
                  const linkedCoaches = state.accounts.filter(
                    (a) => a.role === 'coach' && a.clubId === club.id,
                  ).length;
                  const linkedChildren = state.children.filter((c) => c.clubId === club.id).length;

                  return (
                    <div
                      key={club.id}
                      className="rounded-2xl border border-[#EFE6DA] bg-[#FAF6F0] p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-[#1F2421]">🏟️ {club.name}</h4>
                            {club.fftCode && (
                              <span className="rounded-md bg-[#E9F3EE] px-2 py-0.5 text-[10px] font-bold text-[#1E4D3B]">
                                FFT {club.fftCode}
                              </span>
                            )}
                          </div>
                          {(club.city || club.postalCode || club.address) && (
                            <p className="mt-0.5 text-xs text-[#5C6660]">
                              📍{' '}
                              {[club.address, [club.postalCode, club.city].filter(Boolean).join(' ')]
                                .filter(Boolean)
                                .join(' — ')}
                            </p>
                          )}
                          {club.courtSurface && (
                            <p className="mt-0.5 text-xs text-[#5C6660]">🎾 {club.courtSurface}</p>
                          )}
                          {(club.coachPhone || club.coachEmail) && (
                            <p className="mt-0.5 text-[11px] text-[#5C6660]">
                              {[club.coachPhone, club.coachEmail].filter(Boolean).join(' • ')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => startEditClub(club)}
                            className="rounded-lg p-1.5 text-[#5C6660] hover:bg-white hover:text-[#1F2421]"
                            title="Modifier"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Supprimer le club officiel « ${club.name} » du référentiel ?`,
                                )
                              ) {
                                deleteClub(club.id);
                                notify(`Club « ${club.name} » supprimé.`);
                              }
                            }}
                            className="rounded-lg p-1.5 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#1E4D3B]">
                          {linkedCoaches} coach{linkedCoaches > 1 ? 's' : ''}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#5C6660]">
                          {linkedChildren} enfant{linkedChildren > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: CLEAN USER ACCOUNTS DIRECTORY */}
        {activeTab === 'accounts' && (
          <section className="parent-card space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="parent-display text-xl font-bold text-[#1F2421]">
                  Annuaire des comptes ({filteredAccounts.length})
                </h2>
                <p className="text-xs text-[#5C6660]">
                  Données normalisées : prénom et nom séparés, téléphone avec indicatif pays et club
                  rattaché.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value as 'all' | 'parent' | 'coach' | 'admin')
                  }
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-bold outline-none"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="coach">Coachs uniquement</option>
                  <option value="parent">Parents uniquement</option>
                  <option value="admin">Admins</option>
                </select>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9C948A]" />
                  <input
                    type="text"
                    value={accountSearch}
                    onChange={(e) => setAccountSearch(e.target.value)}
                    placeholder="Filtrer par nom, email, tel..."
                    className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] py-2 pl-8 pr-3 text-xs outline-none focus:border-[#1E4D3B]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EFE6DA] text-[10px] font-extrabold uppercase tracking-wider text-[#5C6660]">
                    <th className="py-2.5 pr-3">Prénom</th>
                    <th className="py-2.5 pr-3">Nom</th>
                    <th className="py-2.5 pr-3">Rôle</th>
                    <th className="py-2.5 pr-3">E-mail & Accès</th>
                    <th className="py-2.5 pr-3">Téléphone</th>
                    <th className="py-2.5">Club / Code Coach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EAE0]">
                  {filteredAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-[#FAF6F0]/60">
                      <td className="py-3 pr-3 font-bold text-[#1F2421]">{acc.firstName}</td>
                      <td className="py-3 pr-3 font-bold text-[#1F2421]">{acc.lastName || '—'}</td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            acc.role === 'admin'
                              ? 'bg-slate-800 text-amber-300'
                              : acc.role === 'coach'
                                ? 'bg-[#E9F3EE] text-[#1E4D3B]'
                                : 'bg-[#FDF0EB] text-[#C85A32]'
                          }`}
                        >
                          {acc.role === 'admin'
                            ? 'Admin'
                            : acc.role === 'coach'
                              ? 'Coach'
                              : 'Parent'}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-[#1F2421]">{acc.email}</p>
                        <p className="text-[10px] text-[#5C6660]">
                          {acc.authMethod === 'magic_link'
                            ? '✨ Magic Link'
                            : '🔑 Mot de passe'}
                        </p>
                      </td>
                      <td className="py-3 pr-3 font-medium text-[#1F2421]">
                        {acc.phoneNumber
                          ? formatPhoneDisplay(acc.phoneCountryCode, acc.phoneNumber)
                          : '—'}
                      </td>
                      <td className="py-3">
                        {acc.role === 'coach' ? (
                          <div className="space-y-0.5">
                            <p className="font-semibold text-[#1F2421]">
                              {acc.clubName || 'Aucun club'}
                              {acc.pendingClubProposalId && (
                                <span className="ml-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                  ⏳ En attente
                                </span>
                              )}
                            </p>
                            {acc.coachCode && (
                              <p className="font-mono text-[11px] font-bold text-[#1E4D3B]">
                                {acc.coachCode}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#9C948A]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
