
export interface FeedbackData {
  clientEmail: string;
  clientName: string;
  projectId: string;
  selectedVersion: string;
  generalFeedback: string;
  rating: number;
  preferredContactMethod: 'email' | 'whatsapp';
  timestamp: string;
}
