"use client";

import { useState } from "react";
import { enderecoCompleto, mapsUrl, site } from "@/lib/site";
import { Pendente } from "./Pendente";

/*
 * Esquema da Zona Leste (sem escala), desenhado como planta.
 * Posições calculadas a partir da latitude/longitude aproximada de cada bairro.
 */
const pontos: { nome: string; x: number; y: number; ancora?: "start" | "end"; dy?: number }[] = [
  { nome: "Penha", x: 70, y: 210 },
  { nome: "Ermelino Matarazzo", x: 259, y: 110, ancora: "end", dy: -12 },
  { nome: "São Miguel Paulista", x: 365, y: 110, ancora: "end", dy: 24 },
  { nome: "Itaquera", x: 329, y: 253 },
  { nome: "Guaianases", x: 462, y: 263 },
  { nome: "Itaim Paulista", x: 497, y: 123, ancora: "end", dy: 32 },
];
const sede = { x: 503, y: 88 };

function MapaEsquema() {
  return (
    <svg viewBox="0 0 600 320" className="mapa h-auto w-full" role="img" aria-labelledby="mapa-titulo">
      <title id="mapa-titulo">
        Esquema da Zona Leste de São Paulo com a sede da Construtora Araújo na Vila Aimoré
      </title>
      {/* malha de planta */}
      <g stroke="rgb(9 96 184 / 0.12)" strokeWidth="1">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="600" y2={i * 40} />
        ))}
      </g>
      {/* Rio Tietê, traçado aproximado */}
      <path
        d="M0 146 C 90 140, 160 128, 240 104 S 400 60, 600 22"
        fill="none"
        stroke="rgb(9 96 184 / 0.45)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      <text x="70" y="160" className="mapa-mono" fill="rgb(9 96 184 / 0.7)" letterSpacing="1.2">
        RIO TIETÊ
      </text>

      {pontos.map((p) => (
        <g key={p.nome}>
          <rect x={p.x - 3} y={p.y - 3} width="6" height="6" fill="#0E1B2C" />
          <text
            x={p.x + (p.ancora === "end" ? -10 : 10)}
            y={p.y + (p.dy ?? 4)}
            textAnchor={p.ancora ?? "start"}
            className="mapa-rotulo"
            fill="#0E1B2C"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            {p.nome}
          </text>
        </g>
      ))}

      {/* sede */}
      <g>
        <circle cx={sede.x} cy={sede.y} r="16" fill="none" stroke="#0960B8" strokeWidth="1" />
        <line x1={sede.x - 26} y1={sede.y} x2={sede.x + 26} y2={sede.y} stroke="#0960B8" strokeWidth="1" />
        <line x1={sede.x} y1={sede.y - 26} x2={sede.x} y2={sede.y + 26} stroke="#0960B8" strokeWidth="1" />
        <rect x={sede.x - 5} y={sede.y - 5} width="10" height="10" fill="#FF5A1F" />
        <text x={sede.x - 22} y={sede.y - 22} textAnchor="end" className="mapa-sede" fontWeight="600" fill="#0960B8" style={{ fontFamily: "var(--font-saira)" }}>
          Vila Aimoré
        </text>
      </g>

      {/* norte e escala */}
      <g transform="translate(570 270)" fill="#0E1B2C">
        <path d="M0 -18 L6 0 L0 -4 L-6 0 Z" />
        <text y="16" textAnchor="middle" className="mapa-mono">
          N
        </text>
      </g>
      <text x="12" y="308" className="mapa-mono" fill="rgb(14 27 44 / 0.55)" letterSpacing="1.2" style={{ fontFamily: "var(--font-jetbrains)" }}>
        ESQUEMA SEM ESCALA
      </text>
    </svg>
  );
}

export function OndeAtendemos() {
  const [mapa, setMapa] = useState(false);
  const iframeSrc = `https://www.google.com/maps?q=${encodeURIComponent(enderecoCompleto())}&output=embed`;

  return (
    <section id="onde-atendemos" aria-labelledby="titulo-area" className="border-t border-linha bg-papel pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="moldura grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
          <p className="mono text-tinta/70">Onde atendemos</p>
          <h2 id="titulo-area" className="mt-4 text-[clamp(44px,6vw,88px)]">
            Zona Leste, de ponta a ponta.
          </h2>
          <p className="mt-6 max-w-[42ch] text-tinta/80">
            A sede fica na Vila Aimoré, no Itaim Paulista. A gente atende casas e comércios nestes bairros e no resto da
            Zona Leste de São Paulo:
          </p>
          <ul className="mt-6 grid grid-cols-1 border-t border-linha xs:grid-cols-2">
            {site.bairros.map((b) => (
              <li key={b} className="border-b border-linha py-3 font-titulo text-[20px] font-medium">
                {b}
              </li>
            ))}
            <li className="border-b border-linha py-3 font-titulo text-[20px] font-medium">Zona Leste em geral</li>
          </ul>
          {!site.bairrosConfirmados ? <Pendente texto="[CONFIRMAR bairros]" className="mt-4 text-tinta/70" /> : null}

          <address className="mt-10 not-italic">
            <span className="mono block text-tinta/70">Endereço</span>
            <span className="mt-2 block">
              {site.endereco.rua}, {site.endereco.bairro}
              <br />
              {site.endereco.cidade}, {site.endereco.uf}, CEP {site.endereco.cep}
            </span>
          </address>
        </div>

        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-obra border border-linha bg-papel">
            {mapa ? (
              <iframe
                src={iframeSrc}
                title={`Mapa: ${enderecoCompleto()}`}
                className="aspect-[15/8] h-auto min-h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <MapaEsquema />
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            {!mapa ? (
              <button type="button" onClick={() => setMapa(true)} className="flex min-h-11 items-center font-titulo text-[18px] font-medium">
                <span className="risco risco-toque">Abrir no mapa</span>
              </button>
            ) : null}
            <a href={mapsUrl} target="_blank" rel="noopener" className="flex min-h-11 items-center font-titulo text-[18px] font-medium">
              <span className="risco">Como chegar pelo Google Maps ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
