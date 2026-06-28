import json
import random

def distribute_gabaritos(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        d = json.load(f)

    # get all questions
    qlist = d.get('questoes', [])
    sim = d.get('simulado', [])
    if isinstance(sim, dict): sim = sim.get('questoes', [])
    qlist.extend(sim)
    des = d.get('desafio', [])
    if isinstance(des, dict): des = des.get('questoes', [])
    qlist.extend(des)
    
    # We want roughly equal distribution: A, B, C, D, E.
    opts = ['A', 'B', 'C', 'D', 'E']
    target_count = len(qlist) // 5
    
    counts = {k: 0 for k in opts}
    for q in qlist:
        if q.get('gabarito') in counts:
            counts[q['gabarito']] += 1

    # find questions we can swap (we can swap any question to a new gabarito by swapping the option text and the explanation reference)
    for q in qlist:
        gab = q.get('gabarito')
        if not gab or gab not in counts: continue
        
        # if this gabarito is over-represented, try to swap to an under-represented one
        if counts[gab] > target_count + 1:
            under = [k for k in opts if counts[k] < target_count]
            if not under: continue
            new_gab = under[0]
            
            # swap alternatives
            old_text = q['alternativas'][gab]
            new_text = q['alternativas'][new_gab]
            q['alternativas'][gab] = new_text
            q['alternativas'][new_gab] = old_text
            
            # update gabarito
            q['gabarito'] = new_gab
            
            # update explanation: very basic string replace 
            # (assuming my explanations start with "A alternativa X está correta" or have "(X)")
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

distribute_gabaritos('src/data/conteudo/comp-02.json')
distribute_gabaritos('src/data/conteudo/comp-04.json')
