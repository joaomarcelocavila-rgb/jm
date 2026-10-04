-- O app só precisa saber se a pessoa já tem cadastro de pagamento (para não pedir o CPF de novo).
create policy "pagamento_clientes: ler o próprio" on public.pagamento_clientes
  for select to authenticated using ((select auth.uid()) = user_id);
