const fs = require('fs');

const gamesFile = 'src/data/games.ts';
const gameData = JSON.parse(fs.readFileSync('game_data.json', 'utf8'));
let content = fs.readFileSync(gamesFile, 'utf8');

// Function to escape strings for TS
const esc = (str) => {
  if (!str) return '""';
  return JSON.stringify(str);
};

// This is a bit complex because I need to update existing objects in a TS file.
// A simpler way is to just rebuild the whole array if I can.
// But the original file might have fields I didn't extract (like trailer, etc.)
// Let's try to do a surgical replacement for each game.

gameData.forEach(game => {
  // Find the game block in the TS file by name
  const escapedName = game.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\{[^{}]*nome: "${escapedName}"[^{}]*\\})`, 's');
  
  const match = content.match(regex);
  if (match) {
    let gameBlock = match[1];
    
    // Update or add fields
    const updates = {
      lancamento: game.data_lancamento,
      desenvolvedor: game.desenvolvedor,
      distribuidor: game.publicadora,
      descricao: game.descricao,
      categorias: game.genero
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) return;
      
      const fieldRegex = new RegExp(`${key}:.*?,`, 's');
      const newVal = Array.isArray(value) ? `[${value.map(v => esc(v)).join(', ')}]` : esc(value);
      
      if (gameBlock.includes(`${key}:`)) {
        gameBlock = gameBlock.replace(new RegExp(`${key}:.*?,`), `${key}: ${newVal},`);
      } else {
        // Add after nome
        gameBlock = gameBlock.replace(/nome: ".*?",/, `$& \n    ${key}: ${newVal},`);
      }
    });

    // Update requisitos
    if (game.requisitos_minimos || game.requisitos_recomendados) {
      const reqs = `requisitos: {
      minimo: ${esc(game.requisitos_minimos || '')},
      recomendado: ${esc(game.requisitos_recomendados || '')}
    },`;
      
      if (gameBlock.includes('requisitos:')) {
        gameBlock = gameBlock.replace(/requisitos: \{[\s\S]*?\},/, reqs);
      } else {
        gameBlock = gameBlock.replace(/\},$/, `    ${reqs}\n  }`);
      }
    }

    content = content.replace(match[1], gameBlock);
  }
});

fs.writeFileSync(gamesFile, content);
console.log('Updated src/data/games.ts');
