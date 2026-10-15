-- Funil do MaisOdonto: marcos de ativação e conversão por conta.
-- Cada usuário só grava os próprios eventos. Ninguém lê pelo app:
-- a leitura é feita no painel do Supabase (service role).

create table if not exists public.eventos_funil (
  id       bigint generated always as identity primary key,
  user_id  uuid not null references auth.users(id) on delete cascade,
  evento   text not null check (evento in (
             'conta_criada','paciente_1','consulta_1','lembrete_1',
             'limite_lembretes','limite_consultas','assinou','oferta_vista','oferta_assinou')),
  em       timestamptz not null default now()
);

create index if not exists eventos_funil_user_idx on public.eventos_funil (user_id, evento);

alter table public.eventos_funil enable row level security;

drop policy if exists eventos_funil_inserir_proprio on public.eventos_funil;
create policy eventos_funil_inserir_proprio on public.eventos_funil
  for insert to authenticated
  with check (user_id = auth.uid());

revoke all on public.eventos_funil from anon, authenticated;
grant insert on public.eventos_funil to authenticated;
