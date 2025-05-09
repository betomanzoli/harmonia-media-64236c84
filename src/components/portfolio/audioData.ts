
export interface AudioExample {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  category: string[];
  featured?: boolean;
  imageUrl?: string;
  beforeUrl?: string;
  afterUrl?: string;
  tags?: string[];
  type?: string;
}

// Main array of audio examples
export const audioExamples: AudioExample[] = [
  {
    id: 'audio-1',
    title: 'Música para Casamento - Piano & Violino',
    description: 'Composição romântica para cerimônia de casamento',
    audioUrl: 'https://sample-music.com/wedding-piano-violin.mp3',
    category: ['Casamento', 'Piano', 'Violino', 'Romântico'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070',
    beforeUrl: 'https://sample-music.com/wedding-piano-before.mp3',
    afterUrl: 'https://sample-music.com/wedding-piano-after.mp3',
    tags: ['Casamento', 'Piano', 'Violino', 'Romântico'],
    type: 'wedding'
  },
  {
    id: 'audio-2',
    title: 'Música Corporativa para Vídeo Institucional',
    description: 'Trilha sonora profissional para apresentações empresariais',
    audioUrl: 'https://sample-music.com/corporate-music.mp3',
    category: ['Corporativo', 'Profissional', 'Vídeo'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
    tags: ['Corporativo', 'Profissional', 'Vídeo'],
    type: 'corporate'
  },
  {
    id: 'audio-3',
    title: 'Música Publicitária para TV',
    description: 'Jingle animado de 30 segundos para comercial de TV',
    audioUrl: 'https://sample-music.com/tv-commercial.mp3',
    category: ['Publicidade', 'TV', 'Jingle', 'Curto'],
    tags: ['Publicidade', 'TV', 'Jingle', 'Curto'],
    type: 'advertisement'
  },
  {
    id: 'audio-4',
    title: 'Declaração de Amor - Balada Romântica',
    description: 'Música personalizada com letra romântica para ocasiões especiais',
    audioUrl: 'https://sample-music.com/romantic-ballad.mp3',
    category: ['Romântico', 'Declaração', 'Vocal', 'Balada'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2070',
    beforeUrl: 'https://sample-music.com/romantic-before.mp3',
    afterUrl: 'https://sample-music.com/romantic-after.mp3',
    tags: ['Romântico', 'Declaração', 'Vocal', 'Balada'],
    type: 'romantic'
  },
  {
    id: 'audio-5',
    title: 'Trilha para Documentário',
    description: 'Composição orquestral para documentário sobre natureza',
    audioUrl: 'https://sample-music.com/documentary.mp3',
    category: ['Documentário', 'Orquestra', 'Natureza'],
    tags: ['Documentário', 'Orquestra', 'Natureza'],
    type: 'documentary'
  },
  {
    id: 'audio-6',
    title: 'Música para Podcast',
    description: 'Vinheta e trilha de fundo para podcast de entrevistas',
    audioUrl: 'https://sample-music.com/podcast-music.mp3',
    category: ['Podcast', 'Vinheta', 'Background'],
    tags: ['Podcast', 'Vinheta', 'Background'],
    type: 'podcast'
  }
];

// Add the missing exports that Portfolio.tsx is trying to import
export const initialExamples: AudioExample[] = audioExamples.slice(0, 3);
export const extraExamples: AudioExample[] = audioExamples.slice(3);
export const featuredExamples = audioExamples.filter(example => example.featured);
export const comparisonExamples = audioExamples.filter(example => example.beforeUrl && example.afterUrl);
