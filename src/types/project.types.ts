
// Base version interface that all version-related types can extend from
export interface BaseVersionItem {
  id: string;
  name: string; // Keep for backward compatibility
  description: string;
  audio_url?: string;
  recommended?: boolean;
  final?: boolean;
  created_at?: string;
  title: string; // Add title property for UI display
  final_version_url?: string;
  stems_url?: string;
  additional_links?: any[];
  file_id?: string;
  file_url?: string;
  date_added?: string;
  url?: string;
}

// Version type used in project.versions_list
export interface ProjectVersion extends BaseVersionItem {
  // Additional properties specific to ProjectVersion
  file_id?: string;
  file_url?: string;
  audio_url: string; // Required in this interface
  title: string; // Make title required in this interface
}

// Music preview type that includes title (mapped from name)
export interface MusicPreview extends BaseVersionItem {
  title: string; // Required for UI components
  audio_url: string; // Required in this interface
  name: string; // Required for compatibility with existing code
  final_version_url?: string;
  stems_url?: string;
  url?: string; // Alternative URL field for compatibility
  file_id?: string;
}

// Base project interface with common properties
export interface BaseProjectItem {
  id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  project_title: string;
  package_type: string;
  status: 'waiting' | 'feedback' | 'approved';
  created_at: string;
  last_activity_date: string;
  expiration_date: string;
  versions: number;
  feedback?: string;
  preview_code?: string;
  previews?: MusicPreview[];
}

// Complete project item with version list
export interface ProjectItem extends BaseProjectItem {
  versions_list: ProjectVersion[];
  feedback_history: FeedbackItem[];
  history: any[];
  previews?: MusicPreview[];
}

// Project data that may have partial information
export interface ProjectData extends BaseProjectItem {
  versions_list?: ProjectVersion[];
  feedback_history?: any[];
  history?: any[];
  previews?: MusicPreview[];
  project_files?: ProjectFile[];
}

// Preview project data for client-facing views
export interface PreviewProjectData {
  client_name: string;
  project_title: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
  package_type?: string;
  creation_date?: string;
}

// Project file interface matching Supabase database schema
export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
  version?: number;
  notes?: string;
}

// Add a VersionItem type to ensure compatibility with existing code
export interface VersionItem extends BaseVersionItem {
  title: string; // Make title required for VersionItem
  audio_url: string; // Make audio_url required for VersionItem
  final_version_url?: string;
  stems_url?: string;
  file_url?: string;
  file_id?: string;
  date_added?: string;
  additional_links?: any[];
}

// Export type for feedback items
export interface FeedbackItem {
  id: string;
  content: string;
  created_at: string;
  status: string;
  version_id?: string;
}
