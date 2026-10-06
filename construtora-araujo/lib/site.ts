/**
 * Dados da empresa. Tudo o que aparece no site sai daqui.
 *
 * Marcadores:
 *  [CONFIRMAR]       dado que precisa ser confirmado com o cliente
 *  [PEDIR AO CLIENTE] material que o cliente ainda precisa mandar
 *
 * Enquanto `mostrarPendencias` for true, o site exibe uma etiqueta
 * "[CONFIRMAR]" ao lado de cada dado pendente. Desligue antes de publicar
 * de vez: o que estiver null some da página em vez de mostrar a etiqueta.
 */
export const mostrarPendencias = true;

const mensagemPadrao = "Olá! Vim pelo site e gostaria de um orçamento.";

export const site = {
  nome: "Construtora Araújo",
  responsavel: "Sandro Araújo",
  url: "https://construtoraaraujo.com.br",
  desde: 2005,
  // Calculado na hora do build: em 2026 dá 21 anos.
  anos: new Date().getFullYear() - 2005,

  servicos: "construção, reforma e acabamento em geral, para obras residenciais e comerciais",

  endereco: {
    rua: "R. Rio Sobrado, 10",
    bairro: "Vila Aimoré",
    cidade: "São Paulo",
    uf: "SP",
    cep: "08190-110",
  },

  // [CONFIRMAR] Coordenada aproximada da Vila Aimoré. Conferir com o pino da ficha do Google.
  geo: { lat: -23.4905, lng: -46.3962 },

  whatsapp: {
    numero: "5511976265083",
    exibicao: "(11) 97626-5083",
    mensagem: mensagemPadrao,
  },
  telefoneSchema: "+55-11-97626-5083",
  email: "sandroaraujosantos51@gmail.com",

  google: {
    nota: 4.8,
    avaliacoes: 33,
    // [CONFIRMAR] Trocar pelo link curto da ficha (Google Maps > Compartilhar > Copiar link).
    // Enquanto isso, este link de busca abre a ficha pelo nome + endereço.
    fichaUrl:
      "https://www.google.com/maps/search/?api=1&query=Construtora+Ara%C3%BAjo+R.+Rio+Sobrado+10+Vila+Aimor%C3%A9+S%C3%A3o+Paulo",
  },

  // [CONFIRMAR] A ficha do Google diz 8h às 17h todos os dias, o que provavelmente está errado.
  // Quando confirmar, preencha os dois campos. Ex.:
  //   texto: "Segunda a sexta, das 8h às 17h. Sábado, das 8h às 12h."
  //   schema: [{ dias: ["Monday","Tuesday","Wednesday","Thursday","Friday"], abre: "08:00", fecha: "17:00" }]
  horario: null as null | {
    texto: string;
    schema: { dias: string[]; abre: string; fecha: string }[];
  },

  // [CONFIRMAR NÚMERO] Obras entregues. Use só número inteiro (ex.: 350).
  obrasEntregues: null as number | null,

  // [CONFIRMAR] CNPJ no formato 00.000.000/0000-00
  cnpj: null as string | null,

  // [CONFIRMAR] Bairros atendidos. Lista sugerida no briefing.
  bairros: [
    "Vila Aimoré",
    "Itaim Paulista",
    "São Miguel Paulista",
    "Guaianases",
    "Itaquera",
    "Ermelino Matarazzo",
    "Penha",
  ],
  bairrosConfirmados: false,

  // [CONFIRMAR] Nome e link da agência para o crédito do rodapé.
  agencia: null as null | { nome: string; url: string },
};

export function whatsappUrl(mensagem: string = mensagemPadrao) {
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}

export function enderecoCompleto() {
  const e = site.endereco;
  return `${e.rua}, ${e.bairro}, ${e.cidade}, ${e.uf}, CEP ${e.cep}`;
}

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.endereco.rua}, ${site.endereco.bairro}, ${site.endereco.cidade} - ${site.endereco.uf}, ${site.endereco.cep}`,
)}`;

export const nav = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#obras", label: "Obras" },
  { href: "/#como-trabalhamos", label: "Como trabalhamos" },
  { href: "/#contato", label: "Contato" },
];

/** "Vila Aimoré, Itaim Paulista e Penha" */
export function listaBairros(bairros: string[] = site.bairros) {
  if (bairros.length < 2) return bairros.join("");
  return `${bairros.slice(0, -1).join(", ")} e ${bairros[bairros.length - 1]}`;
}
