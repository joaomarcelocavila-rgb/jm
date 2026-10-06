import { IconeWhatsApp } from "./IconeWhatsApp";
import { Logo } from "./Logo";
import { Pendente } from "./Pendente";
import { mapsUrl, site, whatsappUrl } from "@/lib/site";

export function Contato() {
  return (
    <footer id="contato" className="bg-azul text-white">
      <div className="moldura pb-10 pt-24 md:pt-36">
        <p className="mono text-white/70">Contato</p>
        <h2 className="mt-6 max-w-[11ch] text-[clamp(56px,11vw,180px)] leading-[0.92]">Vamos construir o seu?</h2>

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener"
          className="botao botao-laranja mt-12 min-h-[72px] w-full gap-4 text-[clamp(24px,2.4vw,30px)] md:mt-16 md:min-h-[96px] md:w-auto md:px-12"
        >
          <IconeWhatsApp className="h-7 w-7 md:h-8 md:w-8" />
          Chamar no WhatsApp
        </a>
        <p className="mono mt-4 text-white/70">{site.whatsapp.exibicao}</p>

        <dl className="mt-20 grid gap-10 border-t border-white/25 pt-10 md:grid-cols-3 md:gap-8">
          <div>
            <dt className="mono text-white/75">E-mail</dt>
            <dd className="mt-3">
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center break-all text-[17px] md:text-[18px]">
                <span className="risco risco-toque">{site.email}</span>
              </a>
            </dd>
          </div>
          <div>
            <dt className="mono text-white/75">Endereço</dt>
            <dd className="mt-3">
              <a href={mapsUrl} target="_blank" rel="noopener" className="inline-block py-2">
                <span className="risco">
                  {site.endereco.rua}, {site.endereco.bairro}
                </span>
                <br />
                {site.endereco.cidade}, {site.endereco.uf}, CEP {site.endereco.cep}
              </a>
            </dd>
          </div>
          <div>
            <dt className="mono text-white/75">Horário</dt>
            <dd className="mt-3 py-2">
              {site.horario ? site.horario.texto : <Pendente texto="[CONFIRMAR horário]" className="text-white" />}
            </dd>
          </div>
        </dl>

        <div className="mt-24 flex flex-col gap-8 border-t border-white/25 pt-8 md:flex-row md:items-end md:justify-between">
          <Logo variante="branco" />
          <div className="mono flex flex-col gap-2 text-white/75 md:items-end md:text-right">
            <span>
              CNPJ {site.cnpj ?? <Pendente texto="[CONFIRMAR]" className="ml-1 text-white" />}
            </span>
            <span>© Construtora Araújo, desde {site.desde}</span>
            {site.agencia ? (
              <a href={site.agencia.url} target="_blank" rel="noopener" className="text-white/75">
                Site: {site.agencia.nome}
              </a>
            ) : (
              <span className="text-white/75">
                Site: <Pendente texto="[CONFIRMAR agência]" />
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
