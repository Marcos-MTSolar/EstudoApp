export function getUserPhase(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  // Fase 1: Junho de 2026 a Dezembro de 2026
  if (year === 2026 && month >= 5 && month <= 11) {
    return 1;
  }
  // Fase 2: Janeiro de 2027 a Junho de 2027
  if (year === 2027 && month <= 5) {
    return 2;
  }
  // Fase 3: Julho de 2027 a Setembro 2027
  if (year === 2027 && month >= 6 && month <= 8) {
    return 3;
  }
  // Fase 4: Outubro de 2027 a Novembro 2027
  if (year === 2027 && month >= 9 && month <= 10) {
    return 4;
  }
  
  // Default fallback if we test today
  return 1;
}

export const SUBJECT_COLORS: Record<string, string> = {
  "Matemática": "text-blue-400 border-blue-400 bg-blue-400/10",
  "Português/Literatura": "text-emerald-400 border-emerald-400 bg-emerald-400/10",
  "Português": "text-emerald-400 border-emerald-400 bg-emerald-400/10",
  "Biologia": "text-green-400 border-green-400 bg-green-400/10",
  "Química": "text-purple-400 border-purple-400 bg-purple-400/10",
  "Física": "text-red-400 border-red-400 bg-red-400/10",
  "Humanas/Geografia": "text-amber-400 border-amber-400 bg-amber-400/10",
  "Humanas/História": "text-amber-400 border-amber-400 bg-amber-400/10",
  "Humanas": "text-amber-400 border-amber-400 bg-amber-400/10",
  "Redação": "text-pink-400 border-pink-400 bg-pink-400/10",
  "Redação completa": "text-pink-400 border-pink-400 bg-pink-400/10",
  "Simulado parcial (1 área)": "text-orange-400 border-orange-400 bg-orange-400/10",
  "Simulado ENEM completo": "text-orange-400 border-orange-400 bg-orange-400/10",
  "Último simulado completo": "text-orange-400 border-orange-400 bg-orange-400/10",
  "Revisão rápida": "text-indigo-400 border-indigo-400 bg-indigo-400/10",
  "Revisão geral": "text-indigo-400 border-indigo-400 bg-indigo-400/10",
  "Revisão Biologia com questões ENEM": "text-green-400 border-green-400 bg-green-400/10",
  "Revisão Química com questões ENEM": "text-purple-400 border-purple-400 bg-purple-400/10",
  "Revisão Matemática com questões ENEM": "text-blue-400 border-blue-400 bg-blue-400/10",
  "Revisão Física com questões ENEM": "text-red-400 border-red-400 bg-red-400/10",
  "Revisão Humanas": "text-amber-400 border-amber-400 bg-amber-400/10",
  "Revisão Português": "text-emerald-400 border-emerald-400 bg-emerald-400/10",
  "Revisão leve por área (mapas mentais, resumos rápidos)": "text-indigo-400 border-indigo-400 bg-indigo-400/10",
  "Revisão leve": "text-indigo-400 border-indigo-400 bg-indigo-400/10",
  "Revisão pontos fracos": "text-indigo-400 border-indigo-400 bg-indigo-400/10",
  "Descanso": "text-gray-400 border-gray-400 bg-gray-400/10",
  "Exercícios de provas ENEM anteriores": "text-blue-300 border-blue-300 bg-blue-300/10",
  "Correção e análise de erros": "text-indigo-300 border-indigo-300 bg-indigo-300/10",
};

interface Block {
  time: string;
  subject: string;
  type?: string;
}

export const SCHEDULES: Record<number, Record<number, Block[]>> = {
  1: { // Fase 1
    1: [{ time: "19:30 - 21:00", subject: "Matemática", type: "standard" }, { time: "21:00 - 21:30", subject: "Revisão rápida", type: "standard" }],
    2: [{ time: "19:30 - 21:00", subject: "Português/Literatura", type: "standard" }, { time: "21:00 - 21:30", subject: "Redação", type: "standard" }],
    3: [{ time: "19:30 - 21:00", subject: "Biologia", type: "standard" }, { time: "21:00 - 21:30", subject: "Revisão rápida", type: "standard" }],
    4: [{ time: "19:30 - 21:00", subject: "Química", type: "standard" }, { time: "21:00 - 21:30", subject: "Revisão rápida", type: "standard" }],
    5: [{ time: "19:30 - 20:30", subject: "Humanas/Geografia", type: "standard" }, { time: "20:30 - 21:00", subject: "Descanso", type: "break" }],
    6: [{ time: "08:00 - 10:00", subject: "Física", type: "standard" }, { time: "10:15 - 11:30", subject: "Matemática", type: "standard" }, { time: "14:00 - 15:30", subject: "Redação", type: "standard" }],
    0: [{ time: "09:00 - 11:00", subject: "Humanas/História", type: "standard" }, { time: "11:00 - 12:00", subject: "Revisão geral", type: "standard" }, { time: "Tarde", subject: "Descanso", type: "break" }],
  },
  2: { // Fase 2
    1: [{ time: "19:30 - 21:30", subject: "Biologia", type: "standard" }],
    2: [{ time: "19:30 - 21:30", subject: "Química", type: "standard" }],
    3: [{ time: "19:30 - 21:30", subject: "Matemática", type: "standard" }],
    4: [{ time: "19:30 - 21:30", subject: "Física", type: "standard" }],
    5: [{ time: "19:30 - 21:00", subject: "Português/Literatura", type: "standard" }, { time: "21:00 - 21:30", subject: "Redação", type: "standard" }],
    6: [{ time: "08:00 - 10:30", subject: "Humanas", type: "standard" }, { time: "10:45 - 12:00", subject: "Redação completa", type: "standard" }, { time: "14:00 - 16:00", subject: "Exercícios de provas ENEM anteriores", type: "standard" }],
    0: [{ time: "09:00 - 11:30", subject: "Simulado parcial (1 área)", type: "simulado" }, { time: "Tarde", subject: "Descanso", type: "break" }],
  },
  3: { // Fase 3
    1: [{ time: "19:30 - 21:30", subject: "Revisão Biologia com questões ENEM", type: "standard" }],
    2: [{ time: "19:30 - 21:30", subject: "Revisão Química com questões ENEM", type: "standard" }],
    3: [{ time: "19:30 - 21:30", subject: "Revisão Matemática com questões ENEM", type: "standard" }],
    4: [{ time: "19:30 - 21:30", subject: "Revisão Física com questões ENEM", type: "standard" }],
    5: [{ time: "19:30 - 21:00", subject: "Revisão Humanas", type: "standard" }, { time: "21:00 - 21:30", subject: "Revisão Português", type: "standard" }],
    6: [{ time: "08:00 - 13:00", subject: "Simulado ENEM completo", type: "simulado" }, { time: "14:00 - 16:00", subject: "Correção e análise de erros", type: "standard" }],
    0: [{ time: "09:00 - 11:00", subject: "Redação (treino nota 1000)", type: "redacao" }, { time: "11:00 - 12:00", subject: "Revisão pontos fracos", type: "standard" }, { time: "Tarde", subject: "Descanso", type: "break" }],
  },
  4: { // Fase 4
    1: [{ time: "19:30 - 21:00", subject: "Revisão leve por área (mapas mentais, resumos rápidos)", type: "standard" }, { time: "21:00 - 21:30", subject: "Redação", type: "standard" }],
    2: [{ time: "19:30 - 21:00", subject: "Revisão leve por área (mapas mentais, resumos rápidos)", type: "standard" }, { time: "21:00 - 21:30", subject: "Redação", type: "standard" }],
    3: [{ time: "19:30 - 21:00", subject: "Revisão leve por área (mapas mentais, resumos rápidos)", type: "standard" }, { time: "21:00 - 21:30", subject: "Redação", type: "standard" }],
    4: [{ time: "19:30 - 21:00", subject: "Revisão leve por área (mapas mentais, resumos rápidos)", type: "standard" }, { time: "21:00 - 21:30", subject: "Redação", type: "standard" }],
    5: [{ time: "19:30 - 20:30", subject: "Revisão leve", type: "standard" }, { time: "20:30+", subject: "Descanso", type: "break" }],
    6: [{ time: "08:00 - 12:00", subject: "Último simulado completo", type: "simulado" }, { time: "14:00 - 15:30", subject: "Redação final", type: "redacao" }],
    0: [{ time: "O Dia Todo", subject: "Descanso total, confirmar local, separar documentos", type: "break" }],
  }
};
