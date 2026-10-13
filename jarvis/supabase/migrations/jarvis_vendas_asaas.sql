-- Tabela de vendas do Asaas usada pelo painel do Jarvis.
-- Schema separado, fora da API pública (anon/authenticated sem acesso).
create schema if not exists jarvis;
revoke all on schema jarvis from anon, authenticated;
create table if not exists jarvis.vendas (
  payment_id text primary key,
  evento text,
  status text,
  valor numeric(12,2),
  valor_liquido numeric(12,2),
  forma text,
  descricao text,
  cliente text,
  data_pagamento date,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now(),
  bruto jsonb
);
alter table jarvis.vendas enable row level security;
create index if not exists vendas_data_idx on jarvis.vendas (data_pagamento);
