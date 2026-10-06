import { Contador } from "./Contador";
import { site } from "@/lib/site";

/** Começa no mesmo azul do último quadro do hero: não aparece emenda. */
export function Numeros() {
  const itens = [
    {
      chave: "anos",
      numero: (
        <>
          <Contador valor={site.anos} /> <span className="text-[0.5em] tracking-[-0.01em]">anos</span>
        </>
      ),
      legenda: `No mercado desde ${site.desde}`,
    },
    {
      chave: "google",
      numero: (
        <>
          <Contador valor={site.google.nota} casas={1} />{" "}
          <span className="text-[0.5em]" aria-hidden="true">
            ★
          </span>
          <span className="so-leitor">estrelas</span>
        </>
      ),
      legenda: `${site.google.avaliacoes} avaliações no Google`,
      href: site.google.fichaUrl,
    },
    {
      chave: "obras",
      numero:
        site.obrasEntregues != null ? (
          <Contador valor={site.obrasEntregues} />
        ) : (
          // [CONFIRMAR NÚMERO] preencha site.obrasEntregues em lib/site.ts
          <span className="text-[0.42em] tracking-[-0.01em]">[CONFIRMAR]</span>
        ),
      legenda: "Obras entregues",
    },
  ];

  return (
    <section aria-label="A Construtora Araújo em números" className="bg-azul text-white">
      <div className="moldura pb-20 pt-12 md:pb-28 md:pt-16">
        <ul className="grid md:grid-cols-3">
          {itens.map((item, i) => {
            const conteudo = (
              <>
                <span className="block font-titulo text-[clamp(64px,9vw,128px)] font-semibold leading-[0.9] tracking-[-0.03em]">
                  {item.numero}
                </span>
                <span className="mono mt-4 flex items-center gap-2 text-white/75">
                  {item.legenda}
                  {item.href ? <span aria-hidden="true">↗</span> : null}
                </span>
              </>
            );
            return (
              <li
                key={item.chave}
                className={`border-t border-white/25 py-8 md:border-t-0 md:py-0 ${
                  i > 0 ? "md:border-l md:pl-8 lg:pl-12" : "md:pr-8"
                } ${i === 0 ? "border-t-0 pt-2 md:pt-0" : ""}`}
              >
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener" className="group block">
                    {conteudo}
                  </a>
                ) : (
                  conteudo
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
