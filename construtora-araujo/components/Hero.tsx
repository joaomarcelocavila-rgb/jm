"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whatsappUrl } from "@/lib/site";
import { IconeWhatsApp } from "./IconeWhatsApp";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero com a sequência de quadros desenhada num <canvas> (técnica da Apple).
 * Não usa <video>: no iPhone e no Android, controlar currentTime pelo scroll trava.
 *
 * Quadros: /public/hero/desktop/f001…f092.webp (1600×900)
 *          /public/hero/mobile/f001…f092.webp  (720×1280)
 */
const TOTAL = 92;
const PRIMEIRO_LOTE = 10;
const LOTE = 10;

type Sequencia = "desktop" | "mobile";

const MQ_MOBILE = "(max-width: 767px), (orientation: portrait)";

function caminho(seq: Sequencia, i: number) {
  return `/hero/${seq}/f${String(i + 1).padStart(3, "0")}.webp`;
}

const LETRAS = Array.from("ARAÚJO");

export function Hero() {
  const secao = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const texto1 = useRef<HTMLDivElement>(null);
  const texto2 = useRef<HTMLDivElement>(null);
  const degrade = useRef<HTMLDivElement>(null);
  const dica = useRef<HTMLDivElement>(null);
  const final = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduzido.matches) return; // só o poster, com título e nome estáticos (CSS)

    const tela = canvas.current!;
    const ctx = tela.getContext("2d", { alpha: false })!;
    const mqMobile = window.matchMedia(MQ_MOBILE);

    let seq: Sequencia = mqMobile.matches ? "mobile" : "desktop";
    let imagens: (HTMLImageElement | null)[] = [];
    let geracao = 0;
    let quadro = 0;
    let desenhado = -1;

    /* ---------- desenho em "cover", respeitando o devicePixelRatio (máx. 2) ---------- */

    function dimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(tela.clientWidth * dpr);
      const h = Math.round(tela.clientHeight * dpr);
      if (tela.width !== w || tela.height !== h) {
        tela.width = w;
        tela.height = h;
        desenhado = -1;
      }
    }

    /** Quadro pedido ou o carregado mais próximo (scroll rápido antes do lote chegar) */
    function maisProximo(i: number) {
      if (imagens[i]) return imagens[i];
      for (let d = 1; d < TOTAL; d++) {
        if (imagens[i - d]) return imagens[i - d];
        if (imagens[i + d]) return imagens[i + d];
      }
      return null;
    }

    function desenhar(forcar = false) {
      const i = Math.min(TOTAL - 1, Math.max(0, Math.round(quadro)));
      const img = maisProximo(i);
      if (!img) return;
      if (!forcar && desenhado === i && imagens[i]) return;
      const cw = tela.width;
      const ch = tela.height;
      const escala = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      desenhado = imagens[i] ? i : -1;
      if (tela.dataset.pronto !== "1") tela.dataset.pronto = "1"; // esconde o poster
    }

    /* ---------- pré-carregamento em lotes ---------- */

    function carregar(i: number, minhaGeracao: number) {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = caminho(seq, i);
        const pronto = () => {
          if (minhaGeracao !== geracao) return resolve();
          imagens[i] = img;
          if (desenhado === -1 || Math.round(quadro) === i) desenhar(true);
          resolve();
        };
        img
          .decode()
          .then(pronto)
          .catch(() => (img.complete && img.naturalWidth ? pronto() : resolve()));
      });
    }

    // Safari não tem requestIdleCallback
    const ocioso = (fn: () => void) =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(fn, { timeout: 600 })
        : setTimeout(fn, 60);

    const eventosInteracao = ["scroll", "wheel", "touchstart", "pointermove", "keydown"] as const;
    let soltar = () => {};
    const liberarFundo = new Promise<void>((r) => (soltar = r));
    const aoInteragir = () => soltar();
    eventosInteracao.forEach((ev) => window.addEventListener(ev, aoInteragir, { passive: true, once: true }));
    const esperaOciosa = window.setTimeout(() => ocioso(() => soltar()), 3500);

    async function carregarSequencia(nova: Sequencia) {
      seq = nova;
      const minha = ++geracao;
      imagens = new Array(TOTAL).fill(null);
      desenhado = -1;
      tela.dataset.pronto = "0";

      // Os 10 primeiros já: o quadro atual na frente (troca o poster pelo canvas),
      // depois os outros 9. O atual só não é o 0 quando a sequência muda ao girar.
      const atual = Math.round(quadro);
      await carregar(atual, minha);
      const primeiros = Array.from({ length: PRIMEIRO_LOTE }, (_, i) => i).filter((i) => i !== atual);
      await Promise.all(primeiros.map((i) => carregar(i, minha)));

      // O resto em segundo plano, lote por lote. Começa quando a pessoa interage
      // (rolar, tocar, mexer o mouse) ou depois de alguns segundos ociosa, para
      // não disputar a CPU com o carregamento da página.
      await liberarFundo;
      for (let inicio = PRIMEIRO_LOTE; inicio < TOTAL; inicio += LOTE) {
        if (minha !== geracao) return;
        await new Promise<void>((r) => ocioso(() => r()));
        const lote = [];
        for (let i = inicio; i < Math.min(inicio + LOTE, TOTAL); i++) {
          if (!imagens[i]) lote.push(carregar(i, minha));
        }
        await Promise.all(lote);
      }
    }

    /* ---------- troca de sequência ao girar o aparelho ---------- */

    const aoMudarOrientacao = () => {
      const nova: Sequencia = mqMobile.matches ? "mobile" : "desktop";
      if (nova !== seq) carregarSequencia(nova);
    };
    mqMobile.addEventListener("change", aoMudarOrientacao);

    const observador = new ResizeObserver(() => {
      dimensionar();
      desenhar(true);
    });
    observador.observe(tela);

    dimensionar();
    carregarSequencia(seq);

    /* ---------- linha do tempo com o scroll ---------- */

    const gctx = gsap.context(() => {
      const letras = gsap.utils.toArray<HTMLElement>("[data-letra]", final.current!);
      const entraFinal = gsap
        .timeline({ paused: true })
        .set(final.current, { autoAlpha: 1 })
        .from("[data-construtora]", { autoAlpha: 0, y: 12, duration: 0.45, ease: "power2.out" }, 0)
        .from(letras, { autoAlpha: 0, yPercent: 35, duration: 0.55, ease: "power3.out", stagger: 0.04 }, 0.08)
        .from("[data-final-resto]", { autoAlpha: 0, y: 14, duration: 0.5, ease: "power2.out", stagger: 0.08 }, 0.35);

      gsap.set(texto2.current, { autoAlpha: 0, y: 20 });
      gsap.set(final.current, { autoAlpha: 0 });

      const estado = { quadro: 0 };
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to(
        estado,
        {
          quadro: TOTAL - 1,
          duration: 1,
          onUpdate: () => {
            quadro = estado.quadro;
            desenhar();
          },
        },
        0,
      )
        // 0–15%: "Seu sonho começa no papel." | 15–20%: sai subindo 20px
        .to([texto1.current, dica.current], { autoAlpha: 0, y: -20, duration: 0.05 }, 0.15)
        // entra "E ganha forma peça por peça." e sai antes de 35%
        .to(texto2.current, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.18)
        .to(texto2.current, { autoAlpha: 0, y: -20, duration: 0.05 }, 0.3)
        // o degradê bege do celular sai junto: no zoom não tem texto
        .to(degrade.current, { autoAlpha: 0, duration: 0.05 }, 0.3);

      ScrollTrigger.create({
        trigger: secao.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => {
          // 75–100%: o nome entra letra por letra (tempo real, stagger de 0.04s)
          if (self.progress >= 0.75) {
            if (entraFinal.reversed() || entraFinal.progress() === 0) entraFinal.timeScale(1).play();
          } else if (entraFinal.progress() > 0 && !entraFinal.reversed()) {
            entraFinal.timeScale(1.6).reverse();
          }
        },
      });
    }, secao);

    return () => {
      geracao++;
      clearTimeout(esperaOciosa);
      eventosInteracao.forEach((ev) => window.removeEventListener(ev, aoInteragir));
      gctx.revert();
      observador.disconnect();
      mqMobile.removeEventListener("change", aoMudarOrientacao);
    };
  }, []);

  /* Poster: primeiro quadro, mostrado até o canvas desenhar. Direção de arte por orientação. */
  const comum = { alt: "", sizes: "100vw", fetchPriority: "high" as const, loading: "eager" as const };
  const {
    props: { srcSet: posterDesktop },
  } = getImageProps({ ...comum, src: "/hero/araujo-hero-poster.jpg", width: 1600, height: 900, quality: 75 });
  const {
    props: { srcSet: posterMobile, ...posterImg },
  } = getImageProps({ ...comum, src: "/hero/araujo-hero-poster-mobile.jpg", width: 720, height: 1280, quality: 70 });

  return (
    <section
      ref={secao}
      id="topo"
      aria-labelledby="titulo-pagina"
      className="relative h-[250svh] bg-azul md:h-[300svh] motion-reduce:h-auto!"
    >
      <h1 id="titulo-pagina" className="so-leitor">
        Construtora Araújo, construção e reforma na Zona Leste de SP
      </h1>

      <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible">
        {/* ---------- cena: poster + canvas + textos 1 e 2 ---------- */}
        <div className="absolute inset-0 bg-bege motion-reduce:relative motion-reduce:h-[100svh]">
          <picture>
            <source media="(min-width: 768px) and (orientation: landscape)" srcSet={posterDesktop} />
            <source srcSet={posterMobile} />
            <img {...posterImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          <canvas
            ref={canvas}
            aria-hidden="true"
            data-pronto="0"
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 data-[pronto=1]:opacity-100 motion-reduce:hidden"
          />

          {/* degradê bege para dar leitura ao texto embaixo, no celular */}
          <div
            ref={degrade}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-bege from-30% via-bege/80 to-bege/0 paisagem:hidden"
          />

          {/* Textos 1 e 2 no mesmo lugar.
              Celular/retrato: embaixo. Desktop: na coluna da direita, que é o lado
              vazio do quadro (o homem ocupa a metade esquerda). Para mudar o lado,
              troque a classe "paisagem:left-[60%]" abaixo. */}
          <div className="absolute inset-x-0 bottom-0 grid pb-[max(28px,env(safe-area-inset-bottom))] text-tinta paisagem:bottom-auto paisagem:left-[60%] paisagem:top-1/2 paisagem:-translate-y-1/2 paisagem:pb-0">
            <div ref={texto1} className="moldura [grid-area:1/1] self-end paisagem:pl-0!">
              <p className="mono mb-4 md:mb-6">Construtora Araújo — desde 2005</p>
              <p className="font-titulo text-[clamp(40px,10.6vw,120px)] paisagem:text-[clamp(40px,6.3vw,120px)] font-semibold leading-[0.95] tracking-[-0.02em] [text-wrap:balance]">
                Seu sonho começa no papel.
              </p>
            </div>
            <div
              ref={texto2}
              aria-hidden="true"
              className="moldura invisible [grid-area:1/1] self-end opacity-0 paisagem:pl-0! motion-reduce:hidden"
            >
              <p className="font-titulo text-[clamp(40px,10.6vw,120px)] paisagem:text-[clamp(40px,6.3vw,120px)] font-semibold leading-[0.95] tracking-[-0.02em] [text-wrap:balance]">
                E ganha forma peça por peça.
              </p>
            </div>
          </div>

          {/* dica de rolagem, só no desktop */}
          <div
            ref={dica}
            aria-hidden="true"
            className="mono absolute bottom-8 left-[60%] hidden items-center gap-3 text-tinta/70 lg:flex motion-reduce:hidden!"
          >
            <span className="block h-10 w-px bg-tinta/40" />
            Role para ver
          </div>
        </div>

        {/* ---------- final: tela azul com o nome ---------- */}
        <div
          ref={final}
          className="invisible absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white opacity-0 motion-reduce:visible motion-reduce:relative motion-reduce:min-h-[100svh] motion-reduce:bg-azul motion-reduce:py-24 motion-reduce:opacity-100"
        >
          <p className="font-titulo leading-none">
            <span className="so-leitor">Construtora Araújo</span>
            <span
              data-construtora
              aria-hidden="true"
              className="block text-[clamp(24px,4vw,52px)] font-medium tracking-[-0.01em]"
            >
              Construtora
            </span>
            <span aria-hidden="true" className="mt-[0.14em] block text-[clamp(64px,18vw,240px)] font-semibold tracking-[-0.03em]">
              {LETRAS.map((l, i) => (
                <span key={i} data-letra className="inline-block">
                  {l}
                </span>
              ))}
            </span>
          </p>
          <p data-final-resto className="mt-5 max-w-[26ch] text-[18px] leading-snug text-white/90 md:mt-7 md:max-w-none md:text-[21px]">
            Construção, reforma e acabamento na Zona Leste de São Paulo.
          </p>
          <div data-final-resto className="mt-8 flex w-full max-w-[360px] flex-col gap-3 md:w-auto md:max-w-none md:flex-row md:gap-4">
            <a href={whatsappUrl()} target="_blank" rel="noopener" className="botao botao-laranja min-h-[52px]">
              <IconeWhatsApp />
              Pedir orçamento no WhatsApp
            </a>
            <a href="#obras" className="botao botao-contorno min-h-[52px] text-white">
              Ver obras
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
