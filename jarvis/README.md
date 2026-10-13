# J.A.R.V.I.S.

Assistente pessoal que trabalha em turnos para vários negócios ao mesmo tempo: briefing de mercado, vendas do Asaas, relatório do MaisOdonto, lembretes, rotina, memória que evolui e uma fábrica de ideias de SaaS.

Este diretório guarda só o código. Memória, contatos e dados de clientes ficam fora do repositório.

## Estrutura

```
jarvis/
  painel/jarvis.html                       painel em estilo HUD (artifact do claude.ai)
  supabase/functions/jarvis-asaas/index.ts recebe os webhooks do Asaas
  supabase/migrations/jarvis_vendas_asaas.sql
  sql/relatorio_maisodonto.sql             relatório diário, somente leitura
  tarefas/                                 prompts das tarefas agendadas
  memoria-modelo/                          modelos de memória sem dados pessoais
```

## Como funciona

- **Painel** (`painel/jarvis.html`): roda como artifact no claude.ai. Ele depende das capacidades do runtime de artifacts (`window.claude.use`): `sample` para a conversa, `db` para lembretes, rotina, briefing e memória, e `mcp` para o Supabase (`execute_sql`) e as tarefas agendadas (`fire_trigger`, `list_triggers`). **Aberto direto do GitHub Pages ele carrega o visual, mas as funções ficam desligadas.**
- **Vendas**: o webhook do Asaas chama a função `jarvis-asaas`, que grava em `jarvis.vendas`. O painel lê essa tabela só com SELECT.
- **Tarefas agendadas** (prompts em `tarefas/`):
  - Briefing: todo dia às 6h56.
  - Relatório MaisOdonto: diário.
  - Turno do Jarvis: a cada 2 horas, com prospecção, produção, resumo, follow-up, pesquisa, aprovações e fechamento.
  - Ideias de SaaS: de hora em hora.
  - Gerador de SaaS: sob demanda, pelo botão Gerar.
- **Memória**: arquivos markdown guardados no banco do artifact (collection `memoria`). Os modelos estão em `memoria-modelo/`.

## Para instalar em outra conta

1. Troque os marcadores no painel e nos prompts: `SEU_ARTIFACT_ID`, `SEU_PROJECT_ID_SUPABASE`, `SEU_AGENT_ID_ELEVENLABS`, `SEU_TRIGGER_ID_GERADOR`, `seu-email@exemplo.com`.
2. Aplique a migração e faça o deploy da função com `verify_jwt = false`. Em `TOKEN_HASH`, coloque o SHA-256 do token que você vai usar no webhook do Asaas.
3. No Asaas, vá em Integrações, depois em Webhooks, e crie um webhook apontando para a função. Marque os eventos de cobrança recebida, confirmada e estornada.
4. Publique o painel como artifact no claude.ai e crie as tarefas agendadas com os prompts de `tarefas/`.

## Limites

O Jarvis só lê dados de sistemas, nunca altera nem apaga. Não envia mensagem fria sem aprovação, não usa automação não oficial de WhatsApp ou Instagram e não gasta dinheiro. Também não inventa números nem depoimentos. As regras completas estão em `memoria-modelo/limites.md`.
