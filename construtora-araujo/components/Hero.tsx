"use client";

import { getImageProps } from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whatsappUrl } from "@/lib/site";
import { IconeWhatsApp } from "./IconeWhatsApp";

gsap.registerPlugin(ScrollTrigger);

/**
 * Abertura no formato do site da neve (frases que desfocam, título embaixo,
 * rolagem suavizada), com o vídeo desenhado como sequência de quadros num
 * <canvas>. Pular para um ponto de um <video> pausado falha em vários celulares
 * (principalmente no iPhone); a sequência de imagens funciona em qualquer um.
 *
 * Quadros: /public/hero/desktop/f001…f092.webp (1600×900, computador e tablet deitado)
 *          /public/hero/mobile/f001…f092.webp  (720×1280, celular e tablet em pé)
 */
const TOTAL = 92;
const QUADRO_AZUL = 78; // f079: a partir daqui a tela já é toda azul
const PRIMEIRO_LOTE = 10;
const LOTE = 10;
type Sequencia = "desktop" | "mobile";
const MQ_MOBILE = "(max-width: 767px), (orientation: portrait)";
const caminho = (seq: Sequencia, i: number) => `/hero/${seq}/f${String(i + 1).padStart(3, "0")}.webp`;

// Linha do tempo, em progresso da rolagem (0 → 1)
const TIMELINE = {
  video: [0, 0.62] as const, // quadros: perfil → zoom no óculos → azul
  azul: [0.58, 0.62] as const, // camada azul sólida segura o fim (os quadros já estão azuis)
  intro: [0.01, 0.05] as const, // título de baixo some assim que a rolagem começa
  dica: [0, 0.03] as const,
  degrade: [0.44, 0.5] as const, // o véu bege sai antes da tela azul
};

type Frase = { rotulo: string; texto: string; faixa: readonly [number, number] };

const FRASES: Frase[] = [
  { rotulo: "01 — No papel", texto: "Seu sonho começa no papel.", faixa: [0.05, 0.25] },
  { rotulo: "02 — Na obra", texto: "E ganha forma peça por peça.", faixa: [0.26, 0.46] },
];

// Final na tela azul: entra e fica
const FINAL = { faixa: [0.64, 0.82] as const, letraAtraso: 0.012, resto: [0.74, 0.88] as const };

const SUAVIDADE = 0.14; // fração do caminho que o progresso suavizado anda por quadro
const DESFOQUE = 12;
const LETRAS = Array.from("ARAÚJO");

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const dentro = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Entra desfocada → nítida, segura, e se desfaz subindo (como poeira de obra baixando) */
function estadoFrase(p: number, [a, b]: readonly [number, number], segura = false) {
  const u = (p - a) / (b - a);
  if (u <= 0) return { o: 0, blur: DESFOQUE, y: 24 };
  const ENTRA = segura ? 0.66 : 0.3;
  if (u < ENTRA) {
    const t = easeOut(u / ENTRA);
    return { o: t, blur: DESFOQUE * (1 - t), y: 24 * (1 - t) };
  }
  if (segura || u <= 0.7) return { o: 1, blur: 0, y: 0 };
  if (u >= 1) return { o: 0, blur: DESFOQUE, y: -16 };
  const t = easeInOut((u - 0.7) / 0.3);
  return { o: 1 - t, blur: DESFOQUE * t, y: -16 * t };
}

function aplicar(el: HTMLElement | null, s: { o: number; blur: number; y: number }) {
  if (!el) return;
  el.style.opacity = String(s.o);
  el.style.filter = s.blur > 0.05 ? `blur(${s.blur.toFixed(2)}px)` : "none";
  el.style.transform = `translate3d(0, ${s.y.toFixed(1)}px, 0)`;
  el.style.visibility = s.o > 0.001 ? "visible" : "hidden";
  el.style.pointerEvents = s.o > 0.5 ? "auto" : "none";
}

function useMedia(query: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setOk(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return ok;
}

export function Hero() {
  const reduzido = useMedia("(prefers-reduced-motion: reduce)");
  if (reduzido) return <HeroEstatico />;
  return <HeroScrub />;
}

function HeroScrub() {
  const secao = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const azul = useRef<HTMLDivElement>(null);
  const degrade = useRef<HTMLDivElement>(null);
  const dica = useRef<HTMLParagraphElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const frases = useRef<(HTMLDivElement | null)[]>([]);
  const final = useRef<HTMLDivElement>(null);
  const construtora = useRef<HTMLSpanElement>(null);
  const letras = useRef<(HTMLSpanElement | null)[]>([]);
  const resto = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tela = canvas.current!;
    const ctx = tela.getContext("2d", { alpha: false })!;
    const mq = window.matchMedia(MQ_MOBILE);
    let seq: Sequencia = mq.matches ? "mobile" : "desktop";
    let imagens: (HTMLImageElement | null)[] = [];
    let geracao = 0;
    let quadro = 0;
    let desenhado = -1;

    // desenho em "cover", respeitando o devicePixelRatio (máx. 2)
    const dimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(tela.clientWidth * dpr);
      const h = Math.round(tela.clientHeight * dpr);
      if (tela.width !== w || tela.height !== h) {
        tela.width = w;
        tela.height = h;
        desenhado = -1;
      }
    };
    const maisProximo = (i: number) => {
      if (imagens[i]) return imagens[i];
      for (let d = 1; d < TOTAL; d++) {
        if (imagens[i - d]) return imagens[i - d];
        if (imagens[i + d]) return imagens[i + d];
      }
      return null;
    };
    const desenhar = (forcar = false) => {
      const i = Math.min(TOTAL - 1, Math.max(0, Math.round(quadro)));
      const img = maisProximo(i);
      if (!img) return;
      if (!forcar && desenhado === i && imagens[i]) return;
      const escala = Math.max(tela.width / img.naturalWidth, tela.height / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      ctx.drawImage(img, (tela.width - dw) / 2, (tela.height - dh) / 2, dw, dh);
      desenhado = imagens[i] ? i : -1;
      tela.dataset.pronto = "1";
    };

    // pré-carregamento: os 10 primeiros já; o resto em lotes depois que a pessoa interage
    const carregar = (i: number, minha: number) =>
      new Promise<void>((ok) => {
        const img = new Image();
        img.decoding = "async";
        img.src = caminho(seq, i);
        const pronto = () => {
          if (minha !== geracao) return ok();
          imagens[i] = img;
          if (desenhado === -1 || Math.round(quadro) === i) desenhar(true);
          ok();
        };
        img.decode().then(pronto, () => (img.complete && img.naturalWidth ? pronto() : ok()));
      });
    const ocioso = (fn: () => void) =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 60);
    let soltar = () => {};
    const liberarFundo = new Promise<void>((r) => (soltar = r));
    const eventos = ["scroll", "wheel", "touchstart", "pointermove", "keydown"] as const;
    const aoInteragir = () => soltar();
    eventos.forEach((ev) => window.addEventListener(ev, aoInteragir, { passive: true, once: true }));
    const espera = window.setTimeout(() => ocioso(soltar), 3500);

    const carregarSequencia = async (nova: Sequencia) => {
      seq = nova;
      const minha = ++geracao;
      imagens = new Array(TOTAL).fill(null);
      desenhado = -1;
      tela.dataset.pronto = "0";
      const atual = Math.round(quadro);
      await carregar(atual, minha);
      await Promise.all(
        Array.from({ length: PRIMEIRO_LOTE }, (_, i) => i)
          .filter((i) => i !== atual)
          .map((i) => carregar(i, minha)),
      );
      await liberarFundo;
      for (let inicio = PRIMEIRO_LOTE; inicio < TOTAL; inicio += LOTE) {
        if (minha !== geracao) return;
        await new Promise<void>((r) => ocioso(() => r()));
        const lote = [];
        for (let i = inicio; i < Math.min(inicio + LOTE, TOTAL); i++) if (!imagens[i]) lote.push(carregar(i, minha));
        await Promise.all(lote);
      }
    };
    // girou o aparelho: troca de sequência
    const aoGirar = () => {
      const nova: Sequencia = mq.matches ? "mobile" : "desktop";
      if (nova !== seq) carregarSequencia(nova);
    };
    mq.addEventListener("change", aoGirar);
    const observador = new ResizeObserver(() => {
      dimensionar();
      desenhar(true);
    });
    observador.observe(tela);
    dimensionar();
    carregarSequencia(seq);

    let vivo = true;
    const render = (p: number) => {
      if (!vivo || !azul.current) return;
      quadro = dentro(p, TIMELINE.video) * QUADRO_AZUL;
      desenhar();
      azul.current!.style.opacity = String(dentro(p, TIMELINE.azul));

      dica.current!.style.opacity = String(1 - dentro(p, TIMELINE.dica));
      const sai = dentro(p, TIMELINE.intro);
      intro.current!.style.opacity = String(1 - sai);
      intro.current!.style.transform = `translate3d(0, ${(-24 * sai).toFixed(1)}px, 0)`;
      intro.current!.style.visibility = sai >= 1 ? "hidden" : "visible";
      intro.current!.style.pointerEvents = sai > 0.5 ? "none" : "auto";
      degrade.current!.style.opacity = String(1 - dentro(p, TIMELINE.degrade));

      FRASES.forEach((f, i) => aplicar(frases.current[i], estadoFrase(p, f.faixa)));

      // Final: "Construtora", depois ARAÚJO letra por letra, depois frase e botões
      const [a, b] = FINAL.faixa;
      final.current!.style.visibility = p >= a ? "visible" : "hidden";
      aplicar(construtora.current, estadoFrase(p, [a, b - 0.06], true));
      LETRAS.forEach((_, i) => {
        const d = 0.03 + i * FINAL.letraAtraso;
        aplicar(letras.current[i], estadoFrase(p, [a + d, b + d - 0.06], true));
      });
      aplicar(resto.current, estadoFrase(p, FINAL.resto, true));
    };

    // A rolagem define o alvo; o laço persegue o alvo com lerp
    let alvo = 0;
    let atual = 0;
    let raf = 0;
    const tick = () => {
      atual += (alvo - atual) * SUAVIDADE;
      if (Math.abs(alvo - atual) < 0.0004) atual = alvo;
      render(atual);
      raf = atual !== alvo ? requestAnimationFrame(tick) : 0;
    };
    const chutar = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const st = ScrollTrigger.create({
      trigger: secao.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        alvo = self.progress;
        chutar();
      },
      onRefresh: (self) => {
        alvo = self.progress;
        chutar();
      },
    });
    alvo = atual = st.progress;
    render(atual);

    return () => {
      vivo = false;
      geracao++;
      clearTimeout(espera);
      eventos.forEach((ev) => window.removeEventListener(ev, aoInteragir));
      mq.removeEventListener("change", aoGirar);
      observador.disconnect();
      st.kill();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={secao} id="topo" aria-labelledby="titulo-pagina" className="relative h-[400svh] bg-azul paisagem:h-[500svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-bege">
        {/* poster (primeiro quadro) até o canvas desenhar */}
        <Poster />
        <canvas
          ref={canvas}
          data-hero="canvas"
          aria-hidden="true"
          data-pronto="0"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 data-[pronto=1]:opacity-100"
        />
        {/* camada azul sólida: garante o #033FC3 exato no fim, igual ao começo da próxima seção */}
        <div ref={azul} data-hero="azul" aria-hidden="true" className="absolute inset-0 bg-azul opacity-0" />

        {/* véu bege atrás das frases: embaixo no celular, na direita no computador */}
        <div
          ref={degrade}
          data-hero="degrade"
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-bege from-35% via-bege/80 to-bege/0 paisagem:inset-x-auto paisagem:right-0 paisagem:top-0 paisagem:h-full paisagem:w-[64%] paisagem:bg-gradient-to-l paisagem:from-30% paisagem:via-bege/75"
        />

        <p
          ref={dica}
          data-hero="dica"
          aria-hidden="true"
          className="mono absolute inset-x-0 top-[84px] text-center text-tinta/70"
        >
          Role para ver ↓
        </p>

        {/* Título da página, embaixo. Some assim que a rolagem começa. */}
        <div
          ref={intro}
          data-hero="intro"
          className="absolute inset-x-0 bottom-[max(28px,env(safe-area-inset-bottom))] paisagem:bottom-10 paisagem:left-[56%]"
        >
          <Intro />
        </div>

        {/* Frases: texto real, na coluna bege da direita (embaixo no celular) */}
        <div className="absolute inset-x-0 bottom-[max(36px,env(safe-area-inset-bottom))] grid paisagem:bottom-auto paisagem:left-[56%] paisagem:top-1/2 paisagem:-translate-y-1/2">
          {FRASES.map((f, i) => (
            <FraseBloco key={f.rotulo} frase={f} ref={(el) => void (frases.current[i] = el)} inicial />
          ))}
        </div>

        {/* Final na tela azul */}
        <div
          ref={final}
          data-hero="final"
          className="invisible absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white"
        >
          <p className="font-titulo leading-none">
            <span className="so-leitor">Construtora Araújo</span>
            <span
              ref={construtora}
              data-hero="construtora"
              aria-hidden="true"
              className="block text-[clamp(24px,4vw,52px)] font-medium tracking-[-0.01em]"
              style={ESCONDIDO}
            >
              Construtora
            </span>
            <span
              aria-hidden="true"
              className="mt-[0.14em] block text-[clamp(64px,18vw,240px)] font-semibold tracking-[-0.03em]"
            >
              {LETRAS.map((l, i) => (
                <span key={i} ref={(el) => void (letras.current[i] = el)} data-hero="letra" className="inline-block" style={ESCONDIDO}>
                  {l}
                </span>
              ))}
            </span>
          </p>
          <div ref={resto} data-hero="resto" className="flex w-full flex-col items-center" style={ESCONDIDO}>
            <p className="mt-5 max-w-[26ch] text-[18px] leading-snug text-white/90 paisagem:mt-7 paisagem:max-w-none paisagem:text-[21px]">
              Construção, reforma e acabamento na Zona Leste de São Paulo.
            </p>
            <Botoes />
          </div>
        </div>
      </div>
    </section>
  );
}

const ESCONDIDO = { opacity: 0, visibility: "hidden" as const, filter: `blur(${DESFOQUE}px)` };

const FraseBloco = forwardRef<HTMLDivElement, { frase: Frase; inicial?: boolean }>(function FraseBloco(
  { frase, inicial },
  ref,
) {
  return (
    <div
      ref={ref}
      data-hero="frase"
      className="moldura col-start-1 row-start-1 will-change-[transform,opacity,filter] paisagem:pl-0!"
      style={inicial ? ESCONDIDO : undefined}
    >
      <p className="mono mb-4 text-marca">{frase.rotulo}</p>
      <h2 className="max-w-[12ch] text-[clamp(40px,10.6vw,120px)] text-tinta paisagem:text-[clamp(40px,6.3vw,120px)]">
        {frase.texto}
      </h2>
    </div>
  );
});

function Intro() {
  return (
    <div className="moldura paisagem:pl-0!">
      <p className="mono text-tinta/80">Construtora Araújo — desde 2005</p>
      <h1
        id="titulo-pagina"
        className="mt-3 max-w-[18ch] text-[clamp(30px,3.4vw,48px)] font-medium leading-[1.04] text-tinta"
      >
        Construção e reforma na Zona Leste de SP.
      </h1>
      <a href={whatsappUrl()} target="_blank" rel="noopener" className="botao botao-laranja mt-6 w-full paisagem:w-auto">
        <IconeWhatsApp />
        Orçamento no WhatsApp
      </a>
    </div>
  );
}

/** Primeiro quadro: 16:9 no computador e tablet deitado, 9:16 no celular e tablet em pé */
function Poster() {
  const comum = { alt: "", sizes: "100vw", fetchPriority: "high" as const, loading: "eager" as const };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...comum, src: "/hero/araujo-hero-poster.jpg", width: 1600, height: 900, quality: 75 });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...comum, src: "/hero/araujo-hero-poster-mobile.jpg", width: 720, height: 1280, quality: 70 });
  return (
    <picture>
      <source media="(min-width: 768px) and (orientation: landscape)" srcSet={desktop} />
      <source srcSet={mobile} />
      <img {...img} alt="" className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}

function Botoes() {
  return (
    <div className="mt-8 flex w-full max-w-[360px] flex-col gap-3 md:w-auto md:max-w-none md:flex-row md:gap-4">
      <a href={whatsappUrl()} target="_blank" rel="noopener" className="botao botao-laranja min-h-[52px]">
        <IconeWhatsApp />
        Pedir orçamento no WhatsApp
      </a>
      <a href="#servicos" className="botao botao-contorno min-h-[52px] text-white">
        Ver serviços
      </a>
    </div>
  );
}

/** prefers-reduced-motion: sem scrub. Poster com o título e, embaixo, o bloco azul com o nome. */
function HeroEstatico() {
  return (
    <section id="topo" aria-labelledby="titulo-pagina">
      <div className="relative h-[100svh] min-h-[560px] overflow-hidden bg-bege">
        <Poster />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-bege from-35% via-bege/80 to-bege/0 paisagem:hidden" />
        <div className="absolute inset-x-0 bottom-8 paisagem:bottom-auto paisagem:left-[56%] paisagem:top-1/2 paisagem:-translate-y-1/2">
          <div className="moldura paisagem:pl-0!">
            <p className="mono text-tinta/80">Construtora Araújo — desde 2005</p>
            <h1 id="titulo-pagina" className="mt-4 max-w-[12ch] text-[clamp(40px,6.3vw,120px)] text-tinta">
              Seu sonho começa no papel.
            </h1>
          </div>
        </div>
      </div>
      <div className="flex min-h-[100svh] flex-col items-center justify-center bg-azul px-5 py-24 text-center text-white">
        <p className="font-titulo leading-none">
          <span className="block text-[clamp(24px,4vw,52px)] font-medium">Construtora</span>
          <span className="mt-[0.14em] block text-[clamp(64px,18vw,240px)] font-semibold tracking-[-0.03em]">ARAÚJO</span>
        </p>
        <p className="mt-6 max-w-[26ch] text-[18px] text-white/90 md:max-w-none md:text-[21px]">
          Construção, reforma e acabamento na Zona Leste de São Paulo.
        </p>
        <Botoes />
      </div>
    </section>
  );
}
