-- Extensions (Supabase usually has pgcrypto enabled for gen_random_uuid)
create extension if not exists pgcrypto;


-- users table is managed by Supabase auth (auth.users)


create table if not exists entries (
                                       id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    trade_date date not null,
    pair text not null check (pair in ('JPY/KRW','JPY/USD','USD/KRW')),
    action text not null check (action in ('BUY','SELL')),
    amount numeric not null,
    price numeric not null,
    fee numeric default 0,
    memo text,
    tags text[] default '{}',
    created_at timestamptz default now()
    );


create index if not exists idx_entries_user_date on entries(user_id, trade_date);


create table if not exists memos (
                                     id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    body text not null,
    created_at timestamptz default now()
    );


create table if not exists posts (
                                     id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    body text not null,
    created_at timestamptz default now()
    );


create table if not exists comments (
                                        id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    post_id uuid not null references posts(id) on delete cascade,
    body text not null,
    created_at timestamptz default now()
    );


-- Enable Row Level Security
alter table entries enable row level security;
alter table memos enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;


-- RLS policies (owner-only)
create policy "entries_select_own" on entries
for select using (auth.uid() = user_id);
create policy "entries_insert_own" on entries
for insert with check (auth.uid() = user_id);
create policy "entries_update_own" on entries
for update using (auth.uid() = user_id);
create policy "entries_delete_own" on entries
for delete using (auth.uid() = user_id);


create policy "memos_select_own" on memos
for select using (auth.uid() = user_id);
create policy "memos_insert_own" on memos
for insert with check (auth.uid() = user_id);
create policy "memos_update_own" on memos
for update using (auth.uid() = user_id);
create policy "memos_delete_own" on memos
for delete using (auth.uid() = user_id);


create policy "posts_select_all" on posts
for select using (true); -- 게시판은 전체 읽기 가능하도록(원하면 auth.uid() = user_id 로 바꾸세요)
create policy "posts_insert_own" on posts
for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on posts
for update using (auth.uid() = user_id);
create policy "posts_delete_own" on posts
for delete using (auth.uid() = user_id);


create policy "comments_select_all" on comments
for select using (true);
create policy "comments_insert_own" on comments
for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on comments
for update using (auth.uid() = user_id);
create policy "comments_delete_own" on comments
for delete using (auth.uid() = user_id);