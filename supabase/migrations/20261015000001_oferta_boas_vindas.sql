-- Oferta de boas-vindas: 10% na primeira cobrança para quem criou a conta há menos de 24 horas.
-- desconto_pct guarda o percentual aplicado (0 = sem oferta); valor_primeira guarda o valor da 1ª cobrança com desconto.
-- O valor cheio continua em "valor" e é o que as cobranças seguintes usam.

alter table public.assinaturas
  add column if not exists desconto_pct int not null default 0,
  add column if not exists valor_primeira numeric(10,2);
