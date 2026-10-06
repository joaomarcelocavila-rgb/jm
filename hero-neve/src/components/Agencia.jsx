import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AGENCIA, waProps } from "../config.js";
import { CAMADAS, EXTRAS, FAQ, INCLUIDO, MESES, PASSOS, RESORTS } from "../data.js";
import WaIcon from "./WaIcon.jsx";

gsap.registerPlugin(ScrollTrigger);

function SecHead({ title, children }) {
  return (
    <div className="sec-head">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <a className="logo" href="#">
        {AGENCIA.nome}
        <small>{AGENCIA.sub}</small>
      </a>
      <nav className="mono">
        <a href="#destinos">Destinos</a>
        <a href="#quiz">Qual neve</a>
        <a href="#duvidas">Dúvidas</a>
        <a href="#contato">Contato</a>
      </nav>
    </header>
  );
}

// As palavras começam apagadas e vão ficando brancas, uma a uma, conforme a rolagem.
// A seção fica presa na tela enquanto isso acontece.
export function Historia() {
  const h = AGENCIA.historia;
  const secRef = useRef(null);
  const words = `${h.frase} ${h.resto}`.split(/\s+/);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sec = secRef.current;
    const ctx = gsap.context(() => {
      gsap.set(".w", { opacity: 0.18 });
      gsap.set(".sign", { opacity: 0, y: 12 });
      gsap
        .timeline({ scrollTrigger: { trigger: sec, start: "top top", end: "+=140%", pin: true, scrub: 0.5 } })
        .to(".w", { opacity: 1, ease: "none", stagger: 0.1, duration: 0.3 })
        .to(".sign", { opacity: 0.6, y: 0, duration: 0.6 }, "-=0.2");
    }, sec);
    return () => ctx.revert();
  }, []);

  return (
    <section id="historia" ref={secRef}>
      <p className="big">
        {words.map((w, i) => (
          <span className="w" key={i}>
            {w}{" "}
          </span>
        ))}
      </p>
      <p className="mono sign">{h.assinatura}</p>
    </section>
  );
}

export function Incluido() {
  return (
    <section id="incluido" className="wrap sec">
      <SecHead title="O que está incluído">
        Nos resorts de neve do Club Med, o que costuma pesar no bolso numa viagem de esqui já vem no preço.
      </SecHead>
      {INCLUIDO.map(([t, d]) => (
        <div className="incl" key={t}>
          <h3>{t}</h3>
          <p>{d}</p>
        </div>
      ))}
    </section>
  );
}

// Ilustração de montanhas desenhada no canvas, diferente para cada resort.
function paintMountains(cv, cores, seed) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = cv.clientWidth || 380;
  const h = Math.round((w * 3) / 4);
  cv.width = w * dpr;
  cv.height = h * dpr;
  const c = cv.getContext("2d");
  c.scale(dpr, dpr);
  const rnd = () => ((seed = (seed * 16807) % 2147483647), (seed - 1) / 2147483646);
  const sky = c.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, cores[0]);
  sky.addColorStop(1, "#ffffff");
  c.fillStyle = sky;
  c.fillRect(0, 0, w, h);
  c.fillStyle = "rgba(255,255,255,.9)";
  c.beginPath();
  c.arc(w * (0.2 + rnd() * 0.6), h * (0.18 + rnd() * 0.12), h * 0.08, 0, 7);
  c.fill();
  for (let L = 0; L < 3; L++) {
    const base = h * (0.48 + L * 0.16);
    const amp = h * (0.34 - L * 0.08);
    const peaks = 3 + L + Math.floor(rnd() * 2);
    const pts = [[0, base + rnd() * amp * 0.3]];
    for (let i = 1; i <= peaks * 2; i++) {
      const x = (w * i) / (peaks * 2);
      const up = i % 2;
      pts.push([x + ((rnd() - 0.5) * w) / (peaks * 4), base - (up ? amp * (0.55 + rnd() * 0.45) : amp * rnd() * 0.25)]);
    }
    c.fillStyle = mix(cores[0], cores[1], L === 0 ? 0.35 : L === 1 ? 0.65 : 1);
    c.beginPath();
    c.moveTo(0, h);
    pts.forEach(([x, y]) => c.lineTo(x, y));
    c.lineTo(w, h);
    c.closePath();
    c.fill();
    // neve nos picos
    c.fillStyle = `rgba(255,255,255,${0.95 - L * 0.2})`;
    pts.forEach((p, i) => {
      if (i % 2 !== 1 || i >= pts.length - 1) return;
      const a = pts[i - 1];
      const b = pts[i + 1];
      const t = 0.32;
      c.beginPath();
      c.moveTo(p[0], p[1]);
      c.lineTo(p[0] + (b[0] - p[0]) * t, p[1] + (b[1] - p[1]) * t);
      c.lineTo(p[0] + (b[0] - p[0]) * t * 0.5, p[1] + (b[1] - p[1]) * t * 0.75);
      c.lineTo(p[0] + (a[0] - p[0]) * t * 0.4, p[1] + (a[1] - p[1]) * t * 0.9);
      c.lineTo(p[0] + (a[0] - p[0]) * t, p[1] + (a[1] - p[1]) * t);
      c.closePath();
      c.fill();
    });
  }
}
function mix(a, b, t) {
  const A = parseInt(a.slice(1), 16);
  const B = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(((A >> s) & 255) * (1 - t) + ((B >> s) & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

export function Destinos() {
  const secRef = useRef(null);
  const trackRef = useRef(null);
  const canvases = useRef([]);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const paint = () => canvases.current.forEach((cv, i) => cv && paintMountains(cv, RESORTS[i].cor, 7 + i * 977));
    paint();
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(paint, 150);
    };
    window.addEventListener("resize", onResize);

    // No computador os destinos ficam presos na tela e a rolagem passa os cartões de lado.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      setPinned(true);
      const track = trackRef.current;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: secRef.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: reduce ? true : 0.6,
          invalidateOnRefresh: true,
        },
      });
      return () => setPinned(false);
    });
    return () => {
      mm.revert();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="destinos" ref={secRef} className={`sec${pinned ? " pinned" : ""}`}>
      <SecHead title="Onde tem neve">
        Alguns dos resorts de neve do Club Med. A gente ajuda a escolher pelo seu nível, pela idade das crianças e pelas datas.
      </SecHead>
      <div className="track" ref={trackRef}>
        {RESORTS.map((r, i) => (
          <article className="resort" key={r.nome}>
            <canvas ref={(el) => (canvases.current[i] = el)} aria-hidden="true" />
            <div className="body">
              <div className="where mono">
                <b>{r.pais}</b>
                <span>
                  {r.regiao} · {r.temp}
                </span>
              </div>
              <h3>{r.nome}</h3>
              <p>{r.txt}</p>
              <div className="chips">
                {r.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
              <a className="go" {...waProps(`Oi! Vi o site e quero saber sobre o Club Med ${r.nome} (${r.pais}).`)}>
                Quero esse →
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="drag mono">Arraste para o lado →</p>
      <p className="note">
        As datas de abertura mudam a cada temporada e de resort para resort. Confirme com a gente antes de fechar as passagens.
      </p>
    </section>
  );
}

const QUIZ = [
  { name: "quem", legend: "1 · Quem vai?", options: [["casal", "Casal"], ["família com crianças", "Família com crianças"], ["grupo de amigos", "Grupo de amigos"]] },
  { name: "nivel", legend: "2 · Já esquiou?", options: [["nunca esquiou", "Nunca"], ["já esquiou algumas vezes", "Algumas vezes"], ["esquia bem", "Esquio bem"]] },
  { name: "onde", legend: "3 · Para onde?", options: [["europa", "Alpes, na Europa"], ["japao", "Japão"], ["canada", "Canadá"], ["tanto faz", "Ainda não sei"]] },
];
const ONDE = { europa: "nos Alpes", japao: "no Japão", canada: "no Canadá" };

export function Quiz() {
  const [resp, setResp] = useState({ quem: "casal", nivel: "nunca esquiou", onde: "europa" });
  const { lista, mensagem } = useMemo(() => {
    const { quem, nivel, onde } = resp;
    const lista = RESORTS.filter((r) => onde === "tanto faz" || r.grupo === onde).map((r) => r.nome);
    const destino = onde === "tanto faz" ? "para a neve (ainda não sabemos onde)" : ONDE[onde];
    return {
      lista,
      mensagem: `Oi! Fiz o quiz do site: somos ${quem}, ${nivel}, e queremos ir ${destino}. Pode me mandar opções?`,
    };
  }, [resp]);

  return (
    <section id="quiz" className="wrap sec">
      <SecHead title="Qual neve é a sua?">Três respostas e a gente já sabe por onde começar. Elas vão junto na mensagem do WhatsApp.</SecHead>
      <form className="qgrid" onSubmit={(e) => e.preventDefault()}>
        {QUIZ.map((q) => (
          <fieldset className="q" key={q.name}>
            <legend>{q.legend}</legend>
            {q.options.map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name={q.name}
                  id={`q-${q.name}-${value.replace(/\s+/g, "-")}`}
                  value={value}
                  checked={resp[q.name] === value}
                  onChange={() => setResp((r) => ({ ...r, [q.name]: value }))}
                />
                {label}
              </label>
            ))}
          </fieldset>
        ))}
      </form>
      <div className="result">
        <p aria-live="polite">
          {resp.onde === "tanto faz" ? "Dá pra começar por " : `Seus resorts ${ONDE[resp.onde]}: `}
          <span>{resp.onde === "tanto faz" ? "Alpes, Japão ou Canadá" : lista.join(", ")}</span>.{" "}
          {resp.nivel === "nunca esquiou" ? "As aulas para iniciantes já vêm incluídas." : "A gente indica o que combina com o seu nível."}
        </p>
        <a className="btn" {...waProps(mensagem)}>
          <WaIcon />
          Mandar minhas respostas
        </a>
      </div>
    </section>
  );
}

export function Como() {
  return (
    <section id="como" className="wrap sec">
      <SecHead title="Como funciona">Do primeiro “oi” até a volta pra casa, você fala com a mesma pessoa.</SecHead>
      <div className="steps">
        {PASSOS.map(([t, d], i) => (
          <div className="step" key={t}>
            <span className="n">{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Levar() {
  return (
    <section id="levar" className="wrap sec">
      <SecHead title="Primeira vez na neve: o que levar">
        O segredo é vestir em camadas: várias peças finas esquentam mais que um casaco grosso, e dá pra tirar uma quando o sol aparece.
      </SecHead>
      <div className="layers">
        {CAMADAS.map(([n, t, d]) => (
          <div className="layer" key={t}>
            <span className="n">{n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
      <div className="extras">
        {EXTRAS.map(([a, b]) => (
          <div key={a}>
            <span>{a}</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Quando() {
  return (
    <section id="quando" className="wrap sec">
      <SecHead title="Quando reservar">
        A neve do hemisfério norte vai de dezembro a abril. Quem reserva meses antes costuma pegar as melhores condições e mais opções de quarto.
      </SecHead>
      <div className="months" aria-label="Calendário: reservar de maio a outubro, temporada de esqui de dezembro a abril">
        {MESES.map(([m, k]) => (
          <div className={k} key={m}>
            {m}
          </div>
        ))}
      </div>
      <div className="legend">
        <span>
          <i className="book-swatch" />
          Melhor época para reservar
        </span>
        <span>
          <i className="ski-swatch" />
          Temporada de esqui
        </span>
      </div>
    </section>
  );
}

export function Duvidas() {
  return (
    <section id="duvidas" className="wrap sec">
      <SecHead title="Perguntas frequentes">O que todo mundo pergunta antes da primeira viagem de neve.</SecHead>
      <div className="faq">
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Contato() {
  return (
    <footer id="contato" className="wrap">
      <h2>Vamos planejar a sua neve?</h2>
      <div className="row">
        <p>Atendemos pelo WhatsApp, de qualquer lugar do Brasil. Conta pra gente quem vai e quando, e mandamos as opções.</p>
        <a className="btn" {...waProps()}>
          <WaIcon />
          Falar no WhatsApp
        </a>
      </div>
      <div className="foot mono">
        <span>
          © 2026 {AGENCIA.nome} {AGENCIA.sub}
        </span>
        <span>{AGENCIA.rodape}</span>
      </div>
    </footer>
  );
}

// Botão de WhatsApp que aparece depois da abertura e some no contato.
export function WaFloat() {
  const ref = useRef(null);
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#historia",
      start: "top 80%",
      endTrigger: "#contato",
      end: "top bottom",
      onToggle: (self) => ref.current.classList.toggle("on", self.isActive),
    });
    return () => st.kill();
  }, []);
  return (
    <a id="wa-float" ref={ref} {...waProps()} aria-label="Falar no WhatsApp">
      <WaIcon />
    </a>
  );
}
