import { Camera, ExternalLink, Lock, Trophy } from 'lucide-react';
import { BADGE_CATALOG } from '../../data/galaxieCatalog';
import { computeUnlockedBadgeIds } from '../../lib/badges';
import { useTennisStore } from '../../lib/store';

export function ChildTrophies() {
  const {
    activeChild,
    childSessions,
    childChallenges,
    childTournaments,
    childMemories,
    childQuizAttempts,
  } = useTennisStore();

  const unlocked = computeUnlockedBadgeIds({
    child: activeChild,
    sessions: childSessions,
    challenges: childChallenges,
    tournaments: childTournaments,
    memories: childMemories,
    quizAttempts: childQuizAttempts,
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Trophy Shelf Header */}
      <section className="child-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="child-display text-2xl font-bold sm:text-3xl">
              🏆 Ma Vitrine à Trophées
            </h1>
            <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
              Collectionne tous les badges en jouant au tennis, en relevant des défis et en faisant
              des quiz !
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#FFF3CC] px-4 py-2 text-base font-extrabold text-[#9A6700]">
            <Trophy className="h-5 w-5 text-[#E09F1F]" />
            {unlocked.size} / {BADGE_CATALOG.length}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BADGE_CATALOG.map((badge) => {
            const isUnlocked = unlocked.has(badge.id);
            return (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center rounded-3xl border-2 p-4 text-center transition ${
                  isUnlocked
                    ? 'border-[#F4D38B] bg-gradient-to-b from-[#FFFDF7] to-[#FFF6DF] shadow-sm'
                    : 'border-[#EAE4DD] bg-[#F8F6F4] opacity-70'
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-inner ${
                    isUnlocked ? 'bg-white' : 'bg-[#EDE9E4] grayscale'
                  }`}
                >
                  {badge.emoji}
                </div>
                {!isUnlocked && (
                  <span className="absolute right-3 top-3 rounded-full bg-white p-1 text-[#8D8596] shadow-xs">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                )}
                <h2 className="child-display mt-2.5 text-base font-bold leading-tight">
                  {badge.title}
                </h2>
                <p className="mt-1 text-xs font-semibold leading-snug" style={{ color: 'var(--c-ink-soft)' }}>
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Kid-Friendly Photo & Video Memories */}
      <section className="child-card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Camera className="h-6 w-6 text-[#EE6C4D]" />
          <h2 className="child-display text-2xl font-bold">📸 Mes Souvenirs de Tennis</h2>
        </div>

        {childMemories.length === 0 ? (
          <div className="rounded-3xl bg-[#FFF8EE] p-6 text-center">
            <p className="text-3xl">📷</p>
            <p className="child-display mt-2 text-lg font-bold">Pas encore de photos ici !</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
              Papa ou Maman peut ajouter des photos de tes entraînements et plateaux.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {childMemories.map((mem) => (
              <div
                key={mem.id}
                className="overflow-hidden rounded-3xl border-2 border-[var(--c-border)] bg-white shadow-xs"
              >
                {mem.mediaType === 'photo' ? (
                  <img
                    src={mem.mediaUrl}
                    alt={mem.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 flex-col items-center justify-center bg-[#FFF4E6] p-4 text-center">
                    <span className="text-4xl">🎬</span>
                    <a
                      href={mem.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#EE6C4D] px-4 py-2 text-xs font-extrabold text-white"
                    >
                      Voir la vidéo <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#FFF3CC] px-2.5 py-0.5 text-[11px] font-extrabold text-[#9A6700]">
                      {mem.tag}
                    </span>
                    <span className="text-xs font-bold" style={{ color: 'var(--c-ink-soft)' }}>
                      {new Date(mem.memoryDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <h3 className="child-display mt-2 text-lg font-bold">{mem.title}</h3>
                  {mem.caption && (
                    <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--c-ink-soft)' }}>
                      {mem.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
