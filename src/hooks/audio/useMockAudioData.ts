
import { AudioSample } from '@/types/audio';

export const getMockAudioSamples = (): AudioSample[] => {
  return [
    {
      id: '1',
      title: 'Música Ambiente Alegre',
      genre: 'Pop',
      url: 'https://storage.googleapis.com/harmonia-media/samples/ambient_happy.mp3',
      audio_url: 'https://storage.googleapis.com/harmonia-media/samples/ambient_happy.mp3',
      description: 'Música ambiente alegre e positiva, perfeita para vídeos corporativos',
      artist: 'harmonIA',
      tags: ['alegre', 'positiva', 'corporativo'],
      duration: '2:45',
      dateAdded: '2023-09-15',
      fileSize: 4.2,
      style: 'Moderno',
      mood: 'Alegre',
      occasion: 'Corporativo'
    },
    {
      id: '2',
      title: 'Piano Emocional',
      genre: 'Clássico',
      url: 'https://storage.googleapis.com/harmonia-media/samples/emotional_piano.mp3',
      audio_url: 'https://storage.googleapis.com/harmonia-media/samples/emotional_piano.mp3',
      description: 'Solo de piano emocional para momentos de introspecção',
      artist: 'harmonIA',
      tags: ['piano', 'emocional', 'clássico'],
      duration: '3:20',
      dateAdded: '2023-10-02',
      fileSize: 5.7,
      style: 'Clássico',
      mood: 'Introspectivo',
      occasion: 'Documentário'
    },
    {
      id: '3',
      title: 'Energia Eletrônica',
      genre: 'Eletrônica',
      url: 'https://storage.googleapis.com/harmonia-media/samples/electronic_energy.mp3',
      audio_url: 'https://storage.googleapis.com/harmonia-media/samples/electronic_energy.mp3',
      description: 'Batidas eletrônicas energéticas para vídeos dinâmicos',
      artist: 'harmonIA',
      tags: ['eletrônica', 'energia', 'dinâmico'],
      duration: '3:05',
      dateAdded: '2023-08-20',
      fileSize: 6.3,
      style: 'Contemporâneo',
      mood: 'Energético',
      occasion: 'Publicidade'
    }
  ];
};
