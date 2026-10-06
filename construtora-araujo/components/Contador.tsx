"use client";

import { useEffect, useRef, useState } from "react";

type Props = { valor: number; casas?: number; duracao?: number };

const formatar = (n: number, casas: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

/**
 * Número que conta do 0 até o valor quando entra na tela.
 * O HTML do servidor já vem com o valor final (SEO e sem JS).
 */
export function Contador({ valor, casas = 0, duracao = 1400 }: Props) {
  const el = useRef<HTMLSpanElement>(null);
  const [texto, setTexto] = useState(formatar(valor, casas));

  useEffect(() => {
    const no = el.current;
    if (!no || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // já está na tela ao carregar (voltou com o botão do navegador): não conta
    if (no.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setTexto(formatar(0, casas));
    let raf = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / duracao);
          const suave = 1 - Math.pow(1 - t, 3);
          setTexto(formatar(valor * suave, casas));
          if (t < 1) raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      },
      { threshold: 0.6 },
    );
    obs.observe(no);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [valor, casas, duracao]);

  return (
    <span ref={el} className="tabular-nums">
      {texto}
    </span>
  );
}
