
export interface AudioExample {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  type: 'example' | 'comparison' | 'stem';
  featured?: boolean;
}

// Cleared initial examples - will be populated by admin
export const initialExamples: AudioExample[] = [];

// Cleared extra examples - will be populated by admin
export const extraExamples: AudioExample[] = [];

// Comparison examples structure is kept but emptied
export const comparisonExamples: AudioExample[] = [];
