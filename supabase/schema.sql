-- ============================================================================
-- GALAXIE TENNIS SUIVI — Schéma PostgreSQL complet pour Supabase
-- Supporte comptes Parent & Coach (login), Code Unique Coach, Assignations,
-- Grille officielle FFT TTCA, Clubs, Studio et Realtime.
-- ============================================================================

create extension if not exists "pgcrypto";

-- 0. Profils utilisateurs (Parent, Coach avec code unique individuel, ou Admin Général)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  full_name text not null,
  phone_country_code text not null default '+33',
  phone_number text not null default '',
  phone_e164 text default '',
  phone_verified boolean not null default false,
  role text not null check (role in ('parent', 'coach', 'admin')),
  club_id text,
  club_name text default '',
  pending_club_proposal_id text,
  coach_code text unique,
  created_at timestamptz not null default now()
);

-- 0b. Référentiel officiel des clubs (géré par l'Administrateur Général)
create table if not exists public.official_clubs (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  city text default '',
  postal_code text default '',
  fft_code text default '',
  court_surface text default '',
  address text default '',
  schedule text default '',
  coach_phone text default '',
  coach_email text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 0c. Propositions de nouveaux clubs par les coachs (à valider par l'Admin Général)
create table if not exists public.club_proposals (
  id text primary key default gen_random_uuid()::text,
  proposed_name text not null,
  proposed_city text default '',
  proposed_address text default '',
  requested_by_coach_id uuid references auth.users(id) on delete cascade,
  requested_by_coach_name text not null default '',
  requested_by_coach_email text not null default '',
  requested_by_coach_phone text default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'merged', 'rejected')),
  resolved_club_id text references public.official_clubs(id) on delete set null,
  admin_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- 1. Familles (1 famille par compte parent Supabase)
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  parent_pin text not null default '1234',
  coach_pin text not null default '0000',
  family_name text not null default 'Ma Famille Tennis',
  clubs jsonb not null default '[]'::jsonb,
  studio_challenges jsonb not null default '[]'::jsonb,
  studio_rewards jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enfants (créés par les parents)
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  parent_id uuid references auth.users(id) on delete cascade,
  name text not null,
  age integer not null default 7,
  current_ball text not null default 'rouge' check (current_ball in ('blanc', 'violet', 'rouge', 'orange', 'vert')),
  club_id text,
  stars_balance integer not null default 0,
  total_stars_earned integer not null default 0,
  streak_count integer not null default 0,
  child_theme text not null default 'terre-battue' check (child_theme in ('terre-battue', 'galaxie', 'gazon')),
  avatar_config jsonb not null default '{}'::jsonb,
  unlocked_items jsonb not null default '[]'::jsonb,
  milestones_completed jsonb not null default '[]'::jsonb,
  milestone_evaluations jsonb not null default '{}'::jsonb,
  skill_levels jsonb not null default '{}'::jsonb,
  club_info jsonb not null default '{}'::jsonb,
  equipment_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2b. Assignations Coach <-> Enfant (via code unique coach + acceptation coach)
create table if not exists public.coach_child_links (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  parent_id uuid not null references auth.users(id) on delete cascade,
  parent_name text not null default '',
  coach_id uuid not null references auth.users(id) on delete cascade,
  coach_name text not null default '',
  coach_code text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  requested_at timestamptz not null default now(),
  responded_at timestamptz,
  unique (child_id, coach_id)
);

-- 3. Séances d'entraînement
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  club_id text,
  session_date date not null default current_date,
  session_type text not null default 'cours_club' check (session_type in ('cours_club', 'jeu_famille', 'stage', 'plateau')),
  duration_min integer not null default 60,
  focus_skills jsonb not null default '[]'::jsonb,
  effort_rating integer not null default 4 check (effort_rating between 1 and 5),
  stars_awarded integer not null default 10,
  coach_note text default '',
  parent_note text default '',
  child_mood text check (child_mood in ('adore', 'fiere', 'rigolo', 'fatiguee', 'difficile')),
  child_favorite_moment text default '',
  created_at timestamptz not null default now()
);

-- 4. Défis & objectifs de la semaine
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  title text not null,
  description text default '',
  category text not null default 'technique',
  stars_reward integer not null default 15,
  status text not null default 'active' check (status in ('active', 'pending_approval', 'completed')),
  week_label text default '',
  parent_feedback text default '',
  requested_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 5. Plateaux & petits matchs Galaxie
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  name text not null,
  event_date date not null default current_date,
  ball_level text not null default 'rouge',
  matches_played integer not null default 3,
  highlight text default '',
  positive_points text default '',
  location text default '',
  created_at timestamptz not null default now()
);

-- 6. Boutique de récompenses réelles
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  title text not null,
  description text default '',
  emoji text not null default '🍦',
  star_cost integer not null default 30,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7. Demandes de récompenses
create table if not exists public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  reward_id uuid references public.rewards(id) on delete set null,
  reward_title text not null,
  reward_emoji text not null default '🎁',
  star_cost integer not null default 30,
  status text not null default 'pending' check (status in ('pending', 'delivered', 'declined')),
  requested_at timestamptz not null default now(),
  delivered_at timestamptz
);

-- 8. Galerie souvenirs
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  title text not null,
  memory_date date not null default current_date,
  caption text default '',
  media_type text not null default 'photo' check (media_type in ('photo', 'video_link')),
  media_url text not null,
  storage_path text,
  tag text default 'Entraînement',
  created_at timestamptz not null default now()
);

-- 9. Tentatives de Mini-Quiz
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  attempt_date date not null default current_date,
  score integer not null default 0,
  total_questions integer not null default 5,
  stars_earned integer not null default 0,
  created_at timestamptz not null default now()
);

-- 10. Calendrier des prochains cours & plateaux
create table if not exists public.upcoming_events (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  title text not null,
  event_date date not null,
  event_time text default '',
  event_type text not null default 'cours' check (event_type in ('cours', 'plateau', 'stage', 'autre')),
  location text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- FONCTIONS HELPER & ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.official_clubs enable row level security;
alter table public.club_proposals enable row level security;
alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.coach_child_links enable row level security;
alter table public.sessions enable row level security;
alter table public.challenges enable row level security;
alter table public.tournaments enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.memories enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.upcoming_events enable row level security;

-- Vérifie si l'utilisateur connecté est Administrateur Général
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Recherche sécurisée d'un coach par son code unique individuel
create or replace function public.find_coach_by_code(code_input text)
returns table (id uuid, full_name text, club_name text, coach_code text)
language sql
security definer
stable
as $$
  select p.id, p.full_name, p.club_name, p.coach_code
  from public.profiles p
  where p.role = 'coach'
    and upper(p.coach_code) = upper(trim(code_input))
  limit 1;
$$;

-- Vérifie si l'enfant appartient au parent connecté
create or replace function public.is_my_child(target_child_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.children c
    join public.families f on f.id = c.family_id
    where c.id = target_child_id
      and f.owner_id = auth.uid()
  );
$$;

-- Vérifie si le coach connecté a une assignation ACCEPTÉE sur cet enfant
create or replace function public.is_assigned_coach(target_child_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.coach_child_links l
    where l.child_id = target_child_id
      and l.coach_id = auth.uid()
      and l.status = 'accepted'
  );
$$;

-- Policies profiles (propre profil + lecture/gestion par Super Admin)
create policy "profiles_own_all" on public.profiles
  for all using (id = auth.uid() or public.is_super_admin())
  with check (id = auth.uid() or public.is_super_admin());

-- Policies official_clubs (lecture publique pour la liste d'inscription coach, écriture Super Admin)
create policy "official_clubs_public_read" on public.official_clubs
  for select using (true);

create policy "official_clubs_admin_write" on public.official_clubs
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- Policies club_proposals (le coach crée & voit sa demande, le Super Admin modère tout)
create policy "club_proposals_coach_insert" on public.club_proposals
  for insert to authenticated
  with check (requested_by_coach_id = auth.uid());

create policy "club_proposals_coach_or_admin_select" on public.club_proposals
  for select using (requested_by_coach_id = auth.uid() or public.is_super_admin());

create policy "club_proposals_admin_update_delete" on public.club_proposals
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- Policies families
create policy "families_owner_all" on public.families
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Policies children (Parent propriétaire + Coach accepté pour valider acquis)
create policy "children_parent_all" on public.children
  for all using (
    exists (select 1 from public.families f where f.id = family_id and f.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.families f where f.id = family_id and f.owner_id = auth.uid())
  );

create policy "children_coach_select_update" on public.children
  for select using (public.is_assigned_coach(id));

create policy "children_coach_update_acquis" on public.children
  for update using (public.is_assigned_coach(id)) with check (public.is_assigned_coach(id));

-- Policies coach_child_links
create policy "links_parent_manage" on public.coach_child_links
  for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());

create policy "links_coach_view_respond" on public.coach_child_links
  for select using (coach_id = auth.uid());

create policy "links_coach_update_status" on public.coach_child_links
  for update using (coach_id = auth.uid()) with check (coach_id = auth.uid());

-- Policies sessions (Parent + Coach accepté)
create policy "sessions_parent_or_coach" on public.sessions
  for all using (public.is_my_child(child_id) or public.is_assigned_coach(child_id))
  with check (public.is_my_child(child_id) or public.is_assigned_coach(child_id));

-- Policies autres tables enfant (Parent uniquement)
create policy "challenges_owner_all" on public.challenges
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

create policy "tournaments_owner_all" on public.tournaments
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

create policy "rewards_owner_all" on public.rewards
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

create policy "reward_redemptions_owner_all" on public.reward_redemptions
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

create policy "memories_owner_all" on public.memories
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

create policy "quiz_attempts_owner_all" on public.quiz_attempts
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

create policy "upcoming_events_owner_all" on public.upcoming_events
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

-- ============================================================================
-- STORAGE & REALTIME
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('tennis-memories', 'tennis-memories', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload tennis memories"
on storage.objects for insert to authenticated
with check (bucket_id = 'tennis-memories' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view tennis memories"
on storage.objects for select to public
using (bucket_id = 'tennis-memories');

create policy "Users can delete own tennis memories"
on storage.objects for delete to authenticated
using (bucket_id = 'tennis-memories' and (storage.foldername(name))[1] = auth.uid()::text);

alter publication supabase_realtime add table public.children;
alter publication supabase_realtime add table public.coach_child_links;
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.challenges;
alter publication supabase_realtime add table public.reward_redemptions;
alter publication supabase_realtime add table public.rewards;
alter publication supabase_realtime add table public.memories;
alter publication supabase_realtime add table public.tournaments;
alter publication supabase_realtime add table public.upcoming_events;
