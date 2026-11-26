import { useState } from 'react';
import { Building2, Calendar, Plus, Save, Settings, Trash2, User } from 'lucide-react';
import { GALAXIE_LEVELS } from '../../data/galaxieCatalog';
import { useTennisStore } from '../../lib/store';
import type { BallLevel, UpcomingEvent } from '../../types/tennis';

interface ParentNotebookProps {
  onOpenSettings: () => void;
}

export function ParentNotebook({ onOpenSettings }: ParentNotebookProps) {
  const {
    state,
    activeChild,
    childEvents,
    updateChildProfile,
    assignChildClub,
    updateEquipmentInfo,
    addUpcomingEvent,
    deleteUpcomingEvent,
  } = useTennisStore();

  // Unified Child Sheet Form State (Identity + Ball + Club + Equipment)
  const [childName, setChildName] = useState(activeChild.name);
  const [childAge, setChildAge] = useState(activeChild.age);
  const [childBall, setChildBall] = useState<BallLevel>(activeChild.currentBall);
  const [selectedClubId, setSelectedClubId] = useState<string>(activeChild.clubId ?? '');
  const [equip, setEquip] = useState(activeChild.equipmentInfo);

  // Upcoming event form (independent list)
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evtTime, setEvtTime] = useState('14h00');
  const [evtType, setEvtType] = useState<UpcomingEvent['eventType']>('cours');
  const previewClub = state.clubs.find((c) => c.id === selectedClubId) ?? null;
  const [evtLocation, setEvtLocation] = useState(previewClub?.name || '');

  const [toast, setToast] = useState<string | null>(null);

  const hasUnsavedChanges =
    childName.trim() !== activeChild.name ||
    childAge !== activeChild.age ||
    childBall !== activeChild.currentBall ||
    (selectedClubId || undefined) !== activeChild.clubId ||
    JSON.stringify(equip) !== JSON.stringify(activeChild.equipmentInfo);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveChildSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    updateChildProfile({
      name: childName.trim(),
      age: childAge,
      currentBall: childBall,
    });
    assignChildClub(activeChild.id, selectedClubId || undefined);
    updateEquipmentInfo(equip);
    notify(`Fiche de ${childName.trim()} enregistrée !`);
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

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
            Fiche & Réglages de l’enfant
          </p>
          <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
            Carnet de {activeChild.name}
          </h1>
          <p className="mt-1 text-sm text-[#5C6660]">
            Identité, niveau de balle, club assigné, équipement et calendrier propres à{' '}
            {activeChild.name}.
          </p>
        </div>
        {toast && (
          <span className="animate-pop-in rounded-xl bg-[#1E4D3B] px-4 py-2 text-xs font-bold text-white shadow">
            ✓ {toast}
          </span>
        )}
      </div>

      {/* UNIFIED CHILD SHEET FORM (Single Save Button) */}
      <form onSubmit={handleSaveChildSheet} className="space-y-5">
        {/* Identity & Ball */}
        <section className="parent-card p-5">
          <h2 className="parent-display mb-3 flex items-center gap-2 text-lg font-bold text-[#1F2421]">
            <User className="h-5 w-5 text-[#C85A32]" />
            Identité & Niveau de balle
          </h2>
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="mb-1 block text-xs font-bold text-[#5C6660]">Prénom</label>
              <input
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Prénom"
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none focus:border-[#C85A32]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold text-[#5C6660]">Âge</label>
              <input
                type="number"
                min={3}
                max={18}
                value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none"
              />
            </div>
            <div className="md:col-span-5">
              <label className="mb-1 block text-xs font-bold text-[#5C6660]">
                Balle Galaxie actuelle
              </label>
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
            </div>
          </div>
        </section>

        {/* Assigned Club & Equipment 2-column */}
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="parent-card space-y-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="parent-display flex items-center gap-2 text-lg font-bold text-[#1E4D3B]">
                <Building2 className="h-5 w-5" />
                Club assigné
              </h2>
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#C85A32] hover:underline"
              >
                <Settings className="h-3.5 w-3.5" /> Gérer les clubs
              </button>
            </div>

            <select
              value={selectedClubId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedClubId(nextId);
                const chosen = state.clubs.find((c) => c.id === nextId);
                if (chosen) setEvtLocation(chosen.name);
              }}
              className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2.5 text-sm font-bold text-[#1F2421] outline-none focus:border-[#C85A32]"
            >
              <option value="">— Aucun club assigné —</option>
              {state.clubs.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  🏟️ {cl.name}
                </option>
              ))}
            </select>

            {previewClub ? (
              <div className="space-y-1.5 rounded-2xl border border-[#EFE6DA] bg-[#FAF6F0] p-4 text-xs">
                <p className="text-sm font-bold text-[#1F2421]">{previewClub.name}</p>
                {previewClub.coachName && (
                  <p className="text-[#1E4D3B]">
                    <strong>Coach :</strong> {previewClub.coachName}
                  </p>
                )}
                {previewClub.coachPhone && (
                  <p className="text-[#5C6660]">
                    <strong>Tél :</strong> {previewClub.coachPhone}
                  </p>
                )}
                {previewClub.coachEmail && (
                  <p className="text-[#5C6660]">
                    <strong>Email :</strong> {previewClub.coachEmail}
                  </p>
                )}
                {previewClub.schedule && (
                  <p className="text-[#5C6660]">
                    <strong>Horaires :</strong> {previewClub.schedule}
                  </p>
                )}
                {previewClub.courtSurface && (
                  <p className="text-[#5C6660]">
                    <strong>Surfaces :</strong> {previewClub.courtSurface}
                  </p>
                )}
              </div>
            ) : (
              <p className="rounded-2xl bg-[#FAF6F0] p-4 text-xs text-[#5C6660]">
                Sélectionne un club ci-dessus ou ajoute tes clubs dans{' '}
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="font-bold text-[#C85A32] underline"
                >
                  Réglages généraux
                </button>
                .
              </p>
            )}
          </section>

          <section className="parent-card space-y-3 p-5">
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
          </section>
        </div>

        {/* Single Unified Save Bar */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 transition ${
            hasUnsavedChanges
              ? 'border-[#C85A32] bg-[#FDF0EB]'
              : 'border-[#E8DDD0] bg-white'
          }`}
        >
          <p className="text-xs font-semibold text-[#5C6660]">
            {hasUnsavedChanges
              ? 'Tu as des modifications non enregistrées sur cette fiche.'
              : `La fiche de ${activeChild.name} est à jour.`}
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C85A32] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#A54522]"
          >
            <Save className="h-4 w-4" />
            Enregistrer la fiche de {childName.trim() || activeChild.name}
          </button>
        </div>
      </form>

      {/* Upcoming Events Calendar */}
      <section className="parent-card p-5">
        <h2 className="parent-display mb-3 flex items-center gap-2 text-lg font-bold text-[#1E4D3B]">
          <Calendar className="h-5 w-5" />
          Calendrier des prochains cours & plateaux de {activeChild.name}
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
            className="flex items-center justify-center rounded-xl bg-[#1E4D3B] px-3 py-2 text-xs font-bold text-white hover:bg-[#163A2C] md:col-span-1"
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
    </div>
  );
}
