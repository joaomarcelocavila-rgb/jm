// Conteúdo das seções. Confira resorts e datas com a agência antes de publicar.

export const INCLUIDO = [
  ["Passe das pistas", "O ski pass da estação, pelos dias da sua estadia."],
  ["Aulas de esqui e snowboard", "Em grupo, do primeiro dia de quem nunca viu neve até quem já desce sozinho."],
  ["Refeições e bar", "Café, almoço e jantar, com bebidas no bar do resort."],
  ["Clube para as crianças", "Atividades para os pequenos enquanto os adultos esquiam."],
  ["Hotel na montanha", "Hospedagem dentro da estação, perto das pistas."],
];

export const RESORTS = [
  { nome: "Val Thorens", pais: "França", regiao: "Les 3 Vallées", grupo: "europa", temp: "dez–abr",
    txt: "A estação de esqui mais alta da Europa, dentro do maior domínio esquiável do mundo.", chips: ["Altitude", "Muitas pistas"], cor: ["#bcd3f2", "#1554b0"] },
  { nome: "Tignes", pais: "França", regiao: "Tignes–Val d'Isère", grupo: "europa", temp: "dez–abr",
    txt: "Tem geleira, o que ajuda a ter neve boa no começo e no fim da temporada.", chips: ["Geleira", "Altitude"], cor: ["#cfe0f5", "#2a5fa8"] },
  { nome: "Les Arcs Panorama", pais: "França", regiao: "Paradiski", grupo: "europa", temp: "dez–abr",
    txt: "Pistas com vista para o Mont Blanc, ligadas a La Plagne pelo domínio Paradiski.", chips: ["Vista do Mont Blanc", "Família"], cor: ["#f2d9c4", "#c4572c"] },
  { nome: "Serre-Chevalier", pais: "França", regiao: "Alpes do sul", grupo: "europa", temp: "dez–abr",
    txt: "Nos Alpes do sul, conhecidos pelos dias de sol. O resort foi reformado recentemente.", chips: ["Dias de sol", "Reformado"], cor: ["#f6e3b8", "#c98a1c"] },
  { nome: "Saint-Moritz Roi Soleil", pais: "Suíça", regiao: "Engadina", grupo: "europa", temp: "dez–mar",
    txt: "A cidade que já sediou duas Olimpíadas de Inverno, com lagos congelados e clima de vila alpina.", chips: ["Charme", "Olímpica"], cor: ["#d8d2ee", "#5a4aa8"] },
  { nome: "Québec Charlevoix", pais: "Canadá", regiao: "Quebec", grupo: "canada", temp: "dez–abr",
    txt: "Montanha de frente para o rio São Lourenço, com o clima do inverno canadense.", chips: ["Vista do rio", "Inverno canadense"], cor: ["#d4ebe6", "#1f7a6a"] },
  { nome: "Tomamu", pais: "Japão", regiao: "Hokkaido", grupo: "japao", temp: "dez–mar",
    txt: "A neve em pó de Hokkaido, leve e seca, e a cultura japonesa fora das pistas.", chips: ["Neve em pó", "Cultura"], cor: ["#f4d6df", "#b33a64"] },
  { nome: "Kiroro", pais: "Japão", regiao: "Hokkaido", grupo: "japao", temp: "dez–mar",
    txt: "Uma das regiões que mais recebe neve em Hokkaido, famosa entre quem ama neve fofa.", chips: ["Neve em pó", "Muita neve"], cor: ["#e2ddf3", "#4b3f9e"] },
];

export const PASSOS = [
  ["Conversa", "Você conta quem vai, quando pode ir e se alguém já esquiou."],
  ["Escolha do resort", "Mandamos as opções que fazem sentido, com os valores lado a lado."],
  ["Reserva", "Fechamos o resort e ajudamos com voos, transfer e documentos."],
  ["Viagem", "Ficamos por perto pelo WhatsApp do embarque até a volta."],
];

export const CAMADAS = [
  ["Camada 1 · encostada na pele", "Segunda pele", "Blusa e calça térmicas, que tiram o suor do corpo. Evite algodão: ele molha e esfria."],
  ["Camada 2 · no meio", "Fleece", "Um casaco de fleece ou lã segura o calor do corpo sem pesar."],
  ["Camada 3 · por fora", "Jaqueta e calça de neve", "Impermeáveis, para a neve não molhar o que está por baixo."],
];

export const EXTRAS = [
  ["Luvas impermeáveis", "essenciais"],
  ["Gorro e balaclava", "orelhas e pescoço"],
  ["Meias de lã ou de esqui", "um par por dia"],
  ["Óculos de esqui", "protegem do vento e do reflexo"],
  ["Protetor solar e labial", "o sol na neve queima"],
  ["Esquis, botas e capacete", "dá pra alugar na estação"],
];

// "ski" = temporada de esqui no hemisfério norte; "book" = melhor época para reservar.
export const MESES = [
  ["jan", "ski"], ["fev", "ski"], ["mar", "ski"], ["abr", "ski"], ["mai", "book"], ["jun", "book"],
  ["jul", "book"], ["ago", "book"], ["set", "book"], ["out", "book"], ["nov", ""], ["dez", "ski"],
];

export const FAQ = [
  ["Nunca esquiei. Vou conseguir?", "Vai. Nos resorts de neve do Club Med as aulas em grupo já vêm no pacote e são separadas por nível, então quem nunca viu neve começa junto com outros iniciantes, numa pista mais tranquila."],
  ["Crianças podem ir?", "Podem. Cada resort tem clubes para faixas de idade diferentes, e as aulas para crianças também variam. Conta pra gente a idade de cada uma e indicamos os resorts que recebem bem a sua família."],
  ["Preciso de visto?", "Para a Europa (Espaço Schengen) e para o Japão, brasileiro não precisa de visto para turismo de até 90 dias. Na Europa o seguro-viagem é obrigatório. Para o Canadá é preciso visto ou, em alguns casos, a autorização eletrônica eTA. As regras mudam, por isso conferimos a documentação de todo mundo antes de fechar."],
  ["Quanto custa?", "Depende do resort, da semana e de quantas pessoas vão. Mandamos as opções com os valores lado a lado, já com o que está incluído, para você comparar sem surpresa."],
  ["Quando é melhor reservar?", "Quanto antes, melhor: as semanas de férias escolares e de fim de ano lotam primeiro, e reservando com antecedência há mais opções de quarto e de preço."],
  ["Preciso comprar roupa de neve?", "Não precisa comprar tudo. Dá pra alugar roupa de neve no Brasil antes de viajar e alugar esquis, botas e capacete na estação. Veja a lista do que levar mais acima."],
];
