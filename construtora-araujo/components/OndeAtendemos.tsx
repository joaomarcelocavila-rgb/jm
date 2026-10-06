import { enderecoCompleto, mapsUrl, site } from "@/lib/site";
import { Pendente } from "./Pendente";

// Busca pelo nome da ficha + endereço: o Google mostra o cartão da empresa com a nota.
const NOME_FICHA = "Construtora Araújo - Construção Reforma e Acabamento em geral";

export function OndeAtendemos() {
  const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${NOME_FICHA}, ${site.endereco.rua} - ${site.endereco.bairro}, ${site.endereco.cidade} - ${site.endereco.uf}, ${site.endereco.cep}`,
  )}&z=15&hl=pt-BR&output=embed`;

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
          {/* Mapa do Google com a ficha da empresa. loading="lazy": só carrega perto de aparecer na tela. */}
          <div className="relative overflow-hidden rounded-obra border border-linha bg-placeholder">
            <iframe
              src={iframeSrc}
              title={`Mapa: ${site.nome}, ${enderecoCompleto()}`}
              className="block h-[420px] w-full md:h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            <a href={mapsUrl} target="_blank" rel="noopener" className="flex min-h-11 items-center font-titulo text-[18px] font-medium">
              <span className="risco">Como chegar pelo Google Maps ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
