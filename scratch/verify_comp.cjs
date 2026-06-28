const fs = require('fs');

function checkFile(filename) {
    const d = JSON.parse(fs.readFileSync(filename, 'utf8'));
    let qlist = [...(d.questoes || [])];
    if (d.simulado) {
        qlist = qlist.concat(Array.isArray(d.simulado) ? d.simulado : (d.simulado.questoes || []));
    }
    if (d.desafio) {
        qlist = qlist.concat(Array.isArray(d.desafio) ? d.desafio : (d.desafio.questoes || []));
    }
    
    let hasAB = false;
    let gabCount = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0 };
    
    qlist.forEach(q => {
        if (!q || !q.alternativas) return;
        const keys = Object.keys(q.alternativas);
        if (keys.length !== 5) {
            console.log(`WARNING: ${filename} - ${q.id} has ${keys.length} options!`);
            if (keys.length === 2) hasAB = true;
        }
        if (gabCount[q.gabarito] !== undefined) {
            gabCount[q.gabarito]++;
        } else {
            console.log(`WARNING: ${filename} - ${q.id} has invalid gabarito: ${q.gabarito}`);
        }
    });
    
    console.log(`\n=== ${filename} ===`);
    console.log(`Formatos A/B encontrados: ${hasAB ? 'SIM' : 'NÃO'}`);
    console.log(`Distribuição de gabaritos:`);
    console.log(`A: ${gabCount.A}`);
    console.log(`B: ${gabCount.B}`);
    console.log(`C: ${gabCount.C}`);
    console.log(`D: ${gabCount.D}`);
    console.log(`E: ${gabCount.E}`);
}

checkFile('src/data/conteudo/comp-02.json');
checkFile('src/data/conteudo/comp-04.json');
