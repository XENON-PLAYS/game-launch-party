const fs = require('fs');
const https = require('https');

const gamesFile = 'src/data/games.ts';
const content = fs.readFileSync(gamesFile, 'utf8');

// Simple regex to extract game objects
// This is fragile but might work for a quick task
const gameRegex = /\{[\s\S]*?id: (\d+)[\s\S]*?nome: "(.*?)"[\s\S]*?imagem: "(.*?)"[\s\S]*?\}/g;

const fetchSteamData = (appId) => {
  return new Promise((resolve, reject) => {
    https.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&l=brazilian`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json[appId] && json[appId].success) {
            resolve(json[appId].data);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', (e) => reject(e));
  });
};

const extractAppId = (url) => {
  const match = url.match(/\/apps\/(\d+)\//);
  return match ? match[1] : null;
};

async function run() {
  const games = [];
  let match;
  while ((match = gameRegex.exec(content)) !== null) {
    const id = parseInt(match[1]);
    const nome = match[2];
    const imagem = match[3];
    const appId = extractAppId(imagem);
    games.push({ id, nome, imagem, appId, startIndex: match.index, length: match[0].length });
  }

  console.log(`Found ${games.length} games.`);

  // To avoid hitting rate limits or taking too long, let's process them in small batches or just a few for now
  // But the user said "all games", so I'll try to do them all, maybe with a small delay
  
  let newContent = content;
  // Sort in reverse order of appearance to not break indices when replacing (if I were replacing)
  // But I'll actually just rebuild the game objects and replace them in the file.
  
  for (const game of games) {
    if (!game.appId) continue;
    
    console.log(`Fetching data for ${game.nome} (AppID: ${game.appId})...`);
    const data = await fetchSteamData(game.appId);
    
    if (data) {
      const updatedGame = {
        lancamento: data.release_date ? data.release_date.date : '',
        desenvolvedor: data.developers ? data.developers.join(', ') : '',
        distribuidor: data.publishers ? data.publishers.join(', ') : '',
        descricao: data.short_description || data.detailed_description,
        categorias: data.genres ? data.genres.map(g => g.description) : [],
        requisitos: {
          minimo: data.pc_requirements ? data.pc_requirements.minimum : '',
          recomendado: data.pc_requirements ? data.pc_requirements.recommended : ''
        }
      };
      
      // Now I need to inject this into the file.
      // Instead of regex replacing which is hard for nested objects, 
      // I'll just collect the results and print them as a JSON for the user as requested.
      game.details = updatedGame;
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync('game_data.json', JSON.stringify(games.map(g => ({
    nome: g.nome,
    desenvolvedor: g.details?.desenvolvedor,
    publicadora: g.details?.distribuidor,
    data_lancamento: g.details?.lancamento,
    requisitos_minimos: g.details?.requisitos?.minimo,
    requisitos_recomendados: g.details?.requisitos?.recomendado,
    descricao: g.details?.descricao,
    genero: g.details?.categorias,
    imagens: {
      principal: g.imagem,
      background: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appId}/library_hero.jpg`,
      capsule: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appId}/capsule_616x353.jpg`
    }
  })), null, 2));
  
  console.log('Done! Data saved to game_data.json');
}

run();
