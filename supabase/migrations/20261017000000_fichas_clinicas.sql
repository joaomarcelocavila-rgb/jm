-- Fichas clínicas por especialidade, com modelos editáveis.
-- Dados de saúde (LGPD, dado sensível): cada usuário só enxerga, cria, edita e apaga as próprias linhas.

create table if not exists public.ficha_modelos (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  nome           text not null,
  especialidade  text not null default '',
  campos         jsonb not null default '[]'::jsonb,
  padrao         boolean not null default false,
  ordem          int not null default 0,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

create table if not exists public.fichas (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  paciente_id    text not null,
  modelo_id      uuid references public.ficha_modelos(id) on delete set null,
  titulo         text not null default '',
  respostas      jsonb not null default '{}'::jsonb,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

create index if not exists fichas_user_paciente_idx on public.fichas (user_id, paciente_id);
create index if not exists ficha_modelos_user_idx on public.ficha_modelos (user_id, ordem);

alter table public.ficha_modelos enable row level security;
alter table public.fichas enable row level security;

-- ficha_modelos: só o dono
drop policy if exists ficha_modelos_select_proprio on public.ficha_modelos;
create policy ficha_modelos_select_proprio on public.ficha_modelos
  for select to authenticated using (user_id = auth.uid());
drop policy if exists ficha_modelos_insert_proprio on public.ficha_modelos;
create policy ficha_modelos_insert_proprio on public.ficha_modelos
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists ficha_modelos_update_proprio on public.ficha_modelos;
create policy ficha_modelos_update_proprio on public.ficha_modelos
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists ficha_modelos_delete_proprio on public.ficha_modelos;
create policy ficha_modelos_delete_proprio on public.ficha_modelos
  for delete to authenticated using (user_id = auth.uid());

-- fichas: só o dono
drop policy if exists fichas_select_proprio on public.fichas;
create policy fichas_select_proprio on public.fichas
  for select to authenticated using (user_id = auth.uid());
drop policy if exists fichas_insert_proprio on public.fichas;
create policy fichas_insert_proprio on public.fichas
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists fichas_update_proprio on public.fichas;
create policy fichas_update_proprio on public.fichas
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists fichas_delete_proprio on public.fichas;
create policy fichas_delete_proprio on public.fichas
  for delete to authenticated using (user_id = auth.uid());

-- nenhum acesso anônimo
revoke all on public.ficha_modelos from anon;
revoke all on public.fichas from anon;
grant select, insert, update, delete on public.ficha_modelos to authenticated;
grant select, insert, update, delete on public.fichas to authenticated;
