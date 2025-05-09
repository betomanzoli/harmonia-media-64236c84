
// Project Types to match Supabase schema

export interface ProjectVersion {
  id: string;
  name: string;
  title?: string; 
  description?: string;
  audio_url?: string; // snake_case to match Supabase
  file_url?: string; // snake_case to match Supabase
  recommended?: boolean;
  final?: boolean;
  created_at: string; // snake_case to match Supabase
  is_recommended?: boolean; // snake_case to match Supabase
  is_final?: boolean; // snake_case to match Supabase
  final_version_url?: string; // snake_case to match Supabase
  stems_url?: string; // snake_case to match Supabase
  fileId?: string; // Legacy support
}

// For backwards compatibility
export type VersionItem = ProjectVersion;

export interface MusicPreview {
  id: string;
  title: string;
  name?: string; // For backwards compatibility
  description: string;
  audio_url: string; // snake_case to match Supabase
  file_url?: string; // snake_case to match Supabase
  recommended?: boolean;
  file_id?: string; // snake_case to match Supabase
  created_at?: string; // snake_case to match Supabase
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
  createdAt: string;
  status: 'pending' | 'reviewed' | 'applied';
}

export interface ProjectItem {
  id: string;
  client_name: string; // snake_case to match Supabase
  client_email?: string; // snake_case to match Supabase
  client_phone?: string; // snake_case to match Supabase
  project_title?: string; // snake_case to match Supabase
  title?: string; // For backwards compatibility
  package_type?: string; // snake_case to match Supabase
  status: 'waiting' | 'feedback' | 'approved' | 'draft' | 'completed';
  created_at: string; // snake_case to match Supabase
  updated_at?: string; // snake_case to match Supabase
  expiration_date?: string; // snake_case to match Supabase
  deadline?: string; // For backwards compatibility
  last_activity_date?: string; // snake_case to match Supabase
  versions?: number;
  versionsList?: ProjectVersion[];
  previews?: MusicPreview[];
  feedback_history?: FeedbackItem[]; // snake_case to match Supabase
  history?: HistoryItem[];
  preview_code?: string; // snake_case to match Supabase
}
