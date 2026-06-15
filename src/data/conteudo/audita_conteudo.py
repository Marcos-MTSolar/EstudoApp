#!/usr/bin/env python3
"""
Script de auditoria do EstudoApp RM2 Marinha.

Roda dentro de src/data/conteudo/ (ou passe o caminho como argumento) e
imprime, para cada JSON de conteúdo (gram-01..14, comp-01..14), o id, o
titulo e o resumo completos, alem de um resumo das contagens de questoes/
simulado/desafio. A saida deste script deve ser colada de volta para
permitir o diagnostico completo do desalinhamento entre o 'id'/'titulo'
de cada arquivo e o conteudo real (resumo/teoria) presente nele.

Uso:
    python3 audita_conteudo.py [caminho_para_pasta_conteudo]

Se nenhum caminho for passado, assume o diretorio atual.
"""

import json
import sys
import os

IDS_OFICIAIS = (
    [f"gram-{i:02d}" for i in range(1, 15)] +
    [f"comp-{i:02d}" for i in range(1, 15)]
)


def carregar(caminho):
    try:
        with open(caminho, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError as e:
        return {"_erro_json": str(e)}


def main():
    pasta = sys.argv[1] if len(sys.argv) > 1 else "."

    print(f"Auditando pasta: {os.path.abspath(pasta)}")
    print("=" * 100)

    for esperado in IDS_OFICIAIS:
        caminho = os.path.join(pasta, f"{esperado}.json")
        dados = carregar(caminho)

        print(f"\n### ARQUIVO: {esperado}.json")

        if dados is None:
            print("  -> ARQUIVO NAO ENCONTRADO")
            continue

        if "_erro_json" in dados:
            print(f"  -> ERRO AO LER JSON: {dados['_erro_json']}")
            continue

        id_interno = dados.get("id", "<sem id>")
        titulo = dados.get("titulo", "<sem titulo>")
        area = dados.get("area", "<sem area>")
        resumo = dados.get("resumo", "<sem resumo>")

        n_questoes = len(dados.get("questoes", []) or [])
        n_simulado = len(dados.get("simulado", []) or [])
        desafio = dados.get("desafio", {}) or {}
        n_desafio = len(desafio.get("questoes", []) or [])
        n_blocos = len((dados.get("teoria", {}) or {}).get("blocos", []) or [])

        marcador = "OK" if id_interno == esperado else "!! DIVERGENTE !!"

        print(f"  arquivo esperado : {esperado}")
        print(f"  id no JSON       : {id_interno}   [{marcador}]")
        print(f"  titulo           : {titulo}")
        print(f"  area             : {area}")
        print(f"  blocos teoria    : {n_blocos}")
        print(f"  questoes         : {n_questoes}")
        print(f"  simulado         : {n_simulado}")
        print(f"  desafio.questoes : {n_desafio}")
        print(f"  resumo (completo):")
        print(f"    {resumo}")

    print("\n" + "=" * 100)
    print("FIM DA AUDITORIA")


if __name__ == "__main__":
    main()
