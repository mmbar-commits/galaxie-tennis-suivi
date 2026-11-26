import { useState } from 'react';
import {
  Check,
  Cloud,
  Download,
  Home,
  Lock,
  RotateCcw,
  Shield,
  Upload,
  UserPlus,
  Users,
} from 'lucide-react';
import { GALAXIE_LEVELS } from '../../data/galaxieCatalog';
import { useTennisStore } from '../../lib/store';
import type { BallLevel } from '../../types/tennis';

interface ParentSettingsProps {
  onOpenAuthModal: () => void;
}

export function ParentSettings({ onOpenAuthModal }: ParentSettingsProps) {
  const {
    state,
    activeChild,
    supabaseUser,
    setActiveChildId,
    addChild,
    updateFamilyName,
    updateParentPin,
    setTabletLocked,
    exportJson,
    importJson,
    resetDemoData,
  } = useTennisStore();

  const [familyNameDraft, setFamilyNameDraft] = useState(state.familyName);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(6);
  const [newChildBall, setNewChildBall] = useState<BallLevel>('violet');
  const [pinDraft, setPinDraft] = useState(state.parentPin);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveFamilyName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyNameDraft.trim()) return;
    updateFamilyName(familyNameDraft.trim());
    notify('Nom de la famille enregistré !');
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    const createdName = newChildName.trim();
    addChild({ name: createdName, age: newChildAge, currentBall: newChildBall });
    setNewChildName('');
    notify(`Profil de ${createdName} créé et sélectionné !`);
  };

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galaxie-tennis-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importJson(String(reader.result || ''));
      notify(res.ok ? 'Sauvegarde restaurée avec succès !' : res.error || 'Erreur d’import.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
            Administration Globale • Famille & Appareils
          </p>
          <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
            Réglages Généraux
          </h1>
          <p className="mt-1 text-sm text-[#5C6660]">
            Ces paramètres s’appliquent à toute l’application (famille, sécurité PIN, cloud et
            sauvegardes).
          </p>
        </div>
        {toast && (
          <span className="animate-pop-in rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white shadow">
            ✓ {toast}
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Family & Children management */}
        <div className="space-y-5">
          <form onSubmit={handleSaveFamilyName} className="parent-card space-y-3 p-5">
            <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1E4D3B]">
              <Home className="h-4 w-4" />
              Espace Famille
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={familyNameDraft}
                onChange={(e) => setFamilyNameDraft(e.target.value)}
                placeholder="Nom de la famille"
                className="flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none focus:border-[#C85A32]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
              >
                Enregistrer
              </button>
            </div>
          </form>

          <section className="parent-card space-y-4 p-5">
            <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1F2421]">
              <Users className="h-4 w-4 text-[#C85A32]" />
              Enfants suivis ({state.children.length})
            </h2>
            <div className="space-y-2">
              {state.children.map((c) => {
                const ball = GALAXIE_LEVELS.find((l) => l.id === c.currentBall);
                const isSelected = c.id === activeChild.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveChildId(c.id);
                      notify(`Suivi basculé sur ${c.name}.`);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition ${
                      isSelected
                        ? 'border-[#C85A32] bg-[#FDF0EB]'
                        : 'border-[#EFE6DA] bg-[#FAF6F0] hover:bg-white'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-[#1F2421]">
                        {c.name}, {c.age} ans
                      </p>
                      <p className="text-xs text-[#5C6660]">
                        {ball?.emoji} {ball?.name} • {c.starsBalance} ⭐ disponibles
                      </p>
                    </div>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#C85A32] px-2.5 py-0.5 text-[11px] font-bold text-white">
                        <Check className="h-3 w-3" /> Actif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={handleAddChild}
              className="space-y-2.5 border-t border-[#EFE6DA] pt-4"
            >
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5C6660]">
                <UserPlus className="h-3.5 w-3.5 text-[#1E4D3B]" />
                Ajouter un autre enfant (frère / sœur)
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="Prénom"
                  className="col-span-2 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
                />
                <input
                  type="number"
                  min={3}
                  max={18}
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(Number(e.target.value))}
                  className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newChildBall}
                  onChange={(e) => setNewChildBall(e.target.value as BallLevel)}
                  className="flex-1 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-semibold outline-none"
                >
                  {GALAXIE_LEVELS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.emoji} {l.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
                >
                  + Ajouter
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Security, Cloud & Backup */}
        <div className="space-y-5">
          <section className="parent-card space-y-4 p-5">
            <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1F2421]">
              <Shield className="h-5 w-5 text-[#C85A32]" />
              Sécurité Parent & Mode Tablette
            </h2>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#5C6660]">
                Code PIN Parent (4 chiffres pour quitter la vue Enfant)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  pattern="\d{4}"
                  value={pinDraft}
                  onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-28 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-center text-sm font-bold tracking-widest outline-none focus:border-[#C85A32]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (pinDraft.length === 4) {
                      updateParentPin(pinDraft);
                      notify('Code PIN mis à jour !');
                    } else {
                      notify('Le code PIN doit contenir exactement 4 chiffres.');
                    }
                  }}
                  className="rounded-xl bg-[#1F2421] px-4 py-2 text-xs font-bold text-white hover:bg-black"
                >
                  Changer PIN
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-3.5 py-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#1F2421]">
                  <Lock className="h-4 w-4 text-[#C85A32]" />
                  Mode « Tablette Enfant » sur cet appareil
                </p>
                <p className="text-xs text-[#5C6660]">
                  Ouvre toujours cet appareil sur la vue Enfant (code PIN requis pour revenir en
                  gestion Parent).
                </p>
              </div>
              <input
                type="checkbox"
                checked={state.tabletLocked}
                onChange={(e) => {
                  setTabletLocked(e.target.checked);
                  notify(
                    e.target.checked
                      ? 'Mode Tablette Enfant activé pour cet appareil.'
                      : 'Mode Tablette Enfant désactivé.',
                  );
                }}
                className="h-5 w-5 accent-[#C85A32]"
              />
            </label>
          </section>

          <section className="parent-card space-y-4 p-5">
            <div>
              <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1E4D3B]">
                <Cloud className="h-5 w-5" />
                Synchronisation Cloud Supabase
              </h2>
              <p className="mt-1 text-xs text-[#5C6660]">
                {supabaseUser
                  ? `Connecté avec ${supabaseUser.email} — synchronisation temps réel active entre vos appareils.`
                  : 'Actuellement en Mode Démo Local. Connecte Supabase pour synchroniser ton téléphone et la tablette.'}
              </p>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="mt-3 rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
              >
                {supabaseUser ? 'Gérer la synchro Cloud' : 'Configurer Supabase Cloud'}
              </button>
            </div>

            <div className="border-t border-[#EFE6DA] pt-4">
              <h3 className="text-sm font-bold text-[#1F2421]">Sauvegarde & Données globales</h3>
              <p className="mt-0.5 text-xs text-[#5C6660]">
                Exporte ou restaure l’ensemble des profils, séances et souvenirs au format JSON.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-bold text-[#1F2421] hover:bg-[#EFE6DB]"
                >
                  <Download className="h-3.5 w-3.5" /> Exporter JSON
                </button>
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-bold text-[#1F2421] hover:bg-[#EFE6DB]">
                  <Upload className="h-3.5 w-3.5" /> Importer JSON
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleImport}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Réinitialiser les données de démonstration locales ?')) {
                      resetDemoData();
                      notify('Données de démo restaurées.');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser démo
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
