import { servicos } from "./conteudo";
import { site } from "./site";

/** Schema.org GeneralContractor para o SEO local. */
export function schemaEmpresa() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${site.url}/#empresa`,
    name: site.nome,
    url: site.url,
    image: `${site.url}/hero/araujo-hero-poster.jpg`,
    logo: `${site.url}/icon.svg`,
    description:
      "Construção, reforma e acabamento em geral, para obras residenciais e comerciais, desde 2005 na Zona Leste de São Paulo.",
    foundingDate: String(site.desde),
    founder: { "@type": "Person", name: site.responsavel },
    telephone: site.telefoneSchema,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.endereco.rua,
      addressLocality: site.endereco.cidade,
      addressRegion: site.endereco.uf,
      postalCode: site.endereco.cep,
      addressCountry: "BR",
    },
    // [CONFIRMAR] coordenada aproximada
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.google.fichaUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.google.nota,
      reviewCount: site.google.avaliacoes,
      bestRating: 5,
    },
    areaServed: [
      ...site.bairros.map((b) => ({ "@type": "Place", name: `${b}, São Paulo - SP` })),
      { "@type": "Place", name: "Zona Leste, São Paulo - SP" },
    ],
    makesOffer: servicos.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.titulo, url: `${site.url}/${s.slug}` },
    })),
  };
  if (site.cnpj) schema.taxID = site.cnpj;
  // [CONFIRMAR] horário: só entra no schema depois de confirmado em lib/site.ts
  if (site.horario) {
    schema.openingHoursSpecification = site.horario.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias,
      opens: h.abre,
      closes: h.fecha,
    }));
  }
  return schema;
}
