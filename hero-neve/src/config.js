// Dados da agência. Troque aqui e o site inteiro acompanha.
export const AGENCIA = {
  nome: "Sua Agência",
  sub: "Neve",
  selo: "Especialistas em viagens de neve com tudo incluído.",
  historia: {
    frase: "Começamos ajudando amigos a escolher o resort certo.",
    resto: "Hoje fazemos o mesmo para famílias que querem ver a neve pela primeira vez, ou voltar pra ela.",
    assinatura: "Modelo de demonstração · troque pelo nome e pela história da agência",
  },
  rodape: "Modelo de demonstração",
  // Só dígitos, com DDI e DDD (ex.: "5585999999999"). Vazio: os botões levam até o contato.
  whatsapp: "",
};

// Exemplo de como fica para a Offline Destinos (quando eles aprovarem):
// nome: "Offline", sub: "Destinos",
// selo: "Agência exclusiva Club Med no Norte e Nordeste.",
// historia.resto: "Hoje fazemos o mesmo para famílias do Norte e Nordeste que querem ver a neve pela primeira vez, ou voltar pra ela.",
// historia.assinatura: "Uma família cearense que viaja de Club Med há mais de dez anos",
// rodape: "Agência exclusiva Club Med · Norte e Nordeste",

export const WA_TEXT = "Oi! Vi o site e quero planejar uma viagem de neve.";

export function waProps(text = WA_TEXT) {
  if (!AGENCIA.whatsapp) return { href: "#contato" };
  return {
    href: `https://wa.me/${AGENCIA.whatsapp}?text=${encodeURIComponent(text)}`,
    target: "_blank",
    rel: "noopener",
  };
}
