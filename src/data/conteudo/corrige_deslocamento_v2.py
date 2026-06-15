#!/usr/bin/env python3
"""
Corretor DEFINITIVO do desalinhamento de conteudo nos JSONs do RM2 Marinha
(EstudoApp) -- versao 2, com mapa 1:1 manual (NAO eh um deslocamento
ciclico uniforme).

DIAGNOSTICO FINAL
-----------------
A primeira hipotese (deslocamento ciclico uniforme de +2 sobre os 28
arquivos) estava PARCIALMENTE correta: ela explica corretamente os
arquivos gram-01 a gram-04 e alguns outros, mas falha a partir de
gram-05 porque, durante a geracao original do conteudo, alguns PARES de
topicos oficiais foram fundidos em um UNICO arquivo gerado:

  - "Flexao Nominal" + "Flexao Verbal"      -> saiu como 1 arquivo so
  - "Concordancia Nominal" + "Concordancia Verbal" -> saiu como 1 arquivo
  - "Coesao Textual" + "Coerencia e Textualidade"   -> saiu como 1 arquivo

Cada fusao "engole" 1 posicao na sequencia, fazendo todo o conteudo
seguinte "escorregar" mais uma casa para tras. Alem disso, dois
conteudos extras foram gerados sem corresponder a nenhum dos 28 topicos
oficiais:

  - "Paralelismo Sintatico"  (gerado no slot que ficou rotulado gram-14)
  - "Propositos do Autor"    (gerado no slot que ficou rotulado comp-02 --
                               este tema, alias, faz parte do ESCOPO
                               OFICIAL de comp-01 "Leitura de Textos
                               Verbais e Nao Verbais")

MAPA DE CORRECAO (fonte -> destino)
------------------------------------
Por nao haver mais um padrao algebrico simples, o mapa abaixo foi
construido manualmente, comparando o RESUMO real de cada um dos 28
arquivos atuais com a descricao oficial de cada um dos 28 topicos em
src/data/rm2Conteudo.ts.

Cada item do mapa MAPA_PRINCIPAL diz: "o CONTEUDO PRINCIPAL (teoria
completa + 30 questoes + 5 simulado + 15 desafio) do arquivo de destino
DEVE VIR do arquivo de origem indicado".

O dict MAPA_EXTRA diz: "alem do conteudo principal, o arquivo de destino
recebe TAMBEM os blocos de teoria (e SOMENTE os blocos de teoria -- nao
questoes/simulado/desafio) do(s) arquivo(s) de origem indicado(s),
anexados ao final de teoria.blocos, para nao se perder esse material
gerado".

REGRAS DE EXECUCAO
-------------------
1. Le os 28 arquivos atuais.
2. Para cada DESTINO (id oficial gram-01..14, comp-01..14):
   a. Carrega o conteudo do arquivo de ORIGEM principal (MAPA_PRINCIPAL).
   b. Corrige os campos id/titulo/area do dict para o destino.
   c. Se houver entrada em MAPA_EXTRA para esse destino, carrega o(s)
      arquivo(s) extra(s) e ANEXA os blocos de teoria.blocos deles ao
      final de teoria.blocos do destino (com um subtitulo indicando a
      origem, para clareza).
   d. Remapeia referencias cruzadas em desafio.topicos_mesclados e
      desafio.questoes[*].topico_referencia usando o mesmo MAPA_PRINCIPAL
      (origem -> destino), trocando qualquer ID de origem mencionado
      pelo ID de destino correspondente.
3. Grava cada resultado em <destino>.json.new (NAO sobrescreve nada).
4. Com --apply, faz backup de cada <destino>.json em <destino>.json.bak
   e substitui pelo .json.new.

USO
---
  python3 corrige_deslocamento_v2.py            # gera *.json.new
  python3 corrige_deslocamento_v2.py --apply    # aplica (com backup .bak)
  python3 corrige_deslocamento_v2.py --dir caminho/para/conteudo
"""

import json
import os
import re
import shutil
import argparse


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

# destino -> origem do conteudo PRINCIPAL (teoria + questoes + simulado + desafio)
MAPA_PRINCIPAL = {
    "gram-01": "gram-01",  # Ortografia/Acentuacao (fundido) -> mantem aqui
    "gram-02": "gram-01",  # mesma fonte fundida, duplicada
    "gram-03": "gram-02",  # Crase
    "gram-04": "gram-03",  # Estrutura e Formacao de Palavras
    "gram-05": "gram-04",  # Classes de Palavras
    "gram-06": "gram-05",  # Flexao Nominal+Verbal (fundido) -> Flexao Nominal
    "gram-07": "gram-05",  # mesma fonte fundida, duplicada -> Flexao Verbal
    "gram-08": "gram-06",  # Frase, Oracao e Periodo
    "gram-09": "gram-07",  # Termos da Oracao
    "gram-10": "gram-08",  # Coordenacao e Subordinacao
    "gram-11": "gram-09",  # Concordancia Nom+Verbal (fundido) -> Nominal
    "gram-12": "gram-09",  # mesma fonte fundida, duplicada -> Verbal
    "gram-13": "gram-10",  # Regencia Nominal e Verbal
    "gram-14": "gram-11",  # Colocacao Pronominal (principal)
    "comp-01": "comp-01",  # Leitura de Textos V/NV (ja correto)
    "comp-02": "comp-03",  # Informacoes Implicitas/Explicitas
    "comp-03": "comp-04",  # Linguagem Denotativa/Conotativa
    "comp-04": "comp-14",  # Elementos Ficcionais/Nao Ficcionais
    "comp-05": "comp-05",  # Ambiguidade e Polissemia (ja correto)
    "comp-06": "comp-06",  # Relacoes Lexicais (ja correto)
    "comp-07": "comp-07",  # Figuras de Linguagem (ja correto)
    "comp-08": "comp-08",  # Tipos e Generos Textuais (ja correto)
    "comp-09": "comp-09",  # Tipos de Discurso (ja correto)
    "comp-10": "gram-13",  # Reescritura de Frases
    "comp-11": "comp-10",  # Coesao+Coerencia (fundido) -> Coesao Textual
    "comp-12": "comp-10",  # mesma fonte fundida, duplicada -> Coerencia/Textualidade
    "comp-13": "comp-11",  # Intertextualidade (parte de Intencionalidade/Intertext.)
    "comp-14": "comp-13",  # Adequacao Vocabular / Variacao Linguistica
}

# destino -> lista de origens cujos teoria.blocos serao ANEXADOS
# (apenas blocos de teoria; questoes/simulado/desafio dessas origens NAO
# sao copiados, para nao duplicar contagens)
MAPA_EXTRA = {
    "gram-14": ["gram-12"],  # + Pontuacao
    "comp-01": ["comp-02"],  # + Propositos do Autor
    "comp-10": ["gram-14"],  # + Paralelismo Sintatico
    "comp-12": ["comp-11", "comp-12"],  # + Intencionalidade/Intertext. e Informatividade/Situacionalidade
}


def carregar(pasta, arquivo_id):
    caminho = os.path.join(pasta, f"{arquivo_id}.json")
    with open(caminho, "r", encoding="utf-8") as f:
        return json.load(f)


def remapear_referencia_id(ref_id, mapa_origem_para_destino):
    """Dado um ID gram-*/comp-* encontrado numa referencia cruzada
    (topicos_mesclados, topico_referencia), retorna o ID de destino
    correspondente, se essa origem aparecer no MAPA_PRINCIPAL. Se a
    origem alimentar dois destinos (caso dos pares fundidos), prefere
    o destino "primario" (primeira ocorrencia na ordem oficial)."""
    candidatos = mapa_origem_para_destino.get(ref_id)
    if not candidatos:
        return ref_id  # origem nao reconhecida, mantem como esta
    return candidatos[0]


def remapear_topico_referencia(valor, mapa_origem_para_destino):
    def repl(match):
        return remapear_referencia_id(match.group(0), mapa_origem_para_destino)
    return re.sub(r"(gram|comp)-\d{2}", repl, valor)


def construir_mapa_origem_para_destino():
    """Inverte MAPA_PRINCIPAL: origem -> [destinos], na ordem em que
    aparecem em MAPA_PRINCIPAL (para escolher um 'primario' de forma
    deterministica quando uma origem alimenta 2 destinos)."""
    inverso = {}
    for destino, origem in MAPA_PRINCIPAL.items():
        inverso.setdefault(origem, []).append(destino)
    return inverso


def gerar_new(pasta):
    print(f"Pasta: {pasta}\n")
    mapa_inverso = construir_mapa_origem_para_destino()

    for destino_id, titulo_oficial in TITULOS_OFICIAIS.items():
        origem_id = MAPA_PRINCIPAL[destino_id]
        dados = carregar(pasta, origem_id)

        # Corrige cabecalho
        dados["id"] = destino_id
        dados["titulo"] = titulo_oficial
        prefixo = destino_id.split("-")[0]
        dados["area"] = AREA_OFICIAL[prefixo]

        # Anexa blocos de teoria extra, se houver
        extras = MAPA_EXTRA.get(destino_id, [])
        teoria = dados.setdefault("teoria", {})
        blocos = teoria.setdefault("blocos", [])
        for extra_id in extras:
            extra_dados = carregar(pasta, extra_id)
            extra_blocos = (extra_dados.get("teoria") or {}).get("blocos") or []
            titulo_extra = extra_dados.get("titulo", extra_id)
            for b in extra_blocos:
                novo_bloco = dict(b)
                # marca a origem no subtitulo para rastreabilidade
                novo_bloco["subtitulo"] = (
                    f"[Conteúdo complementar — {titulo_extra}] "
                    + novo_bloco.get("subtitulo", "")
                )
                blocos.append(novo_bloco)

        # Remapeia referencias cruzadas no desafio
        desafio = dados.get("desafio")
        if isinstance(desafio, dict):
            tm = desafio.get("topicos_mesclados")
            if isinstance(tm, list):
                desafio["topicos_mesclados"] = [
                    remapear_referencia_id(x, mapa_inverso) if isinstance(x, str) else x
                    for x in tm
                ]
            for q in desafio.get("questoes") or []:
                if isinstance(q, dict) and isinstance(q.get("topico_referencia"), str):
                    q["topico_referencia"] = remapear_topico_referencia(
                        q["topico_referencia"], mapa_inverso
                    )

        caminho_new = os.path.join(pasta, f"{destino_id}.json.new")
        with open(caminho_new, "w", encoding="utf-8") as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)

        extra_info = f" + extra de {extras}" if extras else ""
        print(f"  {destino_id}.json.new  <-  conteudo de {origem_id}.json{extra_info}"
              f"  (titulo: {titulo_oficial})")

    print("\nConcluido. Nenhum .json original foi alterado.")
    print("Revise os *.json.new e, quando estiver tudo certo, rode com --apply.")


def aplicar(pasta):
    print(f"Pasta: {pasta}\n")
    aplicados = 0
    ausentes = []

    for destino_id in TITULOS_OFICIAIS:
        caminho_new = os.path.join(pasta, f"{destino_id}.json.new")
        caminho_json = os.path.join(pasta, f"{destino_id}.json")

        if not os.path.isfile(caminho_new):
            ausentes.append(destino_id)
            continue

        if os.path.isfile(caminho_json):
            shutil.copy2(caminho_json, caminho_json + ".bak")

        shutil.move(caminho_new, caminho_json)
        aplicados += 1
        print(f"  {destino_id}.json.new -> {destino_id}.json  (backup: {destino_id}.json.bak)")

    print(f"\n{aplicados} arquivos atualizados.")
    if ausentes:
        print("AVISO: .json.new ausentes para:")
        for d in ausentes:
            print(f"  - {d}.json.new")

    print("\nPronto. Originais preservados como .json.bak.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dir", default=".", help="Pasta com os 28 JSONs")
    parser.add_argument("--apply", action="store_true",
                         help="Aplica: sobrescreve .json com .json.new (com backup .bak)")
    args = parser.parse_args()

    pasta = os.path.abspath(args.dir)

    if args.apply:
        aplicar(pasta)
    else:
        gerar_new(pasta)


if __name__ == "__main__":
    main()
