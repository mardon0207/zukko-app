-- =============================================
-- Phase 6: Admin Panel — Schema (FIXED ORDER)
-- =============================================

-- 1. Сначала добавляем колонку is_admin в profiles
alter table profiles add column if not exists is_admin boolean default false;

-- 2. Таблица вопросов
create table if not exists questions (
  id serial primary key,
  subject text not null,
  level int not null default 1,
  question text not null,
  options jsonb not null,
  answer text not null,
  created_at timestamptz default now()
);

alter table questions enable row level security;

-- 3. RLS политики (теперь is_admin уже существует)
create policy "questions_select" on questions for select
  to authenticated using (true);

create policy "questions_insert" on questions for insert
  to authenticated with check ((select is_admin from profiles where id = auth.uid()));

create policy "questions_update" on questions for update
  to authenticated using ((select is_admin from profiles where id = auth.uid()));

create policy "questions_delete" on questions for delete
  to authenticated using ((select is_admin from profiles where id = auth.uid()));

-- 4. Назначить админа
update profiles set is_admin = true
  where id = (select id from auth.users where email = 'abdunazarovmardon@gmail.com');
