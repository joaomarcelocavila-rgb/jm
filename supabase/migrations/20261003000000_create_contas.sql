-- Uma linha por dentista: os dados do consultório (agenda, clientes, serviços...) e o plano.
create table public.contas (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  plano text not null default 'gratis' check (plano in ('gratis', 'solo', 'consultorio', 'clinica')),
  atualizado_em timestamptz not null default now()
);

alter table public.contas enable row level security;

-- Cada pessoa só enxerga e altera a própria conta.
create policy "contas: ler a própria" on public.contas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "contas: criar a própria" on public.contas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "contas: alterar a própria" on public.contas
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "contas: apagar a própria" on public.contas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Atualiza a data a cada gravação.
create function public.contas_tocar() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.atualizado_em := now();
  return new;
end $$;
create trigger contas_tocar before update on public.contas
  for each row execute function public.contas_tocar();
