import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  createDefaultStudioChallenges,
  createDefaultStudioRewards,
  createInitialDemoState,
} from '../data/demoData';
import { DAILY_QUIZ_STAR_CAP } from '../data/galaxieCatalog';
import {
  getSupabaseClient,
  getSupabaseConfig,
  saveRuntimeSupabaseConfig,
  type SupabaseRuntimeConfig,
} from './supabase';
import type {
  AvatarConfig,
  BallLevel,
  Challenge,
  ChildMood,
  ChildProfile,
  ChildTheme,
  Club,
  ClubInfo,
  EquipmentInfo,
  FamilyState,
  MemoryItem,
  QuizAttempt,
  RewardItem,
  RewardRedemption,
  SkillKey,
  StudioChallengeTemplate,
  StudioRewardTemplate,
  TournamentEntry,
  TrainingSession,
  UpcomingEvent,
} from '../types/tennis';

const LOCAL_STORAGE_KEY = 'galaxie_tennis_family_state_v1';

function uid(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeFamilyState(raw: FamilyState): FamilyState {
  let clubs = Array.isArray(raw.clubs) ? raw.clubs : [];
  let children = raw.children;

  // Migrate legacy per-child clubInfo into centralized clubs catalog if needed
  if (clubs.length === 0) {
    const firstClubInfo = children[0]?.clubInfo;
    if (firstClubInfo?.clubName) {
      const migratedId = 'club-migrated-1';
      clubs = [
        {
          id: migratedId,
          name: firstClubInfo.clubName,
          coachName: firstClubInfo.coachName ?? '',
          coachPhone: firstClubInfo.coachPhone ?? '',
          coachEmail: firstClubInfo.coachEmail ?? '',
          schedule: firstClubInfo.schedule ?? '',
          courtSurface: firstClubInfo.courtSurface ?? '',
          address: '',
        },
      ];
      children = children.map((c) => ({ ...c, clubId: c.clubId ?? migratedId }));
    }
  }

  const studioChallenges =
    Array.isArray(raw.studioChallenges) && raw.studioChallenges.length > 0
      ? raw.studioChallenges
      : createDefaultStudioChallenges();

  const studioRewards =
    Array.isArray(raw.studioRewards) && raw.studioRewards.length > 0
      ? raw.studioRewards
      : createDefaultStudioRewards();

  return {
    ...raw,
    clubs,
    studioChallenges,
    studioRewards,
    children,
  };
}

function loadLocalState(): FamilyState {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FamilyState;
      if (parsed && Array.isArray(parsed.children) && parsed.children.length > 0) {
        return normalizeFamilyState(parsed);
      }
    }
  } catch {
    // Fallback to demo state
  }
  return createInitialDemoState();
}

export type SyncStatus = 'local' | 'connecting' | 'synced' | 'syncing' | 'error';

interface TennisStoreContextValue {
  state: FamilyState;
  activeChild: ChildProfile;
  activeChildClub: Club | null;
  childSessions: TrainingSession[];
  childChallenges: Challenge[];
  childTournaments: TournamentEntry[];
  childRewards: RewardItem[];
  childRedemptions: RewardRedemption[];
  childMemories: MemoryItem[];
  childQuizAttempts: QuizAttempt[];
  childEvents: UpcomingEvent[];
  pendingApprovalCount: number;
  todayQuizStarsEarned: number;

  // Cloud & auth
  isCloudConfigured: boolean;
  supabaseUser: User | null;
  syncStatus: SyncStatus;
  syncError: string | null;
  signInSupabase: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpSupabase: (email: string, password: string) => Promise<{ error: string | null }>;
  signOutSupabase: () => Promise<void>;
  configureSupabase: (config: SupabaseRuntimeConfig | null) => void;
  refreshFromCloud: () => Promise<void>;

  // Family & security
  setActiveChildId: (childId: string) => void;
  setTabletLocked: (locked: boolean) => void;
  updateParentPin: (newPin: string) => void;
  updateFamilyName: (name: string) => void;

  // Global Clubs catalog
  addClub: (input: Omit<Club, 'id'>) => Club;
  updateClub: (clubId: string, patch: Partial<Omit<Club, 'id'>>) => void;
  deleteClub: (clubId: string) => void;
  assignChildClub: (childId: string, clubId?: string) => void;

  // Studio Challenges & Rewards catalog + assignment
  addStudioChallenge: (input: Omit<StudioChallengeTemplate, 'id'>) => void;
  updateStudioChallenge: (
    templateId: string,
    patch: Partial<Omit<StudioChallengeTemplate, 'id'>>,
  ) => void;
  deleteStudioChallenge: (templateId: string) => void;
  assignStudioChallengeToChildren: (templateId: string, childIds: string[]) => number;

  addStudioReward: (input: Omit<StudioRewardTemplate, 'id'>) => void;
  updateStudioReward: (
    templateId: string,
    patch: Partial<Omit<StudioRewardTemplate, 'id'>>,
  ) => void;
  deleteStudioReward: (templateId: string) => void;
  assignStudioRewardToChildren: (templateId: string, childIds: string[]) => number;

  // Children & profile
  addChild: (input: { name: string; age: number; currentBall: BallLevel; clubId?: string }) => void;
  updateChildProfile: (
    patch: Partial<Pick<ChildProfile, 'name' | 'age' | 'currentBall' | 'clubId'>>,
  ) => void;
  updateChildTheme: (theme: ChildTheme) => void;
  updateChildAvatar: (patch: Partial<AvatarConfig>) => void;
  buyAvatarItem: (itemId: string, cost: number, patch: Partial<AvatarConfig>) => boolean;
  toggleMilestone: (milestoneId: string) => void;
  updateSkillLevel: (skill: SkillKey, level: number, note: string) => void;
  updateClubInfo: (info: ClubInfo) => void;
  updateEquipmentInfo: (info: EquipmentInfo) => void;

  // Sessions & mood
  addSession: (
    input: Omit<TrainingSession, 'id' | 'childId' | 'createdAt'>,
  ) => void;
  deleteSession: (sessionId: string) => void;
  submitChildMoodCheckIn: (sessionId: string, mood: ChildMood, favoriteMoment: string) => void;

  // Challenges
  addChallenge: (
    input: Pick<Challenge, 'title' | 'description' | 'category' | 'starsReward' | 'weekLabel'> & {
      templateId?: string;
    },
  ) => void;
  deleteChallenge: (challengeId: string) => void;
  requestChallengeApproval: (challengeId: string) => void;
  approveChallenge: (challengeId: string, feedback?: string) => void;
  declineChallengeRequest: (challengeId: string, feedback?: string) => void;

  // Rewards & redemptions
  addReward: (
    input: Pick<RewardItem, 'title' | 'description' | 'emoji' | 'starCost'> & {
      templateId?: string;
    },
  ) => void;
  deleteReward: (rewardId: string) => void;
  requestRewardRedemption: (rewardId: string) => boolean;
  deliverRewardRedemption: (redemptionId: string) => void;
  cancelRewardRedemption: (redemptionId: string) => void;

  // Plateaux / Tournaments
  addTournament: (
    input: Omit<TournamentEntry, 'id' | 'childId' | 'createdAt'>,
  ) => void;
  deleteTournament: (tournamentId: string) => void;

  // Memories
  addMemory: (
    input: {
      title: string;
      memoryDate: string;
      caption: string;
      mediaType: 'photo' | 'video_link';
      mediaUrl?: string;
      file?: File;
      tag: string;
    },
  ) => Promise<void>;
  deleteMemory: (memoryId: string) => void;

  // Quiz
  recordQuizAttempt: (score: number, totalQuestions: number) => number;

  // Events
  addUpcomingEvent: (input: Omit<UpcomingEvent, 'id' | 'childId'>) => void;
  deleteUpcomingEvent: (eventId: string) => void;

  // Portability
  exportJson: () => string;
  importJson: (jsonStr: string) => { ok: boolean; error?: string };
  resetDemoData: () => void;
}

const TennisStoreContext = createContext<TennisStoreContextValue | null>(null);

function compressImageToDataUrl(file: File, maxDim = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Impossible de lire le fichier image'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image invalide'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function TennisStoreProvider({ children: reactChildren }: { children: React.ReactNode }) {
  const [state, setState] = useState<FamilyState>(() => loadLocalState());
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [configVersion, setConfigVersion] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [syncError, setSyncError] = useState<string | null>(null);
  const familyDbIdRef = useRef<string | null>(null);

  const isCloudConfigured = useMemo(() => {
    void configVersion;
    return Boolean(getSupabaseConfig());
  }, [configVersion]);

  // Persist locally on every state update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Pull entire family graph from Supabase
  const pullFromSupabase = useCallback(async (user: User) => {
    const sb = getSupabaseClient();
    if (!sb) return;
    setSyncStatus('syncing');
    setSyncError(null);

    try {
      // 1. Ensure family row exists
      let { data: familyRow, error: famErr } = await sb
        .from('families')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (famErr) throw famErr;

      if (!familyRow) {
        const { data: created, error: createErr } = await sb
          .from('families')
          .insert({
            owner_id: user.id,
            parent_pin: state.parentPin || '1234',
            family_name: state.familyName || 'Ma Famille Tennis',
          })
          .select()
          .single();
        if (createErr) throw createErr;
        familyRow = created;
      }

      familyDbIdRef.current = familyRow.id;

      // 2. Fetch children
      const { data: childRows, error: childErr } = await sb
        .from('children')
        .select('*')
        .eq('family_id', familyRow.id)
        .order('created_at', { ascending: true });

      if (childErr) throw childErr;

      // If brand new Supabase account with 0 children, seed initial child from demo defaults
      if (!childRows || childRows.length === 0) {
        const demo = createInitialDemoState();
        const seedChild = demo.children[0];
        const { data: insertedChild, error: insChildErr } = await sb
          .from('children')
          .insert({
            family_id: familyRow.id,
            name: seedChild.name,
            age: seedChild.age,
            current_ball: seedChild.currentBall,
            stars_balance: seedChild.starsBalance,
            total_stars_earned: seedChild.totalStarsEarned,
            streak_count: seedChild.streakCount,
            child_theme: seedChild.childTheme,
            avatar_config: seedChild.avatarConfig,
            unlocked_items: seedChild.unlockedItems,
            milestones_completed: seedChild.milestonesCompleted,
            skill_levels: seedChild.skillLevels,
            club_info: seedChild.clubInfo,
            equipment_info: seedChild.equipmentInfo,
          })
          .select()
          .single();
        if (insChildErr) throw insChildErr;

        // Seed starter rewards & a sample challenge
        await sb.from('rewards').insert(
          demo.rewards.map((r) => ({
            child_id: insertedChild.id,
            title: r.title,
            description: r.description,
            emoji: r.emoji,
            star_cost: r.starCost,
            active: true,
          })),
        );
        await sb.from('challenges').insert(
          demo.challenges.slice(0, 2).map((c) => ({
            child_id: insertedChild.id,
            title: c.title,
            description: c.description,
            category: c.category,
            stars_reward: c.starsReward,
            status: 'active',
            week_label: c.weekLabel,
          })),
        );

        // Re-pull now that seed exists
        await pullFromSupabase(user);
        return;
      }

      const childIds = childRows.map((c) => c.id as string);

      const [
        sessionsRes,
        challengesRes,
        tournamentsRes,
        rewardsRes,
        redemptionsRes,
        memoriesRes,
        quizRes,
        eventsRes,
      ] = await Promise.all([
        sb.from('sessions').select('*').in('child_id', childIds).order('session_date', { ascending: false }),
        sb.from('challenges').select('*').in('child_id', childIds).order('created_at', { ascending: false }),
        sb.from('tournaments').select('*').in('child_id', childIds).order('event_date', { ascending: false }),
        sb.from('rewards').select('*').in('child_id', childIds).order('created_at', { ascending: true }),
        sb.from('reward_redemptions').select('*').in('child_id', childIds).order('requested_at', { ascending: false }),
        sb.from('memories').select('*').in('child_id', childIds).order('memory_date', { ascending: false }),
        sb.from('quiz_attempts').select('*').in('child_id', childIds).order('created_at', { ascending: false }),
        sb.from('upcoming_events').select('*').in('child_id', childIds).order('event_date', { ascending: true }),
      ]);

      const demoFallback = createInitialDemoState().children[0];

      const mappedChildren: ChildProfile[] = childRows.map((row) => ({
        id: row.id,
        name: row.name,
        age: row.age ?? 7,
        currentBall: (row.current_ball ?? 'rouge') as BallLevel,
        clubId: row.club_id ?? undefined,
        starsBalance: row.stars_balance ?? 0,
        totalStarsEarned: row.total_stars_earned ?? 0,
        streakCount: row.streak_count ?? 0,
        childTheme: (row.child_theme ?? 'terre-battue') as ChildTheme,
        avatarConfig: { ...demoFallback.avatarConfig, ...(row.avatar_config || {}) },
        unlockedItems: Array.isArray(row.unlocked_items) ? row.unlocked_items : demoFallback.unlockedItems,
        milestonesCompleted: Array.isArray(row.milestones_completed) ? row.milestones_completed : [],
        skillLevels: { ...demoFallback.skillLevels, ...(row.skill_levels || {}) },
        clubInfo: { ...demoFallback.clubInfo, ...(row.club_info || {}) },
        equipmentInfo: { ...demoFallback.equipmentInfo, ...(row.equipment_info || {}) },
        createdAt: row.created_at,
      }));

      setState((prev) =>
        normalizeFamilyState({
          familyName: familyRow.family_name || prev.familyName,
          parentPin: familyRow.parent_pin || prev.parentPin,
          tabletLocked: prev.tabletLocked,
          clubs: Array.isArray(familyRow.clubs) ? familyRow.clubs : prev.clubs,
          studioChallenges: Array.isArray(familyRow.studio_challenges)
            ? familyRow.studio_challenges
            : prev.studioChallenges,
          studioRewards: Array.isArray(familyRow.studio_rewards)
            ? familyRow.studio_rewards
            : prev.studioRewards,
          activeChildId: mappedChildren.some((c) => c.id === prev.activeChildId)
            ? prev.activeChildId
            : mappedChildren[0].id,
          children: mappedChildren,
          sessions: (sessionsRes.data ?? []).map((r) => ({
            id: r.id,
            childId: r.child_id,
            clubId: r.club_id ?? undefined,
            sessionDate: r.session_date,
            sessionType: r.session_type,
            durationMin: r.duration_min,
            focusSkills: Array.isArray(r.focus_skills) ? r.focus_skills : [],
            effortRating: r.effort_rating,
            starsAwarded: r.stars_awarded,
            coachNote: r.coach_note ?? '',
            parentNote: r.parent_note ?? '',
            childMood: r.child_mood ?? undefined,
            childFavoriteMoment: r.child_favorite_moment ?? undefined,
            createdAt: r.created_at,
          })),
        challenges: (challengesRes.data ?? []).map((r) => ({
          id: r.id,
          childId: r.child_id,
          title: r.title,
          description: r.description ?? '',
          category: r.category,
          starsReward: r.stars_reward,
          status: r.status,
          weekLabel: r.week_label ?? 'Cette semaine',
          parentFeedback: r.parent_feedback ?? undefined,
          requestedAt: r.requested_at ?? undefined,
          completedAt: r.completed_at ?? undefined,
          createdAt: r.created_at,
        })),
        tournaments: (tournamentsRes.data ?? []).map((r) => ({
          id: r.id,
          childId: r.child_id,
          name: r.name,
          eventDate: r.event_date,
          ballLevel: r.ball_level,
          matchesPlayed: r.matches_played,
          highlight: r.highlight ?? '',
          positivePoints: r.positive_points ?? '',
          location: r.location ?? '',
          createdAt: r.created_at,
        })),
        rewards: (rewardsRes.data ?? []).map((r) => ({
          id: r.id,
          childId: r.child_id,
          title: r.title,
          description: r.description ?? '',
          emoji: r.emoji ?? '🎁',
          starCost: r.star_cost,
          active: r.active ?? true,
        })),
        redemptions: (redemptionsRes.data ?? []).map((r) => ({
          id: r.id,
          childId: r.child_id,
          rewardId: r.reward_id ?? '',
          rewardTitle: r.reward_title,
          rewardEmoji: r.reward_emoji ?? '🎁',
          starCost: r.star_cost,
          status: r.status,
          requestedAt: r.requested_at,
          deliveredAt: r.delivered_at ?? undefined,
        })),
        memories: (memoriesRes.data ?? []).map((r) => ({
          id: r.id,
          childId: r.child_id,
          title: r.title,
          memoryDate: r.memory_date,
          caption: r.caption ?? '',
          mediaType: r.media_type,
          mediaUrl: r.media_url,
          storagePath: r.storage_path ?? undefined,
          tag: r.tag ?? 'Entraînement',
          createdAt: r.created_at,
        })),
        quizAttempts: (quizRes.data ?? []).map((r) => ({
          id: r.id,
          childId: r.child_id,
          attemptDate: r.attempt_date,
          score: r.score,
          totalQuestions: r.total_questions,
          starsEarned: r.stars_earned,
          createdAt: r.created_at,
        })),
          upcomingEvents: (eventsRes.data ?? []).map((r) => ({
            id: r.id,
            childId: r.child_id,
            title: r.title,
            eventDate: r.event_date,
            eventTime: r.event_time ?? '',
            eventType: r.event_type,
            location: r.location ?? '',
            notes: r.notes ?? '',
          })),
        }),
      );

      setSyncStatus('synced');
    } catch (err) {
      console.error('Supabase sync error:', err);
      setSyncStatus('error');
      setSyncError(err instanceof Error ? err.message : 'Erreur de synchronisation Supabase');
    }
  }, [state.familyName, state.parentPin]);

  // Listen to Supabase Auth & Realtime changes
  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb) {
      setSupabaseUser(null);
      setSyncStatus('local');
      return;
    }

    let isMounted = true;
    setSyncStatus('connecting');

    sb.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const user = data.session?.user ?? null;
      setSupabaseUser(user);
      if (user) {
        void pullFromSupabase(user);
      } else {
        setSyncStatus('local');
      }
    });

    const { data: authSub } = sb.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setSupabaseUser(user);
      if (user) {
        void pullFromSupabase(user);
      } else {
        familyDbIdRef.current = null;
        setSyncStatus('local');
      }
    });

    return () => {
      isMounted = false;
      authSub.subscription.unsubscribe();
    };
  }, [configVersion, pullFromSupabase]);

  // Subscribe to Realtime updates when signed in
  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb || !supabaseUser) return;

    const channel = sb
      .channel('galaxie-tennis-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'children' }, () => {
        void pullFromSupabase(supabaseUser);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, () => {
        void pullFromSupabase(supabaseUser);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, () => {
        void pullFromSupabase(supabaseUser);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reward_redemptions' }, () => {
        void pullFromSupabase(supabaseUser);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rewards' }, () => {
        void pullFromSupabase(supabaseUser);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memories' }, () => {
        void pullFromSupabase(supabaseUser);
      })
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, [supabaseUser, pullFromSupabase]);

  // Helper to run background Supabase mutations cleanly
  const syncCloudOp = useCallback(
    async (op: (sb: NonNullable<ReturnType<typeof getSupabaseClient>>) => Promise<unknown>) => {
      const sb = getSupabaseClient();
      if (!sb || !supabaseUser) return;
      try {
        setSyncStatus('syncing');
        await op(sb);
        setSyncStatus('synced');
      } catch (err) {
        console.error('Cloud write error:', err);
        setSyncStatus('error');
        setSyncError(err instanceof Error ? err.message : 'Erreur d’écriture cloud');
      }
    },
    [supabaseUser],
  );

  // Derived selectors
  const activeChild = useMemo(() => {
    return state.children.find((c) => c.id === state.activeChildId) ?? state.children[0];
  }, [state.children, state.activeChildId]);

  const activeChildClub = useMemo(() => {
    if (!activeChild.clubId) return null;
    return state.clubs.find((c) => c.id === activeChild.clubId) ?? null;
  }, [state.clubs, activeChild.clubId]);

  const childSessions = useMemo(
    () =>
      state.sessions
        .filter((s) => s.childId === activeChild.id)
        .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate)),
    [state.sessions, activeChild.id],
  );

  const childChallenges = useMemo(
    () => state.challenges.filter((c) => c.childId === activeChild.id),
    [state.challenges, activeChild.id],
  );

  const childTournaments = useMemo(
    () =>
      state.tournaments
        .filter((t) => t.childId === activeChild.id)
        .sort((a, b) => b.eventDate.localeCompare(a.eventDate)),
    [state.tournaments, activeChild.id],
  );

  const childRewards = useMemo(
    () => state.rewards.filter((r) => r.childId === activeChild.id && r.active),
    [state.rewards, activeChild.id],
  );

  const childRedemptions = useMemo(
    () => state.redemptions.filter((r) => r.childId === activeChild.id),
    [state.redemptions, activeChild.id],
  );

  const childMemories = useMemo(
    () =>
      state.memories
        .filter((m) => m.childId === activeChild.id)
        .sort((a, b) => b.memoryDate.localeCompare(a.memoryDate)),
    [state.memories, activeChild.id],
  );

  const childQuizAttempts = useMemo(
    () => state.quizAttempts.filter((q) => q.childId === activeChild.id),
    [state.quizAttempts, activeChild.id],
  );

  const childEvents = useMemo(
    () =>
      state.upcomingEvents
        .filter((e) => e.childId === activeChild.id)
        .sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
    [state.upcomingEvents, activeChild.id],
  );

  const pendingApprovalCount = useMemo(() => {
    const pendingChallenges = childChallenges.filter((c) => c.status === 'pending_approval').length;
    const pendingRedemptions = childRedemptions.filter((r) => r.status === 'pending').length;
    return pendingChallenges + pendingRedemptions;
  }, [childChallenges, childRedemptions]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayQuizStarsEarned = useMemo(() => {
    return childQuizAttempts
      .filter((q) => q.attemptDate === todayIso)
      .reduce((acc, q) => acc + q.starsEarned, 0);
  }, [childQuizAttempts, todayIso]);

  // Helper to patch active child
  const patchChild = useCallback(
    (childId: string, updater: (child: ChildProfile) => ChildProfile, dbPatch?: Record<string, unknown>) => {
      setState((prev) => ({
        ...prev,
        children: prev.children.map((c) => (c.id === childId ? updater(c) : c)),
      }));
      if (dbPatch) {
        void syncCloudOp(async (sb) => {
          await sb.from('children').update({ ...dbPatch, updated_at: new Date().toISOString() }).eq('id', childId);
        });
      }
    },
    [syncCloudOp],
  );

  // Auth methods
  const signInSupabase = async (email: string, password: string) => {
    const sb = getSupabaseClient();
    if (!sb) return { error: 'Supabase non configuré.' };
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUpSupabase = async (email: string, password: string) => {
    const sb = getSupabaseClient();
    if (!sb) return { error: 'Supabase non configuré.' };
    const { error } = await sb.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signOutSupabase = async () => {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb.auth.signOut();
    setSupabaseUser(null);
    setSyncStatus('local');
  };

  const configureSupabase = (config: SupabaseRuntimeConfig | null) => {
    saveRuntimeSupabaseConfig(config);
    setConfigVersion((v) => v + 1);
  };

  const refreshFromCloud = async () => {
    if (supabaseUser) {
      await pullFromSupabase(supabaseUser);
    }
  };

  // Family settings
  const setActiveChildId = (childId: string) => {
    setState((prev) => ({ ...prev, activeChildId: childId }));
  };

  const setTabletLocked = (locked: boolean) => {
    setState((prev) => ({ ...prev, tabletLocked: locked }));
  };

  const updateParentPin = (newPin: string) => {
    setState((prev) => ({ ...prev, parentPin: newPin }));
    void syncCloudOp(async (sb) => {
      if (familyDbIdRef.current) {
        await sb.from('families').update({ parent_pin: newPin }).eq('id', familyDbIdRef.current);
      }
    });
  };

  const updateFamilyName = (name: string) => {
    setState((prev) => ({ ...prev, familyName: name }));
    void syncCloudOp(async (sb) => {
      if (familyDbIdRef.current) {
        await sb.from('families').update({ family_name: name }).eq('id', familyDbIdRef.current);
      }
    });
  };

  // Global Clubs catalog CRUD
  const syncFamilyJsonb = (patch: Record<string, unknown>) => {
    void syncCloudOp(async (sb) => {
      if (familyDbIdRef.current) {
        await sb.from('families').update(patch).eq('id', familyDbIdRef.current);
      }
    });
  };

  const addClub = (input: Omit<Club, 'id'>): Club => {
    const newClub: Club = { ...input, id: uid('club') };
    setState((prev) => {
      const nextClubs = [...prev.clubs, newClub];
      syncFamilyJsonb({ clubs: nextClubs });
      return { ...prev, clubs: nextClubs };
    });
    return newClub;
  };

  const updateClub = (clubId: string, patch: Partial<Omit<Club, 'id'>>) => {
    setState((prev) => {
      const nextClubs = prev.clubs.map((c) => (c.id === clubId ? { ...c, ...patch } : c));
      syncFamilyJsonb({ clubs: nextClubs });
      return { ...prev, clubs: nextClubs };
    });
  };

  const deleteClub = (clubId: string) => {
    setState((prev) => {
      const nextClubs = prev.clubs.filter((c) => c.id !== clubId);
      const nextChildren = prev.children.map((ch) =>
        ch.clubId === clubId ? { ...ch, clubId: undefined } : ch,
      );
      const nextSessions = prev.sessions.map((s) =>
        s.clubId === clubId ? { ...s, clubId: undefined } : s,
      );
      syncFamilyJsonb({ clubs: nextClubs });
      return {
        ...prev,
        clubs: nextClubs,
        children: nextChildren,
        sessions: nextSessions,
      };
    });
  };

  const assignChildClub = (childId: string, clubId?: string) => {
    const club = clubId ? state.clubs.find((c) => c.id === clubId) : undefined;
    const syncedClubInfo: ClubInfo = club
      ? {
          clubName: club.name,
          coachName: club.coachName,
          coachPhone: club.coachPhone,
          coachEmail: club.coachEmail,
          schedule: club.schedule,
          courtSurface: club.courtSurface,
        }
      : {
          clubName: '',
          coachName: '',
          coachPhone: '',
          coachEmail: '',
          schedule: '',
          courtSurface: '',
        };
    patchChild(
      childId,
      (c) => ({ ...c, clubId: clubId || undefined, clubInfo: syncedClubInfo }),
      { club_id: clubId || null, club_info: syncedClubInfo },
    );
  };

  // Studio Challenges CRUD & Assignment
  const addStudioChallenge = (input: Omit<StudioChallengeTemplate, 'id'>) => {
    const tpl: StudioChallengeTemplate = { ...input, id: uid('tpl-ch') };
    setState((prev) => {
      const next = [tpl, ...prev.studioChallenges];
      syncFamilyJsonb({ studio_challenges: next });
      return { ...prev, studioChallenges: next };
    });
  };

  const updateStudioChallenge = (
    templateId: string,
    patch: Partial<Omit<StudioChallengeTemplate, 'id'>>,
  ) => {
    setState((prev) => {
      const next = prev.studioChallenges.map((t) =>
        t.id === templateId ? { ...t, ...patch } : t,
      );
      syncFamilyJsonb({ studio_challenges: next });
      return { ...prev, studioChallenges: next };
    });
  };

  const deleteStudioChallenge = (templateId: string) => {
    setState((prev) => {
      const next = prev.studioChallenges.filter((t) => t.id !== templateId);
      syncFamilyJsonb({ studio_challenges: next });
      return { ...prev, studioChallenges: next };
    });
  };

  const assignStudioChallengeToChildren = (templateId: string, childIds: string[]): number => {
    const tpl = state.studioChallenges.find((t) => t.id === templateId);
    if (!tpl || childIds.length === 0) return 0;

    const now = new Date().toISOString();
    const created: Challenge[] = [];

    for (const cid of childIds) {
      const alreadyActive = state.challenges.some(
        (c) =>
          c.childId === cid &&
          c.status !== 'completed' &&
          (c.templateId === templateId || c.title.toLowerCase() === tpl.title.toLowerCase()),
      );
      if (alreadyActive) continue;
      created.push({
        id: uid('chal'),
        childId: cid,
        templateId: tpl.id,
        title: tpl.title,
        description: tpl.description,
        category: tpl.category,
        starsReward: tpl.starsReward,
        status: 'active',
        weekLabel: 'Cette semaine',
        createdAt: now,
      });
    }

    if (created.length === 0) return 0;

    setState((prev) => ({
      ...prev,
      challenges: [...created, ...prev.challenges],
    }));

    void syncCloudOp(async (sb) => {
      await sb.from('challenges').insert(
        created.map((ch) => ({
          id: ch.id,
          child_id: ch.childId,
          title: ch.title,
          description: ch.description,
          category: ch.category,
          stars_reward: ch.starsReward,
          status: 'active',
          week_label: ch.weekLabel,
        })),
      );
    });

    return created.length;
  };

  // Studio Rewards CRUD & Assignment
  const addStudioReward = (input: Omit<StudioRewardTemplate, 'id'>) => {
    const tpl: StudioRewardTemplate = { ...input, id: uid('tpl-rew') };
    setState((prev) => {
      const next = [tpl, ...prev.studioRewards];
      syncFamilyJsonb({ studio_rewards: next });
      return { ...prev, studioRewards: next };
    });
  };

  const updateStudioReward = (
    templateId: string,
    patch: Partial<Omit<StudioRewardTemplate, 'id'>>,
  ) => {
    setState((prev) => {
      const next = prev.studioRewards.map((t) =>
        t.id === templateId ? { ...t, ...patch } : t,
      );
      syncFamilyJsonb({ studio_rewards: next });
      return { ...prev, studioRewards: next };
    });
  };

  const deleteStudioReward = (templateId: string) => {
    setState((prev) => {
      const next = prev.studioRewards.filter((t) => t.id !== templateId);
      syncFamilyJsonb({ studio_rewards: next });
      return { ...prev, studioRewards: next };
    });
  };

  const assignStudioRewardToChildren = (templateId: string, childIds: string[]): number => {
    const tpl = state.studioRewards.find((t) => t.id === templateId);
    if (!tpl || childIds.length === 0) return 0;

    const created: RewardItem[] = [];

    for (const cid of childIds) {
      const alreadyExists = state.rewards.some(
        (r) =>
          r.childId === cid &&
          r.active &&
          (r.templateId === templateId || r.title.toLowerCase() === tpl.title.toLowerCase()),
      );
      if (alreadyExists) continue;
      created.push({
        id: uid('rew'),
        childId: cid,
        templateId: tpl.id,
        title: tpl.title,
        description: tpl.description,
        emoji: tpl.emoji,
        starCost: tpl.starCost,
        active: true,
      });
    }

    if (created.length === 0) return 0;

    setState((prev) => ({
      ...prev,
      rewards: [...prev.rewards, ...created],
    }));

    void syncCloudOp(async (sb) => {
      await sb.from('rewards').insert(
        created.map((r) => ({
          id: r.id,
          child_id: r.childId,
          title: r.title,
          description: r.description,
          emoji: r.emoji,
          star_cost: r.starCost,
          active: true,
        })),
      );
    });

    return created.length;
  };

  // Multi-child creation
  const addChild = (input: {
    name: string;
    age: number;
    currentBall: BallLevel;
    clubId?: string;
  }) => {
    const template = createInitialDemoState().children[0];
    const newId = uid('child');
    const assignedClubId = input.clubId || state.clubs[0]?.id;
    const assignedClub = assignedClubId
      ? state.clubs.find((c) => c.id === assignedClubId)
      : undefined;

    const newChild: ChildProfile = {
      ...template,
      id: newId,
      name: input.name.trim(),
      age: input.age,
      currentBall: input.currentBall,
      clubId: assignedClubId,
      clubInfo: assignedClub
        ? {
            clubName: assignedClub.name,
            coachName: assignedClub.coachName,
            coachPhone: assignedClub.coachPhone,
            coachEmail: assignedClub.coachEmail,
            schedule: assignedClub.schedule,
            courtSurface: assignedClub.courtSurface,
          }
        : template.clubInfo,
      starsBalance: 15,
      totalStarsEarned: 15,
      streakCount: 0,
      milestonesCompleted: [],
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      activeChildId: newId,
      children: [...prev.children, newChild],
    }));
    void syncCloudOp(async (sb) => {
      if (!familyDbIdRef.current) return;
      await sb.from('children').insert({
        id: newId,
        family_id: familyDbIdRef.current,
        name: newChild.name,
        age: newChild.age,
        current_ball: newChild.currentBall,
        club_id: newChild.clubId ?? null,
        stars_balance: newChild.starsBalance,
        total_stars_earned: newChild.totalStarsEarned,
        streak_count: 0,
        child_theme: newChild.childTheme,
        avatar_config: newChild.avatarConfig,
        unlocked_items: newChild.unlockedItems,
        milestones_completed: [],
        skill_levels: newChild.skillLevels,
        club_info: newChild.clubInfo,
        equipment_info: newChild.equipmentInfo,
      });
    });
  };

  const updateChildProfile = (
    patch: Partial<Pick<ChildProfile, 'name' | 'age' | 'currentBall' | 'clubId'>>,
  ) => {
    const dbPatch: Record<string, unknown> = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.age !== undefined) dbPatch.age = patch.age;
    if (patch.currentBall !== undefined) dbPatch.current_ball = patch.currentBall;
    if (patch.clubId !== undefined) dbPatch.club_id = patch.clubId || null;
    patchChild(activeChild.id, (c) => ({ ...c, ...patch }), dbPatch);
  };

  const updateChildTheme = (theme: ChildTheme) => {
    patchChild(activeChild.id, (c) => ({ ...c, childTheme: theme }), { child_theme: theme });
  };

  const updateChildAvatar = (patch: Partial<AvatarConfig>) => {
    const nextAvatar = { ...activeChild.avatarConfig, ...patch };
    patchChild(activeChild.id, (c) => ({ ...c, avatarConfig: nextAvatar }), {
      avatar_config: nextAvatar,
    });
  };

  const buyAvatarItem = (itemId: string, cost: number, patch: Partial<AvatarConfig>): boolean => {
    const alreadyUnlocked = activeChild.unlockedItems.includes(itemId);
    if (!alreadyUnlocked && activeChild.starsBalance < cost) {
      return false;
    }
    const nextAvatar = { ...activeChild.avatarConfig, ...patch };
    const nextUnlocked = alreadyUnlocked
      ? activeChild.unlockedItems
      : [...activeChild.unlockedItems, itemId];
    const nextBalance = alreadyUnlocked ? activeChild.starsBalance : activeChild.starsBalance - cost;

    patchChild(
      activeChild.id,
      (c) => ({
        ...c,
        avatarConfig: nextAvatar,
        unlockedItems: nextUnlocked,
        starsBalance: nextBalance,
      }),
      {
        avatar_config: nextAvatar,
        unlocked_items: nextUnlocked,
        stars_balance: nextBalance,
      },
    );
    return true;
  };

  const toggleMilestone = (milestoneId: string) => {
    const exists = activeChild.milestonesCompleted.includes(milestoneId);
    const nextMilestones = exists
      ? activeChild.milestonesCompleted.filter((id) => id !== milestoneId)
      : [...activeChild.milestonesCompleted, milestoneId];
    const starDelta = exists ? 0 : 10;
    const nextBalance = activeChild.starsBalance + starDelta;
    const nextTotal = activeChild.totalStarsEarned + starDelta;

    patchChild(
      activeChild.id,
      (c) => ({
        ...c,
        milestonesCompleted: nextMilestones,
        starsBalance: nextBalance,
        totalStarsEarned: nextTotal,
      }),
      {
        milestones_completed: nextMilestones,
        stars_balance: nextBalance,
        total_stars_earned: nextTotal,
      },
    );
  };

  const updateSkillLevel = (skill: SkillKey, level: number, note: string) => {
    const nextSkills = {
      ...activeChild.skillLevels,
      [skill]: { level, note, updatedAt: new Date().toISOString().slice(0, 10) },
    };
    patchChild(activeChild.id, (c) => ({ ...c, skillLevels: nextSkills }), {
      skill_levels: nextSkills,
    });
  };

  const updateClubInfo = (info: ClubInfo) => {
    patchChild(activeChild.id, (c) => ({ ...c, clubInfo: info }), { club_info: info });
  };

  const updateEquipmentInfo = (info: EquipmentInfo) => {
    patchChild(activeChild.id, (c) => ({ ...c, equipmentInfo: info }), { equipment_info: info });
  };

  // Sessions
  const addSession = (input: Omit<TrainingSession, 'id' | 'childId' | 'createdAt'>) => {
    const newSession: TrainingSession = {
      ...input,
      id: uid('sess'),
      childId: activeChild.id,
      createdAt: new Date().toISOString(),
    };
    const nextBalance = activeChild.starsBalance + input.starsAwarded;
    const nextTotal = activeChild.totalStarsEarned + input.starsAwarded;
    const nextStreak = activeChild.streakCount + 1;

    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      children: prev.children.map((c) =>
        c.id === activeChild.id
          ? {
              ...c,
              starsBalance: nextBalance,
              totalStarsEarned: nextTotal,
              streakCount: nextStreak,
            }
          : c,
      ),
    }));

    void syncCloudOp(async (sb) => {
      await sb.from('sessions').insert({
        id: newSession.id,
        child_id: activeChild.id,
        club_id: newSession.clubId ?? null,
        session_date: newSession.sessionDate,
        session_type: newSession.sessionType,
        duration_min: newSession.durationMin,
        focus_skills: newSession.focusSkills,
        effort_rating: newSession.effortRating,
        stars_awarded: newSession.starsAwarded,
        coach_note: newSession.coachNote,
        parent_note: newSession.parentNote,
      });
      await sb
        .from('children')
        .update({
          stars_balance: nextBalance,
          total_stars_earned: nextTotal,
          streak_count: nextStreak,
        })
        .eq('id', activeChild.id);
    });
  };

  const deleteSession = (sessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId),
    }));
    void syncCloudOp(async (sb) => {
      await sb.from('sessions').delete().eq('id', sessionId);
    });
  };

  const submitChildMoodCheckIn = (sessionId: string, mood: ChildMood, favoriteMoment: string) => {
    const target = state.sessions.find((s) => s.id === sessionId);
    const isFirstTimeMood = target && !target.childMood;
    const bonusStars = isFirstTimeMood ? 5 : 0;
    const nextBalance = activeChild.starsBalance + bonusStars;
    const nextTotal = activeChild.totalStarsEarned + bonusStars;

    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, childMood: mood, childFavoriteMoment: favoriteMoment } : s,
      ),
      children: prev.children.map((c) =>
        c.id === activeChild.id
          ? { ...c, starsBalance: nextBalance, totalStarsEarned: nextTotal }
          : c,
      ),
    }));

    void syncCloudOp(async (sb) => {
      await sb
        .from('sessions')
        .update({ child_mood: mood, child_favorite_moment: favoriteMoment })
        .eq('id', sessionId);
      if (bonusStars > 0) {
        await sb
          .from('children')
          .update({ stars_balance: nextBalance, total_stars_earned: nextTotal })
          .eq('id', activeChild.id);
      }
    });
  };

  // Challenges
  const addChallenge = (
    input: Pick<Challenge, 'title' | 'description' | 'category' | 'starsReward' | 'weekLabel'>,
  ) => {
    const newCh: Challenge = {
      ...input,
      id: uid('chal'),
      childId: activeChild.id,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, challenges: [newCh, ...prev.challenges] }));
    void syncCloudOp(async (sb) => {
      await sb.from('challenges').insert({
        id: newCh.id,
        child_id: activeChild.id,
        title: newCh.title,
        description: newCh.description,
        category: newCh.category,
        stars_reward: newCh.starsReward,
        status: 'active',
        week_label: newCh.weekLabel,
      });
    });
  };

  const deleteChallenge = (challengeId: string) => {
    setState((prev) => ({
      ...prev,
      challenges: prev.challenges.filter((c) => c.id !== challengeId),
    }));
    void syncCloudOp(async (sb) => {
      await sb.from('challenges').delete().eq('id', challengeId);
    });
  };

  const requestChallengeApproval = (challengeId: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) =>
        c.id === challengeId ? { ...c, status: 'pending_approval', requestedAt: now } : c,
      ),
    }));
    void syncCloudOp(async (sb) => {
      await sb
        .from('challenges')
        .update({ status: 'pending_approval', requested_at: now })
        .eq('id', challengeId);
    });
  };

  const approveChallenge = (challengeId: string, feedback?: string) => {
    const ch = state.challenges.find((c) => c.id === challengeId);
    if (!ch || ch.status === 'completed') return;
    const now = new Date().toISOString();
    const nextBalance = activeChild.starsBalance + ch.starsReward;
    const nextTotal = activeChild.totalStarsEarned + ch.starsReward;

    setState((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              status: 'completed',
              completedAt: now,
              parentFeedback: feedback || 'Bravo ma championne ! 🌟',
            }
          : c,
      ),
      children: prev.children.map((c) =>
        c.id === activeChild.id
          ? { ...c, starsBalance: nextBalance, totalStarsEarned: nextTotal }
          : c,
      ),
    }));

    void syncCloudOp(async (sb) => {
      await sb
        .from('challenges')
        .update({
          status: 'completed',
          completed_at: now,
          parent_feedback: feedback || 'Bravo ma championne ! 🌟',
        })
        .eq('id', challengeId);
      await sb
        .from('children')
        .update({ stars_balance: nextBalance, total_stars_earned: nextTotal })
        .eq('id', activeChild.id);
    });
  };

  const declineChallengeRequest = (challengeId: string, feedback?: string) => {
    setState((prev) => ({
      ...prev,
      challenges: prev.challenges.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              status: 'active',
              parentFeedback: feedback || 'Presque ! On réessaie ensemble à la prochaine séance 💪',
            }
          : c,
      ),
    }));
    void syncCloudOp(async (sb) => {
      await sb
        .from('challenges')
        .update({
          status: 'active',
          parent_feedback: feedback || 'Presque ! On réessaie ensemble à la prochaine séance 💪',
        })
        .eq('id', challengeId);
    });
  };

  // Rewards & Redemptions
  const addReward = (input: Pick<RewardItem, 'title' | 'description' | 'emoji' | 'starCost'>) => {
    const newRew: RewardItem = {
      ...input,
      id: uid('rew'),
      childId: activeChild.id,
      active: true,
    };
    setState((prev) => ({ ...prev, rewards: [...prev.rewards, newRew] }));
    void syncCloudOp(async (sb) => {
      await sb.from('rewards').insert({
        id: newRew.id,
        child_id: activeChild.id,
        title: newRew.title,
        description: newRew.description,
        emoji: newRew.emoji,
        star_cost: newRew.starCost,
        active: true,
      });
    });
  };

  const deleteReward = (rewardId: string) => {
    setState((prev) => ({
      ...prev,
      rewards: prev.rewards.filter((r) => r.id !== rewardId),
    }));
    void syncCloudOp(async (sb) => {
      await sb.from('rewards').delete().eq('id', rewardId);
    });
  };

  const requestRewardRedemption = (rewardId: string): boolean => {
    const rew = state.rewards.find((r) => r.id === rewardId);
    if (!rew || activeChild.starsBalance < rew.starCost) return false;

    const newRedemption: RewardRedemption = {
      id: uid('red'),
      childId: activeChild.id,
      rewardId: rew.id,
      rewardTitle: rew.title,
      rewardEmoji: rew.emoji,
      starCost: rew.starCost,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    const nextBalance = activeChild.starsBalance - rew.starCost;

    setState((prev) => ({
      ...prev,
      redemptions: [newRedemption, ...prev.redemptions],
      children: prev.children.map((c) =>
        c.id === activeChild.id ? { ...c, starsBalance: nextBalance } : c,
      ),
    }));

    void syncCloudOp(async (sb) => {
      await sb.from('reward_redemptions').insert({
        id: newRedemption.id,
        child_id: activeChild.id,
        reward_id: rew.id,
        reward_title: rew.title,
        reward_emoji: rew.emoji,
        star_cost: rew.starCost,
        status: 'pending',
      });
      await sb.from('children').update({ stars_balance: nextBalance }).eq('id', activeChild.id);
    });
    return true;
  };

  const deliverRewardRedemption = (redemptionId: string) => {
    const now = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      redemptions: prev.redemptions.map((r) =>
        r.id === redemptionId ? { ...r, status: 'delivered', deliveredAt: now } : r,
      ),
    }));
    void syncCloudOp(async (sb) => {
      await sb
        .from('reward_redemptions')
        .update({ status: 'delivered', delivered_at: now })
        .eq('id', redemptionId);
    });
  };

  const cancelRewardRedemption = (redemptionId: string) => {
    const target = state.redemptions.find((r) => r.id === redemptionId);
    if (!target || target.status !== 'pending') return;
    const refundedBalance = activeChild.starsBalance + target.starCost;

    setState((prev) => ({
      ...prev,
      redemptions: prev.redemptions.map((r) =>
        r.id === redemptionId ? { ...r, status: 'declined' } : r,
      ),
      children: prev.children.map((c) =>
        c.id === activeChild.id ? { ...c, starsBalance: refundedBalance } : c,
      ),
    }));

    void syncCloudOp(async (sb) => {
      await sb.from('reward_redemptions').update({ status: 'declined' }).eq('id', redemptionId);
      await sb
        .from('children')
        .update({ stars_balance: refundedBalance })
        .eq('id', activeChild.id);
    });
  };

  // Tournaments
  const addTournament = (input: Omit<TournamentEntry, 'id' | 'childId' | 'createdAt'>) => {
    const entry: TournamentEntry = {
      ...input,
      id: uid('tour'),
      childId: activeChild.id,
      createdAt: new Date().toISOString(),
    };
    const nextBalance = activeChild.starsBalance + 20;
    const nextTotal = activeChild.totalStarsEarned + 20;
    setState((prev) => ({
      ...prev,
      tournaments: [entry, ...prev.tournaments],
      children: prev.children.map((c) =>
        c.id === activeChild.id
          ? { ...c, starsBalance: nextBalance, totalStarsEarned: nextTotal }
          : c,
      ),
    }));
    void syncCloudOp(async (sb) => {
      await sb.from('tournaments').insert({
        id: entry.id,
        child_id: activeChild.id,
        name: entry.name,
        event_date: entry.eventDate,
        ball_level: entry.ballLevel,
        matches_played: entry.matchesPlayed,
        highlight: entry.highlight,
        positive_points: entry.positivePoints,
        location: entry.location,
      });
      await sb
        .from('children')
        .update({ stars_balance: nextBalance, total_stars_earned: nextTotal })
        .eq('id', activeChild.id);
    });
  };

  const deleteTournament = (tournamentId: string) => {
    setState((prev) => ({
      ...prev,
      tournaments: prev.tournaments.filter((t) => t.id !== tournamentId),
    }));
    void syncCloudOp(async (sb) => {
      await sb.from('tournaments').delete().eq('id', tournamentId);
    });
  };

  // Memories (with Supabase Storage OR local compressed DataURL)
  const addMemory = async (input: {
    title: string;
    memoryDate: string;
    caption: string;
    mediaType: 'photo' | 'video_link';
    mediaUrl?: string;
    file?: File;
    tag: string;
  }) => {
    let finalUrl = input.mediaUrl?.trim() || './sample-court.jpg';
    let storagePath: string | undefined;

    const sb = getSupabaseClient();
    if (input.file) {
      if (sb && supabaseUser) {
        const ext = input.file.name.split('.').pop() || 'jpg';
        const path = `${supabaseUser.id}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error: uploadErr } = await sb.storage
          .from('tennis-memories')
          .upload(path, input.file, { upsert: false });
        if (!uploadErr) {
          const { data: pub } = sb.storage.from('tennis-memories').getPublicUrl(path);
          finalUrl = pub.publicUrl;
          storagePath = path;
        } else {
          finalUrl = await compressImageToDataUrl(input.file);
        }
      } else {
        finalUrl = await compressImageToDataUrl(input.file);
      }
    }

    const mem: MemoryItem = {
      id: uid('mem'),
      childId: activeChild.id,
      title: input.title,
      memoryDate: input.memoryDate,
      caption: input.caption,
      mediaType: input.mediaType,
      mediaUrl: finalUrl,
      storagePath,
      tag: input.tag,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({ ...prev, memories: [mem, ...prev.memories] }));

    void syncCloudOp(async (client) => {
      await client.from('memories').insert({
        id: mem.id,
        child_id: activeChild.id,
        title: mem.title,
        memory_date: mem.memoryDate,
        caption: mem.caption,
        media_type: mem.mediaType,
        media_url: mem.mediaUrl,
        storage_path: mem.storagePath ?? null,
        tag: mem.tag,
      });
    });
  };

  const deleteMemory = (memoryId: string) => {
    const target = state.memories.find((m) => m.id === memoryId);
    setState((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== memoryId),
    }));
    void syncCloudOp(async (sb) => {
      if (target?.storagePath) {
        await sb.storage.from('tennis-memories').remove([target.storagePath]);
      }
      await sb.from('memories').delete().eq('id', memoryId);
    });
  };

  // Quiz (respects daily star cap!)
  const recordQuizAttempt = (score: number, totalQuestions: number): number => {
    const rawStars = score * 3;
    const remainingCap = Math.max(0, DAILY_QUIZ_STAR_CAP - todayQuizStarsEarned);
    const starsEarned = Math.min(rawStars, remainingCap);

    const attempt: QuizAttempt = {
      id: uid('quiz'),
      childId: activeChild.id,
      attemptDate: todayIso,
      score,
      totalQuestions,
      starsEarned,
      createdAt: new Date().toISOString(),
    };

    const nextBalance = activeChild.starsBalance + starsEarned;
    const nextTotal = activeChild.totalStarsEarned + starsEarned;

    setState((prev) => ({
      ...prev,
      quizAttempts: [attempt, ...prev.quizAttempts],
      children: prev.children.map((c) =>
        c.id === activeChild.id
          ? { ...c, starsBalance: nextBalance, totalStarsEarned: nextTotal }
          : c,
      ),
    }));

    void syncCloudOp(async (sb) => {
      await sb.from('quiz_attempts').insert({
        id: attempt.id,
        child_id: activeChild.id,
        attempt_date: attempt.attemptDate,
        score: attempt.score,
        total_questions: attempt.totalQuestions,
        stars_earned: attempt.starsEarned,
      });
      if (starsEarned > 0) {
        await sb
          .from('children')
          .update({ stars_balance: nextBalance, total_stars_earned: nextTotal })
          .eq('id', activeChild.id);
      }
    });

    return starsEarned;
  };

  // Upcoming events
  const addUpcomingEvent = (input: Omit<UpcomingEvent, 'id' | 'childId'>) => {
    const evt: UpcomingEvent = {
      ...input,
      id: uid('evt'),
      childId: activeChild.id,
    };
    setState((prev) => ({ ...prev, upcomingEvents: [...prev.upcomingEvents, evt] }));
    void syncCloudOp(async (sb) => {
      await sb.from('upcoming_events').insert({
        id: evt.id,
        child_id: activeChild.id,
        title: evt.title,
        event_date: evt.eventDate,
        event_time: evt.eventTime,
        event_type: evt.eventType,
        location: evt.location,
        notes: evt.notes,
      });
    });
  };

  const deleteUpcomingEvent = (eventId: string) => {
    setState((prev) => ({
      ...prev,
      upcomingEvents: prev.upcomingEvents.filter((e) => e.id !== eventId),
    }));
    void syncCloudOp(async (sb) => {
      await sb.from('upcoming_events').delete().eq('id', eventId);
    });
  };

  // JSON Export / Import / Reset
  const exportJson = () => JSON.stringify(state, null, 2);

  const importJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr) as FamilyState;
      if (!parsed || !Array.isArray(parsed.children) || parsed.children.length === 0) {
        return { ok: false, error: 'Fichier JSON invalide (aucun profil enfant trouvé).' };
      }
      setState(normalizeFamilyState(parsed));
      return { ok: true };
    } catch {
      return { ok: false, error: 'Format JSON illisible.' };
    }
  };

  const resetDemoData = () => {
    setState(createInitialDemoState());
  };

  const value: TennisStoreContextValue = {
    state,
    activeChild,
    activeChildClub,
    childSessions,
    childChallenges,
    childTournaments,
    childRewards,
    childRedemptions,
    childMemories,
    childQuizAttempts,
    childEvents,
    pendingApprovalCount,
    todayQuizStarsEarned,
    isCloudConfigured,
    supabaseUser,
    syncStatus,
    syncError,
    signInSupabase,
    signUpSupabase,
    signOutSupabase,
    configureSupabase,
    refreshFromCloud,
    setActiveChildId,
    setTabletLocked,
    updateParentPin,
    updateFamilyName,
    addClub,
    updateClub,
    deleteClub,
    assignChildClub,
    addStudioChallenge,
    updateStudioChallenge,
    deleteStudioChallenge,
    assignStudioChallengeToChildren,
    addStudioReward,
    updateStudioReward,
    deleteStudioReward,
    assignStudioRewardToChildren,
    addChild,
    updateChildProfile,
    updateChildTheme,
    updateChildAvatar,
    buyAvatarItem,
    toggleMilestone,
    updateSkillLevel,
    updateClubInfo,
    updateEquipmentInfo,
    addSession,
    deleteSession,
    submitChildMoodCheckIn,
    addChallenge,
    deleteChallenge,
    requestChallengeApproval,
    approveChallenge,
    declineChallengeRequest,
    addReward,
    deleteReward,
    requestRewardRedemption,
    deliverRewardRedemption,
    cancelRewardRedemption,
    addTournament,
    deleteTournament,
    addMemory,
    deleteMemory,
    recordQuizAttempt,
    addUpcomingEvent,
    deleteUpcomingEvent,
    exportJson,
    importJson,
    resetDemoData,
  };

  return <TennisStoreContext.Provider value={value}>{reactChildren}</TennisStoreContext.Provider>;
}

export function useTennisStore(): TennisStoreContextValue {
  const ctx = useContext(TennisStoreContext);
  if (!ctx) {
    throw new Error('useTennisStore must be used within TennisStoreProvider');
  }
  return ctx;
}
