import React from 'react';

/**
 * Renderiza texto com marcações inline:
 *   __texto__  →  <u> (sublinhado, para palavras-alvo no trecho_ref)
 *   **texto**  →  <mark> com estilo âmbar (para palavras-alvo nas alternativas)
 *
 * Retorna um array de nós React para ser usado diretamente no JSX.
 */
export function renderTextoComMarcacao(texto: string): React.ReactNode[] {
  // Regex que captura __...__ ou **...**
  const REGEX = /(__(.+?)__|[*][*](.+?)[*][*])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = REGEX.exec(texto)) !== null) {
    // Texto literal antes do delimitador
    if (match.index > lastIndex) {
      nodes.push(texto.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];

    if (fullMatch.startsWith('__')) {
      // Sublinhado — palavra-alvo no trecho de referência
      const conteudo = match[2];
      nodes.push(
        React.createElement(
          'u',
          { key: `u-${match.index}`, style: { textUnderlineOffset: '3px' } },
          conteudo
        )
      );
    } else {
      // Destaque âmbar — palavra-alvo nas alternativas
      const conteudo = match[3];
      nodes.push(
        React.createElement(
          'span',
          {
            key: `hl-${match.index}`,
            style: {
              color: '#fbbf24',        /* amber-400 */
              fontWeight: '700',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          },
          conteudo
        )
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Restante do texto após o último delimitador
  if (lastIndex < texto.length) {
    nodes.push(texto.slice(lastIndex));
  }

  return nodes;
}
