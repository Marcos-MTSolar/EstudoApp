import React, { useState, useEffect } from 'react';
import { format, subDays, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Dumbbell, HeartPulse, CheckCircle2, Circle, ChevronLeft, 
  ChevronRight, Activity, CalendarDays, Brain, Sparkles, 
  Award, Flame, GlassWater, Smile, Moon, AlertCircle, BookOpen, Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Legend 
} from 'recharts';

// Tipos
interface RegistroDiario {
  data: string; // YYYY-MM-DD
  humor: number; // 1-5
  horasSono: number;
  qualidadeSono: 'ruim' | 'regular' | 'boa' | 'excelente';
  agua: number; // Litros
  atividadeFisica: boolean;
  tipoAtividade?: 'caminhada' | 'corrida' | 'musculação' | 'natação' | 'ciclismo' | 'outro';
  duracaoAtividade?: number; // Minutos
  alimentacao: 'ruim' | 'regular' | 'boa' | 'excelente';
  estresse: number; // 1-5
  observacoes?: string;
}

interface ExerciciosConcluidos {
  [data: string]: string[]; // data -> array de exercicio.id
}

interface HabitosDiarios {
  [data: string]: {
    sono7h: boolean;
    agua2l: boolean;
    atividade: boolean;
    pomodoro: boolean;
    semRedesSociais: boolean;
  };
}

// Exercícios Organizados
const EXERCICIOS_DATA = {
  alongamento: [
    { id: 'alon-01', nome: 'Rotação de pescoço', desc: '3x cada lado, 30 segundos' },
    { id: 'alon-02', nome: 'Alongamento de trapézio', desc: '30 segundos de cada lado' },
    { id: 'alon-03', nome: 'Alongamento de punhos e antebraços', desc: '30 segundos' },
    { id: 'alon-04', nome: 'Rotação de ombros para trás', desc: '10 repetições' },
    { id: 'alon-05', nome: 'Torção de coluna sentado', desc: '30 segundos cada lado' },
    { id: 'alon-06', nome: 'Alongamento de isquiotibiais em pé', desc: '30 segundos cada lado' },
    { id: 'alon-07', nome: 'Flexão lateral de tronco', desc: '15 segundos cada lado' }
  ],
  semEquipamento: [
    { id: 'eq-01', nome: 'Agachamento livre', desc: '3 séries de 15 repetições' },
    { id: 'eq-02', nome: 'Flexão de braço', desc: '3 séries de 10 repetições (use apoio de joelho se necessário)' },
    { id: 'eq-03', nome: 'Prancha abdominal', desc: '3 séries de 30 segundos' },
    { id: 'eq-04', nome: 'Afundo alternado', desc: '3 séries de 10 repetições cada perna' },
    { id: 'eq-05', nome: 'Abdominal crunch', desc: '3 séries de 20 repetições' },
    { id: 'eq-06', nome: 'Burpee', desc: '3 séries de 8 repetições' },
    { id: 'eq-07', nome: 'Mountain climber', desc: '3 séries de 20 repetições' },
    { id: 'eq-08', nome: 'Polichinelo', desc: '3 séries de 30 repetições' },
    { id: 'eq-09', nome: 'Ponte glúteo', desc: '3 séries de 15 repetições' },
    { id: 'eq-10', nome: 'Superman', desc: 'Deitado de bruços, elevação simultânea, 3 séries de 12 repetições' }
  ],
  cardioLeve: [
    { id: 'car-01', nome: 'Caminhada leve', desc: 'Duração: 20 a 30 minutos (nível: leve)' },
    { id: 'car-02', nome: 'Caminhada rápida', desc: 'Duração: 20 minutos (nível: moderado)' },
    { id: 'car-03', nome: 'Pular corda', desc: 'Duração: 10 minutos (nível: moderado)' },
    { id: 'car-04', nome: 'Subir e descer escada', desc: 'Duração: 10 minutos (nível: moderado)' },
    { id: 'car-05', nome: 'Corrida leve', desc: 'Duração: 20 minutos (nível: moderado)' }
  ]
};

// 31 Frases Motivacionais (uma para cada dia do mês)
const FRASES_MOTIVACIONAIS = [
  "A disciplina é a ponte entre metas e realizações.",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Não pare até se orgulhar de você mesmo.",
  "A consistência supera o talento quando o talento não é consistente.",
  "Você não precisa ser excelente para começar, mas precisa começar para ser excelente.",
  "Foque no processo, o resultado é consequência.",
  "A sua aprovação é esculpida nos dias em que você estuda mesmo sem vontade.",
  "A maré alta eleva todos os barcos. Mantenha o foco na sua preparação.",
  "Estudar é o seu trabalho atual. Faça-o com excelência.",
  "Sua mente desistirá mil vezes antes do seu corpo. Continue.",
  "O caminho pode ser longo, mas a vitória é eterna.",
  "Nenhum obstáculo é grande demais quando sua vontade de vencer é maior.",
  "Quem tem um 'porquê' enfrenta qualquer 'como'. Lembre-se do seu propósito.",
  "A dor do esforço é temporária, mas a dor do arrependimento é permanente.",
  "Suba o primeiro degrau com fé. Você não precisa ver toda a escada, apenas dê o primeiro passo.",
  "Grandes conquistas exigem tempo, paciência e resiliência.",
  "Transforme a pressão em combustível para o seu crescimento.",
  "A diferença entre o impossível e o possível está na determinação.",
  "O que você faz hoje determina quem você será amânha.",
  "Seja mais forte do que a sua melhor desculpa.",
  "A preparação de hoje é a tranquilidade de amanhã na prova.",
  "Confie no processo e celebre cada pequena vitória.",
  "O seu único limite é a quantidade de esforço que você está disposto a empenhar.",
  "Cada hora de estudo te deixa mais perto da farda de Oficial.",
  "Não estude para passar, estude até passar.",
  "A inteligência sem disciplina é como um motor sem combustível.",
  "A calmaria não faz bons marinheiros. Seja forte na tempestade.",
  "Mantenha a cabeça fria, o coração quente e o foco afiado.",
  "Você é capaz de aprender tudo o que se propõe a estudar.",
  "A persistência realiza o impossível.",
  "O destino do perseverante é a aprovação."
];

// Dados default de demonstração caso o usuário não tenha registros ainda
const DEMO_REGISTROS: RegistroDiario[] = [
  { data: format(subDays(new Date(), 6), 'yyyy-MM-dd'), humor: 4, horasSono: 7.5, qualidadeSono: 'boa', agua: 2.25, atividadeFisica: true, tipoAtividade: 'musculação', duracaoAtividade: 45, alimentacao: 'boa', estresse: 3 },
  { data: format(subDays(new Date(), 5), 'yyyy-MM-dd'), humor: 3, horasSono: 6.5, qualidadeSono: 'regular', agua: 1.75, atividadeFisica: false, alimentacao: 'regular', estresse: 4 },
  { data: format(subDays(new Date(), 4), 'yyyy-MM-dd'), humor: 4, horasSono: 8.0, qualidadeSono: 'excelente', agua: 2.5, atividadeFisica: true, tipoAtividade: 'caminhada', duracaoAtividade: 30, alimentacao: 'boa', estresse: 2 },
  { data: format(subDays(new Date(), 3), 'yyyy-MM-dd'), humor: 5, horasSono: 7.0, qualidadeSono: 'boa', agua: 3.0, atividadeFisica: true, tipoAtividade: 'corrida', duracaoAtividade: 20, alimentacao: 'excelente', estresse: 2 },
  { data: format(subDays(new Date(), 2), 'yyyy-MM-dd'), humor: 3, horasSono: 6.0, qualidadeSono: 'regular', agua: 1.5, atividadeFisica: false, alimentacao: 'ruim', estresse: 4 },
  { data: format(subDays(new Date(), 1), 'yyyy-MM-dd'), humor: 4, horasSono: 7.5, qualidadeSono: 'boa', agua: 2.25, atividadeFisica: true, tipoAtividade: 'musculação', duracaoAtividade: 50, alimentacao: 'boa', estresse: 3 },
  { data: format(new Date(), 'yyyy-MM-dd'), humor: 4, horasSono: 8.0, qualidadeSono: 'excelente', agua: 2.5, atividadeFisica: true, tipoAtividade: 'corrida', duracaoAtividade: 20, alimentacao: 'boa', estresse: 2 }
];

export function RM2Saude() {
  const [activeTab, setActiveTab] = useState<'registro' | 'evolucao' | 'exercicios' | 'motivacao'>('registro');
  
  // Estados de dados
  const [registros, setRegistros] = useState<RegistroDiario[]>([]);
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState<ExerciciosConcluidos>({});
  const [habitosDiarios, setHabitosDiarios] = useState<HabitosDiarios>({});
  
  // Estado do formulário de Registro Diário
  const [formData, setFormData] = useState<Partial<RegistroDiario>>({
    data: format(new Date(), 'yyyy-MM-dd'),
    humor: 3,
    horasSono: 7.0,
    qualidadeSono: 'boa',
    agua: 2.0,
    atividadeFisica: false,
    tipoAtividade: 'caminhada',
    duracaoAtividade: 20,
    alimentacao: 'boa',
    estresse: 3,
    observacoes: ''
  });

  const [savingMessage, setSavingMessage] = useState<string>('');

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    const savedRegs = localStorage.getItem('rm2_saude_diarios');
    if (savedRegs) {
      try {
        setRegistros(JSON.parse(savedRegs));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Inicia com dados de demonstração para os gráficos ficarem cheios no início
      setRegistros(DEMO_REGISTROS);
      localStorage.setItem('rm2_saude_diarios', JSON.stringify(DEMO_REGISTROS));
    }

    const savedExs = localStorage.getItem('rm2_saude_exercicios_concluidos');
    if (savedExs) {
      try { setExerciciosConcluidos(JSON.parse(savedExs)); } catch (e) { console.error(e); }
    }

    const savedHabits = localStorage.getItem('rm2_saude_habitos_diarios');
    if (savedHabits) {
      try { setHabitosDiarios(JSON.parse(savedHabits)); } catch (e) { console.error(e); }
    }
  }, []);

  // Preenche o formulário se já existir registro para a data selecionada
  useEffect(() => {
    if (formData.data) {
      const regExistente = registros.find(r => r.data === formData.data);
      if (regExistente) {
        setFormData(regExistente);
      } else {
        setFormData({
          data: formData.data,
          humor: 3,
          horasSono: 7.0,
          qualidadeSono: 'boa',
          agua: 2.0,
          atividadeFisica: false,
          tipoAtividade: 'caminhada',
          duracaoAtividade: 20,
          alimentacao: 'boa',
          estresse: 3,
          observacoes: ''
        });
      }
    }
  }, [formData.data, registros]);

  // Salvar registro
  const handleSalvarRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.data) return;

    const novoRegistro = { ...formData } as RegistroDiario;
    let novosRegistros = [...registros];

    const idx = novosRegistros.findIndex(r => r.data === novoRegistro.data);
    if (idx !== -1) {
      novosRegistros[idx] = novoRegistro;
      setSavingMessage('Registro atualizado com sucesso! ✓');
    } else {
      novosRegistros.push(novoRegistro);
      setSavingMessage('Registro diário salvo com sucesso! ✓');
    }

    // Ordena por data
    novosRegistros.sort((a, b) => a.data.localeCompare(b.data));

    setRegistros(novosRegistros);
    localStorage.setItem('rm2_saude_diarios', JSON.stringify(novosRegistros));

    setTimeout(() => setSavingMessage(''), 3000);
  };

  // Toggle Conclusão de Exercício
  const toggleExercicioConcluido = (id: string) => {
    const hojeStr = format(new Date(), 'yyyy-MM-dd');
    const concluidosHoje = exerciciosConcluidos[hojeStr] || [];
    let novosConcluidos: string[];

    if (concluidosHoje.includes(id)) {
      novosConcluidos = concluidosHoje.filter(x => x !== id);
    } else {
      novosConcluidos = [...concluidosHoje, id];
    }

    const novoEstado = { ...exerciciosConcluidos, [hojeStr]: novosConcluidos };
    setExerciciosConcluidos(novoEstado);
    localStorage.setItem('rm2_saude_exercicios_concluidos', JSON.stringify(novoEstado));
  };

  // Toggle Hábito Diário na aba Motivação
  const toggleHabito = (key: keyof HabitosDiarios[string]) => {
    const hojeStr = format(new Date(), 'yyyy-MM-dd');
    const habitosHoje = habitosDiarios[hojeStr] || {
      sono7h: false,
      agua2l: false,
      atividade: false,
      pomodoro: false,
      semRedesSociais: false
    };

    const novoHabitosHoje = { ...habitosHoje, [key]: !habitosHoje[key] };
    const novoEstado = { ...habitosDiarios, [hojeStr]: novoHabitosHoje };
    setHabitosDiarios(novoEstado);
    localStorage.setItem('rm2_saude_habitos_diarios', JSON.stringify(novoEstado));
  };

  // Cálculos de Streak de registros consecutivos
  const getStreak = () => {
    if (registros.length === 0) return 0;
    
    // Lista de datas únicas ordenadas de forma reversa (da mais nova para a mais antiga)
    const datas = registros.map(r => r.data).sort((a, b) => b.localeCompare(a));
    const hojeStr = format(new Date(), 'yyyy-MM-dd');
    const ontemStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    // Se o último registro não for nem hoje nem ontem, o streak quebrou (0)
    if (datas[0] !== hojeStr && datas[0] !== ontemStr) {
      return 0;
    }

    let streak = 0;
    let dataReferencia = parseISO(datas[0]);

    for (let i = 0; i < datas.length; i++) {
      const dataAtual = parseISO(datas[i]);
      const diff = differenceInDays(dataReferencia, dataAtual);

      if (diff === 0) {
        streak++;
      } else if (diff === 1) {
        streak++;
        dataReferencia = dataAtual;
      } else {
        break; // Quebrou a sequência
      }
    }
    return streak;
  };

  // Dados para gráficos (últimos 14 dias)
  const getDadosGraficos = () => {
    const ultimos14Dias: any[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dataStr = format(d, 'yyyy-MM-dd');
      const reg = registros.find(r => r.data === dataStr);

      ultimos14Dias.push({
        name: format(d, 'dd/MM'),
        horasSono: reg ? reg.horasSono : 0,
        agua: reg ? reg.agua : 0,
        estresse: reg ? reg.estresse : 0,
        atividadeFisica: reg && reg.atividadeFisica ? (reg.duracaoAtividade || 0) : 0,
        dataCompleta: dataStr
      });
    }
    return ultimos14Dias;
  };

  const dadosGraficos = getDadosGraficos();

  // Cálculo de Médias (últimos 7 dias)
  const getMediasUltimos7Dias = () => {
    let somaSono = 0;
    let somaAgua = 0;
    let diasComAtividade = 0;
    const contagemHumor: Record<number, number> = {};
    let totalComDados = 0;

    for (let i = 0; i < 7; i++) {
      const dataStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const reg = registros.find(r => r.data === dataStr);
      if (reg) {
        somaSono += reg.horasSono;
        somaAgua += reg.agua;
        if (reg.atividadeFisica) diasComAtividade++;
        contagemHumor[reg.humor] = (contagemHumor[reg.humor] || 0) + 1;
        totalComDados++;
      }
    }

    let humorPredominante = 3;
    let maxContagem = 0;
    Object.entries(contagemHumor).forEach(([h, count]) => {
      if (count > maxContagem) {
        maxContagem = count;
        humorPredominante = Number(h);
      }
    });

    return {
      mediaSono: totalComDados > 0 ? (somaSono / totalComDados).toFixed(1) : '0',
      mediaAgua: totalComDados > 0 ? (somaAgua / totalComDados).toFixed(2) : '0',
      diasComAtividade,
      humorPredominante
    };
  };

  const medias7Dias = getMediasUltimos7Dias();

  // Mapeia o emoji correspondente ao humor
  const getHumorEmoji = (nivel: number) => {
    switch (nivel) {
      case 1: return '😞 (Péssimo)';
      case 2: return '😕 (Ruim)';
      case 3: return '😐 (Ok)';
      case 4: return '🙂 (Bom)';
      case 5: return '😄 (Excelente)';
      default: return '😐';
    }
  };

  // Frase do dia
  const diaDoMes = new Date().getDate();
  const fraseDoDia = FRASES_MOTIVACIONAIS[(diaDoMes - 1) % FRASES_MOTIVACIONAIS.length];

  // Semana do cronograma
  const [semanaCronograma, setSemanaCronograma] = useState<string>('');
  useEffect(() => {
    const savedSemana = localStorage.getItem('rm2_semana_atual');
    if (savedSemana) {
      setSemanaCronograma(savedSemana);
    } else {
      // Cálculo dinâmico alternativo baseado no cronograma
      const hoje = new Date();
      if (hoje <= new Date(2026, 5, 14)) setSemanaCronograma('Semana 1 — Morfologia Fundacional');
      else if (hoje <= new Date(2026, 5, 21)) setSemanaCronograma('Semana 2 — Morfologia Flexional');
      else if (hoje <= new Date(2026, 5, 28)) setSemanaCronograma('Semana 3 — Ortografia e Acentuação');
      else setSemanaCronograma('Semana Ativa de Estudos');
    }
  }, []);

  const hojeStr = format(new Date(), 'yyyy-MM-dd');
  const habitosHoje = habitosDiarios[hojeStr] || {
    sono7h: false,
    agua2l: false,
    atividade: false,
    pomodoro: false,
    semRedesSociais: false
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/30 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-black text-white">Saúde & Bem-Estar do Candidato</h1>
              <p className="text-xs text-gray-400">O cérebro saudável aprende mais rápido. Monitore e cuide-se diariamente.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 bg-black/30 border border-border p-2.5 rounded-2xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Registro Consecutivo</p>
              <p className="text-sm font-black text-white font-mono">{getStreak()} Dias de Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/60">
        {(
          [
            { id: 'registro', label: '📋 Registro Diário' },
            { id: 'evolucao', label: '📊 Evolução (Gráficos)' },
            { id: 'exercicios', label: '🏋️ Exercícios Recomendados' },
            { id: 'motivacao', label: '💡 Mentalidade & Foco' }
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Renderização das Abas */}
      {activeTab === 'registro' && (
        <form onSubmit={handleSalvarRegistro} className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-black text-white">Ficha de Acompanhamento Diário</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold">Data:</span>
              <input
                type="date"
                value={formData.data || ''}
                onChange={e => setFormData({ ...formData, data: e.target.value })}
                className="bg-black/20 border border-border px-3 py-1.5 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Humor */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">Como está seu humor hoje?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, humor: lvl })}
                    className={`flex-1 py-2 rounded-xl text-lg transition-all border ${
                      formData.humor === lvl
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-black/20 border-border hover:border-gray-500'
                    }`}
                  >
                    {lvl === 1 ? '😞' : lvl === 2 ? '😕' : lvl === 3 ? '😐' : lvl === 4 ? '🙂' : '😄'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 text-right">{getHumorEmoji(formData.humor || 3)}</p>
            </div>

            {/* Nível de Estresse */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">Nível de Estresse / Ansiedade</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, estresse: lvl })}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                      formData.estresse === lvl
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-black/20 border-border text-gray-400'
                    }`}
                  >
                    {lvl === 1 ? 'M. Baixo' : lvl === 2 ? 'Baixo' : lvl === 3 ? 'Médio' : lvl === 4 ? 'Alto' : 'Crítico'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sono */}
            <div className="space-y-2 bg-black/10 p-4 border border-border/40 rounded-2xl">
              <label className="text-xs font-bold text-gray-300 block flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" /> Horas de Sono Realizadas
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={formData.horasSono || 0}
                  onChange={e => setFormData({ ...formData, horasSono: parseFloat(e.target.value) || 0 })}
                  className="w-24 bg-black/20 border border-border px-3 py-2 rounded-xl text-sm font-bold text-center text-white focus:outline-none"
                />
                <span className="text-xs text-gray-400 font-bold">horas</span>
              </div>

              <div className="pt-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-1">Qualidade do Sono</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['ruim', 'regular', 'boa', 'excelente'] as const).map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setFormData({ ...formData, qualidadeSono: q })}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                        formData.qualidadeSono === q
                          ? 'bg-indigo-600/35 border-indigo-400 text-indigo-200'
                          : 'bg-black/10 border-border/60 text-gray-400'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Água */}
            <div className="space-y-2 bg-black/10 p-4 border border-border/40 rounded-2xl">
              <label className="text-xs font-bold text-gray-300 block flex items-center gap-2">
                <GlassWater className="w-4 h-4 text-blue-400" /> Água Ingerida (Litros)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="6"
                  step="0.25"
                  value={formData.agua || 0}
                  onChange={e => setFormData({ ...formData, agua: parseFloat(e.target.value) || 0 })}
                  className="w-24 bg-black/20 border border-border px-3 py-2 rounded-xl text-sm font-bold text-center text-white focus:outline-none"
                />
                <span className="text-xs text-gray-400 font-bold">L</span>
                <div className="flex gap-1">
                  {[1.0, 2.0, 3.0].map(vol => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setFormData({ ...formData, agua: vol })}
                      className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-black border border-blue-500/20 rounded-md"
                    >
                      {vol}L
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Atividade Física */}
            <div className="space-y-3 bg-black/10 p-4 border border-border/40 rounded-2xl md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-indigo-400" /> Praticou atividade física hoje?
                </label>
                <div className="flex gap-2">
                  {[true, false].map((val) => (
                    <button
                      key={val ? 'sim' : 'nao'}
                      type="button"
                      onClick={() => setFormData({ ...formData, atividadeFisica: val })}
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                        formData.atividadeFisica === val
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-black/20 border-border text-gray-400'
                      }`}
                    >
                      {val ? 'Sim' : 'Não'}
                    </button>
                  ))}
                </div>
              </div>

              {formData.atividadeFisica && (
                <div className="grid md:grid-cols-2 gap-3 pt-2 animate-in fade-in duration-200">
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-500 block mb-1">Modalidade</label>
                    <select
                      value={formData.tipoAtividade || 'caminhada'}
                      onChange={e => setFormData({ ...formData, tipoAtividade: e.target.value as any })}
                      className="w-full bg-black/30 border border-border px-3 py-2 rounded-xl text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="caminhada">🚶 Caminhada</option>
                      <option value="corrida">🏃 Corrida</option>
                      <option value="musculação">💪 Musculação</option>
                      <option value="natação">🏊 Natação</option>
                      <option value="ciclismo">🚴 Ciclismo</option>
                      <option value="outro">🔥 Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-gray-500 block mb-1">Duração (Minutos)</label>
                    <input
                      type="number"
                      min="5"
                      max="200"
                      step="5"
                      value={formData.duracaoAtividade || 20}
                      onChange={e => setFormData({ ...formData, duracaoAtividade: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black/30 border border-border px-3 py-1.5 rounded-xl text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Alimentação */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">Qualidade da Alimentação</label>
              <div className="grid grid-cols-4 gap-1">
                {(['ruim', 'regular', 'boa', 'excelente'] as const).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setFormData({ ...formData, alimentacao: a })}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                      formData.alimentacao === a
                        ? 'bg-indigo-600/35 border-indigo-400 text-indigo-200 shadow'
                        : 'bg-black/10 border-border/60 text-gray-400'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-300 block">Notas Pessoais / Sintomas / Dores (Opcional)</label>
              <textarea
                rows={3}
                placeholder="Ex: Senti dor de cabeça à tarde. Estudo fluiu bem pela manhã."
                value={formData.observacoes || ''}
                onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full bg-black/20 border border-border p-3.5 rounded-2xl text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              {registros.some(r => r.data === formData.data) ? 'Editar Registro' : 'Salvar Registro do Dia'}
            </button>
            {savingMessage && (
              <span className="text-xs text-emerald-400 font-bold animate-pulse">{savingMessage}</span>
            )}
          </div>
        </form>
      )}

      {activeTab === 'evolucao' && (
        <div className="space-y-6">
          
          {/* CARDS DE RESUMO (7 DIAS) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface border border-border p-4 rounded-2xl text-center space-y-1">
              <Moon className="w-5 h-5 text-indigo-400 mx-auto" />
              <p className="text-[10px] uppercase font-black text-gray-500">Média de Sono</p>
              <p className="text-lg font-black text-white font-mono">{medias7Dias.mediaSono}h</p>
              <p className="text-[9px] text-gray-400">Meta: 7h a 8h</p>
            </div>

            <div className="bg-surface border border-border p-4 rounded-2xl text-center space-y-1">
              <GlassWater className="w-5 h-5 text-blue-400 mx-auto" />
              <p className="text-[10px] uppercase font-black text-gray-500">Média de Água</p>
              <p className="text-lg font-black text-white font-mono">{medias7Dias.mediaAgua}L</p>
              <p className="text-[9px] text-gray-400">Meta: 2.0L+</p>
            </div>

            <div className="bg-surface border border-border p-4 rounded-2xl text-center space-y-1">
              <Dumbbell className="w-5 h-5 text-emerald-400 mx-auto" />
              <p className="text-[10px] uppercase font-black text-gray-500">Atividades Físicas</p>
              <p className="text-lg font-black text-white font-mono">{medias7Dias.diasComAtividade} dias</p>
              <p className="text-[9px] text-gray-400">Nos últimos 7 dias</p>
            </div>

            <div className="bg-surface border border-border p-4 rounded-2xl text-center space-y-1">
              <Smile className="w-5 h-5 text-amber-400 mx-auto" />
              <p className="text-[10px] uppercase font-black text-gray-500">Humor Predominante</p>
              <p className="text-sm font-black text-white mt-1">
                {medias7Dias.humorPredominante === 5 ? '😄 Excelente' : medias7Dias.humorPredominante === 4 ? '🙂 Bom' : '😐 Ok'}
              </p>
              <p className="text-[9px] text-gray-400">Escala de 1 a 5</p>
            </div>
          </div>

          {/* GRÁFICOS */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Gráfico 1: Sono */}
            <div className="bg-surface border border-border rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">1. Horas de Sono por Dia (14 dias)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGraficos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Line type="monotone" dataKey="horasSono" name="Sono (h)" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico 2: Água */}
            <div className="bg-surface border border-border rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">2. Consumo de Água (L / dia)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Bar dataKey="agua" name="Água (L)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico 3: Nível de Estresse */}
            <div className="bg-surface border border-border rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">3. Nível de Estresse Diário</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosGraficos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} domain={[1, 5]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Line type="monotone" dataKey="estresse" name="Estresse" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico 4: Minutos de Atividade Física */}
            <div className="bg-surface border border-border rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">4. Minutos de Atividade Física</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                    <Bar dataKey="atividadeFisica" name="Atividade (min)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'exercicios' && (
        <div className="space-y-6">
          
          {/* PAINEL DE ORIENTAÇÕES / ROTINAS RECOMENDADAS */}
          <div className="bg-slate-900/60 border border-border rounded-3xl p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Rotina Diária de Estudo (Seg-Sex)
              </h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">Manhã:</span> 5 min de alongamento geral antes de abrir os livros.
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">Metade:</span> Pausa ativa de 5 min com exercícios sem equipamentos.
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400 font-bold">Fim do dia:</span> 20 min de cardio leve para limpar a mente e descontrair.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Rotina Especial Sábado (Meta 4h)
              </h3>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex gap-2">
                  <span className="text-orange-400 font-bold">Antes:</span> 10 min de alongamento completo.
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-400 font-bold">Pausa (2h):</span> 10 min de pausa ativa (agachamentos + flexões + prancha).
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-400 font-bold">Final:</span> 30 min de caminhada rápida ao ar livre.
                </li>
              </ul>
            </div>
          </div>

          {/* LISTAGEM DE EXERCÍCIOS POR CATEGORIA */}
          <div className="space-y-5">
            
            {/* 1. ALONGAMENTO */}
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-heading font-black text-white uppercase tracking-wider">
                🧘‍♂️ Alongamento (Alívio de postura sentada)
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {EXERCICIOS_DATA.alongamento.map(ex => {
                  const concluido = (exerciciosConcluidos[format(new Date(), 'yyyy-MM-dd')] || []).includes(ex.id);
                  return (
                    <div key={ex.id} className="flex items-center justify-between p-3.5 bg-black/15 border border-border/60 hover:border-border rounded-xl transition-all">
                      <div>
                        <h4 className="text-xs font-black text-white">{ex.nome}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{ex.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleExercicioConcluido(ex.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          concluido 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white'
                        }`}
                      >
                        {concluido ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Circle className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. SEM EQUIPAMENTO */}
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-heading font-black text-white uppercase tracking-wider">
                🏋️ Exercícios sem Equipamento (Treino funcional)
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {EXERCICIOS_DATA.semEquipamento.map(ex => {
                  const concluido = (exerciciosConcluidos[format(new Date(), 'yyyy-MM-dd')] || []).includes(ex.id);
                  return (
                    <div key={ex.id} className="flex items-center justify-between p-3.5 bg-black/15 border border-border/60 hover:border-border rounded-xl transition-all">
                      <div>
                        <h4 className="text-xs font-black text-white">{ex.nome}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{ex.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleExercicioConcluido(ex.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          concluido 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white'
                        }`}
                      >
                        {concluido ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Circle className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. CARDIO LEVE */}
            <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-heading font-black text-white uppercase tracking-wider">
                🏃 Cardio Leve (Descompressão e energia)
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {EXERCICIOS_DATA.cardioLeve.map(ex => {
                  const concluido = (exerciciosConcluidos[format(new Date(), 'yyyy-MM-dd')] || []).includes(ex.id);
                  return (
                    <div key={ex.id} className="flex items-center justify-between p-3.5 bg-black/15 border border-border/60 hover:border-border rounded-xl transition-all">
                      <div>
                        <h4 className="text-xs font-black text-white">{ex.nome}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{ex.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleExercicioConcluido(ex.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          concluido 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white'
                        }`}
                      >
                        {concluido ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Circle className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'motivacao' && (
        <div className="space-y-6">
          
          {/* FRASE DO DIA */}
          <div className="bg-gradient-to-br from-indigo-650/40 to-purple-800/10 border border-indigo-500/30 p-6 rounded-3xl space-y-2 text-center">
            <Sparkles className="w-7 h-7 text-yellow-400 mx-auto animate-bounce" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Frase do Dia</h3>
            <p className="text-sm font-black text-white leading-relaxed italic max-w-xl mx-auto">
              "{fraseDoDia}"
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* MINI CHECKLIST DE HÁBITOS DIÁRIOS (LARGURA 7/12) */}
            <div className="md:col-span-7 bg-surface border border-border rounded-3xl p-6 space-y-5">
              <div>
                <h3 className="text-sm font-heading font-black text-white">Hábitos Diários de Performance</h3>
                <p className="text-[10px] text-gray-500">Marque as metas de saúde do dia de hoje para fixar a rotina</p>
              </div>

              <div className="space-y-3">
                {/* 1. Sono */}
                <button
                  onClick={() => toggleHabito('sono7h')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left text-xs font-bold ${
                    habitosHoje.sono7h 
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300' 
                      : 'bg-black/15 border-border hover:border-gray-500 text-gray-400'
                  }`}
                >
                  {habitosHoje.sono7h ? <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0" /> : <Circle className="w-4.5 h-4.5 shrink-0" />}
                  <span>Dormi pelo menos 7 horas</span>
                </button>

                {/* 2. Água */}
                <button
                  onClick={() => toggleHabito('agua2l')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left text-xs font-bold ${
                    habitosHoje.agua2l 
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300' 
                      : 'bg-black/15 border-border hover:border-gray-500 text-gray-400'
                  }`}
                >
                  {habitosHoje.agua2l ? <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0" /> : <Circle className="w-4.5 h-4.5 shrink-0" />}
                  <span>Bebi pelo menos 2L de água</span>
                </button>

                {/* 3. Atividade */}
                <button
                  onClick={() => toggleHabito('atividade')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left text-xs font-bold ${
                    habitosHoje.atividade 
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300' 
                      : 'bg-black/15 border-border hover:border-gray-500 text-gray-400'
                  }`}
                >
                  {habitosHoje.atividade ? <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0" /> : <Circle className="w-4.5 h-4.5 shrink-0" />}
                  <span>Fiz atividade física</span>
                </button>

                {/* 4. Pomodoro */}
                <button
                  onClick={() => toggleHabito('pomodoro')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left text-xs font-bold ${
                    habitosHoje.pomodoro 
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300' 
                      : 'bg-black/15 border-border hover:border-gray-500 text-gray-400'
                  }`}
                >
                  {habitosHoje.pomodoro ? <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0" /> : <Circle className="w-4.5 h-4.5 shrink-0" />}
                  <span>Fiz pausas ativas a cada 50 min de estudo (Pomodoro)</span>
                </button>

                {/* 5. Redes Sociais */}
                <button
                  onClick={() => toggleHabito('semRedesSociais')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left text-xs font-bold ${
                    habitosHoje.semRedesSociais 
                      ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300' 
                      : 'bg-black/15 border-border hover:border-gray-500 text-gray-400'
                  }`}
                >
                  {habitosHoje.semRedesSociais ? <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 shrink-0" /> : <Circle className="w-4.5 h-4.5 shrink-0" />}
                  <span>Fiquei 100% longe das redes sociais durante o estudo</span>
                </button>
              </div>
            </div>

            {/* INTEGRACAO CRONOGRAMA & STATUS (LARGURA 5/12) */}
            <div className="md:col-span-5 bg-surface border border-border rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Sua Semana no Cronograma</h3>
              </div>

              {semanaCronograma ? (
                <div className="p-4 bg-black/25 border border-border/60 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    Fase Ativa
                  </span>
                  <p className="text-xs font-black text-white leading-snug">{semanaCronograma}</p>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    Lembre-se: manter hábitos de saúde potencializa a retenção do conteúdo estudado nesta semana.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Cronograma não iniciado ou semana não definida.</p>
              )}

              <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-300/80 leading-normal">
                  Dica: tente manter uma constância de sono (mesmo horário de dormir e acordar). Isso estabiliza seu ritmo circadiano.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
