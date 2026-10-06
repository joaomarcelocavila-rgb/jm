"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FotoObra } from "./FotoObra";
import { AntesDepois } from "./AntesDepois";
import { RotuloSecao } from "./TituloSecao";
import { antesDepois, obras } from "@/lib/conteudo";
import { travarRolagem } from "@/lib/rolagem";

const legenda = (tipo: string, bairro: string | null) => (bairro ? `${tipo} — ${bairro}` : tipo);

export function Obras() {
  const [aberta, setAberta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const toqueX = useRef<number | null>(null);

  useEffect(() => {
    const d = dialogo.current!;
    if (aberta !== null && !d.open) {
      d.showModal();
      travarRolagem(true);
    }
    if (aberta === null && d.open) d.close();
  }, [aberta]);

  const passar = (dir: 1 | -1) =>
    setAberta((i) => (i === null ? i : (i + dir + obras.length) % obras.length));

  const obra = aberta !== null ? obras[aberta] : null;

  return (
    <section id="obras" aria-labelledby="titulo-obras" className="bg-papel pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="moldura">
        <div className="grid gap-6 lg:grid-cols-12">
          <RotuloSecao numero="02" texto="Obras entregues" className="text-tinta/70 lg:col-span-12" />
          <h2 id="titulo-obras" className="mt-2 text-[clamp(44px,7vw,104px)] lg:col-span-8 lg:col-start-5">
            O que já saiu do papel.
          </h2>
        </div>

        {/* grid irregular (masonry por colunas) */}
        <ul className="mt-14 columns-1 gap-5 xs:columns-2 md:mt-20 md:gap-6 lg:columns-3">
          {obras.map((o, i) => (
            <li key={i} className="mb-5 break-inside-avoid md:mb-6">
              <button
                type="button"
                onClick={() => setAberta(i)}
                className="group block w-full text-left"
              >
                <FotoObra
                  src={o.foto}
                  alt={o.alt}
                  proporcao={o.proporcao}
                  sizes="(min-width: 1024px) 30vw, (min-width: 390px) 50vw, 100vw"
                  className="transition-[filter] duration-300 group-hover:brightness-[0.94]"
                />
                <span className="mono mt-2.5 block text-tinta/70">{legenda(o.tipo, o.bairro)}</span>
              </button>
            </li>
          ))}
        </ul>

        {antesDepois.length > 0 ? (
          <div className="mt-20 grid gap-8 md:mt-28 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="mono text-tinta/70">Antes e depois</p>
              <p className="mt-3 max-w-[30ch] text-tinta/80">
                Arraste a divisória para ver como estava e como ficou.
              </p>
            </div>
            <div className="flex flex-col gap-12 lg:col-span-8 lg:col-start-5">
              {antesDepois.map((par, i) => (
                <AntesDepois key={i} par={par} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* lightbox simples */}
      <dialog
        ref={dialogo}
        onClose={() => {
          setAberta(null);
          travarRolagem(false);
        }}
        onClick={(e) => e.target === dialogo.current && setAberta(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") passar(1);
          if (e.key === "ArrowLeft") passar(-1);
        }}
        onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (toqueX.current === null) return;
          const dx = e.changedTouches[0].clientX - toqueX.current;
          if (Math.abs(dx) > 50) passar(dx < 0 ? 1 : -1);
          toqueX.current = null;
        }}
        aria-label="Foto ampliada"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-tinta/95 p-0 text-papel backdrop:bg-tinta/80"
      >
        {obra ? (
          <div className="flex h-full flex-col">
            <div className="moldura flex h-16 shrink-0 items-center justify-between">
              <p className="mono text-papel/70">
                {String((aberta ?? 0) + 1).padStart(2, "0")} / {String(obras.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => setAberta(null)}
                className="mono -mr-2 flex min-h-11 items-center px-2"
                autoFocus
              >
                Fechar
              </button>
            </div>
            <div className="relative mx-5 flex min-h-0 flex-1 items-center justify-center md:mx-20">
              {obra.foto ? (
                <Image src={obra.foto} alt={obra.alt} fill sizes="100vw" className="object-contain" />
              ) : (
                <div className="h-full max-h-full w-full max-w-[min(100%,calc((100dvh-10rem)*var(--p)))]" style={{ ["--p" as string]: obra.proporcao }}>
                  <FotoObra src={null} alt={obra.alt} proporcao={obra.proporcao} sizes="100vw" className="max-h-full" />
                </div>
              )}
            </div>
            <div className="moldura flex h-24 shrink-0 items-center justify-between gap-4">
              <button type="button" onClick={() => passar(-1)} className="mono flex min-h-11 items-center">
                <span className="risco">Anterior</span>
              </button>
              <p className="mono hidden text-center md:block">{legenda(obra.tipo, obra.bairro)}</p>
              <button type="button" onClick={() => passar(1)} className="mono flex min-h-11 items-center">
                <span className="risco">Próxima</span>
              </button>
            </div>
            <p className="mono -mt-6 pb-6 text-center md:hidden">{legenda(obra.tipo, obra.bairro)}</p>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
