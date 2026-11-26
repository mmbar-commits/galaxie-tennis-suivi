export type BallLevel = 'blanc' | 'violet' | 'rouge' | 'orange' | 'vert';

export type ChildTheme = 'terre-battue' | 'galaxie' | 'gazon';

export type AppMode = 'child' | 'parent' | 'coach';

export type TtcaAxis = 'technique' | 'tactique' | 'comportement' | 'arbitrage';

export type AcquisitionStatus = 'non_evalue' | 'en_cours' | 'acquis';

export type SkillKey =
  | 'coup_droit'
  | 'revers'
  | 'service'
  | 'volee'
  | 'deplacements'
  | 'mental';

export type SessionType = 'cours_club' | 'jeu_famille' | 'stage' | 'plateau';

export type ChildMood = 'adore' | 'fiere' | 'rigolo' | 'fatiguee' | 'difficile';

export interface AvatarConfig {
  skinColor: string;
  hairStyle: 'ponytail' | 'bob' | 'braids' | 'bun';
  hairColor: string;
  outfitColor: string;
  headband: 'none' | 'coral' | 'gold' | 'star' | 'visor';
  racket: 'classic' | 'rainbow' | 'star_pro' | 'clay_champ';
  companion: 'none' | 'ball_buddy' | 'puppy' | 'star_cat' | 'trophy_owl';
}

export interface ClubInfo {
  clubName: string;
  coachName: string;
  coachPhone: string;
  coachEmail: string;
  schedule: string;
  courtSurface: string;
}

export interface Club {
  id: string;
  name: string;
  coachName: string;
  coachPhone: string;
  coachEmail: string;
  schedule: string;
  courtSurface: string;
  address: string;
}

export interface StudioChallengeTemplate {
  id: string;
  title: string;
  description: string;
  category: 'technique' | 'echanges' | 'service' | 'fairplay' | 'jeu';
  starsReward: number;
}

export interface StudioRewardTemplate {
  id: string;
  title: string;
  description: string;
  emoji: string;
  starCost: number;
}

export interface EquipmentInfo {
  racketModel: string;
  racketSize: string;
  gripColor: string;
  shoeSize: string;
  notes: string;
}

export interface MilestoneEvaluation {
  status: AcquisitionStatus;
  validatedBy?: 'coach' | 'parent';
  validatorName?: string;
  note?: string;
  updatedAt: string;
}

export interface SkillEntry {
  status: AcquisitionStatus;
  level: number; // Derived numeric helper (1=non_evalue, 3=en_cours, 5=acquis) for visual radar
  note: string;
  validatedBy?: 'coach' | 'parent';
  validatorName?: string;
  updatedAt: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  currentBall: BallLevel;
  clubId?: string;
  starsBalance: number;
  totalStarsEarned: number;
  streakCount: number;
  childTheme: ChildTheme;
  avatarConfig: AvatarConfig;
  unlockedItems: string[];
  milestonesCompleted: string[];
  milestoneEvaluations: Record<string, MilestoneEvaluation>;
  skillLevels: Record<SkillKey, SkillEntry>;
  clubInfo: ClubInfo;
  equipmentInfo: EquipmentInfo;
  createdAt: string;
}

export interface TrainingSession {
  id: string;
  childId: string;
  clubId?: string;
  sessionDate: string; // YYYY-MM-DD
  sessionType: SessionType;
  durationMin: number;
  focusSkills: SkillKey[];
  effortRating: number; // 1 to 5
  starsAwarded: number;
  coachNote: string;
  parentNote: string;
  childMood?: ChildMood;
  childFavoriteMoment?: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  childId: string;
  templateId?: string;
  title: string;
  description: string;
  category: 'technique' | 'echanges' | 'service' | 'fairplay' | 'jeu';
  starsReward: number;
  status: 'active' | 'pending_approval' | 'completed';
  weekLabel: string;
  parentFeedback?: string;
  requestedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface TournamentEntry {
  id: string;
  childId: string;
  name: string;
  eventDate: string;
  ballLevel: BallLevel;
  matchesPlayed: number;
  highlight: string;
  positivePoints: string;
  location: string;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  childId: string;
  templateId?: string;
  title: string;
  description: string;
  emoji: string;
  starCost: number;
  active: boolean;
}

export interface RewardRedemption {
  id: string;
  childId: string;
  rewardId: string;
  rewardTitle: string;
  rewardEmoji: string;
  starCost: number;
  status: 'pending' | 'delivered' | 'declined';
  requestedAt: string;
  deliveredAt?: string;
}

export interface MemoryItem {
  id: string;
  childId: string;
  title: string;
  memoryDate: string;
  caption: string;
  mediaType: 'photo' | 'video_link';
  mediaUrl: string;
  storagePath?: string;
  tag: string;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  childId: string;
  attemptDate: string; // YYYY-MM-DD
  score: number;
  totalQuestions: number;
  starsEarned: number;
  createdAt: string;
}

export interface UpcomingEvent {
  id: string;
  childId: string;
  title: string;
  eventDate: string;
  eventTime: string;
  eventType: 'cours' | 'plateau' | 'stage' | 'autre';
  location: string;
  notes: string;
}

export interface FamilyState {
  familyName: string;
  parentPin: string;
  coachPin: string;
  tabletLocked: boolean;
  activeChildId: string;
  clubs: Club[];
  studioChallenges: StudioChallengeTemplate[];
  studioRewards: StudioRewardTemplate[];
  children: ChildProfile[];
  sessions: TrainingSession[];
  challenges: Challenge[];
  tournaments: TournamentEntry[];
  rewards: RewardItem[];
  redemptions: RewardRedemption[];
  memories: MemoryItem[];
  quizAttempts: QuizAttempt[];
  upcomingEvents: UpcomingEvent[];
}
