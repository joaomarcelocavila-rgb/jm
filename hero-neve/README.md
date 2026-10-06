# Site de agência de neve (abertura em vídeo + seções)

Site de agência de viagens de neve. Abre com a seção controlada pela rolagem (zoom no óculos até
a tela ficar azul, e de dentro do azul sai o esquiador, com as frases surgindo nas nuvens de neve)
e segue com história, o que está incluído, destinos, quiz, como funciona, o que levar, quando
reservar, perguntas frequentes e contato pelo WhatsApp. React + Tailwind (v4) + GSAP ScrollTrigger.

**Nome, selo, história e número de WhatsApp da agência ficam em `src/config.js`.**
Os textos das seções (resorts, perguntas, o que levar) ficam em `src/data.js`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (base "./", funciona em qualquer pasta)
```

## Onde mexer

As seções depois da abertura ficam em `src/components/Agencia.jsx` (estilos em `src/agency.css`).
A abertura fica em `src/components/ScrollHero.jsx`:

- `TIMELINE`: as faixas da rolagem (vídeo 1 de 0 a 0,40, mistura de 0,38 a 0,48, vídeo 2 de 0,48 a 1).
- `PHRASES`: texto, label, faixa de cada frase e o lado (`side: "left"` coloca a frase no céu da esquerda no computador).
- `SMOOTHING`: quanto o scrub "segue" a rolagem por quadro. Menor = mais suave e mais atrasado.
- `EDGE`: o gradiente azul nas bordas que dá leitura ao texto.

As cores e fontes ficam no `@theme` de `src/index.css` (`glacier` = #1554B0, `frost` = #F4F8FF).

## Vídeos

Ficam em `public/videos/`: 1920x1080 para computador, 1280x720 para celular (tela até 767px)
e um poster `.webp` do primeiro quadro de cada. Todos em H.264 com keyframe em todo quadro,
para que pular para qualquer ponto do vídeo seja instantâneo nos dois sentidos.

Para trocar os vídeos, rode o script com os originais:

```bash
scripts/encode-videos.sh caminho/oculos-original.mp4 caminho/esquiador-original.mp4
```

## Como funciona

- A seção tem 500vh (400vh no celular) e um container `sticky` de 100vh com os dois vídeos empilhados, sempre pausados.
- O ScrollTrigger só informa o progresso (0 a 1). Um laço de `requestAnimationFrame` persegue esse valor com lerp
  e, a cada quadro, define o `currentTime` dos vídeos e a opacidade, o blur e a posição das frases.
  Como tudo é calculado a partir do progresso, rolar para cima volta exatamente pelo mesmo caminho.
- O vídeo só recebe um novo `currentTime` depois de terminar de buscar o anterior, então o scrub acompanha
  a velocidade de cada aparelho sem enfileirar buscas.
- No iOS, o primeiro toque na tela chama `play()` e `pause()` nos vídeos, que é o que libera a busca de quadros no Safari.
- Com `prefers-reduced-motion`, não há scrub: aparece o poster do vídeo 2 com as quatro frases em sequência.
- As frases são `h2` de verdade no HTML (com o label em `p`), então os buscadores leem o texto.

## Levar para outro projeto React

Copie `src/components/ScrollHero.jsx` e `public/videos/`, instale `gsap` e adicione ao seu CSS do Tailwind
as cores `glacier` e `frost`, as fontes e a classe `.frost-text` que estão em `src/index.css`.
