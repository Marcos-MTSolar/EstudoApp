/**
 * Utilitários de data para o projeto EstudoApp.
 * Brasília é sempre UTC-3 (sem horário de verão desde 2019).
 */

/**
 * Retorna a data/hora de liberação de um simulado em UTC,
 * equivalente a `hora` horas no horário de Brasília (BRT = UTC-3).
 *
 * @param dataISO - Data no formato "YYYY-MM-DD"
 * @param hora    - Hora de liberação em Brasília (padrão: 8 = 08:00 BRT)
 */
export function horarioLiberacaoBrasilia(dataISO: string, hora: number = 8): Date {
  // Brasília é sempre UTC-3 (sem horário de verão)
  // 08:00 BRT = 11:00 UTC
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  const horaUTC = hora + 3; // desloca de BRT para UTC
  return new Date(Date.UTC(ano, mes - 1, dia, horaUTC, 0, 0));
}

/**
 * Retorna true se o simulado agendado para `dataISO` já está liberado,
 * ou seja, se já passou das `hora` horas no horário de Brasília.
 *
 * @param dataISO - Data no formato "YYYY-MM-DD"
 * @param hora    - Hora de liberação em Brasília (padrão: 8 = 08:00 BRT)
 */
export function simuladoLiberado(dataISO: string, hora: number = 8): boolean {
  return Date.now() >= horarioLiberacaoBrasilia(dataISO, hora).getTime();
}

/**
 * Retorna a data de hoje no horário de Brasília (BRT = UTC-3 fixo),
 * no formato "YYYY-MM-DD".
 */
export function hojeBrasiliaISO(): string {
  return new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
