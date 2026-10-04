-- Como a pessoa escolheu pagar: Pix com QR Code dentro do app, ou a página do Asaas (cartão ou boleto).
alter table public.assinaturas add column metodo text not null default 'outro' check (metodo in ('pix', 'outro'));
