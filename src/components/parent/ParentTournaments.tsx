import { useState } from 'react';
import { Award, Camera, ExternalLink, Film, Plus, Trash2, Upload } from 'lucide-react';
import { GALAXIE_LEVELS } from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { BallLevel } from '../../types/tennis';

export function ParentTournaments() {
  const {
    activeChild,
    childTournaments,
    childMemories,
    addTournament,
    deleteTournament,
    addMemory,
    deleteMemory,
  } = useTennisStore();

  // Plateau / Tournament Form
  const [tName, setTName] = useState('');
  const [tDate, setTDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tBall, setTBall] = useState<BallLevel>(activeChild.currentBall);
  const [tMatches, setTMatches] = useState(4);
  const [tLocation, setTLocation] = useState(activeChild.clubInfo.clubName || '');
  const [tHighlight, setTHighlight] = useState('');
  const [tPositives, setTPositives] = useState('');

  // Memory Form
  const [mTitle, setMTitle] = useState('');
  const [mDate, setMDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [mType, setMType] = useState<'photo' | 'video_link'>('photo');
  const [mCaption, setMCaption] = useState('');
  const [mTag, setMTag] = useState('Entraînement');
  const [mUrl, setMUrl] = useState('');
  const [mFile, setMFile] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  const handleAddTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim()) return;
    addTournament({
      name: tName.trim(),
      eventDate: tDate,
      ballLevel: tBall,
      matchesPlayed: tMatches,
      location: tLocation.trim(),
      highlight: tHighlight.trim(),
      positivePoints: tPositives.trim(),
    });
    fireStarCelebration();
    setTName('');
    setTHighlight('');
    setTPositives('');
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;
    setUploading(true);
    try {
      await addMemory({
        title: mTitle.trim(),
        memoryDate: mDate,
        caption: mCaption.trim(),
        mediaType: mType,
        mediaUrl: mUrl.trim() || undefined,
        file: mFile,
        tag: mTag,
      });
      setMTitle('');
      setMCaption('');
      setMUrl('');
      setMFile(undefined);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#C85A32]">
          Souvenirs & Petits Matchs sans pression
        </p>
        <h1 className="parent-display mt-0.5 text-3xl font-bold text-[#1F2421]">
          Plateaux Galaxie & Galerie Souvenirs
        </h1>
        <p className="mt-1 text-sm text-[#5C6660]">
          Conserve les plus beaux moments des plateaux Galaxie et les photos/vidéos pour voir sa
          progression au fil des mois.
        </p>
      </div>

      {/* SECTION 1: PLATEAUX & PETITS MATCHS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#C85A32]" />
          <h2 className="parent-display text-xl font-bold text-[#1F2421]">
            Plateaux & Tournois Galaxie
          </h2>
        </div>

        <form onSubmit={handleAddTournament} className="parent-card p-5">
          <h3 className="mb-3 text-sm font-bold text-[#1E4D3B]">
            + Enregistrer un plateau (+20 ⭐ pour {activeChild.name})
          </h3>
          <div className="grid gap-3 md:grid-cols-4">
            <input
              type="text"
              required
              value={tName}
              onChange={(e) => setTName(e.target.value)}
              placeholder="Nom (ex : Plateau Galaxie Rouge)"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32] md:col-span-2"
            />
            <input
              type="date"
              value={tDate}
              onChange={(e) => setTDate(e.target.value)}
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
            <select
              value={tBall}
              onChange={(e) => setTBall(e.target.value as BallLevel)}
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none"
            >
              {GALAXIE_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.emoji} {l.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={tLocation}
              onChange={(e) => setTLocation(e.target.value)}
              placeholder="Club / Lieu"
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none md:col-span-2"
            />
            <div className="flex items-center gap-2 rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-xs">
              <span className="font-semibold text-[#5C6660]">Matchs joués :</span>
              <input
                type="number"
                min={1}
                max={20}
                value={tMatches}
                onChange={(e) => setTMatches(Number(e.target.value))}
                className="w-14 bg-transparent font-bold text-[#1F2421] outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#C85A32] px-4 py-2 text-sm font-bold text-white hover:bg-[#A54522]"
            >
              <Plus className="h-4 w-4" /> Enregistrer
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={tHighlight}
              onChange={(e) => setTHighlight(e.target.value)}
              placeholder="Meilleur souvenir / moment fort..."
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
            />
            <input
              type="text"
              value={tPositives}
              onChange={(e) => setTPositives(e.target.value)}
              placeholder="Points positifs & attitude (fair-play, plaisir)..."
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
            />
          </div>
        </form>

        <div className="grid gap-3 md:grid-cols-2">
          {childTournaments.map((t) => {
            const ball = GALAXIE_LEVELS.find((l) => l.id === t.ballLevel);
            return (
              <div key={t.id} className="parent-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#FAF6F0] px-2.5 py-0.5 text-xs font-bold">
                        {ball?.emoji} {ball?.name}
                      </span>
                      <span className="text-xs text-[#5C6660]">
                        {new Date(t.eventDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-bold text-[#1F2421]">{t.name}</h3>
                    <p className="text-xs text-[#5C6660]">
                      {t.location} • <strong>{t.matchesPlayed} matchs joués</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTournament(t.id)}
                    className="rounded-lg p-1 text-[#9C948A] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {t.highlight && (
                  <p className="mt-2.5 rounded-xl bg-[#FEF7E6] px-3 py-2 text-xs font-semibold text-[#8A5A0A]">
                    ⭐ {t.highlight}
                  </p>
                )}
                {t.positivePoints && (
                  <p className="mt-2 text-xs text-[#5C6660]">{t.positivePoints}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: MEMORIES PHOTO/VIDEO GALLERY */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-[#1E4D3B]" />
          <h2 className="parent-display text-xl font-bold text-[#1F2421]">
            Galerie Souvenirs (Photos & Vidéos)
          </h2>
        </div>

        <form onSubmit={handleAddMemory} className="parent-card p-5">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMType('photo')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold ${
                mType === 'photo'
                  ? 'bg-[#1E4D3B] text-white'
                  : 'border border-[#E8DDD0] bg-[#FAF6F0] text-[#5C6660]'
              }`}
            >
              <Upload className="h-3.5 w-3.5" /> Photo (fichier ou URL)
            </button>
            <button
              type="button"
              onClick={() => setMType('video_link')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold ${
                mType === 'video_link'
                  ? 'bg-[#1E4D3B] text-white'
                  : 'border border-[#E8DDD0] bg-[#FAF6F0] text-[#5C6660]'
              }`}
            >
              <Film className="h-3.5 w-3.5" /> Lien vidéo (YouTube / Drive)
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              type="text"
              required
              value={mTitle}
              onChange={(e) => setMTitle(e.target.value)}
              placeholder="Titre du souvenir..."
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
            />
            <input
              type="date"
              value={mDate}
              onChange={(e) => setMDate(e.target.value)}
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none"
            />
            <select
              value={mTag}
              onChange={(e) => setMTag(e.target.value)}
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm font-semibold outline-none"
            >
              <option value="Entraînement">Entraînement</option>
              <option value="Plateau Galaxie">Plateau Galaxie</option>
              <option value="Coup droit / Service">Coup droit / Service</option>
              <option value="En famille">En famille</option>
              <option value="Trophée">Trophée</option>
            </select>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {mType === 'photo' ? (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D8CBB9] bg-[#FAF6F0] px-4 py-2.5 text-xs font-semibold text-[#5C6660] hover:border-[#C85A32]">
                <Upload className="h-4 w-4 text-[#C85A32]" />
                {mFile ? mFile.name : 'Choisir une photo depuis ton appareil'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setMFile(e.target.files?.[0])}
                />
              </label>
            ) : (
              <input
                type="url"
                required
                value={mUrl}
                onChange={(e) => setMUrl(e.target.value)}
                placeholder="https://youtu.be/... ou lien Google Drive"
                className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
              />
            )}
            <input
              type="text"
              value={mCaption}
              onChange={(e) => setMCaption(e.target.value)}
              placeholder="Légende / petit souvenir..."
              className="rounded-xl border border-[#E8DDD0] bg-[#FAF6F0] px-3 py-2 text-sm outline-none focus:border-[#C85A32]"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#1E4D3B] px-4 py-2 text-sm font-bold text-white hover:bg-[#163A2C] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {uploading ? 'Envoi en cours...' : 'Ajouter à la galerie'}
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {childMemories.map((mem) => (
            <div key={mem.id} className="parent-card overflow-hidden">
              {mem.mediaType === 'photo' ? (
                <img
                  src={mem.mediaUrl}
                  alt={mem.title}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 flex-col items-center justify-center bg-[#FAF6F0] p-4 text-center">
                  <Film className="h-8 w-8 text-[#C85A32]" />
                  <a
                    href={mem.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1E4D3B] hover:underline"
                  >
                    Ouvrir la vidéo <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#FDF0EB] px-2.5 py-0.5 text-[11px] font-bold text-[#C85A32]">
                    {mem.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteMemory(mem.id)}
                    className="rounded p-1 text-[#9C948A] hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h3 className="mt-1.5 font-bold text-[#1F2421]">{mem.title}</h3>
                <p className="text-[11px] text-[#5C6660]">
                  {new Date(mem.memoryDate).toLocaleDateString('fr-FR')}
                </p>
                {mem.caption && <p className="mt-1 text-xs text-[#5C6660]">{mem.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
