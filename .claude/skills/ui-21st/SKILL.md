---
name: ui-21st
description: Cria e integra componentes de interface React/Tailwind em projetos no Claude Code usando o 21st MCP (antigo Magic MCP da 21st.dev) quando ele estiver conectado, e construindo os componentes por conta própria quando não estiver. Use sempre que o usuário pedir para criar, melhorar ou redesenhar uma tela, página, seção ou componente de UI (landing page, hero, pricing, header, footer, card, formulário, dashboard, modal, menu, botão), mencionar 21st, 21st.dev, Magic MCP, shadcn, "componente bonito", "deixar o site mais moderno", ou pedir um logo de marca em SVG, mesmo que não cite a 21st.
---

# UI com 21st (híbrida)

Esta skill leva um pedido de interface até um componente pronto, integrado ao projeto e funcionando. Ela usa o catálogo da 21st.dev quando o MCP está disponível, porque partir de um componente testado costuma dar um resultado mais polido e mais rápido. Quando o MCP não está disponível, ou não tem nada que sirva, o Claude constrói o componente com o mesmo padrão de qualidade. O usuário nunca deve ficar travado por causa do MCP.

## Custos da 21st (guie as escolhas por isso)

- **Busca no catálogo:** grátis. Use à vontade.
- **Instalação de componente:** limitada a cerca de 2 por dia. Não gaste com tentativa e erro.
- **Geração com IA (`generate`):** consome créditos pagos. Use só quando a busca não resolver.

Esses limites podem mudar. Se uma chamada falhar por limite ou crédito, siga para o próximo caminho do fluxo, sem insistir.

## Fluxo

### 1. Entenda o projeto antes de buscar qualquer coisa

Leia o suficiente para que o resultado pareça nativo do projeto:

- `package.json`: framework (Next.js, Vite, Remix etc.), versão do React e do Tailwind (v3 ou v4), bibliotecas já presentes (shadcn/ui, Radix, framer-motion, lucide-react).
- Configuração de estilo: `tailwind.config.*`, `globals.css` ou `app.css` (variáveis CSS, cores, fontes, raio de borda), `components.json` se usar shadcn.
- Componentes existentes em `components/`, `components/ui/` ou similar. Se o projeto já tem um Button, Card ou Input, reutilize-os em vez de trazer outra versão.
- Convenções: TypeScript ou JS, alias de import (`@/`), onde ficam os componentes, idioma dos textos.

Se o projeto não usa React/Tailwind (por exemplo, PHP puro ou WordPress clássico), avise o usuário. Os componentes da 21st são React/Tailwind, então ofereça converter para o formato do projeto (HTML + CSS ou Tailwind via CDN) ou construir direto nele.

### 2. Verifique se o 21st MCP está disponível

Procure ferramentas com `21st` no nome (por exemplo `mcp__21st__search`, `mcp__21st__generate`, `mcp__21st__search_logo`). Os nomes antigos do Magic (`21st_magic_component_builder`, `21st_magic_component_inspiration`, `logo_search`) também funcionam, mas prefira os novos. Se houver dúvida sobre os parâmetros, siga o schema que a própria ferramenta informa.

- **Disponível:** siga para o passo 3.
- **Indisponível ou com erro de autenticação:** vá para o passo 5 (construir sem a 21st). No fim, mencione em uma linha como ativar: `npx @21st-dev/cli@latest init --client claude` e uma chave nova em https://21st.dev/mcp (as chaves antigas do Magic foram resetadas).

### 3. Busque no catálogo (grátis)

- Faça buscas curtas e em inglês, que é o idioma do catálogo: "pricing table", "hero section with gradient", "testimonial carousel".
- Se a primeira busca for fraca, reformule com sinônimos ou com um estilo diferente ("minimal", "bento", "glassmorphism").
- Compare 2 ou 3 candidatos pelo que importa para este projeto: encaixe no visual existente, dependências extras, acessibilidade, se é responsivo.
- Quando o pedido for vago ("quero algo moderno"), mostre ao usuário as 2 ou 3 melhores opções com uma frase sobre cada uma e deixe ele escolher. Se o pedido for claro, escolha você e siga.

Só instale depois de escolher. Como as instalações são poucas por dia, a escolha deve ser feita lendo e comparando, não instalando para testar.

Para logos de marcas (Google, Stripe, Pix etc.), use a ferramenta de busca de logos, uma marca por chamada.

### 4. Gere com IA só se a busca não resolver

Se nada no catálogo servir, avise o usuário que a geração consome créditos da 21st antes de usá-la, a menos que ele já tenha pedido para gerar. Peça poucas variantes (2 ou 3) e escreva um prompt específico: o que o componente faz, o conteúdo real, o estilo do projeto e as restrições (responsivo, modo escuro).

Se o usuário preferir não gastar créditos, ou se a geração falhar, vá para o passo 5.

### 5. Construa sem a 21st (fallback)

Construa o componente com o mesmo padrão de qualidade que se esperaria do catálogo:

- Use os tokens do projeto (variáveis CSS e cores do tema) em vez de cores soltas, para que o componente acompanhe o tema e o modo escuro.
- Use os componentes base existentes (shadcn/ui, se houver).
- Faça hierarquia visual clara, espaçamento consistente e estados de hover, focus e disabled.
- Responsivo do celular ao desktop (comece pelo mobile).
- Acessível: HTML semântico, `aria-*` onde fizer sentido, foco visível, contraste suficiente, navegação por teclado.
- Animações discretas e respeitando `prefers-reduced-motion`.

### 6. Adapte e integre

Um componente de catálogo raramente serve como veio. Antes de considerar pronto:

- Troque cores, fontes e raios pelos tokens do projeto.
- Substitua o texto de exemplo pelo conteúdo real ou por textos plausíveis no idioma do site (em geral português do Brasil), e nunca deixe "Lorem ipsum" ou "Acme Inc".
- Ajuste imports ao alias do projeto, remova dependências duplicadas e instale só as que faltam, com o gerenciador que o projeto já usa (veja o lockfile: npm, pnpm, yarn ou bun).
- Tipagem: se o projeto é TypeScript, exporte props tipadas.
- Coloque o arquivo onde o projeto guarda componentes desse tipo e conecte-o à página que o usuário pediu.

### 7. Verifique

Rode o que o projeto tiver: type-check (`tsc --noEmit`), lint e build. Corrija os erros que forem seus. Se houver servidor de desenvolvimento e um navegador disponível, abra a página e confira em largura de celular e de desktop.

### 8. Relate ao usuário

Seja breve:

- De onde veio: componente da 21st (nome e link, se houver), gerado pela IA da 21st, ou construído direto.
- Arquivos criados ou alterados e dependências adicionadas.
- Qualquer coisa que ficou pendente (imagem real, texto final, link de destino de botão).
- Se o MCP não estava conectado, a linha sobre como ativá-lo.

## Exemplos

**Exemplo 1**
Pedido: "cria uma seção de preços com 3 planos pro site do curso"
Caminho: lê o projeto (Next.js + shadcn) → busca "pricing table three tiers" → escolhe o que melhor combina → instala → troca os textos pelos planos reais em pt-BR e as cores pelos tokens → build → relata.

**Exemplo 2**
Pedido: "melhora o header do site" (sem MCP conectado)
Caminho: lê o header atual e o tema → redesenha com os componentes existentes, menu mobile acessível e estado ativo → build → relata e menciona em uma linha como ativar o 21st MCP.

**Exemplo 3**
Pedido: "quero um dashboard de alunos diferente de tudo" (busca sem bons resultados)
Caminho: busca algumas variações → nada serve → avisa que a geração usa créditos → com o ok do usuário, gera 3 variantes → mostra → integra a escolhida.
