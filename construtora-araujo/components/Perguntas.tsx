import { perguntas } from "@/lib/conteudo";
import { Pendente } from "./Pendente";

/** Acordeão nativo (<details>): funciona sem JavaScript e no leitor de tela. */
export function Perguntas({ itens = perguntas, titulo = "Perguntas que todo mundo faz." }: { itens?: typeof perguntas; titulo?: string }) {
  return (
    <section id="perguntas" aria-labelledby="titulo-faq" className="border-t border-linha bg-papel pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="moldura grid gap-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <p className="mono text-tinta/70">Perguntas frequentes</p>
          <h2 id="titulo-faq" className="mt-4 max-w-[12ch] text-[clamp(40px,5vw,72px)]">
            {titulo}
          </h2>
        </div>
        <div className="border-t border-tinta/80 lg:col-span-7 lg:col-start-6">
          {itens.map((p) => (
            <details key={p.pergunta} className="group border-b border-linha">
              <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-titulo text-[clamp(20px,2vw,26px)] font-medium leading-[1.2] tracking-[-0.01em]">
                  {p.pergunta}
                </span>
                {/* mais/menos desenhado com duas linhas */}
                <span aria-hidden="true" className="relative mt-2 block h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-tinta" />
                  <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-tinta transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <div className="pb-6 pr-10">
                <p className="max-w-[60ch] text-tinta/80">{p.resposta}</p>
                {!p.confirmada ? <Pendente texto="[CONFIRMAR resposta]" className="mt-3 text-tinta/70" /> : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
