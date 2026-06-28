const fs = require('fs');

function show(file, ids) {
    if (!fs.existsSync(file)) return;
    const d = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`\n\n=== ${file} ===`);
    let qlist = (d.questoes||[]).concat(d.simulado||[]).concat(d.simulado?.questoes||[]).concat(d.desafio||[]).concat(d.desafio?.questoes||[]);
    for (let id of ids) {
        let q = qlist.find(x => x.id === id);
        if (q) {
            console.log(`\n--- ${id} ---`);
            console.log(q.explicacao);
        } else {
            console.log(`\n--- ${id} --- NOT FOUND`);
        }
    }
}

show('src/data/conteudo/gram-00.json', ['q14', 'q17', 'q21', 'q25', 'q27', 'q28', 's04', 'd04', 'd11', 'd15']);
show('src/data/conteudo/gram-01.json', ['q18', 'd03']);
show('src/data/conteudo/gram-02.json', ['q25', 'd02', 'd03']);
show('src/data/conteudo/gram-03.json', ['q16', 'd12', 'd14']);
show('src/data/conteudo/comp-03.json', ['d11']);
