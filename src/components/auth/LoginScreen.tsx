import { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ClipboardCheck,
  KeyRound,
  LogIn,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Wand2,
} from 'lucide-react';
import { PHONE_COUNTRIES } from '../../data/phoneCountries';
import { useTennisStore } from '../../lib/store';

interface LoginScreenProps {
  onOpenChildDemo?: () => void;
}

export function LoginScreen({ onOpenChildDemo }: LoginScreenProps) {
  const {
    state,
    officialClubs,
    pendingClubProposals,
    registerAccount,
    loginAccount,
    sendMagicLink,
    verifyDemoMagicLink,
    quickDemoLogin,
    isCloudConfigured,
  } = useTennisStore();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic_link'>('password');

  // Registration fields
  const [role, setRole] = useState<'parent' | 'coach'>('parent');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+33');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string>(officialClubs[0]?.id ?? '__other__');
  const [proposedClubName, setProposedClubName] = useState('');
  const [proposedClubCity, setProposedClubCity] = useState('');
  const [registerWithMagicLink, setRegisterWithMagicLink] = useState(false);

  // Shared auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Magic link feedback card
  const [magicLinkNotice, setMagicLinkNotice] = useState<{
    message: string;
    mode: 'supabase' | 'local';
    demoToken?: string;
    demoLink?: string;
    accountName?: string;
  } | null>(null);

  const selectedCountry =
    PHONE_COUNTRIES.find((c) => c.dialCode === phoneCountryCode) ?? PHONE_COUNTRIES[0];

  const demoParent = state.accounts.find((a) => a.role === 'parent');
  const demoCoach =
    state.accounts.find((a) => a.id === 'coach-demo-1') ||
    state.accounts.find((a) => a.role === 'coach');
  const demoAdmin = state.accounts.find((a) => a.role === 'admin');

  const effectiveClubId =
    selectedClubId &&
    (selectedClubId === '__other__' || officialClubs.some((c) => c.id === selectedClubId))
      ? selectedClubId
      : officialClubs[0]?.id ?? '__other__';

  const isProposingNewClub = role === 'coach' && effectiveClubId === '__other__';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMagicLinkNotice(null);
    setLoading(true);
    try {
      if (tab === 'login') {
        if (loginMethod === 'magic_link') {
          const res = await sendMagicLink(email);
          if (!res.ok) {
            setError(res.error || 'Impossible d’envoyer le lien magique.');
          } else {
            setMagicLinkNotice({
              message: res.message || 'Lien magique prêt !',
              mode: res.mode || 'local',
              demoToken: res.demoMagicToken,
              demoLink: res.demoMagicLink,
              accountName: res.accountName,
            });
          }
        } else {
          const res = await loginAccount(email, password);
          if (!res.ok) setError(res.error || 'Connexion impossible.');
        }
      } else {
        const res = await registerAccount({
          email,
          password: registerWithMagicLink ? undefined : password,
          useMagicLink: registerWithMagicLink,
          firstName,
          lastName,
          phoneCountryCode,
          phoneNumber,
          role,
          clubId: role === 'coach' ? effectiveClubId : undefined,
          proposedClubName: isProposingNewClub ? proposedClubName : undefined,
          proposedClubCity: isProposingNewClub ? proposedClubCity : undefined,
        });
        if (!res.ok) {
          setError(res.error || 'Création du compte impossible.');
        } else if (res.magicLinkSent) {
          setMagicLinkNotice({
            message: isCloudConfigured
              ? `Compte créé pour ${firstName.trim()} ! Un lien magique vient d’être envoyé à ${email.trim()}.`
              : `Compte créé pour ${firstName.trim()} ! Voici votre lien magique de connexion (Mode Démo Local).`,
            mode: isCloudConfigured ? 'supabase' : 'local',
            demoToken: res.demoMagicToken,
            demoLink: res.demoMagicLink,
            accountName: `${firstName.trim()} ${lastName.trim()}`,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDemoMagicLink = () => {
    if (!magicLinkNotice?.demoToken) return;
    const res = verifyDemoMagicLink(magicLinkNotice.demoToken);
    if (!res.ok) {
      setError(res.error || 'Lien magique invalide.');
      setMagicLinkNotice(null);
    }
  };

  return (
    <div className="parent-world flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-3xl border border-[#E8DDD0] bg-white shadow-xl lg:grid-cols-12">
          {/* Left Editorial Court Panel */}
          <div className="flex flex-col justify-between bg-[#1E4D3B] p-7 text-white lg:col-span-5 lg:p-8">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="./app-icon.jpg"
                  alt="Galaxie Tennis"
                  className="h-12 w-12 rounded-2xl object-cover shadow"
                />
                <div>
                  <p className="parent-display text-2xl font-bold leading-tight">Galaxie Tennis</p>
                  <p className="text-xs font-medium text-emerald-200">
                    Suivi FFT • Parent, Coach, Admin & Enfant
                  </p>
                </div>
              </div>

              <h1 className="parent-display mt-7 text-3xl font-bold leading-snug">
                Suivez chaque étape sur le court, ensemble.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-emerald-100/90">
                Connectez-vous par <strong>mot de passe</strong> ou par{' '}
                <strong>lien magique (sans mot de passe)</strong>. Les coachs choisissent leur club
                dans le référentiel officiel administré et partagent leur code unique aux parents.
              </p>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B942]" />
                  <div>
                    <p className="font-bold">Espace Parent</p>
                    <p className="text-emerald-100/80">
                      Création d’enfants, questionnaire de niveau FFT, séances, studio défis &
                      boutique.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-3">
                  <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B942]" />
                  <div>
                    <p className="font-bold">Espace Coach</p>
                    <p className="text-emerald-100/80">
                      Rattachement club officiel, code unique individuel et validation FFT TTCA.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B942]" />
                  <div>
                    <p className="font-bold">Administrateur Général</p>
                    <p className="text-emerald-100/80">
                      Gestion de la base officielle des clubs et validation des nouveaux clubs
                      proposés.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/15 pt-4 text-[11px] text-emerald-200/80">
              {isCloudConfigured
                ? '☁️ Mode Cloud Supabase actif (e-mails Magic Link réels)'
                : '💾 Mode Local actif (teste les comptes, le Magic Link et la validation Admin ici)'}
            </div>
          </div>

          {/* Right Auth Form Panel */}
          <div className="p-6 sm:p-8 lg:col-span-7">
            {/* Switch Login / Register */}
            <div className="mb-5 flex gap-2 rounded-2xl bg-[#FAF6F0] p-1.5">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                  setMagicLinkNotice(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                  tab === 'login'
                    ? 'bg-white text-[#1E4D3B] shadow-xs'
                    : 'text-[#5C6660] hover:text-[#1F2421]'
                }`}
              >
                <LogIn className="h-4 w-4" />
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                  setMagicLinkNotice(null);
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                  tab === 'register'
                    ? 'bg-white text-[#C85A32] shadow-xs'
                    : 'text-[#5C6660] hover:text-[#1F2421]'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                Créer un compte
              </button>
            </div>

            {/* Login Method Toggle (Password vs Magic Link) */}
            {tab === 'login' && (
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#EFE6DA] bg-[#FAF6F0]/70 p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setError(null);
                    setMagicLinkNotice(null);
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                    loginMethod === 'password'
                      ? 'bg-white text-[#1F2421] shadow-2xs'
                      : 'text-[#5C6660] hover:text-[#1F2421]'
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Mot de passe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('magic_link');
                    setError(null);
                    setMagicLinkNotice(null);
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                    loginMethod === 'magic_link'
                      ? 'bg-[#1E4D3B] text-white shadow-2xs'
                      : 'text-[#5C6660] hover:text-[#1F2421]'
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Lien magique (sans mdp)
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'register' && (
                <>
                  {/* Role Selector */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
                      Type de profil
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setRole('parent')}
                        className={`rounded-2xl border-2 p-3 text-left transition ${
                          role === 'parent'
                            ? 'border-[#C85A32] bg-[#FDF0EB]'
                            : 'border-[#E8DDD0] bg-[#FAF6F0] hover:bg-white'
                        }`}
                      >
                        <p className="text-sm font-bold text-[#1F2421]">👨‍👩‍👧 Parent</p>
                        <p className="mt-0.5 text-[11px] text-[#5C6660]">
                          Crée les enfants & suit la progression
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('coach')}
                        className={`rounded-2xl border-2 p-3 text-left transition ${
                          role === 'coach'
                            ? 'border-[#1E4D3B] bg-[#E9F3EE]'
                            : 'border-[#E8DDD0] bg-[#FAF6F0] hover:bg-white'
                        }`}
                      >
                        <p className="text-sm font-bold text-[#1F2421]">🎾 Coach</p>
                        <p className="mt-0.5 text-[11px] text-[#5C6660]">
                          Club officiel + code unique TTCA
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Separated First Name & Last Name */}
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={role === 'coach' ? 'Ex : Camille' : 'Ex : Sophie'}
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#C85A32]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#5C6660]">Nom *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={role === 'coach' ? 'Ex : Laurent' : 'Ex : Martin'}
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#C85A32]"
                      />
                    </div>
                  </div>

                  {/* Phone with Country Dial Code (for both Parent and Coach) */}
                  <div>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#5C6660]">
                      <Phone className="h-3.5 w-3.5 text-[#1E4D3B]" />
                      Numéro de téléphone (avec indicatif pays) *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        aria-label="Indicatif pays"
                        className="w-36 shrink-0 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-2.5 py-2.5 text-xs font-bold outline-none focus:border-[#C85A32]"
                      >
                        {PHONE_COUNTRIES.map((c) => (
                          <option key={`${c.iso}-${c.dialCode}`} value={c.dialCode}>
                            {c.flag} {c.dialCode} ({c.iso})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={selectedCountry.placeholder}
                        className="flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm font-medium outline-none focus:border-[#C85A32]"
                      />
                    </div>
                  </div>

                  {/* Coach Club Dropdown from Official Admin List + Propose Missing Club */}
                  {role === 'coach' && (
                    <div className="space-y-2.5 rounded-2xl border border-[#D8E8DF] bg-[#F3F8F5] p-3.5">
                      <div>
                        <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#1E4D3B]">
                          <Building2 className="h-3.5 w-3.5" />
                          Votre club de tennis *
                        </label>
                        <select
                          value={effectiveClubId}
                          onChange={(e) => setSelectedClubId(e.target.value)}
                          className="w-full rounded-xl border border-[#C9DED2] bg-white px-3 py-2.5 text-sm font-semibold text-[#1F2421] outline-none focus:border-[#1E4D3B]"
                        >
                          {officialClubs.map((club) => (
                            <option key={club.id} value={club.id}>
                              🏟️ {club.name}
                              {club.city ? ` — ${club.city}` : ''}
                            </option>
                          ))}
                          <option value="__other__">
                            ➕ Mon club n’est pas dans la liste (proposer un club)
                          </option>
                        </select>
                      </div>

                      {isProposingNewClub && (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            required
                            value={proposedClubName}
                            onChange={(e) => setProposedClubName(e.target.value)}
                            placeholder="Nom exact de votre club *"
                            className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-[#C85A32]"
                          />
                          <input
                            type="text"
                            value={proposedClubCity}
                            onChange={(e) => setProposedClubCity(e.target.value)}
                            placeholder="Ville & code postal (ex : Vincennes 94300)"
                            className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#C85A32]"
                          />
                          <p className="text-[11px] text-amber-900 sm:col-span-2">
                            ⏳ Votre proposition sera envoyée à l’<strong>administrateur général</strong>{' '}
                            pour vérification et ajout propre dans la base officielle. Votre compte
                            et votre code coach sont utilisables immédiatement.
                          </p>
                        </div>
                      )}

                      <p className="text-[11px] text-[#1E4D3B]">
                        ✨ Un <strong>code unique individuel</strong> sera généré automatiquement
                        après inscription pour que les parents puissent vous assigner leurs enfants.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Email */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#5C6660]">
                  <Mail className="h-3.5 w-3.5 text-[#C85A32]" />
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.fr"
                  className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#C85A32]"
                />
              </div>

              {/* Registration Password vs Magic Link choice */}
              {tab === 'register' && (
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-3.5 py-2.5">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-bold text-[#1F2421]">
                      <Wand2 className="h-3.5 w-3.5 text-[#1E4D3B]" />
                      Inscription sans mot de passe (Lien magique par e-mail)
                    </p>
                    <p className="text-[11px] text-[#5C6660]">
                      Aucun mot de passe à retenir : recevez un lien de connexion sécurisé à chaque
                      visite.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={registerWithMagicLink}
                    onChange={(e) => setRegisterWithMagicLink(e.target.checked)}
                    className="h-4 w-4 accent-[#1E4D3B]"
                  />
                </label>
              )}

              {/* Password Field (only when needed) */}
              {((tab === 'login' && loginMethod === 'password') ||
                (tab === 'register' && !registerWithMagicLink)) && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                    Mot de passe (6 caractères min.) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#C85A32]"
                  />
                </div>
              )}

              {tab === 'login' && loginMethod === 'magic_link' && (
                <p className="rounded-xl bg-[#E9F3EE] px-3.5 py-2 text-xs text-[#1E4D3B]">
                  ✨ Saisissez simplement votre adresse e-mail : nous vous envoyons un{' '}
                  <strong>lien de connexion instantané</strong> valable 15 minutes, sans mot de
                  passe.
                </p>
              )}

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700">
                  {error}
                </p>
              )}

              {/* Magic Link Sent Feedback & Instant Demo Inbox Preview */}
              {magicLinkNotice && (
                <div className="space-y-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    <div className="text-xs text-emerald-950">
                      <p className="font-bold">{magicLinkNotice.message}</p>
                      {magicLinkNotice.mode === 'local' && (
                        <p className="mt-0.5 text-[11px] text-emerald-800">
                          En mode démo local (sans serveur SMTP Supabase), voici l’aperçu direct du
                          lien qui serait envoyé dans votre boîte mail :
                        </p>
                      )}
                    </div>
                  </div>
                  {magicLinkNotice.mode === 'local' && magicLinkNotice.demoToken && (
                    <button
                      type="button"
                      onClick={handleOpenDemoMagicLink}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E4D3B] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#163A2C]"
                    >
                      <Wand2 className="h-4 w-4" />
                      Cliquer sur mon lien magique ({magicLinkNotice.accountName || email})
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-xs transition disabled:opacity-50 ${
                  (tab === 'login' && loginMethod === 'magic_link') ||
                  (tab === 'register' && role === 'coach')
                    ? 'bg-[#1E4D3B] hover:bg-[#163A2C]'
                    : 'bg-[#C85A32] hover:bg-[#A54522]'
                }`}
              >
                {loading
                  ? 'Chargement...'
                  : tab === 'login'
                    ? loginMethod === 'magic_link'
                      ? '✨ Recevoir mon lien magique'
                      : 'Se connecter'
                    : registerWithMagicLink
                      ? '✨ Créer mon compte & recevoir mon lien magique'
                      : role === 'coach'
                        ? 'Créer mon compte Coach & générer mon code'
                        : 'Créer mon compte Parent'}
              </button>
            </form>

            {/* 1-click Demo Access (Parent, Coach & Super Admin) */}
            <div className="mt-5 border-t border-[#EFE6DA] pt-4">
              <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5C6660]">
                <KeyRound className="h-3.5 w-3.5 text-[#C85A32]" />
                Accès Démo rapide (1 clic)
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {demoParent && (
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('parent')}
                    className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2.5 text-left transition hover:border-[#C85A32] hover:bg-[#FDF0EB]"
                  >
                    <p className="text-xs font-bold text-[#1F2421]">👨‍👩‍👧 {demoParent.fullName}</p>
                    <p className="truncate text-[10px] text-[#5C6660]">{demoParent.email}</p>
                  </button>
                )}
                {demoCoach && (
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('coach')}
                    className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2.5 text-left transition hover:border-[#1E4D3B] hover:bg-[#E9F3EE]"
                  >
                    <p className="text-xs font-bold text-[#1F2421]">🎾 {demoCoach.fullName}</p>
                    <p className="text-[10px] text-[#1E4D3B]">
                      Code : <strong>{demoCoach.coachCode}</strong>
                    </p>
                  </button>
                )}
                {demoAdmin && (
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('admin')}
                    className="relative rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-left transition hover:border-slate-700 hover:bg-slate-100"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[#1F2421]">🛡️ Admin Général</p>
                      {pendingClubProposals.length > 0 && (
                        <span className="rounded-full bg-[#C85A32] px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                          {pendingClubProposals.length}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[10px] text-[#5C6660]">{demoAdmin.email}</p>
                  </button>
                )}
              </div>

              {onOpenChildDemo && state.children.length > 0 && (
                <button
                  type="button"
                  onClick={onOpenChildDemo}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#FEF7E6] py-2 text-xs font-extrabold text-[#9A6700] hover:bg-[#FDECC4]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ouvrir directement la Vue Enfant ({state.children[0].name})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
