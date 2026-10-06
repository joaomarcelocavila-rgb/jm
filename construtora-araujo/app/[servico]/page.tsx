import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Contato } from "@/components/Contato";
import { FotoObra } from "@/components/FotoObra";
import { Perguntas } from "@/components/Perguntas";
import { Pendente } from "@/components/Pendente";
import { WhatsAppFlutuante } from "@/components/WhatsAppFlutuante";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";
import { Cota } from "@/components/Cota";
import { mensagemServico } from "@/components/Servicos";
import { paginas } from "@/lib/paginas";
import { perguntas, servicos } from "@/lib/conteudo";
import { site, whatsappUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return paginas.map((p) => ({ servico: p.slug }));
}

type Props = { params: Promise<{ servico: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { servico } = await params;
  const p = paginas.find((x) => x.slug === servico);
  if (!p) return {};
  return {
    title: p.tituloSeo,
    description: p.descricao,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: `${p.tituloSeo} | Construtora Araújo`, description: p.descricao, url: `/${p.slug}` },
  };
}

export default async function PaginaDeServico({ params }: Props) {
  const { servico } = await params;
  const p = paginas.find((x) => x.slug === servico);
  if (!p) notFound();
  const foto = servicos.find((s) => s.slug === p.slug);
  const outros = paginas.filter((x) => x.slug !== p.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.titulo,
    serviceType: p.titulo,
    description: p.descricao,
    url: `${site.url}/${p.slug}`,
    provider: { "@id": `${site.url}/#empresa` },
    areaServed: [...site.bairros, "Zona Leste de São Paulo"].map((name) => ({ "@type": "Place", name })),
  };
  const migalhas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: site.url },
      { "@type": "ListItem", position: 2, name: p.titulo, item: `${site.url}/${p.slug}` },
    ],
  };

  return (
    <>
      <Header />
      <main id="conteudo" className="bg-papel">
        <section className="pb-20 pt-32 md:pb-28 md:pt-44">
          <div className="moldura">
            <nav aria-label="Você está em" className="mono text-tinta/70">
              <Link href="/" className="inline-flex min-h-11 items-center">
                <span className="risco">Início</span>
              </Link>
              <span className="mx-3" aria-hidden="true">/</span>
              <span aria-current="page">{p.titulo}</span>
            </nav>
            <h1 className="mt-6 max-w-[13ch] text-[clamp(48px,8.4vw,128px)]">{p.manchete}</h1>
            <p className="mono mt-8 text-marca">
              {p.titulo} na Zona Leste de São Paulo
            </p>
          </div>
        </section>

        <section className="pb-24 md:pb-36">
          <div className="moldura grid gap-12 lg:grid-cols-12 lg:gap-x-6">
            <div className="relative lg:col-span-5">
              <FotoObra
                src={foto?.foto ?? null}
                alt={foto?.fotoAlt ?? p.titulo}
                proporcao={4 / 5}
                sizes="(min-width: 1024px) 40vw, 100vw"
                preload
              />
              <Cota rotulo="4:5" className="mt-3 hidden w-full md:flex" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              {p.intro.map((t) => (
                <p key={t} className="mb-5 max-w-[56ch] text-[18px] md:text-[20px]">
                  {t}
                </p>
              ))}

              <h2 className="mt-14 text-[clamp(32px,3.6vw,52px)]">O que entra</h2>
              <ul className="mt-6 border-t border-tinta/80">
                {p.itens.map((item) => (
                  <li key={item.nome} className="grid gap-1 border-b border-linha py-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6">
                    <span className="font-titulo text-[22px] font-medium tracking-[-0.01em]">{item.nome}</span>
                    <span className="text-tinta/80">{item.texto}</span>
                  </li>
                ))}
              </ul>
              <Pendente texto="[CONFIRMAR itens do serviço]" className="mt-4 text-tinta/70" />

              <a
                href={whatsappUrl(mensagemServico(p.chamada))}
                target="_blank"
                rel="noopener"
                className="botao botao-laranja mt-12 w-full min-h-14 text-[18px] md:w-auto"
              >
                <IconeWhatsApp />
                Pedir orçamento para {p.chamada}
              </a>

              <div className="mt-16 border-t border-linha pt-8">
                <p className="mono text-tinta/70">Outros serviços</p>
                <ul className="mt-3 flex flex-col">
                  {outros.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/${o.slug}`} className="inline-flex min-h-11 items-center font-titulo text-[24px] font-medium">
                        <span className="risco">{o.titulo} →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Perguntas itens={perguntas.slice(0, 4)} />
      </main>
      <Contato />
      <WhatsAppFlutuante />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, migalhas]) }} />
    </>
  );
}
