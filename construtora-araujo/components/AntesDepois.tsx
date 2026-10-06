"use client";

import { useRef, useState } from "react";
import { FotoObra } from "./FotoObra";
import type { AntesDepois as Par } from "@/lib/conteudo";

/**
 * Slider de antes e depois. Arrasta com o dedo ou o mouse em qualquer ponto
 * da foto; no teclado, as setas movem a divisória (input range por baixo).
 * touch-action: pan-y deixa a página rolar na vertical mesmo com o dedo na foto.
 */
export function AntesDepois({ par }: { par: Par }) {
  const [pos, setPos] = useState(50);
  const caixa = useRef<HTMLDivElement>(null);
  const arrastando = useRef(false);

  const mover = (clientX: number) => {
    const r = caixa.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  const legenda = (par.bairro ? `${par.tipo} — ${par.bairro}` : par.tipo);

  return (
    <figure>
      <div
        ref={caixa}
        className="relative select-none overflow-hidden rounded-obra [touch-action:pan-y]"
        onPointerDown={(e) => {
          arrastando.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          mover(e.clientX);
        }}
        onPointerMove={(e) => arrastando.current && mover(e.clientX)}
        onPointerUp={() => (arrastando.current = false)}
        onPointerCancel={() => (arrastando.current = false)}
      >
        <FotoObra src={par.depois} alt={`Depois: ${legenda}`} proporcao={3 / 2} sizes="(min-width: 1024px) 66vw, 100vw" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <FotoObra
            src={par.antes}
            alt={`Antes: ${legenda}`}
            proporcao={3 / 2}
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="!bg-[#bdb7ad]"
          />
        </div>

        <span className="mono absolute left-3 top-3 bg-tinta px-2 py-1 text-papel">Antes</span>
        <span className="mono absolute right-3 top-3 bg-papel px-2 py-1 text-tinta">Depois</span>

        {/* divisória */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-obra bg-white text-tinta">
            <span className="block h-4 w-px bg-tinta" />
            <span className="block h-4 w-px bg-tinta" />
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Comparar antes e depois"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mono mt-3 text-tinta/70">{legenda}</figcaption>
    </figure>
  );
}
