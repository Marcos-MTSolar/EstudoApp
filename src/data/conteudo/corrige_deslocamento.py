#!/usr/bin/env python3
"""
Corretor do desalinhamento de conteudo nos JSONs do RM2 Marinha (EstudoApp).

DIAGNOSTICO
-----------
Os 28 arquivos de conteudo (gram-01..14, comp-01..14) foram gerados em
sequencia, mas o CONTEUDO de cada arquivo corresponde ao topico que esta
DUAS posicoes adiante na lista oficial de 28 topicos (com wraparound:
depois de comp-14 volta para gram-01). Ou seja, e um ciclo unico fechado
de +2 sobre 28 itens.

Exemplo: o arquivo gram-01.json tem id/titulo "gram-01 / Sistema
Ortografico", mas o RESUMO e a TEORIA dentro dele sao sobre Crase, que
e o topico oficial gram-03... espera, na verdade o CONTEUDO de gram-01
(Acordo Ortografico/acentuacao) e o topico que DEVERIA estar em gram-03
(ou seja, gram-01 contem o material que pertence a gram-03).
Generalizando: o arquivo na posicao N contem o material que pertence a
posicao N+2 (mod 28).

CORRECAO
--------
Este script:
  1. Le os 28 arquivos atuais (pasta de entrada).
  2. Para cada arquivo na posicao N, escreve seu CONTEUDO num novo
     arquivo na posicao N+2 (mod 28) -- ou seja, "empurra" o conteudo
     para onde ele pertence.
  3. Corrige os campos internos "id", "titulo" e "area" do JSON para
     bater com a posicao de destino (conforme a lista oficial abaixo).
  4. Tambem corrige, dentro de listas de "topicos_mesclados" e de
     "topico_referencia" nos desafios, qualquer referencia a IDs gram-*/
     comp-* SUBSTITUINDO pelo ID corrigido (N -> N+2 mod 28), para que
     as referencias cruzadas entre topicos continuem coerentes apos a
     correcao.
  5. Grava cada arquivo corrigido com sufixo ".json.new" na pasta de
     saida (por padrao, a mesma pasta de entrada). NADA E SOBRESCRITO
     nesta etapa -- os arquivos originais ".json" permanecem intactos.

Depois de revisar o resultado, rode este mesmo script com a flag
--apply para that ele renomeie os ".json.new" para ".json"
(sobrescrevendo os originais). Antes disso, é fortemente recomendado
fazer um backup/commit do estado atual (os arquivos originais), para
permitir reverter se algo estiver errado.

USO
---
  # 1) gerar os .json.new (nao destrutivo)
  python3 corrige_deslocamento.py

  # 2) revisar os .json.new manualmente (ou rodar a auditoria neles)

  # 3) aplicar -- sobrescreve os .json originais com o conteudo de .json.new
  python3 corrige_deslocamento.py --apply

  # opcional: indicar pasta diferente da atual
  python3 corrige_deslocamento.py --dir caminho/para/conteudo
"""

import json
import os
import sys
import argparse
import shutil


# Ordem oficial dos 28 topicos, conforme src/data/rm2Conteudo.ts
# (a ordem AQUI eh a ordem "fisica" dos arquivos gram-01..14, comp-01..14 --
#  nao a ordem pedagogica de exibicao. O que importa para este script eh
#  apenas o titulo oficial de cada ID de arquivo.)
TITULOS_OFICIAIS = {
    "gram-01": "Sistema Ortográfico",
    "gram-02": "Acentuação Gráfica",
    "gram-03": "Uso do Sinal de Crase",
    "gram-04": "Estrutura e Formação de Palavras",
    "gram-05": "Classes de Palavras",
    "gram-06": "Flexão Nominal",
    "gram-07": "Flexão Verbal",
    "gram-08": "Organização Sintática: Frase, Oração e Período",
    "gram-09": "Termos da Oração",
    "gram-10": "Coordenação e Subordinação",
    "gram-11": "Concordância Nominal",
    "gram-12": "Concordância Verbal",
    "gram-13": "Regência Nominal e Verbal",
    "gram-14": "Colocação Pronominal e Pontuação",
    "comp-01": "Leitura de Textos Verbais e Não Verbais",
    "comp-02": "Informações Implícitas e Explícitas",
    "comp-03": "Linguagem Denotativa e Conotativa",
    "comp-04": "Elementos Ficcionais e Não Ficcionais",
    "comp-05": "Ambiguidade e Polissemia",
    "comp-06": "Relações Lexicais",
    "comp-07": "Figuras de Linguagem",
    "comp-08": "Tipos e Gêneros Textuais",
    "comp-09": "Tipos de Discurso",
    "comp-10": "Reescritura de Frases",
    "comp-11": "Coesão Textual",
    "comp-12": "Coerência e Textualidade",
    "comp-13": "Intertextualidade",
    "comp-14": "Adequação Vocabular e Variação Linguística",
}

AREA_OFICIAL = {
    "gram": "Gramática",
    "comp": "Compreensão e Interpretação de Texto",
}

# Lista ordenada dos 28 IDs, na ordem "fisica" 01..14 de gram, depois 01..14
# de comp. Esta eh a ordem usada para calcular o deslocamento ciclico +2.
SEQUENCIA = (
    [f"gram-{i:02d}" for i in range(1, 15)] +
    [f"comp-{i:02d}" for i in range(1, 15)]
)
N = len(SEQUENCIA)  # 28


def id_destino(id_origem: str) -> str:
    """Dado o id de um arquivo (posicao N na sequencia), retorna o id
    do arquivo de destino (posicao N+2 mod 28), ou seja, para onde o
    CONTEUDO desse arquivo deve ir."""
    idx = SEQUENCIA.index(id_origem)
    novo_idx = (idx + 2) % N
    return SEQUENCIA[novo_idx]


def remapear_referencia_id(ref_id: str) -> str:
    """Remapeia um ID gram-*/comp-* encontrado dentro de campos de
    referencia cruzada (topicos_mesclados, topico_referencia) para o
    novo ID, aplicando a mesma correcao +2. Se o token nao for um ID
    valido reconhecido, retorna inalterado."""
    if ref_id in SEQUENCIA:
        return id_destino(ref_id)
    return ref_id


def remapear_topico_referencia(valor: str) -> str:
    """O campo topico_referencia costuma ser uma string como
    'gram-04 + gram-09' ou 'gram-05 + gram-09'. Substitui cada
    ocorrencia de um ID gram-*/comp-* pelo ID remapeado, preservando o
    resto da string (separadores ' + ', etc.)."""
    import re

    def repl(match):
        return remapear_referencia_id(match.group(0))

    # Padrao: gram-NN ou comp-NN
    return re.sub(r"(gram|comp)-\d{2}", repl, valor)


def corrigir_conteudo(dados: dict, novo_id: str) -> dict:
    """Recebe o dict carregado de um JSON de conteudo (cujo CONTEUDO
    pertence ao topico novo_id) e corrige os campos id/titulo/area, alem
    de remapear referencias cruzadas internas (topicos_mesclados,
    topico_referencia)."""

    dados["id"] = novo_id
    dados["titulo"] = TITULOS_OFICIAIS[novo_id]
    prefixo = novo_id.split("-")[0]  # "gram" ou "comp"
    dados["area"] = AREA_OFICIAL[prefixo]

    desafio = dados.get("desafio")
    if isinstance(desafio, dict):
        # topicos_mesclados: lista de IDs
        tm = desafio.get("topicos_mesclados")
        if isinstance(tm, list):
            desafio["topicos_mesclados"] = [
                remapear_referencia_id(x) if isinstance(x, str) else x
                for x in tm
            ]

        # questoes[*].topico_referencia: string com IDs embutidos
        questoes_desafio = desafio.get("questoes")
        if isinstance(questoes_desafio, list):
            for q in questoes_desafio:
                if isinstance(q, dict) and isinstance(q.get("topico_referencia"), str):
                    q["topico_referencia"] = remapear_topico_referencia(
                        q["topico_referencia"]
                    )

    return dados


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dir",
        default=".",
        help="Pasta onde estao os 28 arquivos gram-*/comp-*.json (padrao: pasta atual)",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Aplica a correcao: renomeia os .json.new para .json, "
             "sobrescrevendo os originais (faca backup/commit antes!).",
    )
    args = parser.parse_args()

    pasta = os.path.abspath(args.dir)

    if args.apply:
        aplicar(pasta)
        return

    gerar_new(pasta)


def gerar_new(pasta: str):
    print(f"Pasta: {pasta}")
    print("Gerando arquivos .json.new com o conteudo corrigido...\n")

    faltando = []

    for origem_id in SEQUENCIA:
        caminho_origem = os.path.join(pasta, f"{origem_id}.json")
        if not os.path.isfile(caminho_origem):
            faltando.append(origem_id)
            continue

        with open(caminho_origem, "r", encoding="utf-8") as f:
            dados = json.load(f)

        destino_id = id_destino(origem_id)
        dados_corrigidos = corrigir_conteudo(dados, destino_id)

        caminho_destino = os.path.join(pasta, f"{destino_id}.json.new")
        with open(caminho_destino, "w", encoding="utf-8") as f:
            json.dump(dados_corrigidos, f, ensure_ascii=False, indent=2)

        print(f"  {origem_id}.json  (conteudo de '{dados.get('titulo','?')}')"
              f"  ->  {destino_id}.json.new  (id/titulo corrigidos para "
              f"'{TITULOS_OFICIAIS[destino_id]}')")

    if faltando:
        print("\nAVISO: os seguintes arquivos de origem nao foram encontrados "
              "e foram ignorados:")
        for f_id in faltando:
            print(f"  - {f_id}.json")

    print("\nConcluido. Nenhum arquivo .json original foi alterado.")
    print("Revise os arquivos *.json.new e, quando estiver tudo certo, rode:")
    print("  python3 corrige_deslocamento.py --apply")


def aplicar(pasta: str):
    print(f"Pasta: {pasta}")
    print("Aplicando correcao: sobrescrevendo .json com .json.new ...\n")

    aplicados = 0
    ausentes = []

    for destino_id in SEQUENCIA:
        caminho_new = os.path.join(pasta, f"{destino_id}.json.new")
        caminho_json = os.path.join(pasta, f"{destino_id}.json")

        if not os.path.isfile(caminho_new):
            ausentes.append(destino_id)
            continue

        # Backup do original antes de sobrescrever, por seguranca extra.
        if os.path.isfile(caminho_json):
            backup = caminho_json + ".bak"
            shutil.copy2(caminho_json, backup)

        shutil.move(caminho_new, caminho_json)
        aplicados += 1
        print(f"  {destino_id}.json.new -> {destino_id}.json  (backup salvo em {destino_id}.json.bak)")

    print(f"\n{aplicados} arquivos atualizados.")
    if ausentes:
        print("AVISO: nao foram encontrados .json.new para:")
        for f_id in ausentes:
            print(f"  - {f_id}.json.new")

    print("\nPronto. Os arquivos .json agora contem o conteudo corrigido.")
    print("Os originais foram preservados como .json.bak -- apague-os depois "
          "de confirmar que tudo esta certo (ex.: apos rodar a auditoria de "
          "novo e validar build/tsc).")


if __name__ == "__main__":
    main()
