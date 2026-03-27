export interface Game {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  trailer?: string;
  lancamento?: string;
  desenvolvedor?: string;
  distribuidor?: string;
  categorias: string[];
  modos: string[];
  idiomas: string[];
  classificacao?: string;
  descricao?: string;
  requisitos?: {
    minimo: { sistema: string; processador: string; memoria: string; placa: string; armazenamento: string };
    recomendado: { sistema: string; processador: string; memoria: string; placa: string; armazenamento: string };
  };
  destaques?: string[];
  torrentLink?: string;
  tamanho?: string;
}

export const games: Game[] = [
  {
    id: 1,
    nome: "Red Dead Redemption 2",
    preco: 0,
    imagem: "https://upload.wikimedia.org/wikipedia/pt/e/e7/Rdr2-cover.jpg",
    lancamento: "2019-11-05",
    desenvolvedor: "Rockstar Games",
    distribuidor: "Rockstar Games",
    categorias: ["Ação", "Aventura", "Mundo Aberto"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês", "Espanhol"],
    classificacao: "18+",
    descricao: "América, 1899. O fim da era do velho oeste começou. Após um roubo que deu errado na cidade de Blackwater, Arthur Morgan e a gangue Van der Linde são forçados a fugir.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core i5-2500K", memoria: "8 GB", placa: "Nvidia GTX 770 2GB", armazenamento: "150 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i7-4770K", memoria: "12 GB", placa: "Nvidia GTX 1060 6GB", armazenamento: "150 GB" },
    },
    destaques: ["Mundo aberto imenso", "História épica de 60h+", "Gráficos impressionantes"],
    torrentLink: "#",
    tamanho: "120 GB",
  },
  {
    id: 2,
    nome: "God of War Ragnarök",
    preco: 0,
    imagem: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdqbWo8h.png",
    lancamento: "2024-09-19",
    desenvolvedor: "Santa Monica Studio",
    distribuidor: "PlayStation PC LLC",
    categorias: ["Ação", "Aventura", "RPG"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês", "Espanhol"],
    classificacao: "18+",
    descricao: "Kratos e Atreus devem viajar a cada um dos Nove Reinos em busca de respostas enquanto as forças Asgard se preparam para uma batalha profetizada.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core i5-4670K", memoria: "8 GB", placa: "Nvidia GTX 1060 6GB", armazenamento: "190 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i5-8600", memoria: "16 GB", placa: "Nvidia RTX 3060", armazenamento: "190 GB" },
    },
    destaques: ["Combate visceral", "Narrativa emocionante", "Nove reinos para explorar"],
    torrentLink: "#",
    tamanho: "190 GB",
  },
  {
    id: 3,
    nome: "Cyberpunk 2077",
    preco: 0,
    imagem: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
    lancamento: "2020-12-10",
    desenvolvedor: "CD Projekt RED",
    distribuidor: "CD Projekt",
    categorias: ["RPG", "Ação", "Mundo Aberto"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês", "Espanhol", "Japonês"],
    classificacao: "18+",
    descricao: "Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto ambientado em Night City, uma megalópole obcecada por poder, glamour e modificação corporal.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core i5-3570K", memoria: "8 GB", placa: "Nvidia GTX 970", armazenamento: "70 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i7-4790", memoria: "12 GB", placa: "Nvidia RTX 2060", armazenamento: "70 GB" },
    },
    destaques: ["Mundo cyberpunk imersivo", "Escolhas que importam", "DLC Phantom Liberty"],
    torrentLink: "#",
    tamanho: "70 GB",
  },
  {
    id: 4,
    nome: "Elden Ring",
    preco: 0,
    imagem: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png",
    lancamento: "2022-02-25",
    desenvolvedor: "FromSoftware",
    distribuidor: "Bandai Namco",
    categorias: ["RPG", "Ação", "Mundo Aberto"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês", "Japonês"],
    classificacao: "16+",
    descricao: "LEVANTE-SE, SEM LUZ, e que a graça o guie para abraçar o poder do Anel Prístino e se tornar o Lorde Prístino nas Terras Intermédias.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core i5-8400", memoria: "12 GB", placa: "Nvidia GTX 1060 3GB", armazenamento: "60 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i7-8700K", memoria: "16 GB", placa: "Nvidia RTX 3060 Ti", armazenamento: "60 GB" },
    },
    destaques: ["Mundo aberto massivo", "Combate desafiador", "Criado por Miyazaki e George R.R. Martin"],
    torrentLink: "#",
    tamanho: "60 GB",
  },
  {
    id: 5,
    nome: "GTA V",
    preco: 0,
    imagem: "https://upload.wikimedia.org/wikipedia/pt/c/c1/Se7en_Se7enposter.jpg",
    lancamento: "2015-04-14",
    desenvolvedor: "Rockstar North",
    distribuidor: "Rockstar Games",
    categorias: ["Ação", "Aventura", "Mundo Aberto"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês", "Espanhol"],
    classificacao: "18+",
    descricao: "Grand Theft Auto V para PC oferece aos jogadores a oportunidade de explorar o premiado mundo de Los Santos e Blaine County em resoluções de até 4k.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core 2 Quad Q6600", memoria: "4 GB", placa: "Nvidia 9800 GT 1GB", armazenamento: "72 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i5-3470", memoria: "8 GB", placa: "Nvidia GTX 660 2GB", armazenamento: "72 GB" },
    },
    destaques: ["Três protagonistas jogáveis", "GTA Online incluso", "Mundo detalhado"],
    torrentLink: "#",
    tamanho: "72 GB",
  },
  {
    id: 6,
    nome: "Hogwarts Legacy",
    preco: 0,
    imagem: "https://image.api.playstation.com/vulcan/ap/rnd/202208/0921/dR9KGET7a4cSkYqKEMYqhPf3.png",
    lancamento: "2023-02-10",
    desenvolvedor: "Avalanche Software",
    distribuidor: "Warner Bros.",
    categorias: ["RPG", "Aventura", "Mundo Aberto"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    classificacao: "12+",
    descricao: "Hogwarts Legacy é um RPG de ação em mundo aberto ambientado no universo Harry Potter nos anos 1800.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core i5-6600", memoria: "16 GB", placa: "Nvidia GTX 960 4GB", armazenamento: "85 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i7-8700", memoria: "16 GB", placa: "Nvidia RTX 2080 Ti", armazenamento: "85 GB" },
    },
    destaques: ["Explore Hogwarts livremente", "Aprenda feitiços", "Crie seu bruxo"],
    torrentLink: "#",
    tamanho: "85 GB",
  },
  {
    id: 7,
    nome: "Spider-Man Remastered",
    preco: 0,
    imagem: "https://image.api.playstation.com/vulcan/ap/rnd/202011/0714/RTVMlJXPyzjagRhgAvJyXRxp.png",
    lancamento: "2022-08-12",
    desenvolvedor: "Insomniac Games",
    distribuidor: "PlayStation PC LLC",
    categorias: ["Ação", "Aventura"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês", "Espanhol"],
    classificacao: "14+",
    descricao: "Balançe-se pela Nova York da Marvel, combata vilões icônicos e viva a vida de Peter Parker.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core i3-4160", memoria: "8 GB", placa: "Nvidia GTX 950", armazenamento: "75 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i5-4670", memoria: "16 GB", placa: "Nvidia RTX 3070", armazenamento: "75 GB" },
    },
    destaques: ["Combate fluido", "Exploração vertical", "História envolvente"],
    torrentLink: "#",
    tamanho: "75 GB",
  },
  {
    id: 8,
    nome: "The Witcher 3: Wild Hunt",
    preco: 0,
    imagem: "https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHlktOHar3lVl6rY.png",
    lancamento: "2015-05-19",
    desenvolvedor: "CD Projekt RED",
    distribuidor: "CD Projekt",
    categorias: ["RPG", "Ação", "Mundo Aberto"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês", "Espanhol"],
    classificacao: "18+",
    descricao: "Você é Geralt de Rivia, mercenário matador de monstros. À sua frente se estende um continente devastado pela guerra, esperando para ser explorado.",
    requisitos: {
      minimo: { sistema: "Windows 10", processador: "Intel Core i5-2500K", memoria: "6 GB", placa: "Nvidia GTX 660", armazenamento: "50 GB" },
      recomendado: { sistema: "Windows 10", processador: "Intel Core i7-3770", memoria: "8 GB", placa: "Nvidia GTX 770", armazenamento: "50 GB" },
    },
    destaques: ["200+ horas de conteúdo", "Escolhas com consequências", "Melhor RPG de todos os tempos"],
    torrentLink: "#",
    tamanho: "50 GB",
  },
];

export const allCategories = Array.from(new Set(games.flatMap((g) => g.categorias))).sort();
