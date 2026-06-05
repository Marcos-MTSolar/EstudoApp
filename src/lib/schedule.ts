export const FASE1_SCHEDULE = [
  { day: 'Segunda-feira', dayIndex: 1, time: '19h30–21h30', tasks: 'Matemática + Revisão' },
  { day: 'Terça-feira', dayIndex: 2, time: '19h30–21h30', tasks: 'Português/Literatura + Redação' },
  { day: 'Quarta-feira', dayIndex: 3, time: '19h30–21h30', tasks: 'Biologia + Revisão' },
  { day: 'Quinta-feira', dayIndex: 4, time: '19h30–21h30', tasks: 'Química + Revisão' },
  { day: 'Sexta-feira', dayIndex: 5, time: '19h30–21h00', tasks: 'Humanas/Geografia + Descanso' },
  { day: 'Sábado', dayIndex: 6, time: '08h–10h', tasks: 'Física', extra: ['10h15–11h30: Matemática', '14h–15h30: Redação'] },
  { day: 'Domingo', dayIndex: 0, time: '09h–11h', tasks: 'Humanas/História', extra: ['11h–12h: Revisão geral', 'Tarde: Descanso'] }
];

export const FASE2_SCHEDULE = [
  { day: 'Segunda-feira', dayIndex: 1, time: '19h30–21h30', tasks: 'Biologia' },
  { day: 'Terça-feira', dayIndex: 2, time: '19h30–21h30', tasks: 'Química' },
  { day: 'Quarta-feira', dayIndex: 3, time: '19h30–21h30', tasks: 'Matemática' },
  { day: 'Quinta-feira', dayIndex: 4, time: '19h30–21h30', tasks: 'Física' },
  { day: 'Sexta-feira', dayIndex: 5, time: '19h30–21h30', tasks: 'Português + Redação' },
  { day: 'Sábado', dayIndex: 6, time: '08h–10h30', tasks: 'Humanas', extra: ['10h45–12h: Redação', '14h–16h: Exercícios de provas anteriores'] },
  { day: 'Domingo', dayIndex: 0, time: '09h–11h30', tasks: 'Simulado parcial (1 área)', extra: ['Tarde: Descanso'] }
];

export const FASE3_SCHEDULE = [
  { day: 'Segunda a Sexta', time: '19h30–21h30', tasks: 'Revisão de uma área por dia com questões ENEM', extra: ['(rodízio: Bio, Qui, Mat, Fis, Hum+Port)'] },
  { day: 'Sábado', dayIndex: 6, time: '08h–13h', tasks: 'Simulado ENEM completo', extra: ['14h–16h: Correção e análise de erros'] },
  { day: 'Domingo', dayIndex: 0, time: '09h–11h', tasks: 'Redação (treino nota 1000)', extra: ['11h–12h: Pontos fracos', 'Tarde: Descanso'] }
];

export const FASE4_SCHEDULE = [
  { day: 'Segunda a Quinta', time: '19h30–21h00', tasks: 'Revisão leve (mapas mentais, resumos)' },
  { day: 'Sexta-feira', dayIndex: 5, time: '19h30–20h30', tasks: 'Revisão leve', extra: ['20h30+: Descanso'] },
  { day: 'Sábado', dayIndex: 6, time: '08h–12h', tasks: 'Último simulado completo', extra: ['14h–15h30: Redação final'] },
  { day: 'Domingo pré-prova', dayIndex: 0, time: '-', tasks: 'Descanso total, confirmar local, separar documentos' }
];

export function getScheduleForPhase(phase: number) {
  switch (phase) {
    case 1: return FASE1_SCHEDULE;
    case 2: return FASE2_SCHEDULE;
    case 3: return FASE3_SCHEDULE;
    case 4: return FASE4_SCHEDULE;
    default: return FASE1_SCHEDULE;
  }
}
