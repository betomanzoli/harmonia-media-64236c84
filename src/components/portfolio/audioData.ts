
export interface AudioExample {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  type: 'example' | 'comparison' | 'stem';
  categories: string[];
  imageUrl?: string;
  tags?: string[];
  beforeUrl?: string;
  featured?: boolean;
}

// Cleared initial examples - will be populated by admin
export const initialExamples: AudioExample[] = [];

// Cleared extra examples - will be populated by admin
export const extraExamples: AudioExample[] = [];

// Comparison examples structure is kept but emptied
export const comparisonExamples: AudioExample[] = [];
