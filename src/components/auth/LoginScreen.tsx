import { useState } from 'react';
import {
  ClipboardCheck,
  KeyRound,
  LogIn,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { useTennisStore } from '../../lib/store';
import type { UserRole } from '../../types/tennis';

interface LoginScreenProps {
  onOpenChildDemo?: () => void;
}

export function LoginScreen({ onOpenChildDemo }: LoginScreenProps) {
  const { state, registerAccount, loginAccount, quickDemoLogin, isCloudConfigured } =
    useTennisStore();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('parent');
  const [fullName, setFullName] = useState('');
  const [clubName, setClubName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoParent = state.accounts.find((a) => a.role === 'parent');
  const demoCoach = state.accounts.find((a) => a.role === 'coach');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === 'login') {
        const res = await loginAccount(email, password);
        if (!res.ok) setError(res.error || 'Connexion impossible.');
      } else {
        const res = await registerAccount({
          email,
          password,
          fullName,
          role,
          clubName: role === 'coach' ? clubName : undefined,
        });
        if (!res.ok) setError(res.error || 'Création du compte impossible.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-world flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
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
                    Suivi FFT • Parent, Coach & Enfant
                  </p>
                </div>
              </div>

              <h1 className="parent-display mt-7 text-3xl font-bold leading-snug">
                Suivez chaque étape sur le court, ensemble.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-emerald-100/90">
                Les parents créent les profils de leurs enfants avec le questionnaire d’évaluation
                initial, puis invitent leur coach via son <strong>code unique individuel</strong>.
              </p>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B942]" />
                  <div>
                    <p className="font-bold">Espace Parent</p>
                    <p className="text-emerald-100/80">
                      Création d’enfants, questionnaire de niveau, séances, studio défis & boutique.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-3">
                  <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#F4B942]" />
                  <div>
                    <p className="font-bold">Espace Coach</p>
                    <p className="text-emerald-100/80">
                      Code unique individuel, acceptation des élèves et validation officielle FFT
                      TTCA.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/15 pt-4 text-[11px] text-emerald-200/80">
              {isCloudConfigured
                ? '☁️ Mode Cloud Supabase actif'
                : '💾 Mode Local actif (crée tes comptes Parent & Coach et teste tout le parcours ici)'}
            </div>
          </div>

          {/* Right Auth Form Panel */}
          <div className="p-6 sm:p-8 lg:col-span-7">
            {/* Switch Login / Register */}
            <div className="mb-6 flex gap-2 rounded-2xl bg-[#FAF6F0] p-1.5">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#5C6660]">
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
                          Code unique + validation TTCA
                        </p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                      Prénom & Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={role === 'coach' ? 'Ex : Coach Camille Laurent' : 'Ex : Sophie Martin'}
                      className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-[#C85A32]"
                    />
                  </div>

                  {role === 'coach' && (
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                        Club de tennis (optionnel)
                      </label>
                      <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        placeholder="Ex : TC des Lilas"
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-sm outline-none focus:border-[#1E4D3B]"
                      />
                      <p className="mt-1 text-[11px] text-[#1E4D3B]">
                        ✨ Un <strong>code unique individuel</strong> sera généré automatiquement
                        après inscription pour que les parents puissent t’inviter.
                      </p>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                  Email (identifiant de connexion)
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

              <div>
                <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                  Mot de passe (6 caractères min.)
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

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-xs transition disabled:opacity-50 ${
                  tab === 'register' && role === 'coach'
                    ? 'bg-[#1E4D3B] hover:bg-[#163A2C]'
                    : 'bg-[#C85A32] hover:bg-[#A54522]'
                }`}
              >
                {loading
                  ? 'Chargement...'
                  : tab === 'login'
                    ? 'Se connecter'
                    : role === 'coach'
                      ? 'Créer mon compte Coach & générer mon code'
                      : 'Créer mon compte Parent'}
              </button>
            </form>

            {/* 1-click Demo Access */}
            <div className="mt-6 border-t border-[#EFE6DA] pt-5">
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C6660]">
                <KeyRound className="h-3.5 w-3.5 text-[#C85A32]" />
                Accès Démo rapide (1 clic)
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {demoParent && (
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('parent')}
                    className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-left transition hover:border-[#C85A32] hover:bg-[#FDF0EB]"
                  >
                    <p className="text-xs font-bold text-[#1F2421]">👨‍👩‍👧 {demoParent.fullName}</p>
                    <p className="text-[11px] text-[#5C6660]">{demoParent.email}</p>
                  </button>
                )}
                {demoCoach && (
                  <button
                    type="button"
                    onClick={() => quickDemoLogin('coach')}
                    className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-left transition hover:border-[#1E4D3B] hover:bg-[#E9F3EE]"
                  >
                    <p className="text-xs font-bold text-[#1F2421]">🎾 {demoCoach.fullName}</p>
                    <p className="text-[11px] text-[#1E4D3B]">
                      Code : <strong>{demoCoach.coachCode}</strong>
                    </p>
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
