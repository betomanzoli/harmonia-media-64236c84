
// Project Types to match Supabase schema

// Define both camelCase and snake_case versions of properties for compatibility
export interface ProjectVersion {
  id: string;
  name: string;
  title?: string; 
  description?: string;
  audio_url?: string; // snake_case to match Supabase
  file_url?: string; // snake_case to match Supabase
  audioUrl?: string; // camelCase for frontend compatibility 
  fileUrl?: string; // camelCase for frontend compatibility
  recommended?: boolean;
  final?: boolean;
  created_at: string; // snake_case to match Supabase
  is_recommended?: boolean; // snake_case to match Supabase
  is_final?: boolean; // snake_case to match Supabase
  final_version_url?: string; // snake_case to match Supabase
  stems_url?: string; // snake_case to match Supabase
  fileId?: string; // Legacy support
  file_id?: string; // Snake case version
  date_added?: string; // For compatibility
  additionalLinks?: {name: string, url: string}[]; // For VersionCard component
}

// For backwards compatibility
export type VersionItem = ProjectVersion;

export interface MusicPreview {
  id: string;
  title: string;
  name?: string; // For backwards compatibility
  description: string;
  audio_url: string; // snake_case to match Supabase
  audioUrl?: string; // camelCase for frontend compatibility
  file_url?: string; // snake_case to match Supabase
  fileUrl?: string; // camelCase for frontend compatibility
  recommended?: boolean;
  file_id?: string; // snake_case to match Supabase
  fileId?: string; // camelCase version
  created_at?: string; // snake_case to match Supabase
  createdAt?: string; // camelCase version
  final_version_url?: string; // snake_case to match Supabase
  stems_url?: string; // snake_case to match Supabase
}

export interface HistoryItem {
  id: string;
  project_id: string; // snake_case to match Supabase
  action: string;
  description?: string;
  data?: any;
  timestamp?: string;
  created_at?: string; // snake_case to match Supabase
}

export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: string;
  data: any;
}

export interface FeedbackItem {
  id: string;
  content: string;
  comment?: string;  // For compatibility with existing code
  createdAt?: string;
  created_at?: string; // snake_case to match Supabase
  status?: 'pending' | 'reviewed' | 'applied';
  version_id?: string; // For ProjectFeedbackHistory component
  versionId?: string; // camelCase version
  project_id?: string; // For compatibility with Supabase structure
}

export interface ProjectItem {
  id: string;
  client_name: string; // snake_case to match Supabase
  clientName?: string; // camelCase for frontend
  client_email?: string; // snake_case to match Supabase
  clientEmail?: string; // camelCase for frontend
  client_phone?: string; // snake_case to match Supabase
  clientPhone?: string; // camelCase for frontend
  project_title?: string; // snake_case to match Supabase
  title?: string; // For backwards compatibility
  package_type?: string; // snake_case to match Supabase
  packageType?: string; // camelCase for frontend
  status: 'waiting' | 'feedback' | 'approved' | 'draft' | 'completed';
  created_at: string; // snake_case to match Supabase
  createdAt?: string; // camelCase for frontend
  updated_at?: string; // snake_case to match Supabase
  updatedAt?: string; // camelCase for frontend
  expiration_date?: string; // snake_case to match Supabase
  expirationDate?: string; // camelCase for frontend
  deadline?: string; // For backwards compatibility
  last_activity_date?: string; // snake_case to match Supabase
  lastActivityDate?: string; // camelCase for frontend
  versions?: number;
  versionsList?: ProjectVersion[];
  previews?: MusicPreview[];
  feedback_history?: FeedbackItem[]; // snake_case to match Supabase
  feedbackHistory?: FeedbackItem[]; // camelCase for frontend
  history?: HistoryItem[];
  preview_code?: string; // snake_case to match Supabase
  previewCode?: string; // camelCase for frontend
}

// For compatibility with existing code
export interface ProjectData extends ProjectItem {}
export interface PreviewProjectData {
  projectTitle: string;
  clientName: string;
  status: 'waiting' | 'feedback' | 'approved';
  packageType?: string;
  creationDate: string;
}

// Additional types needed for other components
export interface PhoneWithCountryCode {
  code: string;
  number: string;
}

export interface ExtraService {
  id: string;
  name: string;
  description: string;
  price: number;
  selected?: boolean;
}
