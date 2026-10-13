Gere o relatório diário do MaisOdonto. SOMENTE LEITURA: rode apenas SELECT; nunca altere, apague ou insira nada no banco.

1. Leia a lista de e-mails ignorados: ArtifactData "get", url https://claude.ai/artifact/SEU_ARTIFACT_ID, collection "config", doc_id "maisodonto", campo "ignorar".
2. Rode no conector Supabase (execute_sql, project_id "SEU_PROJECT_ID_SUPABASE") a consulta de `../sql/relatorio_maisodonto.sql`, trocando a lista em "ignorar" pelos e-mails em minúsculas.
3. Escreva o relatório em português, curto, sem emoji, horários no fuso de Recife:

Relatório MaisOdonto · DD/MM, HH:MM

1. Contas novas nas últimas 24h: N
   - Nome · email · WhatsApp X (só se tiver) · cadastro DD/MM, HH:MM

2. Ativação das contas novas
   - Nome: paciente sim/não · consulta sim/não   (ou "- Nenhuma conta nova.")

3. Contas paradas (1 a 7 dias, sem paciente): N
   - Nome · email · WhatsApp X ou "sem WhatsApp" · criada há N dia(s)

4. Vendas
   - Nova assinatura: Nome · plano P ciclo · R$ valor   (ou "- Nenhuma assinatura paga nova nas últimas 24h.")
   - Assinantes pagos: N · Receita mensal: R$ X,XX

Ação do dia: se houver paradas, "Chamar A e B, que criaram conta e não começaram."; senão, se houver novas sem paciente, "Acompanhar A amanhã: criou conta e ainda não cadastrou paciente."; senão, se houver vendas, "Dar boas-vindas a A, que assinou nas últimas 24h."; senão "Nenhuma conta para chamar hoje."

4. Envie o relatório ao usuário com SendUserMessage. Se o Supabase falhar, diga o motivo em uma frase.
