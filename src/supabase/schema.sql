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


    
-- 공개 프로필 테이블(표시 가능한 최소 정보만)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    full_name text,
    avatar_url text,
    updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- profiles RLS 정책 (예시: 인증된 사용자만 조회 가능)
create policy "profiles read for authenticated"
on public.profiles
for select
to authenticated
using (true);

-- posts 테이블에 user_email 컬럼 추가 (선택: 직접 저장할 경우)
alter table posts add column if not exists user_email text;

-- posts_with_author 뷰 생성
create or replace view public.posts_with_author as
select
  p.id, p.title, p.body, p.created_at,
  pr.full_name,
  pr.email,
  pr.avatar_url
from public.posts p
join public.profiles pr on pr.id = p.user_id;

-- 트리거: auth.users → profiles 동기화
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set email = new.email,
         full_name = new.raw_user_meta_data->>'full_name',
         avatar_url = new.raw_user_meta_data->>'avatar_url',
         updated_at = now()
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email, raw_user_meta_data on auth.users
for each row execute procedure public.handle_user_updated();

-- 기존 사용자 동기화 (최초 1회 실행)
insert into public.profiles (id, email, full_name, avatar_url)
select
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      avatar_url = excluded.avatar_url,
      updated_at = now();


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