import { BADGE_CATALOG } from '../data/galaxieCatalog';
import type {
  Challenge,
  ChildProfile,
  MemoryItem,
  QuizAttempt,
  TournamentEntry,
  TrainingSession,
} from '../types/tennis';

export function computeUnlockedBadgeIds(params: {
  child: ChildProfile;
  sessions: TrainingSession[];
  challenges: Challenge[];
  tournaments: TournamentEntry[];
  memories: MemoryItem[];
  quizAttempts: QuizAttempt[];
}): Set<string> {
  const { child, sessions, challenges, tournaments, memories, quizAttempts } = params;
  const unlocked = new Set<string>();

  if (sessions.length >= 1) unlocked.add('first-session');
  if (child.streakCount >= 3 || sessions.length >= 3) unlocked.add('streak-3');
  if (sessions.length >= 5) unlocked.add('five-sessions');

  const completedChallenges = challenges.filter((c) => c.status === 'completed');
  if (completedChallenges.length >= 2) unlocked.add('challenge-hero');

  if (quizAttempts.some((q) => q.score >= 4)) unlocked.add('quiz-whiz');
  if (sessions.some((s) => Boolean(s.childMood))) unlocked.add('mood-sharer');
  if (tournaments.length >= 1 || sessions.some((s) => s.sessionType === 'plateau')) {
    unlocked.add('plateau-star');
  }
  if (child.totalStarsEarned >= 100) unlocked.add('star-collector');
  if (child.milestonesCompleted.length >= 5) unlocked.add('milestone-5');
  if (child.unlockedItems.length > 5) unlocked.add('fashion-pro');
  if (memories.length >= 1) unlocked.add('memory-keeper');

  const serviceEntry = child.skillLevels.service;
  const fhEntry = child.skillLevels.coup_droit;
  if (
    serviceEntry?.status === 'acquis' ||
    fhEntry?.status === 'acquis' ||
    (serviceEntry?.level ?? 0) >= 4 ||
    (fhEntry?.level ?? 0) >= 4
  ) {
    unlocked.add('service-ace');
  }

  // Ensure all IDs exist in catalog
  const validIds = new Set(BADGE_CATALOG.map((b) => b.id));
  for (const id of unlocked) {
    if (!validIds.has(id)) unlocked.delete(id);
  }
  return unlocked;
}
