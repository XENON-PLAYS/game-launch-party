const fs = require('fs');

const gamesFile = 'src/data/games.ts';
const gameData = JSON.parse(fs.readFileSync('game_data.json', 'utf8'));

// I'll read the original games to keep their non-scraped fields
const content = fs.readFileSync(gamesFile, 'utf8');

// This is a bit tricky. I'll extract the current games as a list of objects if possible.
// Or I'll just do the surgical replacement again but better.

let updatedContent = content;

gameData.forEach(game => {
  const escapedName = game.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\{[^{}]*nome: "${escapedName}"[^{}]*\\})`, 's');
  
  const match = updatedContent.match(regex);
  if (match) {
    let block = match[1];
    
    // Update simple fields
    if (game.desenvolvedor) {
      if (block.includes('desenvolvedor:')) block = block.replace(/desenvolvedor:.*?,/, `desenvolvedor: ${JSON.stringify(game.desenvolvedor)},`);
      else block = block.replace(/nome:.*?,/, `$& \n    desenvolvedor: ${JSON.stringify(game.desenvolvedor)},`);
    }
    if (game.publicadora) {
      if (block.includes('distribuidor:')) block = block.replace(/distribuidor:.*?,/, `distribuidor: ${JSON.stringify(game.publicadora)},`);
      else block = block.replace(/nome:.*?,/, `$& \n    distribuidor: ${JSON.stringify(game.publicadora)},`);
    }
    if (game.data_lancamento) {
      if (block.includes('lancamento:')) block = block.replace(/lancamento:.*?,/, `lancamento: ${JSON.stringify(game.data_lancamento)},`);
      else block = block.replace(/nome:.*?,/, `$& \n    lancamento: ${JSON.stringify(game.data_lancamento)},`);
    }
    if (game.descricao) {
      if (block.includes('descricao:')) block = block.replace(/descricao:.*?,/, `descricao: ${JSON.stringify(game.descricao)},`);
      else block = block.replace(/nome:.*?,/, `$& \n    descricao: ${JSON.stringify(game.descricao)},`);
    }
    if (game.genero) {
      if (block.includes('categorias:')) block = block.replace(/categorias:.*?,/, `categorias: ${JSON.stringify(game.genero)},`);
      else block = block.replace(/nome:.*?,/, `$& \n    categorias: ${JSON.stringify(game.genero)},`);
    }
    
    // Requirements
    if (game.requisitos_minimos || game.requisitos_recomendados) {
      const reqs = `requisitos: {
      minimo: ${JSON.stringify(game.requisitos_minimos || '')},
      recomendado: ${JSON.stringify(game.requisitos_recomendados || '')}
    },`;
      if (block.includes('requisitos:')) {
        block = block.replace(/requisitos: \{[\s\S]*?\},/, reqs);
      } else {
        block = block.replace(/\n\s*\}/, `,\n    ${reqs}\n  }`);
      }
    }

    updatedContent = updatedContent.replace(match[1], block);
  }
});

fs.writeFileSync(gamesFile, updatedContent);
console.log('Cleaned up and updated src/data/games.ts');
