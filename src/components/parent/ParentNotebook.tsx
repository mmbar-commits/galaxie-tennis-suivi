import { useState } from 'react';
import {
  Calendar,
  Cloud,
  Download,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Shield,
  Trash2,
  Upload,
  UserPlus,
} from 'lucide-react';
import { GALAXIE_LEVELS } from '../../data/galaxieCatalog';
import { useTennisStore } from '../../lib/store';
import type { BallLevel, UpcomingEvent } from '../../types/tennis';

interface ParentNotebookProps {
  onOpenAuthModal: () => void;
}

export function ParentNotebook({ onOpenAuthModal }: ParentNotebookProps) {
  const {
    state,
    activeChild,
    childEvents,
    supabaseUser,
    updateChildProfile,
    updateClubInfo,
    updateEquipmentInfo,
    addUpcomingEvent,
    deleteUpcomingEvent,
    addChild,
    updateParentPin,
    setTabletLocked,
    exportJson,
    importJson,
    resetDemoData,
  } = useTennisStore();

  // Profile form
  const [childName, setChildName] = useState(activeChild.name);
  const [childAge, setChildAge] = useState(activeChild.age);
  const [childBall, setChildBall] = useState<BallLevel>(activeChild.currentBall);

  // Club & Equipment
  const [club, setClub] = useState(activeChild.clubInfo);
  const [equip, setEquip] = useState(activeChild.equipmentInfo);

  // Upcoming event form
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evtTime, setEvtTime] = useState('14h00');
  const [evtType, setEvtType] = useState<UpcomingEvent['eventType']>('cours');
  const [evtLocation, setEvtLocation] = useState(activeChild.clubInfo.clubName || '');

  // Add another child
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(6);
  const [newChildBall, setNewChildBall] = useState<BallLevel>('violet');

  // PIN
  const [pinDraft, setPinDraft] = useState(state.parentPin);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    updateChildProfile({ name: childName.trim(), age: childAge, currentBall: childBall });
    notify('Profil mis à jour !');
  };

  const handleSaveClub = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubInfo(club);
    notify('Infos club & coach enregistrées !');
  };

  const handleSaveEquip = (e: React.FormEvent) => {
    e.preventDefault();
    updateEquipmentInfo(equip);
    notify('Matériel enregistré !');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;
    addUpcomingEvent({
      title: evtTitle.trim(),
      eventDate: evtDate,
      eventTime: evtTime.trim(),
      eventType: evtType,
      location: evtLocation.trim(),
      notes: '',
    });
    setEvtTitle('');
    notify('Rendez-vous ajouté au calendrier !');
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;
    addChild({ name: newChildName.trim(), age: newChildAge, currentBall: newChildBall });
    setNewChildName('');
    notify(`Profil de ${newChildName.trim()} créé !`);
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
            Organisation & Réglages Famille
          </p>
          <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
            Carnet Pratique & Paramètres
          </h1>
        </div>
        {toast && (
          <span className="animate-pop-in rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white shadow">
            ✓ {toast}
          </span>
        )}
      </div>

      {/* Upcoming Events Calendar */}
      <section className="parent-card p-5">
        <h2 className="parent-display mb-3 flex items-center gap-2 text-lg font-bold text-[#1E4D3B]">
          <Calendar className="h-5 w-5" />
          Calendrier des prochains cours & plateaux
        </h2>
        <form onSubmit={handleAddEvent} className="grid gap-2.5 md:grid-cols-12">
          <input
            type="text"
            required
            value={evtTitle}
            onChange={(e) => setEvtTitle(e.target.value)}
            placeholder="Ex : Cours Galaxie Rouge, Plateau..."
            className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32] md:col-span-4"
          />
          <input
            type="date"
            value={evtDate}
            onChange={(e) => setEvtDate(e.target.value)}
            className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none md:col-span-2"
          />
          <input
            type="text"
            value={evtTime}
            onChange={(e) => setEvtTime(e.target.value)}
            placeholder="14h00"
            className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none md:col-span-1"
          />
          <select
            value={evtType}
            onChange={(e) => setEvtType(e.target.value as UpcomingEvent['eventType'])}
            className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-2.5 py-2 text-xs font-semibold outline-none md:col-span-2"
          >
            <option value="cours">Cours</option>
            <option value="plateau">Plateau</option>
            <option value="stage">Stage</option>
            <option value="autre">Autre</option>
          </select>
          <input
            type="text"
            value={evtLocation}
            onChange={(e) => setEvtLocation(e.target.value)}
            placeholder="Lieu"
            className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none md:col-span-2"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-[#C85A32] px-3 py-2 text-xs font-bold text-white hover:bg-[#A54522] md:col-span-1"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {childEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-3.5 py-2.5"
            >
              <div>
                <p className="text-sm font-bold text-[#1F2421]">{evt.title}</p>
                <p className="text-xs text-[#5C6660]">
                  {new Date(evt.eventDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                  {evt.eventTime ? ` • ${evt.eventTime}` : ''}
                  {evt.location ? ` • ${evt.location}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteUpcomingEvent(evt.id)}
                className="rounded-lg p-1.5 text-[#9C948A] hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Club & Equipment 2-column */}
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSaveClub} className="parent-card space-y-3 p-5">
          <h2 className="parent-display text-lg font-bold text-[#1E4D3B]">
            🏟️ Club & Coordonnées Coach
          </h2>
          <input
            type="text"
            value={club.clubName}
            onChange={(e) => setClub({ ...club, clubName: e.target.value })}
            placeholder="Nom du club"
            className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              value={club.coachName}
              onChange={(e) => setClub({ ...club, coachName: e.target.value })}
              placeholder="Prénom / Nom du coach"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
            <input
              type="text"
              value={club.coachPhone}
              onChange={(e) => setClub({ ...club, coachPhone: e.target.value })}
              placeholder="Téléphone coach"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
          </div>
          <input
            type="email"
            value={club.coachEmail}
            onChange={(e) => setClub({ ...club, coachEmail: e.target.value })}
            placeholder="Email coach"
            className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
          />
          <input
            type="text"
            value={club.schedule}
            onChange={(e) => setClub({ ...club, schedule: e.target.value })}
            placeholder="Horaires habituels des cours"
            className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
          >
            <Save className="h-3.5 w-3.5" /> Enregistrer club
          </button>
        </form>

        <form onSubmit={handleSaveEquip} className="parent-card space-y-3 p-5">
          <h2 className="parent-display text-lg font-bold text-[#1E4D3B]">
            🎾 Équipement & Raquette
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              value={equip.racketModel}
              onChange={(e) => setEquip({ ...equip, racketModel: e.target.value })}
              placeholder="Modèle de raquette"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
            <input
              type="text"
              value={equip.racketSize}
              onChange={(e) => setEquip({ ...equip, racketSize: e.target.value })}
              placeholder="Taille (ex : 23 pouces)"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              value={equip.gripColor}
              onChange={(e) => setEquip({ ...equip, gripColor: e.target.value })}
              placeholder="Couleur grip / surgrip"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
            <input
              type="text"
              value={equip.shoeSize}
              onChange={(e) => setEquip({ ...equip, shoeSize: e.target.value })}
              placeholder="Pointure chaussures"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
          </div>
          <textarea
            rows={2}
            value={equip.notes}
            onChange={(e) => setEquip({ ...equip, notes: e.target.value })}
            placeholder="Mémo taille, cordage, prochaine raquette..."
            className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
          >
            <Save className="h-3.5 w-3.5" /> Enregistrer matériel
          </button>
        </form>
      </div>

      {/* Profile, Multi-Child & Security Settings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          {/* Edit Active Child */}
          <form onSubmit={handleSaveProfile} className="parent-card space-y-3 p-5">
            <h2 className="parent-display text-lg font-bold text-[#1F2421]">
              👤 Profil de {activeChild.name}
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              <input
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Prénom"
                className="col-span-2 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none focus:border-[#C85A32]"
              />
              <input
                type="number"
                min={3}
                max={18}
                value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none"
              />
            </div>
            <select
              value={childBall}
              onChange={(e) => setChildBall(e.target.value as BallLevel)}
              className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none"
            >
              {GALAXIE_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.emoji} {l.name} — {l.ageHint}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-[#C85A32] px-4 py-2 text-xs font-bold text-white hover:bg-[#A54522]"
            >
              Mettre à jour le profil
            </button>
          </form>

          {/* Add another child */}
          <form onSubmit={handleAddChild} className="parent-card space-y-3 p-5">
            <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1F2421]">
              <UserPlus className="h-4 w-4 text-[#1E4D3B]" />
              Ajouter un autre enfant (frère / sœur)
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                required
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Prénom"
                className="col-span-2 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
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
        </div>

        {/* Security, Cloud & Backup */}
        <div className="parent-card space-y-5 p-5">
          <div>
            <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1F2421]">
              <Shield className="h-5 w-5 text-[#C85A32]" />
              Sécurité Parent & Mode Tablette
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                pattern="\d{4}"
                value={pinDraft}
                onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-28 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-center text-sm font-bold tracking-widest outline-none"
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
                className="rounded-xl bg-[#1F2421] px-4 py-2 text-xs font-bold text-white"
              >
                Changer PIN
              </button>
            </div>
            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-[#EFE6DA] bg-[#FAF6F0] px-3.5 py-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-[#1F2421]">
                  <Lock className="h-4 w-4 text-[#C85A32]" />
                  Mode « Tablette Enfant »
                </p>
                <p className="text-xs text-[#5C6660]">
                  Ouvre toujours cet appareil sur l’espace de {activeChild.name} (PIN requis pour
                  sortir).
                </p>
              </div>
              <input
                type="checkbox"
                checked={state.tabletLocked}
                onChange={(e) => setTabletLocked(e.target.checked)}
                className="h-5 w-5 accent-[#C85A32]"
              />
            </label>
          </div>

          <div className="border-t border-[#EFE6DA] pt-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[#1E4D3B]">
              <Cloud className="h-4 w-4" />
              Synchronisation Cloud Supabase
            </h3>
            <p className="mt-1 text-xs text-[#5C6660]">
              {supabaseUser
                ? `Connecté avec ${supabaseUser.email} — synchro temps réel active.`
                : 'Actuellement en Mode Démo Local. Connecte Supabase pour synchroniser téléphone & tablette.'}
            </p>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="mt-2.5 rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#163A2C]"
            >
              {supabaseUser ? 'Gérer la synchro Cloud' : 'Configurer Supabase Cloud'}
            </button>
          </div>

          <div className="border-t border-[#EFE6DA] pt-4">
            <h3 className="text-sm font-bold text-[#1F2421]">Sauvegarde & Données</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-bold text-[#1F2421] hover:bg-[#EFE6DB]"
              >
                <Download className="h-3.5 w-3.5" /> Exporter JSON
              </button>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs font-bold text-[#1F2421] hover:bg-[#EFE6DB]">
                <Upload className="h-3.5 w-3.5" /> Importer JSON
                <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
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
        </div>
      </div>
    </div>
  );
}
