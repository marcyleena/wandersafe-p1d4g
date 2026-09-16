# WanderSafe – Supabase Setup

Create a new Supabase project at https://supabase.com and run the following SQL in the SQL Editor.

## 1. Enable Row-Level Security on all tables (done automatically below).

## 2. Profiles table (auto-created from auth users)

```sql
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  created_at timestamptz default now()
);

-- Populate profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

alter table profiles enable row level security;
create policy "Users can read all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
```

## 3. Destinations table

```sql
create table destinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  country text,
  status text default 'planned',
  visited date,
  notes text,
  created_at timestamptz default now()
);

alter table destinations enable row level security;
create policy "Users manage own destinations" on destinations for all using (auth.uid() = user_id);
```

## 4. Safety Ratings table

```sql
create table safety_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  destination text not null,
  country text,
  rating integer check (rating between 1 and 5),
  review text,
  tips text,
  created_at timestamptz default now()
);

alter table safety_ratings enable row level security;
create policy "Authenticated users can read ratings" on safety_ratings for select using (auth.role() = 'authenticated');
create policy "Users manage own ratings" on safety_ratings for insert with check (auth.uid() = user_id);
create policy "Users delete own ratings" on safety_ratings for delete using (auth.uid() = user_id);
```

## 5. Packing Lists table

```sql
create table packing_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  trip_type text default 'city',
  created_at timestamptz default now()
);

alter table packing_lists enable row level security;
create policy "Users manage own lists" on packing_lists for all using (auth.uid() = user_id);
```

## 6. Packing Items table

```sql
create table packing_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references packing_lists(id) on delete cascade not null,
  text text not null,
  checked boolean default false,
  created_at timestamptz default now()
);

alter table packing_items enable row level security;
create policy "Users manage items in own lists" on packing_items for all
  using (exists (select 1 from packing_lists where id = packing_items.list_id and user_id = auth.uid()));
```

## 7. Connections table

```sql
create table connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  destination text not null,
  dates text,
  looking_for text,
  bio text,
  created_at timestamptz default now()
);

alter table connections enable row level security;
create policy "Authenticated users can read connections" on connections for select using (auth.role() = 'authenticated');
create policy "Users manage own connections" on connections for insert with check (auth.uid() = user_id);
create policy "Users delete own connections" on connections for delete using (auth.uid() = user_id);
```

## 8. Environment Variables

In your Vite project, create a `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in Supabase → Settings → API.

## 9. PWA Icons

Place `icon-192.png` and `icon-512.png` in the `/public` folder for the home screen install feature.