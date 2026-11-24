import { useState } from 'react';
import { CheckCircle2, Cloud, CloudOff, KeyRound, LogOut, RefreshCw, X } from 'lucide-react';
import { useTennisStore } from '../../lib/store';
import { getSupabaseConfig } from '../../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const {
    isCloudConfigured,
    supabaseUser,
    syncStatus,
    syncError,
    signInSupabase,
    signUpSupabase,
    signOutSupabase,
    configureSupabase,
    refreshFromCloud,
  } = useTennisStore();

  const existing = getSupabaseConfig();
  const [url, setUrl] = useState(existing?.url ?? '');
  const [anonKey, setAnonKey] = useState(existing?.anonKey ?? '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setFeedback('Merci de renseigner l’URL du projet et la clé publique (anon key).');
      return;
    }
    configureSupabase({ url: url.trim(), anonKey: anonKey.trim() });
    setFeedback('Configuration Supabase enregistrée ! Connecte-toi maintenant avec ton email.');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    const res =
      authTab === 'login'
        ? await signInSupabase(email.trim(), password)
        : await signUpSupabase(email.trim(), password);
    setLoading(false);
    if (res.error) {
      setFeedback(`Erreur : ${res.error}`);
    } else if (authTab === 'signup') {
      setFeedback(
        'Compte créé ! Vérifie ton email de confirmation (ou connecte-toi si la confirmation est désactivée dans Supabase).',
      );
    } else {
      setFeedback('Connecté ! Synchronisation en cours...');
      setTimeout(onClose, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="animate-pop-in max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E8DDD0] bg-[#FAF6F0] p-6 text-[#1F2421] shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E4D3B] text-white">
              {supabaseUser ? <Cloud className="h-5 w-5" /> : <CloudOff className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="parent-display text-xl font-bold">Synchronisation Cloud Supabase</h2>
              <p className="text-xs text-[#5C6660]">
                Synchronise temps réel ton téléphone Parent et la tablette de ta fille.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#5C6660] hover:bg-black/5"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Connected User State */}
        {supabaseUser && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold">Synchronisation active</p>
                  <p className="text-xs text-emerald-700">{supabaseUser.email}</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800">
                {syncStatus === 'synced' ? 'À jour' : syncStatus}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void refreshFromCloud()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#163A2C]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Forcer la synchro
              </button>
              <button
                type="button"
                onClick={() => void signOutSupabase()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
              >
                <LogOut className="h-3.5 w-3.5" />
                Déconnexion (revenir en local)
              </button>
            </div>
          </div>
        )}

        {syncError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <strong>Attention :</strong> {syncError}. Assure-toi d’avoir exécuté{' '}
            <code>supabase/schema.sql</code> dans ton projet Supabase.
          </div>
        )}

        {/* Step 1: Supabase Project Credentials */}
        <form onSubmit={handleSaveConfig} className="mb-5 rounded-2xl border border-[#E8DDD0] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#1E4D3B]">
              <KeyRound className="h-4 w-4" />
              1. Projet Supabase {isCloudConfigured && <span className="text-emerald-600">✓</span>}
            </h3>
            {isCloudConfigured && (
              <button
                type="button"
                onClick={() => {
                  configureSupabase(null);
                  setUrl('');
                  setAnonKey('');
                  setFeedback('Configuration cloud retirée. L’app fonctionne en Mode Local.');
                }}
                className="text-xs font-semibold text-[#C85A32] hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#5C6660]">
                Project URL (Supabase → Settings → API)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xxxxxxxx.supabase.co"
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#5C6660]">
                Clé publique Anon Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#F4EDE3] py-2 text-xs font-bold text-[#1F2421] transition hover:bg-[#E8DDD0]"
            >
              Enregistrer les clés Supabase
            </button>
          </div>
        </form>

        {/* Step 2: Parent Email/Password Auth */}
        {isCloudConfigured && !supabaseUser && (
          <form onSubmit={handleAuth} className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
            <div className="mb-3 flex gap-2 rounded-xl bg-[#FAF6F0] p-1">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  authTab === 'login' ? 'bg-white text-[#1E4D3B] shadow-xs' : 'text-[#5C6660]'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                  authTab === 'signup' ? 'bg-white text-[#1E4D3B] shadow-xs' : 'text-[#5C6660]'
                }`}
              >
                Créer compte famille
              </button>
            </div>
            <div className="space-y-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email du parent"
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (6 caractères min.)"
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#C85A32] py-2.5 text-sm font-bold text-white transition hover:bg-[#A54522] disabled:opacity-50"
              >
                {loading
                  ? 'Connexion...'
                  : authTab === 'login'
                    ? 'Connecter cet appareil'
                    : 'Créer mon compte famille'}
              </button>
            </div>
          </form>
        )}

        {feedback && (
          <p className="mt-3 rounded-xl bg-[#FEF7E6] px-3 py-2 text-xs font-semibold text-[#8A5A0A]">
            {feedback}
          </p>
        )}

        <p className="mt-4 text-center text-xs text-[#5C6660]">
          Sans configuration cloud, toutes tes modifications sont automatiquement sauvegardées sur
          cet appareil (Mode Démo Local).
        </p>
      </div>
    </div>
  );
}
