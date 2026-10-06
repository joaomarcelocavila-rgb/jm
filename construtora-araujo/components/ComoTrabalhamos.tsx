"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { etapas } from "@/lib/conteudo";

gsap.registerPlugin(ScrollTrigger);

/**
 * "Do papel à chave": linha do tempo desenhada como planta técnica.
 * Horizontal a partir de 1024px, vertical no celular e tablet.
 * A linha tracejada se desenha com o scroll (clip-path com scrub).
 */
export function ComoTrabalhamos() {
  const lista = useRef<HTMLOListElement>(null);
  const linha = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const st = { trigger: lista.current, scrub: 0.6 };
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      gsap.fromTo(
        linha.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { ...st, start: "top 80%", end: "bottom 55%" } },
      );
    });
    mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
      gsap.fromTo(
        linha.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", ease: "none", scrollTrigger: { ...st, start: "top 70%", end: "bottom 60%" } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="como-trabalhamos"
      aria-labelledby="titulo-processo"
      className="relative overflow-hidden border-t border-linha bg-papel pb-24 pt-20 md:pb-36 md:pt-28"
    >
      <div className="moldura">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <p className="mono text-tinta/70 lg:col-span-3 lg:pb-3">Como trabalhamos</p>
          <h2 id="titulo-processo" className="text-[clamp(48px,9vw,140px)] lg:col-span-9">
            Do papel à chave.
          </h2>
        </div>

        <div className="relative mt-16 md:mt-24">
          {/* guia tracejada fixa (30%) + linha que se desenha (100%) */}
          <div aria-hidden="true" className="tracejado-v absolute bottom-0 left-[5px] top-0 lg:hidden" />
          <div aria-hidden="true" className="tracejado-h absolute left-0 right-0 top-[39px] hidden lg:block" />
          <div
            ref={linha}
            aria-hidden="true"
            className="absolute bottom-0 left-[5px] top-0 w-px [background-image:linear-gradient(to_bottom,#0960B8_0_6px,transparent_6px_10px)] [background-size:1px_10px] lg:bottom-auto lg:left-0 lg:right-0 lg:top-[39px] lg:h-px lg:w-auto lg:[background-image:linear-gradient(to_right,#0960B8_0_6px,transparent_6px_10px)] lg:[background-size:10px_1px]"
          />

          <ol ref={lista} className="relative grid gap-14 lg:grid-cols-4 lg:gap-8">
            {etapas.map((etapa, i) => (
              <li key={etapa.titulo} className="relative pl-10 lg:pl-0">
                <p className="mono text-marca lg:h-[28px]">Etapa {String(i + 1).padStart(2, "0")}</p>

                {/* ponto de levantamento sobre a linha */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[5px] block h-[11px] w-[11px] border border-marca bg-papel lg:left-0 lg:top-[34px]"
                >
                  <span className="absolute inset-[3px] bg-marca" />
                </span>

                {/* cota: marcação entre uma etapa e a próxima */}
                {i < etapas.length - 1 ? (
                  <span aria-hidden="true" className="absolute right-0 top-[33px] hidden h-[13px] w-px bg-marca/30 lg:block" />
                ) : null}

                <h3 className="mt-3 text-[clamp(30px,3.2vw,44px)] lg:mt-12">{etapa.titulo}</h3>
                <p className="mt-3 max-w-[32ch] text-tinta/80">{etapa.texto}</p>
              </li>
            ))}
          </ol>

          <p aria-hidden="true" className="mono absolute -top-1 right-0 hidden text-marca/50 lg:block">
            Chave na mão
          </p>
        </div>
      </div>
    </section>
  );
}
