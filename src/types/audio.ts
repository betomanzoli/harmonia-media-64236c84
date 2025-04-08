
export interface AudioSample {
  id: string;
  title: string;
  style: string;
  mood: string;
  occasion: string;
  audio_url: string;
  preview_duration: string;
  created_at?: string;
  
  // Additional properties needed by the mock data
  description?: string;
  url?: string;
  duration?: number;
  category?: string;
  tags?: string[];
}
