import Link from "next/link";
import { FotoObra } from "./FotoObra";
import { Cota } from "./Cota";
import { RotuloSecao } from "./TituloSecao";
import { servicos } from "@/lib/conteudo";
import { whatsappUrl } from "@/lib/site";

export function mensagemServico(chamada: string) {
  return `Olá! Vim pelo site e gostaria de um orçamento para ${chamada}.`;
}

/*
 * Layout de revista: cada bloco tem um encaixe diferente no grid de 12 colunas.
 * No celular é sempre foto em cima, texto embaixo.
 */
const encaixes = [
  {
    foto: "lg:col-start-1 lg:col-span-5",
    texto: "lg:col-start-7 lg:col-span-5 lg:self-end lg:pb-6",
  },
  {
    foto: "lg:col-start-8 lg:col-span-5 lg:row-start-1",
    texto: "lg:col-start-2 lg:col-span-5 lg:row-start-1 lg:self-center",
  },
  {
    foto: "lg:col-start-2 lg:col-span-4",
    texto: "lg:col-start-7 lg:col-span-6 lg:self-start lg:pt-16",
  },
];

export function Servicos() {
  return (
    <section id="servicos" aria-labelledby="titulo-servicos" className="bg-papel pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="moldura">
        <RotuloSecao numero="01" texto="O que fazemos" className="text-tinta/70" />
        <h2
          id="titulo-servicos"
          className="mt-8 max-w-[14ch] text-[clamp(40px,7vw,104px)] md:mt-10 lg:ml-[25%]"
        >
          Da fundação à última demão de tinta.
        </h2>

        <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-28 lg:gap-40">
          {servicos.map((s, i) => {
            const e = encaixes[i % encaixes.length];
            return (
              <article
                key={s.slug}
                aria-labelledby={`servico-${s.slug}`}
                className="grid gap-7 md:grid-cols-2 md:gap-10 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0"
              >
                <div className={`relative ${e.foto} ${i === 1 ? "md:order-2 lg:order-none" : ""}`}>
                  <FotoObra
                    src={s.foto}
                    alt={s.fotoAlt}
                    proporcao={4 / 5}
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  />
                  {i === 0 ? (
                    <Cota orientacao="v" rotulo="4:5" className="absolute -left-6 top-0 hidden h-full xl:flex" />
                  ) : null}
                </div>

                <div className={`${e.texto} ${i === 1 ? "md:order-1 lg:order-none" : ""} md:self-end`}>
                  <h3 id={`servico-${s.slug}`} className="text-[clamp(44px,6.4vw,92px)]">
                    {s.titulo}
                  </h3>
                  <p className="mt-6 max-w-[30ch] font-titulo text-[clamp(21px,2vw,28px)] font-medium leading-[1.2] tracking-[-0.01em]">
                    {s.resumo}
                  </p>
                  <p className="mt-4 max-w-[46ch] text-tinta/80">{s.texto}</p>
                  <div className="mt-8 flex flex-col items-start gap-4">
                    <a
                      href={whatsappUrl(mensagemServico(s.chamada))}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex min-h-11 items-center font-titulo text-[19px] font-medium"
                    >
                      <span className="risco risco-toque">Pedir orçamento para {s.chamada} →</span>
                    </a>
                    <Link href={`/${s.slug}`} className="inline-flex min-h-11 items-center text-[16px] text-tinta/70">
                      <span className="risco">Como fazemos {s.chamada}</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
