import { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

// Os dois vídeos vivem em /public/videos. "duration" é usado até o navegador ler os metadados.
const VIDEOS = {
  oculos: {
    desktop: `${BASE}videos/oculos-azul.mp4`,
    mobile: `${BASE}videos/oculos-azul-720.mp4`,
    poster: `${BASE}videos/oculos-azul-poster.webp`,
    duration: 9.567,
  },
  esquiador: {
    desktop: `${BASE}videos/esquiador-neve.mp4`,
    mobile: `${BASE}videos/esquiador-neve-720.mp4`,
    poster: `${BASE}videos/esquiador-neve-poster.webp`,
    duration: 7.933,
  },
};

// Linha do tempo, em progresso da rolagem (0 → 1).
const TIMELINE = {
  oculos: [0, 0.4], // scrub do vídeo 1
  blueIn: [0.35, 0.38], // a camada azul entra enquanto o vídeo 1 já está azul (invisível)
  blend: [0.38, 0.48], // vídeo 2 sai de dentro do azul
  esquiador: [0.48, 1], // scrub do vídeo 2
};

const PHRASES = [
  { label: "01 — Visão", text: "Todo grande projeto começa no topo.", range: [0.52, 0.64] },
  // Nesse trecho a nuvem de neve sobe no centro-direita, então a frase vai para o céu da esquerda.
  { label: "02 — Precisão", text: "Cada linha de código, uma curva precisa.", range: [0.66, 0.78], side: "left" },
  { label: "03 — Ritmo", text: "Velocidade com controle.", range: [0.8, 0.92] },
  { label: "04 — Convite", text: "Vamos descer juntos?", range: [0.94, 1], hold: true, cta: true },
];

const SMOOTHING = 0.14; // fração do caminho que o progresso suavizado anda por quadro (lerp)
const BLUR = 12;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const within = (p, [a, b]) => clamp01((p - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Estado de uma frase: entra com blur → nítida, segura, e se desfaz em blur subindo (neve se dissipando).
function phraseState(p, { range: [a, b], hold }) {
  const u = (p - a) / (b - a);
  if (u <= 0) return { o: 0, blur: BLUR, y: 24 };
  const IN = hold ? 0.66 : 0.3;
  if (u < IN) {
    const t = easeOut(u / IN);
    return { o: t, blur: BLUR * (1 - t), y: 24 * (1 - t) };
  }
  if (hold || u <= 0.7) return { o: 1, blur: 0, y: 0 };
  if (u >= 1) return { o: 0, blur: BLUR, y: -16 };
  const t = easeInOut((u - 0.7) / 0.3);
  return { o: 1 - t, blur: BLUR * t, y: -16 * t };
}

function useMedia(query) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

export default function ScrollHero() {
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const mobile = useMedia("(max-width: 767px)");
  return reduce ? <StaticHero /> : <ScrubHero key={mobile ? "m" : "d"} mobile={mobile} />;
}

function ScrubHero({ mobile }) {
  const sectionRef = useRef(null);
  const v1Ref = useRef(null);
  const v2Ref = useRef(null);
  const blueRef = useRef(null);
  const edgeRef = useRef(null);
  const hintRef = useRef(null);
  const phraseRefs = useRef([]);

  useEffect(() => {
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    const videos = [v1, v2];
    videos.forEach((v) => {
      v.muted = true;
      v.defaultMuted = true;
    });

    const duration = (v, fallback) => (Number.isFinite(v.duration) && v.duration > 0 ? v.duration : fallback);
    // Só pede um novo quadro quando o anterior já terminou de carregar: o scrub acompanha a
    // velocidade de decodificação do aparelho em vez de enfileirar buscas.
    const seek = (v, t) => {
      if (v.readyState < 1 || v.seeking) return;
      if (Math.abs(v.currentTime - t) > 0.001) v.currentTime = t;
    };

    const render = (p) => {
      const m = easeInOut(within(p, TIMELINE.blend));

      seek(v1, within(p, TIMELINE.oculos) * (duration(v1, VIDEOS.oculos.duration) - 0.05));
      v1.style.visibility = m >= 1 ? "hidden" : "visible";
      blueRef.current.style.opacity = within(p, TIMELINE.blueIn);

      seek(v2, within(p, TIMELINE.esquiador) * (duration(v2, VIDEOS.esquiador.duration) - 0.05));
      v2.style.opacity = m;
      v2.style.transform = `scale(${1.08 - 0.08 * m})`;
      edgeRef.current.style.opacity = m;

      hintRef.current.style.opacity = 1 - within(p, [0, 0.04]);

      PHRASES.forEach((phrase, i) => {
        const el = phraseRefs.current[i];
        const s = phraseState(p, phrase);
        el.style.opacity = s.o;
        el.style.filter = s.blur > 0.05 ? `blur(${s.blur.toFixed(2)}px)` : "none";
        el.style.transform = `translate3d(0, ${s.y.toFixed(1)}px, 0)`;
        el.style.visibility = s.o > 0.001 ? "visible" : "hidden";
        el.style.pointerEvents = s.o > 0.5 ? "auto" : "none";
      });
    };

    // A rolagem define o alvo; um laço de requestAnimationFrame persegue o alvo com lerp.
    let target = 0;
    let current = 0;
    let raf = 0;
    const tick = () => {
      current += (target - current) * SMOOTHING;
      if (Math.abs(target - current) < 0.0004) current = target;
      render(current);
      // Continua enquanto falta chegar ao alvo ou enquanto um vídeo ainda está buscando o quadro.
      raf = current !== target || v1.seeking || v2.seeking ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target = self.progress;
        kick();
      },
      onRefresh: (self) => {
        target = self.progress;
        kick();
      },
    });
    target = current = st.progress;
    render(current);

    const onLoaded = () => kick();
    videos.forEach((v) => {
      v.addEventListener("loadedmetadata", onLoaded);
      v.addEventListener("seeked", onLoaded);
    });

    // iOS só libera a busca de quadros depois de um play() disparado por toque.
    const unlock = () => {
      videos.forEach((v) => {
        const p = v.play();
        if (p) p.then(() => { v.pause(); kick(); }).catch(() => {});
      });
    };
    window.addEventListener("touchstart", unlock, { passive: true, once: true });

    return () => {
      st.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener("touchstart", unlock);
      videos.forEach((v) => {
        v.removeEventListener("loadedmetadata", onLoaded);
        v.removeEventListener("seeked", onLoaded);
      });
    };
  }, []);

  const src = (v) => (mobile ? v.mobile : v.desktop);

  return (
    <section ref={sectionRef} aria-label="Abertura" className="relative h-[400vh] bg-glacier md:h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-glacier" style={{ height: "100svh" }}>
        {/* Vídeo 1: zoom no óculos até o azul */}
        <video
          ref={v1Ref}
          className="absolute inset-0 h-full w-full object-cover"
          src={src(VIDEOS.oculos)}
          poster={VIDEOS.oculos.poster}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
        {/* Camada azul sólida que segura a passagem de um vídeo para o outro */}
        <div ref={blueRef} className="absolute inset-0 bg-glacier opacity-0" aria-hidden="true" />
        {/* Vídeo 2: esquiador na neve, sai de dentro do azul */}
        <video
          ref={v2Ref}
          className="absolute inset-0 h-full w-full object-cover opacity-0 will-change-transform"
          src={src(VIDEOS.esquiador)}
          poster={VIDEOS.esquiador.poster}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
        {/* Gradiente azul nas bordas para dar leitura ao texto */}
        <div ref={edgeRef} className="pointer-events-none absolute inset-0 opacity-0" aria-hidden="true" style={EDGE} />

        <p
          ref={hintRef}
          className="absolute inset-x-0 bottom-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-night/60"
          aria-hidden="true"
        >
          Role para descer ↓
        </p>

        {/* Frases: texto real no HTML, empilhadas no céu acima das nuvens de neve (direita/topo) */}
        <div className="absolute inset-x-[6vw] top-[8vh] grid text-[clamp(2.5rem,6vw,6rem)] max-md:inset-x-6 max-md:top-[13vh]">
          {PHRASES.map((phrase, i) => (
            <Phrase key={phrase.label} phrase={phrase} ref={(el) => (phraseRefs.current[i] = el)} initial />
          ))}
        </div>
      </div>
    </section>
  );
}

const EDGE = {
  background: [
    "linear-gradient(180deg, rgba(21,84,176,.7) 0%, rgba(21,84,176,.25) 30%, rgba(21,84,176,0) 52%)",
    // reforço atrás das frases (canto superior direito), onde a nuvem de neve sobe
    "radial-gradient(55% 50% at 78% 18%, rgba(10,40,96,.38) 0%, rgba(10,40,96,0) 70%)",
    "linear-gradient(0deg, rgba(7,21,43,.35) 0%, rgba(7,21,43,0) 30%)",
    "radial-gradient(120% 90% at 50% 45%, rgba(21,84,176,0) 60%, rgba(21,84,176,.35) 100%)",
  ].join(","),
};

const Phrase = forwardRef(function Phrase({ phrase, initial }, ref) {
  return (
  <div
    ref={ref}
    className={`col-start-1 row-start-1 w-full max-w-[13ch] will-change-[transform,opacity,filter] ${
      phrase.side === "left" ? "md:justify-self-start" : "md:justify-self-end"
    }`}
    style={initial ? { opacity: 0, visibility: "hidden", filter: `blur(${BLUR}px)` } : undefined}
  >
    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-frost/75 md:text-xs">{phrase.label}</p>
    <h2 className="frost-text text-[1em] font-medium leading-[0.98] tracking-[-0.03em] text-balance">{phrase.text}</h2>
    {phrase.cta && (
      <a
        href="#contato"
        className="mt-8 inline-flex h-12 items-center rounded-lg bg-glacier px-7 font-mono text-xs font-medium uppercase tracking-[0.08em] text-white shadow-[0_10px_40px_-10px_rgba(7,21,43,.6)] ring-1 ring-white/35 transition hover:bg-[#1a5fc4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Agende uma chamada
      </a>
    )}
  </div>
  );
});

// prefers-reduced-motion: sem scrub. Poster do vídeo 2 e as frases em sequência.
function StaticHero() {
  return (
    <section aria-label="Abertura" className="relative min-h-screen overflow-hidden bg-glacier">
      <img src={VIDEOS.esquiador.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" aria-hidden="true" style={EDGE} />
      <div className="relative ml-auto flex max-w-[34rem] flex-col gap-14 px-6 py-[12vh] text-[clamp(2.5rem,6vw,6rem)] md:mr-[6vw]">
        {PHRASES.map((phrase) => (
          <Phrase key={phrase.label} phrase={phrase} />
        ))}
      </div>
    </section>
  );
}
