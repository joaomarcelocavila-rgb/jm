-- Cliente do Asaas de cada conta (um por pessoa).
create table public.pagamento_clientes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  asaas_customer_id text not null unique,
  criado_em timestamptz not null default now()
);

-- Cada assinatura criada no Asaas. A que estiver 'ativa' define o plano da conta.
create table public.assinaturas (
  id text primary key,                       -- id da assinatura no Asaas (sub_...)
  user_id uuid not null references auth.users (id) on delete cascade,
  plano text not null check (plano in ('solo', 'consultorio', 'clinica')),
  ciclo text not null check (ciclo in ('mensal', 'anual')),
  valor numeric(10,2) not null,
  status text not null default 'aguardando' check (status in ('aguardando', 'ativa', 'atrasada', 'cancelada', 'substituida')),
  link_pagamento text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index assinaturas_user_idx on public.assinaturas (user_id);

alter table public.pagamento_clientes enable row level security;
alter table public.assinaturas enable row level security;

-- A pessoa só pode ver as próprias assinaturas. Criar e alterar é só pelo servidor (funções com service role).
create policy "assinaturas: ler as próprias" on public.assinaturas
  for select to authenticated using ((select auth.uid()) = user_id);

-- O plano da conta só muda pelo servidor (pagamento confirmado ou cancelado).
-- Pelo app, uma conta nova sempre começa no Grátis e qualquer tentativa de mudar o plano é ignorada.
create function public.contas_proteger_plano() returns trigger
language plpgsql set search_path = '' as $$
begin
  if coalesce((select auth.jwt() ->> 'role'), '') = 'authenticated' then
    if tg_op = 'INSERT' then
      new.plano := 'gratis';
    else
      new.plano := old.plano;
    end if;
  end if;
  return new;
end $$;
create trigger contas_proteger_plano before insert or update on public.contas
  for each row execute function public.contas_proteger_plano();
