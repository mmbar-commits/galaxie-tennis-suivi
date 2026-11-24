-- ============================================================================
-- GALAXIE TENNIS SUIVI — Schéma PostgreSQL complet pour Supabase
-- Copie-colle ce script dans Supabase > SQL Editor > New Query puis clique Run
-- ============================================================================

-- Extension UUID
create extension if not exists "pgcrypto";

-- 1. Familles (1 famille par compte parent Supabase)
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  parent_pin text not null default '1234',
  family_name text not null default 'Ma Famille Tennis',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enfants (multi-enfants prêt)
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  age integer not null default 7,
  current_ball text not null default 'rouge' check (current_ball in ('blanc', 'violet', 'rouge', 'orange', 'vert')),
  stars_balance integer not null default 0,
  total_stars_earned integer not null default 0,
  streak_count integer not null default 0,
  child_theme text not null default 'terre-battue' check (child_theme in ('terre-battue', 'galaxie', 'gazon')),
  avatar_config jsonb not null default '{}'::jsonb,
  unlocked_items jsonb not null default '[]'::jsonb,
  milestones_completed jsonb not null default '[]'::jsonb,
  skill_levels jsonb not null default '{}'::jsonb,
  club_info jsonb not null default '{}'::jsonb,
  equipment_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Séances d'entraînement
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
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

-- 6. Boutique de récompenses réelles (définies par le parent)
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

-- 8. Galerie souvenirs (photos & liens vidéos)
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

-- 9. Tentatives de Mini-Quiz (limite quotidienne d'étoiles)
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
-- ROW LEVEL SECURITY (RLS) — Chaque famille n'accède qu'à ses propres données
-- ============================================================================

alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.sessions enable row level security;
alter table public.challenges enable row level security;
alter table public.tournaments enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.memories enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.upcoming_events enable row level security;

-- Helper function : vérifie si l'enfant appartient à l'utilisateur connecté
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

-- Policies families
create policy "families_owner_all" on public.families
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Policies children
create policy "children_owner_all" on public.children
  for all using (
    exists (select 1 from public.families f where f.id = family_id and f.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.families f where f.id = family_id and f.owner_id = auth.uid())
  );

-- Policies tables enfants
create policy "sessions_owner_all" on public.sessions
  for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));

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
-- STORAGE BUCKET POUR LES PHOTOS SOUVENIRS
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

-- ============================================================================
-- REALTIME (Synchronisation instantanée Téléphone Parent <-> Tablette Enfant)
-- ============================================================================

alter publication supabase_realtime add table public.children;
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.challenges;
alter publication supabase_realtime add table public.reward_redemptions;
alter publication supabase_realtime add table public.rewards;
alter publication supabase_realtime add table public.memories;
alter publication supabase_realtime add table public.tournaments;
alter publication supabase_realtime add table public.upcoming_events;
