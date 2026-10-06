"use client";

import { useRef, useState } from "react";
import { depoimentos } from "@/lib/conteudo";
import { site } from "@/lib/site";
import { Pendente } from "./Pendente";

function Estrelas({ n, rotulo }: { n: number; rotulo?: string }) {
  return (
    <span className="tracking-[0.15em] text-laranja" aria-label={rotulo ?? `${n} de 5 estrelas`} role="img">
      {"★".repeat(n)}
      <span className="text-tinta/20">{"★".repeat(5 - n)}</span>
    </span>
  );
}

/**
 * Só avaliações reais do Google, com autorização do cliente (lib/conteudo.ts).
 * Enquanto a lista estiver vazia, a seção mostra a nota e o link para a ficha.
 */
export function Depoimentos() {
  const [i, setI] = useState(0);
  const toqueX = useRef<number | null>(null);
  const total = depoimentos.length;
  const passar = (dir: 1 | -1) => setI((atual) => (atual + dir + total) % total);
  const d = depoimentos[i];

  return (
    <section aria-labelledby="titulo-depoimentos" className="border-t border-linha bg-papel pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="moldura grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="mono text-tinta/70">Quem já fez obra com a gente</p>
          <h2 id="titulo-depoimentos" className="mt-4 text-[clamp(56px,7vw,104px)]">
            {site.google.nota.toLocaleString("pt-BR")}
          </h2>
          <p className="mt-2">
            <Estrelas n={5} rotulo={`Nota ${site.google.nota.toLocaleString("pt-BR")} de 5`} />
          </p>
          <p className="mono mt-3 text-tinta/70">{site.google.avaliacoes} avaliações no Google</p>
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          {d ? (
            <figure
              onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (toqueX.current === null) return;
                const dx = e.changedTouches[0].clientX - toqueX.current;
                if (Math.abs(dx) > 50) passar(dx < 0 ? 1 : -1);
                toqueX.current = null;
              }}
            >
              <div aria-live="polite">
                <blockquote className="font-titulo text-[clamp(26px,3.4vw,48px)] font-medium leading-[1.15] tracking-[-0.015em]">
                  “{d.texto}”
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="font-titulo text-[20px] font-medium">{d.nome}</span>
                  <Estrelas n={d.estrelas} />
                  <span className="mono text-tinta/70">{d.data}</span>
                </figcaption>
              </div>
              {total > 1 ? (
                <div className="mt-10 flex items-center gap-6">
                  <button type="button" onClick={() => passar(-1)} className="flex min-h-11 items-center" aria-label="Avaliação anterior">
                    <span className="risco font-titulo text-[18px] font-medium">← Anterior</span>
                  </button>
                  <span className="mono text-tinta/70">
                    {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <button type="button" onClick={() => passar(1)} className="flex min-h-11 items-center" aria-label="Próxima avaliação">
                    <span className="risco font-titulo text-[18px] font-medium">Próxima →</span>
                  </button>
                </div>
              ) : null}
            </figure>
          ) : (
            <div>
              {/* [CONFIRMAR quais avaliações o cliente autoriza usar] */}
              <p className="font-titulo text-[clamp(26px,3.4vw,48px)] font-medium leading-[1.15] tracking-[-0.015em]">
                Nota {site.google.nota.toLocaleString("pt-BR")} com {site.google.avaliacoes} avaliações no Google. Leia o que
                os clientes escreveram direto na ficha.
              </p>
              <Pendente texto="[CONFIRMAR avaliações autorizadas]" className="mt-6 text-tinta/70" />
            </div>
          )}

          <a
            href={site.google.fichaUrl}
            target="_blank"
            rel="noopener"
            className="botao botao-contorno mt-10 text-tinta hover:border-tinta! hover:bg-tinta! hover:text-papel!"
          >
            Ver todas as avaliações no Google
          </a>
        </div>
      </div>
    </section>
  );
}
