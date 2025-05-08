
/**
 * Project Item interface with snake_case properties to match Supabase database schema
 */
export interface ProjectItem {
  id: string;
  client_name: string;
  project_title: string;
  package_type: string;
  status: string;
  created_at: string;
  last_activity_date: string;
  expiration_date: string;
  versions: number;
  versionsList?: ProjectVersion[];
  feedback_history?: FeedbackItem[];
  history?: HistoryItem[];
  preview_code?: string;
  client_email?: string;
  client_phone?: string;
}

/**
 * Music Preview interface with snake_case properties
 */
export interface MusicPreview {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  audio_url?: string;
  file_url?: string;
  file_id?: string;
  recommended?: boolean;
  final?: boolean;
  final_version_url?: string;
  stems_url?: string;
  created_at?: string;
  date_added?: string;
}

/**
 * Project Version interface
 */
export interface ProjectVersion {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  audio_url?: string;
  file_url?: string;
  file_id?: string;
  recommended?: boolean;
  final?: boolean;
  created_at?: string;
  date_added?: string;
  final_version_url?: string;
  stems_url?: string;
}

/**
 * Version Item interface
 */
export interface VersionItem {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  audio_url?: string;
  file_url?: string;
  file_id?: string;
  recommended?: boolean;
  final?: boolean;
  created_at?: string;
  date_added?: string;
  final_version_url?: string;
  stems_url?: string;
}

/**
 * Feedback Item interface
 */
export interface FeedbackItem {
  id: string;
  project_id: string;
  version_id?: string;
  comment: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  created_at: string;
}

/**
 * History Item interface
 */
export interface HistoryItem {
  id: string;
  project_id: string;
  action: string;
  description: string;
  created_at: string;
  user_id?: string;
}

/**
 * Project Client interface
 */
export interface ProjectClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

/**
 * Project Update interface
 */
export interface ProjectUpdate {
  client_name?: string;
  project_title?: string;
  status?: string;
  package_type?: string;
  expiration_date?: string;
  client_email?: string;
  client_phone?: string;
}
