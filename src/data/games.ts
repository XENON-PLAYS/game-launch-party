export interface Game {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  heroImage?: string;
  verticalImage?: string;
  capsuleImage?: string;
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
    minimo: { sistema: string; processador: string; memoria: string; placa: string; armazenamento: string } | string;
    recomendado: { sistema: string; processador: string; memoria: string; placa: string; armazenamento: string } | string;
  };
  destaques?: string[];
  torrentLink?: string;
  tamanho?: string;
}

export const games: Game[] = [
  {
    id: 1,
    nome: "Red Dead Redemption 2", 
    distribuidor: "Rockstar Games", 
    desenvolvedor: "Rockstar Games", 
    lancamento: "5/dez./2019",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "Arthur Morgan e a gangue Van der Linde são forçados a fugir. Com agentes federais e caçadores de recompensas no seu encalço, a gangue precisa roubar, assaltar e lutar para sobreviver no impiedoso coração dos Estados Unidos. 1899. O fim da era do velho oeste começou.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 - 64-bit<br></li><li><strong>Processador:</strong> Intel® Core™ i5-2500K / AMD FX-6300<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 150 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> Direct X Compatible</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 - 64-bit<br></li><li><strong>Processador:</strong> Intel® Core™ i7-4770K / AMD Ryzen 5 1500X<br></li><li><strong>Memória:</strong> 12 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 150 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> Direct X Compatible</li></ul>"
    },
  },
  {
    id: 2,
    nome: "Elden Ring", 
    distribuidor: "FromSoftware, Inc., Bandai Namco Entertainment", 
    desenvolvedor: "FromSoftware, Inc.", 
    lancamento: "24/fev./2022",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg",
    categorias: ["Ação","RPG"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "O NOVO RPG DE AÇÃO E FANTASIA. Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias. Maculado, e seja guiado pela graça.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10<br></li><li><strong>Processador:</strong> INTEL CORE I5-8400 or AMD RYZEN 3 3300X<br></li><li><strong>Memória:</strong> 12 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 60 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> Windows Compatible Audio Device<br></li><li><strong>Outras observações:</strong> </li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10/11<br></li><li><strong>Processador:</strong> INTEL CORE I7-8700K or AMD RYZEN 5 3600X<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GEFORCE GTX 1070 8 GB or AMD RADEON RX VEGA 56 8 GB<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 60 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> Windows Compatible Audio Device<br></li><li><strong>Outras observações:</strong> </li></ul>"
    },
  },
  {
    id: 3,
    nome: "Dark Souls Remastered", 
    descricao: "Mas então, fez-se o fogo. Experimente novamente o jogo aclamado pela crítica e definidor de gênero que foi o início tudo. Belamente remasterizado, volte a Lordran com detalhes em alta definição a 60fps.", 
    distribuidor: "FromSoftware, Inc., Bandai Namco Entertainment", 
    desenvolvedor: "QLOC, FromSoftware, Inc.", 
    lancamento: "23/mai./2018",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/570940/header.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO *:</strong> Windows 7 64-bit, Service Pack 1<br></li><li><strong>Processador:</strong> Intel Core i5-2300 2.8 GHz / AMD FX-6300, 3.5 GHz<br></li><li><strong>Memória:</strong> 6 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> GeForce GTX 460, 1 GB / Radeon HD 6870, 1 GB<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 8 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 sound device<br></li><li><strong>Outras observações:</strong> Low Settings, 60 FPS @ 1080p</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit<br></li><li><strong>Processador:</strong> Intel Core i5-4570 3.2 GHz / AMD FX-8350 4.2 GHz<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> GeForce GTX 660, 2 GB / Radeon HD 7870, 2 GB<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 8 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 sound device<br></li><li><strong>Outras observações:</strong> High Settings, 60 FPS @ 1080p</li></ul>"
    },
  },
  {
    id: 4,
    nome: "Dark Souls 3", 
    descricao: "DARK SOULS™ II: Scholar of the First Sin leva a renomada obscuridade e jogabilidade viciante da franquia a um novo nível. Junte-se à jornada sombria e vivencie encontros com inimigos devastadores, perigos diabólicos e o desafio implacável.", 
    distribuidor: "Bandai Namco Entertainment, FromSoftware, Inc.", 
    desenvolvedor: "FromSoftware, Inc.", 
    lancamento: "1/abr./2015",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/capsule_616x353.jpg",
    categorias: ["Ação","RPG"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7 SP1 64bit, Windows 8.1 64bit<br></li><li><strong>Processador:</strong> AMD® A8 3870 3,6 Ghz or Intel® Core ™ i3 2100 3.1Ghz<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce  GTX 465 / ATI Radeon TM HD 6870<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 23 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 sound device</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7 SP1 64bit, Windows 8.1 64bit<br></li><li><strong>Processador:</strong> AMD® FX 8150 3.6 GHz or Intel® Core™ i7 2600 3.4 GHz<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 750, ATI Radeon™ HD 7850<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 23 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 sound device</li></ul>"
    },
  },
  {
    id: 5,
    nome: "Resident Evil 2", 
    descricao: "Um vírus maligno toma conta dos residentes de Raccoon City em setembro de 1998, afundando a cidade no caos enquanto zumbis comedores de carne humana vagam pelas ruas em busca de sobreviventes. Um surto de adrenalina sem comparação, uma história instigante e horrores inimagináveis o aguardam.", 
    distribuidor: "CAPCOM Co., Ltd.", 
    desenvolvedor: "CAPCOM Co., Ltd.", 
    lancamento: "24/jan./2019",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/883710/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/883710/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/883710/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/883710/capsule_616x353.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> WINDOWS® 10 (64-BIT Required)<br></li><li><strong>Processador:</strong> Intel® Core™ i5-4460 or AMD FX™-6300 or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 960 or AMD Radeon™ RX 460<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 26 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> This game is expected to run at 1080p/30 FPS. If you have don't have enough graphics memory to run the game at your selected texture quality, you must go to Options &gt; Graphics and lower the texture quality or shadow quality, or decrease the resolution. An internet connection is required for product activation. (Network connectivity uses Steam® developed by Valve® Corporation.)</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> WINDOWS® 10 (64-BIT Required)<br></li><li><strong>Processador:</strong> Intel® Core™ i7-3770 or AMD FX™-9590 or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 1060 or AMD Radeon™ RX 480  with 3GB VRAM<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 26 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> This game is expected to run at 1080p/60 FPS. An internet connection is required for product activation. (Network connectivity uses Steam® developed by Valve® Corporation.)</li></ul>"
    },
  },
  {
    id: 6,
    nome: "Resident Evil 3", 
    descricao: "Jill Valentine é uma das últimas pessoas em Raccoon City a testemunhar as atrocidades que a Umbrella cometeu. Para pará-la a Umbrella libera sua arma secreta suprema: Nemesis! Também inclui a Resident Evil Resistance, um novo modo de jogo multijogador online 4x1.", 
    distribuidor: "CAPCOM Co., Ltd.", 
    desenvolvedor: "CAPCOM Co., Ltd.", 
    lancamento: "2/abr./2020",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/952060/header.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> WINDOWS® 10 (64-BIT Required)<br></li><li><strong>Processador:</strong> Intel® Core™ i5-4460 or AMD FX™-6300 or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 960 or AMD Radeon™ RX 460<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 45 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> Anticipated performance at these specifications is 1080p/30FPS for Resident Evil 3 and 720p/30FPS for Resident Evil Resistance. If you don't have enough graphics memory to run the game at your selected texture quality, you must go to Options &gt; Graphics and lower the texture quality or shadow quality, or decrease the resolution. An internet connection is required for product activation. In addition, an internet connection is required at all times when playing Resident Evil Resistance. (Network connectivity uses Steam® developed by Valve® Corporation.)</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> WINDOWS® 10 (64-BIT Required)<br></li><li><strong>Processador:</strong> Intel® Core™ i7-3770 or AMD FX™-9590 or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 1060 or AMD Radeon™ RX 480 with 3GB VRAM<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 45 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> Anticipated performance at these specifications is 1080p/60FPS. An internet connection is required for product activation. In addition, an internet connection is required at all times when playing Resident Evil Resistance. (Network connectivity uses Steam® developed by Valve® Corporation.)</li></ul>"
    },
  },
  {
    id: 7,
    nome: "Resident Evil Village", 
    descricao: "Vivencie o horror de sobrevivência como nunca na 8ª sequência parte da franquia Resident Evil - Resident Evil Village. Com gráficos detalhados, ação intensa em primeira pessoa e uma narrativa primorosa, o terror nunca foi tão realista.", 
    distribuidor: "CAPCOM Co., Ltd.", 
    desenvolvedor: "CAPCOM Co., Ltd.", 
    lancamento: "6/mai./2021",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 (64 bit)<br></li><li><strong>Processador:</strong> AMD Ryzen 3 1200  ／ Intel Core i5-7500<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon RX 560 with 4GB VRAM ／ NVIDIA GeForce GTX 1050 Ti with 4GB VRAM<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Outras observações:</strong> Estimated performance (when set to Prioritize Performance): 1080p/60fps. ・Framerate might drop in graphics-intensive scenes. ・AMD Radeon RX 6700 XT or NVIDIA GeForce RTX 2060 required to support ray tracing.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 (64 bit)<br></li><li><strong>Processador:</strong> AMD Ryzen 5 3600 ／ Intel Core i7 8700<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon RX 5700 ／ NVIDIA GeForce GTX 1070<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Outras observações:</strong> Estimated performance: 1080p/60fps ・Framerate might drop in graphics-intensive scenes. ・AMD Radeon RX 6700 XT or NVIDIA GeForce RTX 2070 required to support ray tracing.</li></ul>"
    },
  },
  {
    id: 8,
    nome: "Cyberpunk 2077", 
    descricao: "Cyberpunk 2077 é um RPG de ação e aventura em mundo aberto que se passa em Night City, uma megalópole perigosa onde todos são obcecados por poder, glamour e alterações corporais.", 
    distribuidor: "CD PROJEKT RED", 
    desenvolvedor: "CD PROJEKT RED", 
    lancamento: "9/dez./2020",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg",
    categorias: ["RPG"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Core i7-6700 or Ryzen 5 1600<br></li><li><strong>Memória:</strong> 12 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> GeForce GTX 1060 6GB or Radeon RX 580 8GB or Arc A380<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 70 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> SSD required. Attention: In this game you will encounter a variety of visual effects that may provide seizures or loss of consciousness in a minority of people. If you or someone you know experiences any of the above symptoms while playing, stop and seek medical attention immediately.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Core i7-12700 or Ryzen 7 7800X3D<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> GeForce RTX 2060 SUPER or Radeon RX 5700 XT or Arc A770<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 70 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> SSD required.</li></ul>"
    },
  },
  {
    id: 9,
    nome: "GTA V", 
    descricao: "Grand Theft Auto V para PC oferece aos jogadores a opção de explorar o gigantesco e premiado mundo de Los Santos e Blaine County em resoluções de até 4K e além, assim como a chance de experimentar o jogo rodando a 60 FPS (quadros por segundo).", 
    distribuidor: "Rockstar Games", 
    desenvolvedor: "Rockstar North", 
    lancamento: "13/abr./2015",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64 Bit<br></li><li><strong>Processador:</strong> Intel Core 2 Quad CPU Q6600 @ 2.40 GHz (4 CPUs) / AMD Phenom 9850 Quad-Core (4 CPUs) @ 2.5 GHz<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA 9800 GT 1 GB / AMD HD 4870 1 GB (DX 10, 10.1, 11)<br></li><li><strong>Armazenamento:</strong> 125 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> 100% compatível com DirectX 10<br></li><li><strong>Outras observações:</strong> Com o decorrer do tempo, conteúdos para download e modificações na programação poderão alterar os requisitos de sistema deste jogo. Entre em contato com o fabricante do seu equipamento e visite  para informações de compatibilidade atualizadas. Alguns componentes do sistema, como chipsets móveis, integrados e placas AGP podem ser incompatíveis. Especificações não listadas também podem não ser compatíveis.     Outros requisitos: A instalação e jogo online requerem uma conta na rede Social Club da Rockstar Games (para maiores de 13 anos); uma conexão com a internet é necessária para a ativação, jogo online e verificações de autenticidade periódicas; instalação de softwares necessários, incluindo a plataforma Social Club da Rockstar Games, DirectX , Chromium, Microsoft Visual C++ 2008 sp1 Redistributable Package, e o software de autenticação para o reconhecimento de certos atributos de hardware para verificação, gerenciamento de direitos digitais, sistema e assistência ao cliente.  É NECESSÁRIO O USO DE UM CÓDIGO DE REGISTRO DE USO ÚNICO VIA INTERNET; O REGISTRO É LIMITADO A UMA CONTA DO SOCIAL CLUB DA ROCKSTAR GAMES (MAIORES DE 13 ANOS) POR CÓDIGO DE SÉRIE; SOMENTE UMA CONTA DE PC PODE SER USADA POR CADA CONTA DO SOCIAL CLUB AO MESMO TEMPO; O(S) CÓDIGO(S) DE SÉRIE NÃO É(SÃO) TRANSFERÍVEL(IS) APÓS O USO; AS CONTAS DO SOCIAL CLUB NÃO SÃO TRANSFERÍVEIS.  Requisitos de Parceiros: Verifique os termos de serviço deste site antes da compra.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64 Bit<br></li><li><strong>Processador:</strong> Intel Core i5 3470 @ 3.2 GHZ (4 CPUs) / AMD X8 FX-8350 @ 4 GHZ (8 CPUs)<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 660 2 GB / AMD HD7870 2 GB<br></li><li><strong>Armazenamento:</strong> 125 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> 100% compatível com DirectX 10</li></ul>"
    },
  },
  {
    id: 10,
    nome: "The Witcher 3", 
    descricao: "Você é Geralt de Rívia, mercenário matador de monstros. Você está em um continente devastado pela guerra e infestado de monstros para você explorar à vontade. Sua tarefa é encontrar Ciri, a Criança da Profecia — uma arma viva que pode alterar a forma do mundo.", 
    distribuidor: "CD PROJEKT RED", 
    desenvolvedor: "CD PROJEKT RED", 
    lancamento: "18/mai./2015",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg",
    categorias: ["RPG"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> 64-bit Windows 7, 64-bit Windows 8 (8.1)<br></li><li><strong>Processador:</strong> Intel CPU Core i5-2500K 3.3GHz / AMD A10-5800K APU (3.8GHz)<br></li><li><strong>Memória:</strong> 6 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GPU GeForce GTX 660 / AMD GPU Radeon HD 7870<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> 64-bit Windows 10/11<br></li><li><strong>Processador:</strong> Intel Core i5-7400 / Ryzen 5 1600<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GTX 1070 / Radeon RX 480<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 11,
    nome: "Dead by Daylight", 
    descricao: "Presos para sempre em um mundo abominável onde nem a morte é uma escapatória, quatro Sobreviventes determinados enfrentam um Assassino sanguinário em um jogo perverso de coragem e astúcia. Escolha um lado e desbrave um mundo de medo e tensão com o melhor sistema assimétrico dos jogos de terror.", 
    distribuidor: "Behaviour Interactive Inc.", 
    desenvolvedor: "Behaviour Interactive Inc.", 
    lancamento: "14/jun./2016",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg",
    categorias: ["Ação"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit Operating System<br></li><li><strong>Processador:</strong> Intel Core i3-4170 or AMD FX-8120<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> DX11 Compatible GeForce GTX 460 1GB or AMD HD 6850 1GB<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DX11 compatible<br></li><li><strong>Outras observações:</strong> With these requirements, it is recommended that the game is played on Low quality settings.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit Operating System<br></li><li><strong>Processador:</strong> Intel Core i3-4170 or AMD FX-8300 or higher<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> DX11 Compatible GeForce 760 or AMD HD 8800 or higher with 4GB of RAM<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DX11 compatible</li></ul>"
    },
  },
  {
    id: 12,
    nome: "Garry's Mod", 
    descricao: "Garry's Mod is a physics sandbox. There aren't any predefined aims or goals. We give you the tools and leave you to play.", 
    distribuidor: "Valve", 
    desenvolvedor: "Facepunch Studios", 
    lancamento: "29/nov./2006",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/4000/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/4000/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/4000/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/4000/capsule_616x353.jpg",
    categorias: ["Casual","Indie","Simulação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> Windows® 10<br></li><li><strong>Processador:</strong> 2 GHz Processor or better<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> 1GB dedicated VRAM or better<br></li><li><strong>DirectX:</strong> Versão 9.0c<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 10 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX® 9 compatible<br></li><li><strong>Outras observações:</strong> Mouse, Keyboard, Monitor</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> Windows® 10/11<br></li><li><strong>Processador:</strong> 2.5 GHz Processor or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> 4GB dedicated VRAM or better<br></li><li><strong>DirectX:</strong> Versão 9.0c<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 25 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 13,
    nome: "Rust",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/capsule_616x353.jpg",
    categorias: ["Ação ", "Multiplayer"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "O único objetivo em Rust é sobreviver. Tudo te quer ver morto: a vida selvagem da ilha, outros habitantes, o ambiente e outros sobreviventes. Faz o que for preciso para aguentar outra noite.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um sistema operacional e processador de 64 bits<br></li><li><strong>Sistema Operacional:</strong> Windows 11 64bit<br></li><li><strong>Processador:</strong> AMD Ryzen 5 1400 or Intel Core i5-6600<br></li><li><strong>Memória:</strong> 12 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon RX 470, NVIDIA GeForce GTX 1060, Intel® Arc™ A580<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de Internet de banda larga<br></li><li><strong>Armazenamento:</strong> Requer 45 GB de espaço livre</li></ul>",
      recomendado: ""
    }
  },
  {
    id: 14,
    nome: "Baldur's Gate 3", 
    descricao: "Gather your party, and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.", 
    distribuidor: "Larian Studios", 
    desenvolvedor: "Larian Studios", 
    lancamento: "3/ago./2023",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/capsule_616x353.jpg",
    categorias: ["Aventura","RPG","Estratégia"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit<br></li><li><strong>Processador:</strong> Intel I5 4690 / AMD FX 8350 / Snapdragon X Elite<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GTX 970 / RX 480 / Intel Arc A380 / Qualcomm Adreno X1 (4GB+ of VRAM)<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 150 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> SSD required</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit<br></li><li><strong>Processador:</strong> Intel i7 8700K / AMD r5 3600<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia 2060 Super / RX 5700 XT / Intel Arc A580 (8GB+ of VRAM)<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 150 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> SSD required</li></ul>"
    },
  },
  {
    id: 15,
    nome: "Call of Duty MW3", 
    descricao: "A experiência Call of Duty® é compatível com Call of Duty®: Black Ops 7, Call of Duty®: Black Ops 6 e Call of Duty®: Warzone™.", 
    distribuidor: "Activision", 
    desenvolvedor: "Treyarch, Raven Software, Beenox, High Moon Studios, Sledgehammer Games, Infinity Ward, Activision Shanghai, Demonware", 
    lancamento: "27/out./2022",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows® 10 64 Bit (atualização mais recente)<br></li><li><strong>Processador:</strong> AMD Ryzen™ 5 1400 ou Intel® Core™ i5-6600<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon™ RX 470, NVIDIA® GeForce® GTX 970 / 1060 ou Intel® Arc™ A580<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Outras observações:</strong> SSD com 161 GB de espaço disponível no lançamento</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows® 11 64 Bit (atualização mais recente)<br></li><li><strong>Processador:</strong> AMD Ryzen™ 5 1600X ou Intel® Core™ i7-6700K<br></li><li><strong>Memória:</strong> 12 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon™ RX 6600XT ou NVIDIA® GeForce® RTX 3060 ou Intel® Arc™ B580<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Outras observações:</strong> SSD com 161 GB de espaço disponível no lançamento</li></ul>"
    },
  },
  {
    id: 16,
    nome: "Hogwarts Legacy", 
    descricao: "Hogwarts Legacy é um RPG de ação imersivo de mundo aberto. Agora você pode assumir o controle da ação e estar no centro de sua própria aventura no mundo bruxo.", 
    distribuidor: "Warner Bros. Games", 
    desenvolvedor: "Avalanche Software", 
    lancamento: "10/fev./2023",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/capsule_616x353.jpg",
    categorias: ["Ação","Aventura","RPG"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Intel Core i5-6600 (3.3Ghz) or AMD Ryzen 5 1400 (3.2Ghz)<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 960 4GB or AMD Radeon RX 470 4GB<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 85 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> SSD (Preferred), HDD (Supported), 720p/30 fps, Low Quality Settings</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Intel Core i7-8700 (3.2Ghz) or AMD Ryzen 5 3600 (3.6 Ghz)<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce 1080 Ti or AMD Radeon RX 5700 XT or INTEL Arc A770<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 85 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> SSD, 1080p/60 fps, High Quality Settings</li></ul>"
    },
  },
  {
    id: 17,
    nome: "Sekiro", 
    descricao: "Trilhe seu próprio caminho de vingança nesta premiada aventura da FromSoftware, os criadores de Bloodborne e da franquia Dark Souls. Obtenha vingança. Retome sua honra. Mate astuciosamente.", 
    desenvolvedor: "FromSoftware, Inc.", 
    lancamento: "21/mar./2019",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg",
    categorias: ["Ação","Casual","Indie","Multijogador Massivo","Esportes"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64bit only<br></li><li><strong>Processador:</strong> Intel Core i5 or AMD equivalent<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 660 or AMD Radeon HD 7950<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 2 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> Gamepad Recommended</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits</li></ul>"
    },
  },
  {
    id: 18,
    nome: "Sekiro Shadows Die Twice", 
    descricao: "Jogo do Ano - The Game Awards 2019 Melhor Jogo de Ação de 2019 - IGN Trilhe seu próprio caminho de vingança nesta premiada aventura da FromSoftware, os criadores de Bloodborne e da franquia Dark Souls. Obtenha vingança. Retome sua honra. Mate astuciosamente.", 
    distribuidor: "Activision (Excluding Japan and Asia), FromSoftware, Inc. (Japan), 方块游戏 (Asia)", 
    desenvolvedor: "FromSoftware, Inc.", 
    lancamento: "21/mar./2019",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7 64-bit | Windows 8 64-bit | Windows 10 64-bit<br></li><li><strong>Processador:</strong> Intel Core i3-2100 | AMD FX-6300<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 760 | AMD Radeon HD 7950<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 25 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 Compatible</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7 64-bit | Windows 8 64-bit | Windows 10 64-bit<br></li><li><strong>Processador:</strong> Intel Core i5-2500K | AMD Ryzen 5 1400<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 970 | AMD Radeon RX 570<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 25 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 Compatible</li></ul>"
    },
  },
  {
    id: 19,
    nome: "Devil May Cry 5", 
    descricao: "O melhor caçador de demônios está de volta com estilo, no jogo que os fãs de ação estavam esperando.", 
    distribuidor: "CAPCOM Co., Ltd.", 
    desenvolvedor: "CAPCOM Co., Ltd.", 
    lancamento: "7/mar./2019",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/601150/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/601150/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/601150/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/601150/capsule_616x353.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> WINDOWS® 10 (64-BIT Required)<br></li><li><strong>Processador:</strong> Intel® Core™ i5-4460, AMD FX™-6300, or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 760 or AMD Radeon™ R7 260x with 2GB Video RAM, or better<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 35 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> *Xinput support Controllers recommended *Internet connection required for game activation. (Network connectivity uses Steam® developed by Valve® Corporation.)</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> WINDOWS® 10 (64-BIT Required)<br></li><li><strong>Processador:</strong> Intel® Core™ i7-3770, AMD FX™-9590, or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 1060 with 6GB VRAM, AMD Radeon™ RX 480 with 8GB VRAM, or better<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 35 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> *Xinput support Controllers recommended *Internet connection required for game activation. (Network connectivity uses Steam® developed by Valve® Corporation.)</li></ul>"
    },
  },
  {
    id: 20,
    nome: "Portal 2", 
    descricao: "A &quot;Iniciativa de Testes Perpétuos&quot; foi expandida: crie câmaras cooperativas para você e os seus amigos!", 
    distribuidor: "Valve", 
    desenvolvedor: "Valve", 
    lancamento: "18/abr./2011",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer", "Co-op"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7/Vista/XP<br></li><li><strong>Processador:</strong> Pentium 4 com 3.0 GHz, Dual Core com 2.0 GHz (ou superior) ou AMD64X2 (ou superior)<br></li><li><strong>Memória:</strong> 2 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> A placa de vídeo precisa ter 128 MB ou mais de memória de vídeo e ser compatível com Pixel Shader 2.0b (ATI Radeon X800 ou superior / NVIDIA GeForce 7600 ou superior / Intel HD Graphics 2000 ou superior)<br></li><li><strong>DirectX:</strong> Versão 9.0c<br></li><li><strong>Armazenamento:</strong> 8 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> Compatibilidade com DirectX 9.0c</li></ul>",
      recomendado: ""
    },
  },
  {
    id: 21,
    nome: "Left 4 Dead 2",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/550/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/550/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/550/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/550/capsule_616x353.jpg",
    categorias: ["Ação ", "FPS"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "Set in the zombie apocalypse, Left 4 Dead 2 is a co-operative action horror FPS takes you and your friends through the cities, swamps and cemeteries of the Deep South, from Savannah to New Orleans across five expansive campaigns.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>Sistema Operacional *:</strong> Windows® 7 32/64-bit / Vista 32/64 / XP<br></li><li><strong>Processador:</strong> Pentium 4 3.0GHz<br></li><li><strong>Memória:</strong> 2 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Video card with 128 MB, Shader model 2.0. ATI X800, NVidia 6600 or better<br></li><li><strong>DirectX:</strong> Versão 9.0c<br></li><li><strong>Armazenamento:</strong> Requer 13 GB de espaço livre<br></li><li><strong>Placa de som:</strong> DirectX 9.0c compatible sound card</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>Sistema Operacional *:</strong> Windows® 7 32/64-bit / Vista 32/64 / XP<br></li><li><strong>Processador:</strong> Intel core 2 duo 2.4GHz<br></li><li><strong>Memória:</strong> 2 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Video Card Shader model 3.0. NVidia 7600, ATI X1600 or better<br></li><li><strong>DirectX:</strong> Versão 9.0c<br></li><li><strong>Armazenamento:</strong> Requer 13 GB de espaço livre<br></li><li><strong>Placa de som:</strong> DirectX 9.0c compatible sound card</li></ul>"
    }
  },
  {
    id: 22,
    nome: "Rainbow Six Siege", 
    descricao: "Rainbow Six® Siege é a referência em jogos de tiro táticos. Triunfa quem planejar e executar melhor a estratégia. Aproveite o Acesso Gratuito aos modos de jogo Partida Rápida, Sem Colocação e Dual Front, com uma seleção de agentes.", 
    distribuidor: "Ubisoft", 
    desenvolvedor: "Ubisoft Montreal", 
    lancamento: "1/dez./2015",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/359550/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/359550/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/359550/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/359550/capsule_616x353.jpg",
    categorias: ["Ação","Gratuitos para Jogar"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> Windows 10, Windows 11 (64-bit versions)<br></li><li><strong>Processador:</strong> AMD Ryzen 3 3100 / Intel i3-8100<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GTX 1650 4GB / AMD RX 5500XT 4GB / Intel ARC A380 6GB<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 65 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX® 9.0c compatible sound card with latest drivers<br></li><li><strong>Outras observações:</strong> For an up-to-date list of supported chipsets, please visit the FAQ for this game on our support website. Game contains BattleEye anti-cheat technology.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> Windows 11 (64-bit versions)<br></li><li><strong>Processador:</strong> AMD Ryzen5 3600 / Intel i5-10400<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA RTX 2060 6GB / AMD RX 6600 8GB<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 65 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX® 9.0c compatible sound card 5.1 with latest drivers<br></li><li><strong>Outras observações:</strong> For an up-to-date list of supported chipsets, please visit the FAQ for this game on our support website. Game contains BattleEye anti-cheat technology.</li></ul>"
    },
  },
  {
    id: 23,
    nome: "Apex Legends", 
    descricao: "Apex Legends é o premiado jogo de tiro em primeira pessoa de heróis e heroínas da Respawn Entertainment. Domine um elenco cada vez mais amplo de personagens lendários com habilidades poderosas, experimente partidas estratégicas e a jogabilidade inovadora na próxima evolução do gênero battle royale.", 
    distribuidor: "Electronic Arts", 
    desenvolvedor: "Respawn", 
    lancamento: "4/nov./2020",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
    categorias: ["Ação","Aventura","Gratuitos para Jogar"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> AMD FX 4350 or Equivalent, Intel Core i3 6300 or Equivalent<br></li><li><strong>Memória:</strong> 6 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon™ HD 7790 (2 GB), NVIDIA GeForce® GTX 950<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 75 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> ~3.8GB for 1 localized language</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Ryzen 5 CPU or Equivalent<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon™ R9 290, NVIDIA GeForce® GTX 970<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 75 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> ~3.8GB for 1 localized language</li></ul>"
    },
  },
  {
    id: 24,
    nome: "Marvel Spider-Man Remastered", 
    descricao: "Em Marvel's Spider-Man Remasterizado, os mundos de Peter Parker e Spider-Man entram em conflito em uma história original cheia de ação. Jogue como um Peter Parker experiente que combate as maiores ameaças do crime e vilões icônicos na Nova York da Marvel.", 
    distribuidor: "PlayStation Publishing LLC", 
    desenvolvedor: "Insomniac Games, Nixxes Software", 
    lancamento: "12/ago./2022",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/capsule_616x353.jpg",
    categorias: ["Ação","Aventura","Casual"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit<br></li><li><strong>Processador:</strong> Intel Core i3-4160, 3.6 GHz or AMD equivalent<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 950 or AMD Radeon RX 470<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 75 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit<br></li><li><strong>Processador:</strong> Intel Core i5-4670, 3.4 Ghz or AMD Ryzen5 1600, 3.2 Ghz<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 1060 6GB or AMD Radeon RX 580 8GB<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 75 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 25,
    nome: "Spider-Man Miles Morales", 
    descricao: "Após os eventos de Marvel's Spider-Man Remasterizado, o adolescente Miles Morales está se adaptando a um novo lar enquanto segue os passos do seu mentor, Peter Parker. Mas quando uma violenta disputa de forças ameaça destruir seu novo lar, Miles precisa reconhecer e assumir o título de Spider-Man.", 
    distribuidor: "PlayStation Publishing LLC", 
    desenvolvedor: "Insomniac Games, Nixxes Software", 
    lancamento: "18/nov./2022",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817190/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit 1909<br></li><li><strong>Processador:</strong> Intel Core i3-4160, 3.6 GHz or AMD equivalent<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 950 or AMD Radeon RX 470<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 75 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64-bit 1909<br></li><li><strong>Processador:</strong> Intel Core i5-4670, 3.4 Ghz or AMD Ryzen 5 1600, 3.2 Ghz<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 1060 6GB or AMD Radeon RX 580 8GB<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 75 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> 75 GB SSD space Recommended</li></ul>"
    },
  },
  {
    id: 26,
    nome: "Resident Evil 4 Remake", 
    descricao: "Sobrevivência é apenas o começo. Seis anos se passaram desde o desastre biológico em Raccoon City. Leon S. Kennedy, um dos sobreviventes, segue o rastro da raptada filha do presidente até uma vila europeia isolada, onde há algo terrivelmente errado com os habitantes.", 
    distribuidor: "CAPCOM Co., Ltd.", 
    desenvolvedor: "CAPCOM Co., Ltd.", 
    lancamento: "23/mar./2023",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 (64 bit)<br></li><li><strong>Processador:</strong> AMD Ryzen 3 1200 / Intel Core i5-7500<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon RX 560 with 4GB VRAM / NVIDIA GeForce GTX 1050 Ti with 4GB VRAM<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Outras observações:</strong> Estimated performance (when set to Prioritize Performance): 1080p/45fps. ・Framerate might drop in graphics-intensive scenes. ・AMD Radeon RX 6700 XT or NVIDIA GeForce RTX 2060 required to support ray tracing.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 (64 bit)/Windows 11 (64 bit)<br></li><li><strong>Processador:</strong> AMD Ryzen 5 3600 / Intel Core i7 8700<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Outras observações:</strong> Desempenho aproximado: 1080p/60fps. ・A taxa de quadros pode cair em cenas que exigem recursos visuais mais pesados. ・O suporte ao traçado de raios requer uma placa AMD Radeon RX 6700 XT ou NVIDIA GeForce RTX 2070.</li></ul>"
    },
  },
  {
    id: 27,
    nome: "Battlefield 2042", 
    descricao: "Essa é a experiência definitiva de Battlefield V. Entre no maior conflito da humanidade com o arsenal completo de armas, veículos e dispositivos, além do melhor conteúdo de personalização dos Anos 1 e 2.", 
    distribuidor: "Electronic Arts", 
    desenvolvedor: "DICE", 
    lancamento: "22/out./2020",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1238810/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1238810/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1238810/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1238810/capsule_616x353.jpg",
    categorias: ["Ação"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> AMD FX-8350/ Core i5 6600K<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce® GTX 1050 / NVIDIA GeForce® GTX 660 2GB or AMD Radeon™ RX 560 / HD 7850 2GB<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10 or later<br></li><li><strong>Processador:</strong> AMD Ryzen 3 1300X/Intel Core i7 4790<br></li><li><strong>Memória:</strong> 12 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce® GTX 1060 6GB/AMD Radeon™ RX 580 8GB<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 28,
    nome: "Battlefield V", 
    descricao: "Battlefield™ 2042 é um jogo de tiro em primeira pessoa que marca o retorno à emblemática guerra total da franquia.", 
    distribuidor: "Electronic Arts", 
    desenvolvedor: "DICE", 
    lancamento: "19/nov./2021",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1517290/header.jpg",
    categorias: ["Ação","Aventura","Casual"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> AMD Ryzen 5 1600, Core i5 6600K<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon RX 560,Nvidia GeForce GTX 1050 Ti<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 100 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> No recommendation</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> AMD Ryzen 7 2700X, Intel Core i7 4790<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon RX 6600 XT, Nvidia GeForce RTX 3060<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 100 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> No recommendation</li></ul>"
    },
  },
  {
    id: 29,
    nome: "PUBG", 
    descricao: "PUBG: BATTLEGROUNDS, o jogo de tiro de alto risco em que o vencedor leva tudo e que deu início ao fenômeno do Battle Royale, é gratuito! Entre em diversos mapas, saqueie armas e suprimentos exclusivos e sobreviva em uma zona cada vez menor, onde cada turno pode ser o último.", 
    distribuidor: "KRAFTON, Inc.", 
    desenvolvedor: "PUBG Corporation", 
    lancamento: "21/dez./2017",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
    categorias: ["Ação","Aventura","Multijogador Massivo","Gratuitos para Jogar"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Intel Core i5-4430 / AMD FX-6300<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 40 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Intel Core i5-6600K / AMD Ryzen 5 1600<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 30,
    nome: "Halo MCC", 
    descricao: "A lendária jornada do Master Chief está incluída em seis jogos, feitos para PC e reunidos em uma única experiência. Tanto para fãs de longa data como para os que conhecerão o Spartan 117 agora, a Master Chief Collection é a experiência de jogo definitiva da série Halo.", 
    distribuidor: "Xbox Game Studios", 
    desenvolvedor: "343 Industries, Splash Damage, Ruffian Games, Bungie, Saber Interactive", 
    lancamento: "3/dez./2019",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/976730/header.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO *:</strong> Windows 7<br></li><li><strong>Processador:</strong> AMD Phenom II X4 960T ; Intel i3550<br></li><li><strong>Placa de vídeo:</strong> AMD HD 6850 ; NVIDIA GeForce GTS 450<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 43 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> Direct3D feature Level 11.1</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits</li></ul>"
    },
  },
  {
    id: 31,
    nome: "Monster Hunter Rise", 
    descricao: "De uma das sagas mais icônicas dos jogos, Halo está maior do que nunca. Com uma campanha expansiva de mundo aberto e uma experiência de multijogador dinâmica e gratuita. ", 
    distribuidor: "Xbox Game Studios", 
    desenvolvedor: "343 Industries", 
    lancamento: "15/nov./2021",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg",
    categorias: ["Ação","Gratuitos para Jogar"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 RS5 x64<br></li><li><strong>Processador:</strong> AMD Ryzen 5 1600 or Intel i5-4440<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD RX 570 or Nvidia GTX 1050 Ti<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 19H2 x64<br></li><li><strong>Processador:</strong> AMD Ryzen 7 3700X or Intel i7-9700k<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Radeon RX 5700 XT or Nvidia RTX 2070<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Armazenamento:</strong> 50 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 32,
    nome: "Monster Hunter World", 
    descricao: "Encare o desafio e junte-se à caça! Em Monster Hunter Rise, o capítulo mais recente da premiada e bem-sucedida série Monster Hunter, você vai se tornar um caçador, explorar mapas novos e usar diversas armas para derrotar monstros assustadores como parte de uma nova história.", 
    distribuidor: "CAPCOM Co., Ltd.", 
    desenvolvedor: "CAPCOM Co., Ltd.", 
    lancamento: "12/jan./2022",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1446780/header.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 （64-bit）<br></li><li><strong>Processador:</strong> Intel® Core™ i3-4130 or Core™ i5-3470 or AMD FX™-6100<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GT 1030 (DDR4) or AMD Radeon™ RX 550<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 36 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> 1080p/30fps when graphics settings are set to &quot;Low&quot;.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 （64-bit）<br></li><li><strong>Processador:</strong> Intel® Core™ i5-4460 or AMD FX™-8300<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce® GTX 1060 (VRAM 3GB) or AMD Radeon™ RX 570 (VRAM 4GB)<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 36 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> 1080p/30fps when graphics settings are set to &quot;Average&quot;.</li></ul>"
    },
  },
  {
    id: 33,
    nome: "Dark Souls 3 Deluxe", 
    descricao: "DARK SOULS™ continua a ultrapassar seus próprios limites em um ambicioso novo capítulo da série que definiu um gênero e que é aclamada pela crítica. Prepare-se para abraçar a escuridão!", 
    distribuidor: "FromSoftware, Inc., Bandai Namco Entertainment", 
    desenvolvedor: "FromSoftware, Inc.", 
    lancamento: "11/abr./2016",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit<br></li><li><strong>Processador:</strong> Intel Core i3-2100 / AMD® FX-6300<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce GTX 750 Ti / ATI Radeon HD 7950<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 25 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 sound device<br></li><li><strong>Outras observações:</strong> Internet connection required for online play and product activation</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7 SP1 64bit, Windows 8.1 64bit Windows 10 64bit<br></li><li><strong>Processador:</strong> Intel Core i7-3770 / AMD® FX-8350<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA® GeForce GTX 970 / ATI Radeon R9 series<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 25 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> DirectX 11 sound device<br></li><li><strong>Outras observações:</strong> Internet connection required for online play and product activation</li></ul>"
    },
  },
  {
    id: 34,
    nome: "Batman Arkham Knight", 
    descricao: "Batman™: Arkham Knight é a conclusão épica da trilogia Arkham da Rocksteady Studios. Desenvolvido exclusivamente para plataformas de última geração, Batman™: Arkham Knight apresenta o design exclusivo da Rocksteady para o Batmóvel.", 
    distribuidor: "WB Games", 
    desenvolvedor: "Rocksteady Studios", 
    lancamento: "23/jun./2015",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/208650/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/208650/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/208650/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/208650/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO *:</strong> Win 7 SP1, Win 8.1 (64-bit Operating System Required)<br></li><li><strong>Processador:</strong> Intel Core i5-750, 2.67 GHz | AMD Phenom II X4 965, 3.4 GHz<br></li><li><strong>Memória:</strong> 6 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Graphics: NVIDIA GeForce GTX 660 (2 GB Memory Minimum)  | AMD Radeon HD 7870 (2 GB Memory Minimum)<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 45 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO *:</strong> Win 7 SP1, Win 8.1 (64-bit Operating System Required)<br></li><li><strong>Processador:</strong> Intel Core i7-3770, 3.4 GHz | AMD FX-8350, 4.0 GHz<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 760 - 3 GB Memory Recommended | AMD Radeon HD 7950 - 3 GB Memory Recommended<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 55 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 35,
    nome: "DOOM Eternal", 
    descricao: "Os exércitos do Inferno invadiram a Terra. Torne-se o Slayer em uma campanha épica para um jogador e derrote demônios entre dimensões para impedir a derradeira destruição da humanidade. A única coisa que eles temem... é você.", 
    distribuidor: "Bethesda Softworks", 
    desenvolvedor: "id Software", 
    lancamento: "19/mar./2020",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/capsule_616x353.jpg",
    categorias: ["Ação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO *:</strong> 64-bit Windows 7 / 64-Bit Windows 10<br></li><li><strong>Processador:</strong> Intel Core i5 @ 3.3 GHz or better, or AMD Ryzen 3 @ 3.1 GHz or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 1050Ti (4GB), GTX 1060 (3GB), GTX 1650 (4GB) or AMD Radeon R9 280(3GB), AMD Radeon R9 290 (4GB), RX 470 (4GB)<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 80 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> ( 1080p / 60 FPS / Low Quality Settings )</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> 64-bit Windows 10<br></li><li><strong>Processador:</strong> Intel Core i7-6700K or better, or AMD Ryzen 7 1800X or better<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 1060 (6GB), NVIDIA GeForce 970 (4GB), AMD RX 480 (8GB)<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 80 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> ( 1080p / 60 FPS / High Quality Settings ) - *On NVIDIA GTX 970 cards Texture Quality should be set to Medium</li></ul>"
    },
  },
  {
    id: 36,
    nome: "DOOM",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/782331/header.jpg",
    categorias: ["FPS", "Ação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
  },
  {
    id: 37,
    nome: "Cities Skylines", 
    descricao: "Cities: Skylines é uma versão moderna dos simuladores de cidade clássicos. O jogo introduz novos elementos de jogabilidade para que você sinta a emoção e a dificuldade de criar e manter uma cidade de verdade, além de aprimorar os elementos clássicos da construção de cidades. ", 
    distribuidor: "Paradox Interactive", 
    desenvolvedor: "Colossal Order", 
    lancamento: "10/mar./2015",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/255710/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/255710/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/255710/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/255710/capsule_616x353.jpg",
    categorias: ["Simulação","Estratégia"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows® 10 Home 64 Bit<br></li><li><strong>Processador:</strong> Intel® Core™ I7 930  |  AMD® FX 6350<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia® GeForce™ GTS 450 (1 GB) |  AMD® R7 250 (2 GB)  |  Intel Iris Xe G7 (Tiger Lake)<br></li><li><strong>DirectX:</strong> Versão 9.0c<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 4 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows® 10 Home 64 bit<br></li><li><strong>Processador:</strong> Intel® Core™ I7 2700K  |   AMD® Ryzen 7 2700X<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia® GeForce™ GTX 580 (1.5 GB)  |   AMD® Radeon™ RX 560 (4 GB)<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 4 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 38,
    nome: "Stardew Valley", 
    descricao: "Você herdou a antiga fazenda do seu avô, em Stardew Valley. Com ferramentas de segunda-mão e algumas moedas, você parte para dar início a sua nova vida. Será que você vai aprender a viver da terra, a transformar esse matagal em um próspero lar?", 
    distribuidor: "ConcernedApe", 
    desenvolvedor: "ConcernedApe", 
    lancamento: "26/fev./2016",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/capsule_616x353.jpg",
    categorias: ["Indie","RPG","Simulação"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows Vista or greater<br></li><li><strong>Processador:</strong> 2 Ghz<br></li><li><strong>Memória:</strong> 2 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> 256 mb video memory, shader model 3.0+<br></li><li><strong>DirectX:</strong> Versão 10<br></li><li><strong>Armazenamento:</strong> 500 MB de espaço disponível</li></ul>",
      recomendado: ""
    },
  },
  {
    id: 39,
    nome: "Phasmophobia", 
    descricao: "Phasmophobia is a 4 player online co-op psychological horror. Paranormal activity is on the rise and it’s up to you and your team to use all the ghost-hunting equipment at your disposal in order to gather as much evidence as you can.", 
    distribuidor: "Kinetic Games", 
    desenvolvedor: "Kinetic Games", 
    lancamento: "18/set./2020",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/capsule_616x353.jpg",
    categorias: ["Ação","Indie","Acesso Antecipado"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64Bit<br></li><li><strong>Processador:</strong> Intel Core i5-4590 / AMD Ryzen 5 2600<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 970 / AMD Radeon R9 390<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 21 GB de espaço disponível<br></li><li><strong>Compatibilidade com RV:</strong> OpenXR<br></li><li><strong>Outras observações:</strong> Minimum Specs are for VR, lower specs may work for Non-VR.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64Bit<br></li><li><strong>Processador:</strong> Intel Core i5-10600 / AMD Ryzen 5 3600<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA RTX 2060 / AMD Radeon RX 5700<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 21 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 40,
    nome: "Among Us", 
    descricao: "Um jogo de trabalho em equipe e trairagem online ou em rede local para 4 a 15 jogadores... no espaço!", 
    distribuidor: "Innersloth", 
    desenvolvedor: "Innersloth", 
    lancamento: "16/nov./2018",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
    categorias: ["Casual"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> Windows 10 x32bit<br></li><li><strong>Processador:</strong> INTEL i3-4330<br></li><li><strong>Memória:</strong> 1 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> INTEL HD Graphics 4600</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO:</strong> Windows 10 x64bit<br></li><li><strong>Processador:</strong> INTEL i3-4330<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GTX 650</li></ul>"
    },
  },
  {
    id: 41,
    nome: "Lost Ark DLC", 
    descricao: "Embarque numa odisseia pela Arca Perdida num mundo vasto e vibrante: explore novas terras, procure tesouros perdidos e teste-se num combate de ação emocionante neste RPG grátis para jogar. ", 
    distribuidor: "Amazon Game Studios", 
    desenvolvedor: "Smilegate RPG", 
    lancamento: "11/fev./2022",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1599340/header.jpg",
    categorias: ["Ação","Aventura","Multijogador Massivo","RPG","Gratuitos para Jogar"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 (64-bit)<br></li><li><strong>Processador:</strong> Intel i3 ou AMD Ryzen 3<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 460 / AMD HD6850<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 110 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> Necessária conexão de internet para jogar, oferece compras no jogo. Os requisitos de sistema para este jogo podem mudar ao longo do tempo.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 (64-bit)<br></li><li><strong>Processador:</strong> Intel i5 ou AMD Ryzen 5<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 1050 / AMD Radeon RX560 2G<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 110 GB de espaço disponível<br></li><li><strong>Outras observações:</strong> Necessária conexão de internet para jogar, oferece compras no jogo. Os requisitos de sistema para este jogo podem mudar ao longo do tempo.</li></ul>"
    },
  },
  {
    id: 42,
    nome: "Sea of Thieves", 
    descricao: "Sea of Thieves é um jogo de aventura pirata de sucesso, que oferece a experiência de pilhar tesouros perdidos, fazer parte de batalhas intensas, derrotar monstros marinhos e muito mais. Mergulhe nesta edição revisada do jogo, que inclui acesso a conteúdo digital bônus.", 
    distribuidor: "Xbox Game Studios", 
    desenvolvedor: "Rare Ltd", 
    lancamento: "3/jun./2020",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 version 18362.0 or higher<br></li><li><strong>Processador:</strong> Intel i3 4170 @ 3.7 GHz or AMD FX-6300 @ 3.5 GHz<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GeForce GTX 660 or AMD Radeon R9 270<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 100 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows® 10 64-bit<br></li><li><strong>Processador:</strong> Intel i7 4790 @4Ghz - AMD Ryzen 5 1600 @3.6Ghz<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia Geforce GTX 1080ti - AMD Radeon Rx Vega 64 - Intel A750<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 100 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 43,
    nome: "GTA V Premium", 
    descricao: "Grand Theft Auto V para PC oferece aos jogadores a opção de explorar o gigantesco e premiado mundo de Los Santos e Blaine County em resoluções de até 4K e além, assim como a chance de experimentar o jogo rodando a 60 FPS (quadros por segundo).", 
    distribuidor: "Rockstar Games", 
    desenvolvedor: "Rockstar North", 
    lancamento: "13/abr./2015",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64 Bit<br></li><li><strong>Processador:</strong> Intel Core 2 Quad CPU Q6600 @ 2.40 GHz (4 CPUs) / AMD Phenom 9850 Quad-Core (4 CPUs) @ 2.5 GHz<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA 9800 GT 1 GB / AMD HD 4870 1 GB (DX 10, 10.1, 11)<br></li><li><strong>Armazenamento:</strong> 125 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> 100% compatível com DirectX 10<br></li><li><strong>Outras observações:</strong> Com o decorrer do tempo, conteúdos para download e modificações na programação poderão alterar os requisitos de sistema deste jogo. Entre em contato com o fabricante do seu equipamento e visite  para informações de compatibilidade atualizadas. Alguns componentes do sistema, como chipsets móveis, integrados e placas AGP podem ser incompatíveis. Especificações não listadas também podem não ser compatíveis.     Outros requisitos: A instalação e jogo online requerem uma conta na rede Social Club da Rockstar Games (para maiores de 13 anos); uma conexão com a internet é necessária para a ativação, jogo online e verificações de autenticidade periódicas; instalação de softwares necessários, incluindo a plataforma Social Club da Rockstar Games, DirectX , Chromium, Microsoft Visual C++ 2008 sp1 Redistributable Package, e o software de autenticação para o reconhecimento de certos atributos de hardware para verificação, gerenciamento de direitos digitais, sistema e assistência ao cliente.  É NECESSÁRIO O USO DE UM CÓDIGO DE REGISTRO DE USO ÚNICO VIA INTERNET; O REGISTRO É LIMITADO A UMA CONTA DO SOCIAL CLUB DA ROCKSTAR GAMES (MAIORES DE 13 ANOS) POR CÓDIGO DE SÉRIE; SOMENTE UMA CONTA DE PC PODE SER USADA POR CADA CONTA DO SOCIAL CLUB AO MESMO TEMPO; O(S) CÓDIGO(S) DE SÉRIE NÃO É(SÃO) TRANSFERÍVEL(IS) APÓS O USO; AS CONTAS DO SOCIAL CLUB NÃO SÃO TRANSFERÍVEIS.  Requisitos de Parceiros: Verifique os termos de serviço deste site antes da compra.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 64 Bit<br></li><li><strong>Processador:</strong> Intel Core i5 3470 @ 3.2 GHZ (4 CPUs) / AMD X8 FX-8350 @ 4 GHZ (8 CPUs)<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 660 2 GB / AMD HD7870 2 GB<br></li><li><strong>Armazenamento:</strong> 125 GB de espaço disponível<br></li><li><strong>Placa de som:</strong> 100% compatível com DirectX 10</li></ul>"
    },
  },
  {
    id: 44,
    nome: "Skyrim", 
    descricao: "EPIC FANTASY REBORN The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.", 
    distribuidor: "Bethesda Softworks", 
    desenvolvedor: "Bethesda Game Studios", 
    lancamento: "10/nov./2011",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/72850/header.jpg",
    categorias: ["RPG"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Minimum:</strong><br>\t\t\t\t\t\t\t\t<ul class=\"bb_ul\"><li><strong>OS *:</strong> Windows 7/Vista/XP PC (32 or 64 bit)<br>\t\t\t\t\t\t\t\t</li><li><strong>Processor:</strong> Dual Core 2.0GHz or equivalent processor<br>\t\t\t\t\t\t\t\t</li><li><strong>Memory:</strong> 2GB System RAM<br>\t\t\t\t\t\t\t\t</li><li><strong>Hard Disk Space:</strong> 6GB free HDD Space<br>\t\t\t\t\t\t\t\t</li><li><strong>Video Card:</strong> Direct X 9.0c compliant video card with 512 MB of RAM<br>\t\t\t\t\t\t\t\t</li><li><strong>Sound:</strong> DirectX compatible sound card<br>\t\t\t\t\t\t\t\t</li></ul>",
      recomendado: "<strong>Recommended:</strong><br>\t\t\t\t\t\t\t\t<ul class=\"bb_ul\"><li><strong>Processor:</strong> Quad-core Intel or AMD CPU<br>\t\t\t\t\t\t\t\t</li><li><strong>Memory:</strong> 4GB System RAM<br>\t\t\t\t\t\t\t\t</li><li><strong>Video Card:</strong> DirectX 9.0c compatible NVIDIA or AMD ATI video card with 1GB of RAM (Nvidia GeForce GTX 260 or higher; ATI Radeon 4890 or higher)<br>\t\t\t\t\t\t\t\t</li></ul>"
    },
  },
  {
    id: 45,
    nome: "Skyrim Special Edition", 
    descricao: "Vencedor de mais de 200 prêmios de Jogo do Ano, The Elder Scrolls V: Skyrim Special Edition dá vida à fantasia épica com um nível de detalhe espantoso. A Special Edition inclui o jogo aclamado pela crítica e suplementos com novas funcionalidades.", 
    distribuidor: "Bethesda Softworks", 
    desenvolvedor: "Bethesda Game Studios", 
    lancamento: "27/out./2016",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/489830/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/489830/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/489830/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/489830/capsule_616x353.jpg",
    categorias: ["RPG"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7/8.1/10 (64-bit Version)<br></li><li><strong>Processador:</strong> Intel i5-750/AMD Phenom II X4-945<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 470 1GB /AMD HD 7870 2GB<br></li><li><strong>Armazenamento:</strong> 12 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li><strong>SO *:</strong> Windows 7/8.1/10 (64-bit Version)<br></li><li><strong>Processador:</strong> Intel i5-2400/AMD FX-8320<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GTX 780 3GB /AMD R9 290 4GB<br></li><li><strong>Armazenamento:</strong> 12 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 46,
    nome: "Star Wars Jedi Fallen Order", 
    descricao: "Prepare-se para cruzar a galáxia em STAR WARS Jedi: Fallen Order, uma aventura em terceira pessoa cheia de ação da Respawn Entertainment. Um padawan perdido precisa completar seu treinamento, desenvolver novas habilidades com a Força e dominar a arte do sabre de luz — tudo isso enquanto despista o Império.", 
    distribuidor: "Electronic Arts", 
    desenvolvedor: "Respawn Entertainment", 
    lancamento: "14/nov./2019",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172380/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172380/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172380/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172380/capsule_616x353.jpg",
    categorias: ["Ação","Aventura"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO *:</strong> 64-bit Windows 7/8.1/10<br></li><li><strong>Processador:</strong> AMD FX-6100/Intel i3-3220 or Equivalent<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD Radeon HD 7750, NVIDIA GeForce GTX 650 or Equivalent<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 55 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO *:</strong> 64-bit Windows 7/8.1/10<br></li><li><strong>Processador:</strong> AMD Ryzen 7 1700/Intel  i7-6700K or Equivalent<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> AMD RX Vega 56, Nvidia GTX 1070/GTX1660Ti or Equivalent<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Armazenamento:</strong> 55 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 47,
    nome: "Star Wars Jedi Survivor",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172381/header.jpg",
    categorias: ["Ação", "Aventura"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
  },
  {
    id: 48,
    nome: "EA Sports FC 24", 
    descricao: "O FIFA 23 leva o Jogo de Todo Mundo aos gramados com a tecnologia HyperMotion2, FIFA World Cup™ masculina e feminina, clubes femininos, recursos de crossplay** e muito mais.", 
    distribuidor: "Electronic Arts", 
    desenvolvedor: "EA Canada, EA Romania", 
    lancamento: "30/set./2022",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/library_600x900.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/capsule_616x353.jpg",
    categorias: ["Simulação","Esportes"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 - 64-Bit (Latest Update)<br></li><li><strong>Processador:</strong> Intel Core i5 6600k or AMD Ryzen 5 1600<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 570<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 100 GB de espaço disponível</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um processador e sistema operacional de 64 bits<br></li><li><strong>SO:</strong> Windows 10 - 64-Bit (Latest Update)<br></li><li><strong>Processador:</strong> Intel Core i7 6700 or AMD Ryzen 7 2700X<br></li><li><strong>Memória:</strong> 12 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 1660 or AMD Radeon RX 5600 XT<br></li><li><strong>DirectX:</strong> Versão 12<br></li><li><strong>Rede:</strong> Conexão de internet banda larga<br></li><li><strong>Armazenamento:</strong> 100 GB de espaço disponível</li></ul>"
    },
  },
  {
    id: 49,
    nome: "Balatro",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/2379780/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2379780/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2379780/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2379780/capsule_616x353.jpg",
    categorias: ["Casual ", "Estratégia"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "O roguelike de póquer. Balatro é um jogo de construção de baralhos de cartas hipnoticamente satisfatório onde vais jogar mãos de póquer ilegais, descobrir jóqueres que vão mudar o rumo do jogo e fazer combinações empolgantes.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um sistema operacional e processador de 64 bits<br></li><li><strong>Sistema Operacional *:</strong> Windows 7, 8, 10, 11 x64<br></li><li><strong>Processador:</strong> Intel Core i3<br></li><li><strong>Memória:</strong> 1 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> OpenGL 2.1 compatible graphics card, integrated graphics<br></li><li><strong>Armazenamento:</strong> Requer 150 MB de espaço livre</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um sistema operacional e processador de 64 bits</li></ul>"
    }
  },
  {
    id: 50,
    nome: "Rocket League®",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/capsule_616x353.jpg",
    categorias: ["Ação ", "Desporto"],
    modos: ["Multiplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "Futebol e condução encontram-se uma vez mais na aguardada sequência do clássico de arena baseado na física que conquistou os jogadores, o Supersonic Acrobatic Rocket-Powered Battle-Cars!",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um sistema operacional e processador de 64 bits<br></li><li><strong>Sistema Operacional *:</strong> Windows 7 (64 bit) or Newer (64 bit) Windows OS<br></li><li><strong>Processador:</strong> 2.5 GHz Dual core<br></li><li><strong>Memória:</strong> 4 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce 760, AMD Radeon R7 270X, or better<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de Internet de banda larga<br></li><li><strong>Armazenamento:</strong> Requer 20 GB de espaço livre</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um sistema operacional e processador de 64 bits<br></li><li><strong>Sistema Operacional *:</strong> Windows 7 (64 bit) or Newer (64 bit) Windows OS<br></li><li><strong>Processador:</strong> 3.0+ GHz Quad core<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> NVIDIA GeForce GTX 1060, AMD Radeon RX 470, or better<br></li><li><strong>DirectX:</strong> Versão 11<br></li><li><strong>Rede:</strong> Conexão de Internet de banda larga<br></li><li><strong>Armazenamento:</strong> Requer 20 GB de espaço livre<br></li><li><strong>Notas adicionais:</strong> Gamepad or Controller Recommended</li></ul>"
    }
  },
  {
    id: 51,
    nome: "Satisfactory",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/526870/capsule_616x353.jpg",
    categorias: ["Aventura ", "Estratégia"],
    modos: ["Singleplayer", "Co-op"],
    idiomas: ["Português", "Inglês"],
    descricao: "Satisfactory is a first-person open-world factory building game with a dash of exploration and combat. Play alone or with friends, explore an alien planet, create multi-story factories, and enter conveyor belt heaven!",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul class=\"bb_ul\"><li>Requer um sistema operacional e processador de 64 bits<br></li><li><strong>Sistema Operacional:</strong> Windows 10 or later (64-Bit)<br></li><li><strong>Processador:</strong> i5-3570 3.4 GHz 4 Core<br></li><li><strong>Memória:</strong> 8 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia GTX 1650/GTX 1050-ti, or AMD RX 470/RX 570, or equivalent performance &amp; VRAM<br></li><li><strong>Armazenamento:</strong> Requer 20 GB de espaço livre<br></li><li><strong>Notas adicionais:</strong> Internet connection required for multiplayer.</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul class=\"bb_ul\"><li>Requer um sistema operacional e processador de 64 bits<br></li><li><strong>Sistema Operacional:</strong> Windows 11 or later (64-Bit)<br></li><li><strong>Processador:</strong> Ryzen 5 5600X﻿ or ﻿i5-12400 ﻿or equivalent performance, 6 physical cores minimum<br></li><li><strong>Memória:</strong> 16 GB de RAM<br></li><li><strong>Placa de vídeo:</strong> Nvidia RTX 2070﻿ or RX 5700, or equivalent performance &amp; VRAM<br></li><li><strong>Armazenamento:</strong> Requer 20 GB de espaço livre<br></li><li><strong>Notas adicionais:</strong> Internet connection required for multiplayer.</li></ul>"
    }
  },
  {
    id: 52,
    nome: "Resident Evil 4 Remake",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/capsule_616x353.jpg",
    categorias: ["Ação", "Terror"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "Sobreviver é apenas o começo. Seis anos se passaram desde o desastre biológico em Raccoon City. Leon S. Kennedy, um dos sobreviventes, rastreou a filha raptada do presidente até uma vila europeia isolada, onde algo está terrivelmente errado com os habitantes locais.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 10 (64 bit)</li><li>Processador: AMD Ryzen 3 1200 / Intel Core i5-7500</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: AMD Radeon RX 560 / NVIDIA GeForce GTX 1050 Ti</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 10/11 (64 bit)</li><li>Processador: AMD Ryzen 5 3600 / Intel Core i7 8700</li><li>Memória: 16 GB de RAM</li><li>Placa de vídeo: AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070</li></ul>"
    }
  },
  {
    id: 53,
    nome: "Resident Evil 7 Biohazard",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/418370/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/418370/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/418370/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/418370/capsule_616x353.jpg",
    categorias: ["Ação", "Terror"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "O perigo e o isolamento emanam das paredes apodrecidas de uma fazenda abandonada no sul dos EUA. Resident Evil 7 marca um novo início para o terror de sobrevivência, com uma mudança total de modelo para a assustadora perspectiva em primeira pessoa.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7, 8, 8.1, 10 (64-BIT)</li><li>Processador: Intel Core i5-4460 / AMD FX-6300</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 760 / AMD Radeon R7 260x</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7, 8, 8.1, 10 (64-BIT)</li><li>Processador: Intel Core i7 3770 / AMD FX-9590</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 1060</li></ul>"
    }
  },
  {
    id: 54,
    nome: "Dark Souls II: Scholar of the First Sin",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/335300/capsule_616x353.jpg",
    categorias: ["Ação", "RPG"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "Prepare-se para morrer... de novo. Dark Souls II oferece a renomada obscuridade e jogabilidade viciante da franquia a um novo nível, com novos inimigos e desafios.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7 SP1 64bit, Windows 8.1 64bit</li><li>Processador: AMD A8 3870 / Intel Core i3 2100</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 465 / ATI Radeon HD 6870</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7 SP1 64bit, Windows 8.1 64bit</li><li>Processador: AMD FX 8150 / Intel Core i7 2600</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 750 / ATI Radeon HD 7850</li></ul>"
    }
  },
  {
    id: 55,
    nome: "Lies of P",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1627720/capsule_616x353.jpg",
    categorias: ["Ação", "RPG", "Souls-like"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "Lies of P é um soulslike emocionante que pega a história de Pinóquio, vira-a de cabeça para baixo e coloca-a no cenário sombrio e elegante da era Belle Époque.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 10 (64-bit)</li><li>Processador: AMD Ryzen 3 1200 / Intel Core i3-6300</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: AMD Radeon RX 560 / NVIDIA GeForce GTX 960</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 10 (64-bit)</li><li>Processador: AMD Ryzen 3 1200 / Intel Core i3-6300</li><li>Memória: 16 GB de RAM</li><li>Placa de vídeo: AMD Radeon RX 6500 XT / NVIDIA GeForce GTX 1660</li></ul>"
    }
  },
  {
    id: 56,
    nome: "Far Cry 3",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/220240/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/220240/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/220240/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/220240/capsule_616x353.jpg",
    categorias: ["Ação", "Mundo Aberto"],
    modos: ["Singleplayer", "Multiplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "Descubra os segredos de uma ilha tropical onde a loucura reina. Far Cry 3 é um jogo de tiro em primeira pessoa de mundo aberto que não se parece com nenhum outro.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7 SP1 / Windows 8</li><li>Processador: Intel Core 2 Duo E6700 / AMD Athlon 64 X2 6000+</li><li>Memória: 2 GB de RAM</li><li>Placa de vídeo: Nvidia 8800 GTX / AMD Radeon HD 2900</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7 SP1 / Windows 8</li><li>Processador: Intel Core i3-530 / AMD Phenom II X2 565</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: Nvidia GTX 480 / AMD Radeon HD 5770</li></ul>"
    }
  },
  {
    id: 57,
    nome: "Far Cry 4",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/298110/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/298110/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/298110/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/298110/capsule_616x353.jpg",
    categorias: ["Ação", "Mundo Aberto"],
    modos: ["Singleplayer", "Co-op"],
    idiomas: ["Português", "Inglês"],
    descricao: "Escondido no Himalaia encontra-se Kyrat, um país mergulhado em tradição e violência. Você é Ajay Ghale, viajando para Kyrat para cumprir o último desejo de sua mãe.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7 SP1, Windows 8/8.1 (64bit)</li><li>Processador: Intel Core i5-750 / AMD Phenom II X4 955</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 460 / AMD Radeon HD5850</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7 SP1, Windows 8/8.1 (64bit)</li><li>Processador: Intel Core i5-2400S / AMD FX-8350</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 680 / AMD Radeon R9 290X</li></ul>"
    }
  },
  {
    id: 58,
    nome: "Far Cry 5",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/552520/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/552520/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/552520/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/552520/capsule_616x353.jpg",
    categorias: ["Ação", "Mundo Aberto"],
    modos: ["Singleplayer", "Co-op"],
    idiomas: ["Português", "Inglês"],
    descricao: "Bem-vindo a Hope County, Montana, terra dos livres e dos bravos, mas também o lar de um culto fanático do juízo final conhecido como Eden's Gate.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7 SP1, Windows 8.1, Windows 10 (64-bit versions only)</li><li>Processador: Intel Core i5-2400 / AMD FX-6300</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 670 / AMD R9 270</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7 SP1, Windows 8.1, Windows 10 (64-bit versions only)</li><li>Processador: Intel Core i7-4770 / AMD Ryzen 5 1600</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 970 / AMD R9 290X</li></ul>"
    }
  },
  {
    id: 59,
    nome: "Far Cry 6",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/capsule_616x353.jpg",
    categorias: ["Ação", "Mundo Aberto"],
    modos: ["Singleplayer", "Co-op"],
    idiomas: ["Português", "Inglês"],
    descricao: "Jogue como Dani Rojas, um habitante local de Yara, enquanto luta em uma revolução de guerrilha moderna para libertar Yara!",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 10 (64-bit)</li><li>Processador: AMD Ryzen 3 1200 / Intel Core i5-4460</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: AMD Radeon RX 460 / NVIDIA GeForce GTX 960</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 10 (64-bit)</li><li>Processador: AMD Ryzen 5 3600 / Intel Core i7-7700</li><li>Memória: 16 GB de RAM</li><li>Placa de vídeo: AMD Radeon RX 5700 / NVIDIA GeForce GTX 1080</li></ul>"
    }
  },
  {
    id: 60,
    nome: "Grand Theft Auto IV: The Complete Edition",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/12210/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/12210/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/12210/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/12210/capsule_616x353.jpg",
    categorias: ["Ação", "Mundo Aberto"],
    modos: ["Singleplayer"],
    idiomas: ["Inglês"],
    descricao: "Niko Bellic, Johnny Klebitz e Luis Lopez têm uma coisa em comum: vivem na pior cidade da América. Liberty City adora dinheiro e status, e é o paraíso para quem os tem e um pesadelo vivo para quem não os tem.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7 (plus Service Pack 1)</li><li>Processador: Intel Core 2 Quad CPU Q6600 / AMD Phenom X3 8750</li><li>Memória: 2 GB de RAM</li><li>Placa de vídeo: NVIDIA 8600 / ATI 3870</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7 (plus Service Pack 1)</li><li>Processador: Intel Core 2 Quad CPU Q6600 / AMD Phenom X3 8750</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA 8600 / ATI 3870</li></ul>"
    }
  },
  {
    id: 61,
    nome: "Resident Evil HD REMASTER",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/304240/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/304240/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/304240/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/304240/capsule_616x353.jpg",
    categorias: ["Ação", "Terror"],
    modos: ["Singleplayer"],
    idiomas: ["Inglês"],
    descricao: "O jogo que definiu o gênero de terror de sobrevivência está de volta! Confira a versão HD remasterizada do Resident Evil.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7 SP1 / Windows 8.1</li><li>Processador: Intel Core 2 Duo 2.4 GHz / AMD Athlon X2 2.8 GHz</li><li>Memória: 2 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 260 / ATI Radeon HD 6790</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7 SP1 / Windows 8.1</li><li>Processador: Intel Core 2 Quad 2.7 GHz / AMD Phenom II X4 3.0 GHz</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 560 / ATI Radeon HD 6950</li></ul>"
    }
  },
  {
    id: 62,
    nome: "Resident Evil 5",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/21690/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/21690/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/21690/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/21690/capsule_616x353.jpg",
    categorias: ["Ação", "Terror"],
    modos: ["Singleplayer", "Co-op"],
    idiomas: ["Inglês"],
    descricao: "A corporação Umbrella e seus estoques de vírus letais foram destruídos e contidos. Mas uma nova e mais perigosa ameaça surgiu.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7</li><li>Processador: Intel Core 2 Quad 2.4 GHz / AMD Phenom II X4 3.0 GHz</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce 9800 / ATI Radeon HD 4850</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7</li><li>Processador: Intel Core 2 Quad 2.4 GHz / AMD Phenom II X4 3.0 GHz</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 260 / ATI Radeon HD 4850</li></ul>"
    }
  },
  {
    id: 63,
    nome: "Resident Evil 6",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/221040/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/221040/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/221040/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/221040/capsule_616x353.jpg",
    categorias: ["Ação", "Terror"],
    modos: ["Singleplayer", "Co-op"],
    idiomas: ["Português", "Inglês"],
    descricao: "Combinando ação e terror de sobrevivência, Resident Evil 6 promete ser a experiência dramática de terror de 2013.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows Vista/XP, Windows 7, Windows 8</li><li>Processador: Intel Core 2 Duo 2.4 Ghz / AMD Athlon X2 2.8 Ghz</li><li>Memória: 2 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce 8800GTS</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows Vista/XP, Windows 7, Windows 8</li><li>Processador: Intel Core 2 Quad 2.7 Ghz / AMD Phenom II X4 3 Ghz</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 560</li></ul>"
    }
  },
  {
    id: 64,
    nome: "Far Cry Primal",
    preco: 0,
    imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/371660/header.jpg",
    heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/371660/library_hero.jpg",
    verticalImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/371660/library_600x900.jpg",
    capsuleImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/371660/capsule_616x353.jpg",
    categorias: ["Ação", "Mundo Aberto"],
    modos: ["Singleplayer"],
    idiomas: ["Português", "Inglês"],
    descricao: "A premiada franquia Far Cry que invadiu os trópicos e os Himalaias agora entra na luta original pela sobrevivência da humanidade.",
    requisitos: {
      minimo: "<strong>Mínimos:</strong><br><ul><li>SO: Windows 7, Windows 8.1, Windows 10 (64-bit versions only)</li><li>Processador: Intel Core i3-550 / AMD Phenom II X4 955</li><li>Memória: 4 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 460 / AMD Radeon HD 5770</li></ul>",
      recomendado: "<strong>Recomendados:</strong><br><ul><li>SO: Windows 7, Windows 8.1, Windows 10 (64-bit versions only)</li><li>Processador: Intel Core i7-2600K / AMD FX-8350</li><li>Memória: 8 GB de RAM</li><li>Placa de vídeo: NVIDIA GeForce GTX 780 / AMD Radeon R9 280X</li></ul>"
    }
  },
];

export const allCategories = Array.from(new Set(games.flatMap((g) => g.categorias))).sort();
