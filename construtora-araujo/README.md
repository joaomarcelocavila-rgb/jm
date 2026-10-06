# Construtora Araújo: site institucional

Next.js (App Router) + TypeScript + Tailwind CSS 4, GSAP + ScrollTrigger no hero e Lenis para o scroll suave (só no desktop com mouse; no touch fica o scroll nativo).

Domínio sugerido: **construtoraaraujo.com.br**

---

## Rodar localmente

Precisa de Node 20 ou mais novo.

```bash
cd construtora-araujo
npm install
npm run dev        # http://localhost:3000
```

Para testar como vai ficar em produção:

```bash
npm run build && npm start
```

`npm run typecheck` confere os tipos sem gerar build.

## Publicar na Vercel

O site fica na pasta `construtora-araujo/` dentro deste repositório, então na Vercel:

1. **Add New → Project** e importe o repositório do GitHub.
2. Em **Root Directory**, escolha `construtora-araujo`. O framework (Next.js) é detectado sozinho.
3. **Deploy**. Não precisa de variável de ambiente.
4. Em **Settings → Domains**, adicione `construtoraaraujo.com.br` e `www.construtoraaraujo.com.br` e siga as instruções de DNS do registro.br.

Pela linha de comando: `npx vercel` dentro da pasta `construtora-araujo/` (e `npx vercel --prod` para produção).

Se o domínio final for outro, troque `url` em `lib/site.ts`. Ele é usado no sitemap, no robots, no Open Graph e no Schema.org.

---

## Onde trocar cada coisa

| O quê | Arquivo |
| --- | --- |
| Nome, endereço, WhatsApp, e-mail, nota do Google, horário, CNPJ, número de obras, bairros, crédito da agência | `lib/site.ts` |
| Textos dos serviços, etapas, obras da galeria, antes e depois, depoimentos, perguntas frequentes | `lib/conteudo.ts` |
| Texto das páginas `/construcao`, `/reforma`, `/acabamento` | `lib/paginas.ts` |
| Logo | `components/Logo.tsx` (provisório, ver abaixo) |
| Favicon | `app/icon.svg` e `app/apple-icon.png` |
| Cores, fontes, botões, sublinhado do hover | `app/globals.css` |
| Title, description, Open Graph | `app/layout.tsx` |
| Schema.org (GeneralContractor) | `lib/schema.ts` |

### Dados pendentes: `[CONFIRMAR]`

Todo dado que falta está marcado com `[CONFIRMAR]` ou `[PEDIR AO CLIENTE]` no código. Para achar todos:

```bash
grep -rn "CONFIRMAR\|PEDIR AO CLIENTE" lib components app
```

Enquanto `mostrarPendencias` for `true` em `lib/site.ts`, o site mostra uma etiqueta tracejada `[CONFIRMAR]` ao lado de cada dado pendente, para o cliente ver o que falta na própria página. **Antes de divulgar o site, troque para `false`**: o que ainda estiver vazio some da página em vez de mostrar a etiqueta. O único `[CONFIRMAR]` que continua visível é o número de obras entregues, até ele ser preenchido.

Dados que já têm lugar certo para preencher:

- **Horário**: `site.horario` em `lib/site.ts`. Preencha o texto e o formato do Schema (o exemplo está no comentário). O horário só entra no Schema.org depois de preenchido.
- **Obras entregues**: `site.obrasEntregues` (só o número). O contador passa a animar sozinho.
- **CNPJ**: `site.cnpj`.
- **Bairros**: `site.bairros`. Depois de confirmar, mude `bairrosConfirmados` para `true`. A lista aparece em "Onde atendemos", nas páginas de serviço e no Schema.org.
- **Link da ficha do Google**: `site.google.fichaUrl`. Hoje é um link de busca pelo nome e endereço; troque pelo link curto da ficha (Google Maps → Compartilhar → Copiar link).
- **Coordenada**: `site.geo` é aproximada. Pegue a exata clicando com o botão direito no pino da ficha no Google Maps.
- **Agência**: `site.agencia` (nome e link para o crédito do rodapé).

### Fotos das obras

Coloque as fotos em `public/obras/` (JPG ou PNG grandes, o Next converte para AVIF/WebP sozinho) e aponte o caminho em `lib/conteudo.ts`:

- **Serviços**: campo `foto` de cada item de `servicos` (proporção 4:5, retrato).
- **Galeria**: lista `obras`. Para cada foto, preencha `foto`, `tipo`, `bairro` e `proporcao` (largura ÷ altura, por exemplo `4 / 5`, `3 / 2`, `1`). A legenda sai assim: `REFORMA — ITAIM PAULISTA`.
- **Antes e depois**: lista `antesDepois`, com `antes` e `depois` do mesmo ângulo, proporção 3:2. Se não houver nenhum par, deixe a lista vazia (`[]`) e o slider some.

Enquanto `foto` for `null`, aparece um retângulo cinza com a legenda "foto da obra". Nunca use foto de banco de imagem.

### Depoimentos

Só avaliações reais do Google, com autorização. Copie o texto como está no Google para a lista `depoimentos` em `lib/conteudo.ts`, com o primeiro nome e a inicial do sobrenome (`"Maria S."`), as estrelas e a data. Com a lista vazia, a seção mostra a nota 4,8 e o botão para a ficha do Google.

### Perguntas frequentes

As respostas em `lib/conteudo.ts` (`perguntas`) são **rascunho** para o Sandro revisar. Quando uma resposta for confirmada, mude `confirmada` para `true`.

### Logo

`components/Logo.tsx` monta um logo **provisório** com o símbolo do "A" (perna em ciano) e o nome em Saira. Quando o SVG oficial chegar:

1. Salve como `public/brand/logo-araujo.svg` (e uma versão branca, `logo-araujo-branco.svg`, para o rodapé e o menu).
2. Troque o conteúdo de `<Logo>` por `<img src="/brand/logo-araujo.svg" alt="Construtora Araújo" />`.
3. Troque o símbolo em `SimboloA` (aparece sozinho no header depois de rolar) e gere o favicon a partir dele (`app/icon.svg`).

---

## Hero (sequência de quadros)

- Quadros em `public/hero/desktop/f001…f092.webp` (1600×900) e `public/hero/mobile/f001…f092.webp` (720×1280).
- Posters: `public/hero/araujo-hero-poster.jpg` e `araujo-hero-poster-mobile.jpg`. Foram gerados a partir do `f001` de cada sequência, porque o zip não trazia os posters. O poster desktop também é a imagem do Open Graph.
- A sequência é desenhada num `<canvas>` (não `<video>`). A mobile é usada abaixo de 768px **ou** em retrato; ao girar o aparelho, troca sozinha.
- Carregamento: o quadro atual e os 10 primeiros vão na hora; o resto começa em lotes de 10 assim que a pessoa interage (rolar, tocar, mexer o mouse) ou depois de ~3,5 s ociosa. Isso deixou o Lighthouse mobile em 94–96 (era 67 baixando os 92 quadros de uma vez).
- Linha do tempo em `components/Hero.tsx`: 0–15% "Seu sonho começa no papel.", 15–35% "E ganha forma peça por peça.", 35–75% sem texto, 75–100% "Construtora ARAÚJO" letra por letra (stagger de 0,04 s) com os dois botões.
- Com `prefers-reduced-motion`, mostra só o poster com o título e, abaixo, o bloco azul com o nome e os botões, sem scrub.

**Uma decisão de layout:** no desktop, o briefing pedia o título à esquerda, mas nos quadros 16:9 o homem ocupa a metade esquerda e o título ficava em cima do rosto. Por isso, a partir de 768px na horizontal, o texto fica na coluna da direita (alinhado à esquerda, a partir de 60% da largura), sobre o fundo bege. No celular ele fica embaixo, sobre o degradê bege, como no briefing. Para voltar para a esquerda, troque a classe `paisagem:left-[60%]` em `components/Hero.tsx`.

---

## Estrutura

```
app/
  layout.tsx           fontes, metadata, Schema.org
  page.tsx             home (ordem das seções)
  [servico]/page.tsx   /construcao, /reforma, /acabamento
  sitemap.ts, robots.ts, icon.svg, apple-icon.png, not-found.tsx
components/            uma seção por arquivo
lib/
  site.ts              dados da empresa
  conteudo.ts          textos e listas das seções
  paginas.ts           texto das páginas de serviço
  schema.ts            Schema.org
  rolagem.ts           Lenis e trava de rolagem
public/hero/           quadros e posters do hero
```

## Medições (build de produção, Lighthouse 12 mobile)

Home: Performance 94–96, Acessibilidade 100, Boas práticas 100, SEO 100, CLS 0. Páginas de serviço: Performance 99, Acessibilidade 96 (pelo contraste abaixo e pelo ciano da palavra "Construtora" do logo provisório sobre o fundo claro).

Um aviso de contraste continua: texto branco sobre o laranja `#FF5A1F` dá 3,1:1, abaixo dos 4,5:1 que a WCAG pede para texto pequeno (passa só no botão grande do contato, com 24px ou mais). As cores e o texto branco vieram do briefing. Se quiserem passar no critério, a saída é texto `#0E1B2C` sobre o laranja (5,6:1).
