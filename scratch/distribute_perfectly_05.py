import json

def distribute_perfectly(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        d = json.load(f)

    # Coletar todas as questoes
    qlist = []
    
    if 'questoes' in d:
        qlist.extend(d['questoes'])
    
    sim = d.get('simulado', [])
    if isinstance(sim, dict): sim = sim.get('questoes', [])
    qlist.extend(sim)
    
    des = d.get('desafio', [])
    if isinstance(des, dict): des = des.get('questoes', [])
    qlist.extend(des)
    
    total = len(qlist)
    if total == 0: return

    # Queremos uma distribuição onde a diferença entre o mais frequente e o menos frequente seja no máximo 1
    target = total // 5
    remainder = total % 5
    
    targets = {'A': target, 'B': target, 'C': target, 'D': target, 'E': target}
    # distribute remainder
    for k in list(targets.keys())[:remainder]:
        targets[k] += 1
        
    counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0}
    for q in qlist:
        gab = q.get('gabarito')
        if gab in counts:
            counts[gab] += 1

    opts = ['A', 'B', 'C', 'D', 'E']
    
    # Repetir o swap até que counts == targets
    # Ou o mais próximo possivel
    for q in qlist:
        gab = q.get('gabarito')
        if not gab or gab not in counts: continue
        
        if counts[gab] > targets[gab]:
            # Acha quem precisa de mais
            under = [k for k in opts if counts[k] < targets[k]]
            if not under: continue
            new_gab = under[0]
            
            # Swap
            old_text = q['alternativas'][gab]
            new_text = q['alternativas'][new_gab]
            q['alternativas'][gab] = new_text
            q['alternativas'][new_gab] = old_text
            
            # Update gabarito
            q['gabarito'] = new_gab
            
            # Update explicacao (mesmo regex safado)
            exp = q.get('explicacao', '')
            exp = exp.replace(f"alternativa {gab}", "TEMP_GAB")
            exp = exp.replace(f"Alternativa {gab}", "TEMP_GAB")
            exp = exp.replace(f"A {gab} ", "A TEMP_GAB ")
            exp = exp.replace(f"opção {gab}", "TEMP_GAB")
            exp = exp.replace(f"opções {gab}", "TEMP_GAB")
            exp = exp.replace(f"({gab})", "(TEMP_GAB)")
            
            exp = exp.replace(f"alternativa {new_gab}", f"alternativa {gab}")
            exp = exp.replace(f"Alternativa {new_gab}", f"Alternativa {gab}")
            exp = exp.replace(f"A {new_gab} ", f"A {gab} ")
            exp = exp.replace(f"opção {new_gab}", f"opção {gab}")
            exp = exp.replace(f"opções {new_gab}", f"opções {gab}")
            exp = exp.replace(f"({new_gab})", f"({gab})")
            
            exp = exp.replace("TEMP_GAB", new_gab)
            q['explicacao'] = exp
            
            counts[gab] -= 1
            counts[new_gab] += 1

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write('\n')

distribute_perfectly('src/data/conteudo/comp-05.json')
distribute_perfectly('src/data/conteudo/comp-05.json')
