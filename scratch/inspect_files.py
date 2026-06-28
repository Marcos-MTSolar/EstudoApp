import json
import os
import sys

def show(file, ids, out_f):
    if not os.path.exists(file): return
    with open(file, 'r', encoding='utf-8') as f:
        d = json.load(f)
    out_f.write(f"\n\n=== {file} ===\n")
    
    qlist = d.get('questoes', [])
    
    sim = d.get('simulado', [])
    if isinstance(sim, dict): sim = sim.get('questoes', [])
    qlist.extend(sim)
    
    des = d.get('desafio', [])
    if isinstance(des, dict): des = des.get('questoes', [])
    qlist.extend(des)
    
    for id in ids:
        found = False
        for q in qlist:
            if q.get('id') == id:
                out_f.write(f"\n--- {id} ---\n")
                out_f.write(q.get('explicacao', 'NO EXPLICACAO') + '\n')
                found = True
                break
        if not found:
            out_f.write(f"\n--- {id} --- NOT FOUND\n")

with open('scratch/output.txt', 'w', encoding='utf-8') as out_f:
    show('src/data/conteudo/gram-00.json', ['q14', 'q17', 'q21', 'q25', 'q27', 'q28', 's04', 'd04', 'd11', 'd15'], out_f)
    show('src/data/conteudo/gram-01.json', ['q18', 'd03'], out_f)
    show('src/data/conteudo/gram-02.json', ['q25', 'd02', 'd03'], out_f)
    show('src/data/conteudo/gram-03.json', ['q16', 'd12', 'd14'], out_f)
    show('src/data/conteudo/comp-03.json', ['d11'], out_f)
