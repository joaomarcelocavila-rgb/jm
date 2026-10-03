-- Número que sobe a cada gravação. O app só grava se a versão for a mesma que ele leu;
-- se outro aparelho salvou antes, o app junta as mudanças e tenta de novo.
alter table public.contas add column versao bigint not null default 0;
