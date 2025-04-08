
import { AudioSample } from '@/types/audio';

// Mock audio samples for offline development
export const mockAudioSamples: AudioSample[] = [
  {
    id: '1',
    title: 'Guitar Melody',
    style: 'Acoustic',
    mood: 'Calm',
    occasion: 'Relaxation',
    audio_url: 'https://example.com/samples/guitar-melody.mp3',
    preview_duration: '0:45',
    description: 'Acoustic guitar melody in G major',
    url: 'https://example.com/samples/guitar-melody.mp3',
    duration: 45,
    category: 'Acoustic',
    tags: ['guitar', 'melody', 'acoustic'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Piano Ballad',
    style: 'Classical',
    mood: 'Emotional',
    occasion: 'Reflection',
    audio_url: 'https://example.com/samples/piano-ballad.mp3',
    preview_duration: '2:00',
    description: 'Emotional piano ballad in C minor',
    url: 'https://example.com/samples/piano-ballad.mp3',
    duration: 120,
    category: 'Classical',
    tags: ['piano', 'ballad', 'emotional'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Electronic Beat',
    style: 'Electronic',
    mood: 'Energetic',
    occasion: 'Party',
    audio_url: 'https://example.com/samples/electronic-beat.mp3',
    preview_duration: '1:00',
    description: 'Modern electronic beat at 120 BPM',
    url: 'https://example.com/samples/electronic-beat.mp3',
    duration: 60,
    category: 'Electronic',
    tags: ['electronic', 'beat', 'modern'],
    created_at: new Date().toISOString()
  }
];
