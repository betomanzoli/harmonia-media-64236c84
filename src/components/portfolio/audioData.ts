
export interface AudioExampleItem {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre: string;
  type: string;
}

export interface ComparisonExample {
  title: string;
  subtitle: string;
  versions: {
    name: string;
    audioSrc: string;
    description: string;
  }[];
  type: "comparison" | "stems";
}

export const initialExamples: AudioExampleItem[] = [
  {
    title: "Canção do Amor Familiar",
    subtitle: "Pacote Essencial - Aniversário",
    audioSrc: "/audio/exemplos/amor-familiar.mp3",
    genre: "Pop/Acústico",
    type: "completa"
  },
  {
    title: "Jingle Corporativo Tech Solutions",
    subtitle: "Pacote Profissional - Marketing",
    audioSrc: "/audio/exemplos/jingle-tech.mp3",
    genre: "Eletrônico/Corporativo",
    type: "completa"
  },
  {
    title: "Hino Oficial da Escola XYZ",
    subtitle: "Pacote Premium - Institucional",
    audioSrc: "/audio/exemplos/hino-escola.mp3",
    genre: "Orquestral/Coral",
    type: "completa"
  },
  {
    title: "Tema de Casamento para Maria e João",
    subtitle: "Pacote Essencial - Casamento",
    audioSrc: "/audio/exemplos/tema-casamento.mp3",
    genre: "Clássico/Romântico",
    type: "completa"
  }
];

export const extraExamples: AudioExampleItem[] = [
  {
    title: "Música Instrumental para Meditação",
    subtitle: "Pacote Profissional - Bem-estar",
    audioSrc: "/audio/exemplos/meditacao.mp3",
    genre: "Ambient/New Age",
    type: "instrumental"
  },
  {
    title: "Tema para Podcast Educativo",
    subtitle: "Pacote Essencial - Podcast",
    audioSrc: "/audio/exemplos/tema-podcast.mp3",
    genre: "Lo-fi/Instrumental",
    type: "instrumental"
  },
  {
    title: "Abertura para Canal no YouTube",
    subtitle: "Pacote Profissional - Digital",
    audioSrc: "/audio/exemplos/abertura-youtube.mp3",
    genre: "Eletrônico/Pop",
    type: "completa"
  },
  {
    title: "Trilha para Vídeo Institucional",
    subtitle: "Pacote Premium - Corporativo",
    audioSrc: "/audio/exemplos/trilha-institucional.mp3",
    genre: "Corporativo/Orquestral",
    type: "completa"
  }
];

export const comparisonExamples: ComparisonExample[] = [
  // Exemplo de comparação entre masterizado e não masterizado
  {
    title: "Comparação: Masterizado vs. Não Masterizado",
    subtitle: "Veja a diferença na qualidade sonora",
    versions: [
      {
        name: "Versão Não Masterizada",
        audioSrc: "/audio/comparacoes/nao-masterizado/exemplo1.mp3",
        description: "Mix básico sem ajustes finais"
      },
      {
        name: "Versão Masterizada",
        audioSrc: "/audio/comparacoes/masterizado/exemplo1.mp3",
        description: "Qualidade profissional com masterização"
      }
    ],
    type: "comparison"
  },
  // Exemplo de stems separados
  {
    title: "Stems Separados: Composição Rock",
    subtitle: "Ouça cada instrumento individualmente",
    versions: [
      {
        name: "Música Completa",
        audioSrc: "/audio/stems/completo/rock-exemplo.mp3",
        description: "Composição final com todos os instrumentos"
      },
      {
        name: "Vocal",
        audioSrc: "/audio/stems/vocal/rock-exemplo.mp3",
        description: "Apenas a faixa vocal"
      },
      {
        name: "Guitarra",
        audioSrc: "/audio/stems/guitarra/rock-exemplo.mp3",
        description: "Apenas a faixa de guitarra"
      },
      {
        name: "Bateria",
        audioSrc: "/audio/stems/bateria/rock-exemplo.mp3",
        description: "Apenas a faixa de bateria"
      },
      {
        name: "Baixo",
        audioSrc: "/audio/stems/baixo/rock-exemplo.mp3",
        description: "Apenas a faixa de baixo"
      }
    ],
    type: "stems"
  },
  // Comparação entre pacotes
  {
    title: "Comparação entre Pacotes: Música de Casamento",
    subtitle: "Ouça as diferenças entre os pacotes",
    versions: [
      {
        name: "Pacote Essencial",
        audioSrc: "/audio/comparacoes/pacote-essencial/casamento.mp3",
        description: "Qualidade básica, sem masterização"
      },
      {
        name: "Pacote Profissional",
        audioSrc: "/audio/comparacoes/pacote-profissional/casamento.mp3",
        description: "Com masterização e arranjo aprimorado"
      },
      {
        name: "Pacote Premium",
        audioSrc: "/audio/comparacoes/pacote-premium/casamento.mp3",
        description: "Com orquestra completa e masterização premium"
      }
    ],
    type: "comparison"
  }
];
