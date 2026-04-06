const fs = require('fs');

const gamesFile = 'src/data/games.ts';
const gameData = JSON.parse(fs.readFileSync('game_data.json', 'utf8'));

// Initial games from the very first version of the file (before my mess)
// I'll try to find an older version or just extract the IDs and keep the rest.
// Since I can't easily undo, I'll try to clean up the current mess by removing duplicates.

let content = fs.readFileSync(gamesFile, 'utf8');

// The mess looks like: categorias: ["Ação","Aventura"], "Aventura"], "Aventura", "Mundo Aberto"],
// and descricao: "...", "...", "...",

// Fix categorias
content = content.replace(/categorias: \[.*?\],.*?\],/g, (match) => {
  const parts = match.match(/\[(.*?)\]/g);
  if (parts) {
    // Take the first one which is usually my new one or a merged one
    return `categorias: ${parts[0]},`;
  }
  return match;
});

// Fix descricao
content = content.replace(/descricao: "(.*?)",.*?",/g, (match) => {
  const parts = match.match(/"(.*?)"/g);
  if (parts) {
    return `descricao: ${parts[0]},`;
  }
  return match;
});

// Fix lancamento, desenvolvedor, distribuidor
['lancamento', 'desenvolvedor', 'distribuidor'].forEach(field => {
  const regex = new RegExp(`${field}: "(.*?)",.*?",`, 'g');
  content = content.replace(regex, (match) => {
    const parts = match.match(/"(.*?)"/g);
    if (parts) return `${field}: ${parts[0]},`;
    return match;
  });
});

fs.writeFileSync(gamesFile, content);
console.log('Fixed duplicates in src/data/games.ts');
