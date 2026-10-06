/**
 * Textos e listas das seções. Para trocar fotos, preencha `foto` com o
 * caminho do arquivo em /public/obras/ (ex.: "/obras/reforma-itaim-01.jpg").
 * Enquanto `foto` for null, aparece o placeholder cinza "foto da obra".
 */

export type Servico = {
  slug: "construcao" | "reforma" | "acabamento";
  titulo: string;
  resumo: string;
  texto: string;
  /** Nome usado no link "Pedir orçamento para ..." e na mensagem do WhatsApp */
  chamada: string;
  // [PEDIR AO CLIENTE] foto da obra, proporção 4:5
  foto: string | null;
  fotoAlt: string;
};

export const servicos: Servico[] = [
  {
    slug: "construcao",
    titulo: "Construção",
    resumo: "Casas e pequenos comerciais do zero, da fundação ao telhado.",
    texto:
      "A gente pega o terreno vazio e entrega a obra pronta pra morar ou abrir as portas. Uma equipe só, do começo ao fim, sem você ter que ficar juntando gente de fora.",
    chamada: "construção",
    foto: null,
    fotoAlt: "Casa construída pela Construtora Araújo",
  },
  {
    slug: "reforma",
    titulo: "Reforma",
    resumo: "Ampliação, troca de piso, banheiro, cozinha, fachada.",
    texto:
      "Reforma com começo, meio e fim, sem deixar a obra parada no meio. Antes de quebrar a primeira parede você já sabe o que vai ser feito, em que ordem e quanto vai custar.",
    chamada: "reforma",
    foto: null,
    fotoAlt: "Reforma feita pela Construtora Araújo",
  },
  {
    slug: "acabamento",
    titulo: "Acabamento",
    resumo: "Pintura, revestimento, gesso, piso.",
    texto:
      "É o acabamento que faz a casa parecer pronta. Rodapé alinhado, rejunte certo, pintura sem marca de rolo: os detalhes que você vê todo dia depois que a obra acaba.",
    chamada: "acabamento",
    foto: null,
    fotoAlt: "Acabamento feito pela Construtora Araújo",
  },
];

export const etapas = [
  {
    titulo: "Visita e orçamento",
    texto: "Vamos até o local, medimos e passamos um orçamento claro.",
  },
  {
    titulo: "Planejamento",
    texto: "Definimos materiais, prazo e etapas antes de começar.",
  },
  {
    titulo: "Obra",
    texto: "Equipe própria, acompanhamento e obra limpa.",
  },
  {
    titulo: "Entrega",
    texto: "Vistoria junto com você e a chave na mão.",
  },
];

export type Obra = {
  // [PEDIR AO CLIENTE] fotos reais das obras
  foto: string | null;
  /** Tipo de obra, em maiúsculas na legenda: "REFORMA", "CONSTRUÇÃO", "ACABAMENTO" */
  tipo: string;
  // [CONFIRMAR] bairro de cada obra
  bairro: string | null;
  /** largura / altura da foto, para o grid não pular enquanto carrega */
  proporcao: number;
  alt: string;
};

// Placeholders até as fotos chegarem. As proporções variadas montam o grid irregular.
export const obras: Obra[] = [
  { foto: null, tipo: "Reforma", bairro: null, proporcao: 4 / 5, alt: "Reforma" },
  { foto: null, tipo: "Construção", bairro: null, proporcao: 3 / 2, alt: "Construção" },
  { foto: null, tipo: "Acabamento", bairro: null, proporcao: 1, alt: "Acabamento" },
  { foto: null, tipo: "Reforma", bairro: null, proporcao: 3 / 4, alt: "Reforma" },
  { foto: null, tipo: "Construção", bairro: null, proporcao: 4 / 5, alt: "Construção" },
  { foto: null, tipo: "Acabamento", bairro: null, proporcao: 3 / 2, alt: "Acabamento" },
  { foto: null, tipo: "Reforma", bairro: null, proporcao: 1, alt: "Reforma" },
];

export type AntesDepois = {
  antes: string | null;
  depois: string | null;
  tipo: string;
  bairro: string | null;
};

// [PEDIR AO CLIENTE] pares de antes e depois (mesmo ângulo, mesma proporção 3:2).
// Se o cliente não tiver nenhum par, deixe a lista vazia: o slider some.
export const antesDepois: AntesDepois[] = [
  { antes: null, depois: null, tipo: "Reforma", bairro: null },
];

export type Depoimento = {
  /** Primeiro nome + inicial do sobrenome: "Maria S." */
  nome: string;
  estrelas: 1 | 2 | 3 | 4 | 5;
  /** Data como aparece no Google, ex.: "março de 2025" */
  data: string;
  texto: string;
};

// [CONFIRMAR quais avaliações o cliente autoriza usar]
// Copie o texto exatamente como está no Google. Só entra o que o cliente autorizar.
// Formato:
//   { nome: "Maria S.", estrelas: 5, data: "março de 2025", texto: "..." },
export const depoimentos: Depoimento[] = [];

// [CONFIRMAR RESPOSTAS COM O CLIENTE]
// As respostas abaixo são rascunho para o Sandro revisar. `confirmada: false`
// mostra a etiqueta [CONFIRMAR] ao lado enquanto mostrarPendencias estiver ligado.
export const perguntas = [
  {
    pergunta: "Vocês fazem orçamento sem custo?",
    resposta:
      "Fazemos a visita, medimos o local e passamos o orçamento por escrito, com o que vai ser feito e o valor de cada etapa.",
    confirmada: false,
  },
  {
    pergunta: "Atendem obras pequenas?",
    resposta:
      "Sim. Troca de piso, um banheiro, uma pintura: obra pequena também tem orçamento e prazo combinados.",
    confirmada: false,
  },
  {
    pergunta: "Quanto tempo leva uma reforma de banheiro?",
    resposta:
      "Depende do tamanho e do que vai ser trocado. O prazo sai junto com o orçamento, depois da visita, e a gente cumpre o que combinou.",
    confirmada: false,
  },
  {
    pergunta: "Vocês fornecem o material?",
    resposta:
      "Dá pra fazer dos dois jeitos: a gente compra o material ou você compra e a gente passa a lista certinha do que precisa.",
    confirmada: false,
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta:
      "A forma de pagamento é combinada no orçamento, dividida pelas etapas da obra.",
    confirmada: false,
  },
  {
    pergunta: "Atendem fora da Zona Leste?",
    resposta:
      "Nosso foco é a Zona Leste de São Paulo. Para outras regiões, mande uma mensagem com o endereço da obra que a gente avisa se consegue atender.",
    confirmada: false,
  },
];
