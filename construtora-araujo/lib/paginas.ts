import { listaBairros } from "./site";

/**
 * Texto próprio de cada página de serviço (/construcao, /reforma, /acabamento).
 * Cada uma cita os bairros, o que ajuda no SEO local.
 * [CONFIRMAR] revisar com o Sandro o que entra em cada serviço.
 */
export type PaginaServico = {
  slug: "construcao" | "reforma" | "acabamento";
  titulo: string;
  tituloSeo: string;
  descricao: string;
  chamada: string;
  manchete: string;
  intro: string[];
  itens: { nome: string; texto: string }[];
};

const bairros = listaBairros();

export const paginas: PaginaServico[] = [
  {
    slug: "construcao",
    titulo: "Construção",
    tituloSeo: "Construção de casas e comércios na Zona Leste de SP",
    descricao:
      "Construção de casas e pequenos comerciais do zero, da fundação ao telhado, na Zona Leste de São Paulo. Orçamento pelo WhatsApp (11) 97626-5083.",
    chamada: "construção",
    manchete: "Do terreno vazio à casa pronta.",
    intro: [
      "A Construtora Araújo constrói casas e pequenos comerciais do zero, da fundação ao telhado. Desde 2005 a gente trabalha na Zona Leste de São Paulo, com sede na Vila Aimoré.",
      `Atendemos ${bairros}, além do resto da Zona Leste. A primeira conversa é pelo WhatsApp; depois a gente vai até o terreno, mede e passa um orçamento claro, com as etapas e o prazo.`,
    ],
    itens: [
      { nome: "Casa térrea e sobrado", texto: "Obra residencial completa, do alicerce à cobertura." },
      { nome: "Pequeno comércio", texto: "Ponto comercial construído para abrir as portas." },
      { nome: "Fundação e estrutura", texto: "A parte que ninguém vê e que segura todo o resto." },
      { nome: "Telhado", texto: "Cobertura feita junto com a obra, sem terceirizar a última etapa." },
    ],
  },
  {
    slug: "reforma",
    titulo: "Reforma",
    tituloSeo: "Reforma de casas e comércios na Zona Leste de SP",
    descricao:
      "Reforma, ampliação, banheiro, cozinha, piso e fachada na Zona Leste de São Paulo, sem deixar a obra parada no meio. Orçamento pelo WhatsApp (11) 97626-5083.",
    chamada: "reforma",
    manchete: "Reforma que começa e termina.",
    intro: [
      "Ampliação, troca de piso, banheiro, cozinha, fachada. A Construtora Araújo faz reforma residencial e comercial na Zona Leste de São Paulo desde 2005, sem deixar a obra parada no meio.",
      `Atendemos ${bairros}, além do resto da Zona Leste. Antes de começar, você sabe o que vai ser feito, em que ordem e quanto custa.`,
    ],
    itens: [
      { nome: "Ampliação", texto: "Mais um cômodo, laje, segundo andar." },
      { nome: "Banheiro", texto: "Troca de revestimento, louça, box e encanamento do banheiro." },
      { nome: "Cozinha", texto: "Bancada, piso, revestimento e a cozinha do jeito que você usa." },
      { nome: "Piso", texto: "Troca de piso em um cômodo ou na casa toda." },
      { nome: "Fachada", texto: "A frente da casa ou do comércio de cara nova." },
    ],
  },
  {
    slug: "acabamento",
    titulo: "Acabamento",
    tituloSeo: "Acabamento, pintura, gesso e piso na Zona Leste de SP",
    descricao:
      "Pintura, revestimento, gesso e piso na Zona Leste de São Paulo: os detalhes que fazem a casa parecer pronta. Orçamento pelo WhatsApp (11) 97626-5083.",
    chamada: "acabamento",
    manchete: "O detalhe que você vê todo dia.",
    intro: [
      "Pintura, revestimento, gesso e piso. O acabamento é o que faz a casa parecer pronta, e é o que você vai olhar todo dia depois que a obra termina.",
      `A Construtora Araújo faz acabamento em obra nova e em reforma, na Zona Leste de São Paulo desde 2005. Atendemos ${bairros}, além do resto da Zona Leste.`,
    ],
    itens: [
      { nome: "Pintura", texto: "Parede, teto, fachada, com a preparação certa antes da tinta." },
      { nome: "Revestimento", texto: "Cerâmica e porcelanato em parede e piso, com rejunte alinhado." },
      { nome: "Gesso", texto: "Forro, sanca e acabamento de parede." },
      { nome: "Piso", texto: "Assentamento de piso e rodapé." },
    ],
  },
];
