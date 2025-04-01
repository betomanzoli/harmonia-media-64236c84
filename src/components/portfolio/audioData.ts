
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
    audioSrc: "https://example.com/audio1.mp3",
    genre: "Pop/Acústico",
    type: "completa"
  },
  {
    title: "Jingle Corporativo Tech Solutions",
    subtitle: "Pacote Profissional - Marketing",
    audioSrc: "https://example.com/audio2.mp3",
    genre: "Eletrônico/Corporativo",
    type: "completa"
  },
  {
    title: "Hino Oficial da Escola XYZ",
    subtitle: "Pacote Premium - Institucional",
    audioSrc: "https://example.com/audio3.mp3",
    genre: "Orquestral/Coral",
    type: "completa"
  },
  {
    title: "Tema de Casamento para Maria e João",
    subtitle: "Pacote Essencial - Casamento",
    audioSrc: "https://example.com/audio4.mp3",
    genre: "Clássico/Romântico",
    type: "completa"
  }
];

export const extraExamples: AudioExampleItem[] = [
  {
    title: "Música Instrumental para Meditação",
    subtitle: "Pacote Profissional - Bem-estar",
    audioSrc: "https://example.com/audio5.mp3",
    genre: "Ambient/New Age",
    type: "instrumental"
  },
  {
    title: "Tema para Podcast Educativo",
    subtitle: "Pacote Essencial - Podcast",
    audioSrc: "https://example.com/audio6.mp3",
    genre: "Lo-fi/Instrumental",
    type: "instrumental"
  },
  {
    title: "Abertura para Canal no YouTube",
    subtitle: "Pacote Profissional - Digital",
    audioSrc: "https://example.com/audio7.mp3",
    genre: "Eletrônico/Pop",
    type: "completa"
  },
  {
    title: "Trilha para Vídeo Institucional",
    subtitle: "Pacote Premium - Corporativo",
    audioSrc: "https://example.com/audio8.mp3",
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
        audioSrc: "https://example.com/not-mastered.mp3",
        description: "Mix básico sem ajustes finais"
      },
      {
        name: "Versão Masterizada",
        audioSrc: "https://example.com/mastered.mp3",
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
        audioSrc: "https://example.com/full-rock.mp3",
        description: "Composição final com todos os instrumentos"
      },
      {
        name: "Vocal",
        audioSrc: "https://example.com/vocal-stem.mp3",
        description: "Apenas a faixa vocal"
      },
      {
        name: "Guitarra",
        audioSrc: "https://example.com/guitar-stem.mp3",
        description: "Apenas a faixa de guitarra"
      },
      {
        name: "Bateria",
        audioSrc: "https://example.com/drum-stem.mp3",
        description: "Apenas a faixa de bateria"
      },
      {
        name: "Baixo",
        audioSrc: "https://example.com/bass-stem.mp3",
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
        audioSrc: "https://example.com/wedding-basic.mp3",
        description: "Qualidade básica, sem masterização"
      },
      {
        name: "Pacote Profissional",
        audioSrc: "https://example.com/wedding-pro.mp3",
        description: "Com masterização e arranjo aprimorado"
      },
      {
        name: "Pacote Premium",
        audioSrc: "https://example.com/wedding-premium.mp3",
        description: "Com orquestra completa e masterização premium"
      }
    ],
    type: "comparison"
  }
];
