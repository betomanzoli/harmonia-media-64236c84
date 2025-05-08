
// Base version interface that all version-related types can extend from
export interface BaseVersionItem {
  id: string;
  name: string; // Keep for backward compatibility
  description: string;
  audio_url?: string; // Changed from audioUrl to audio_url
  recommended?: boolean;
  final?: boolean;
  created_at?: string; // Changed from createdAt to created_at
  title: string; // Add title property for UI display
  final_version_url?: string; // Changed from finalVersionUrl to final_version_url
  stems_url?: string; // Changed from stemsUrl to stems_url
  additional_links?: any[]; // Changed from additionalLinks to additional_links
  file_id?: string; // Changed from fileId to file_id
  file_url?: string; // Already in snake_case
  date_added?: string; // Changed from dateAdded to date_added
  url?: string; // Already in snake_case
}

// Version type used in project.versionsList
export interface ProjectVersion extends BaseVersionItem {
  // Additional properties specific to ProjectVersion
  file_id?: string; // Changed from fileId to file_id
  file_url?: string; // Already in snake_case
  audio_url: string; // Required in this interface, changed from audioUrl
  title: string; // Make title required in this interface
}

// Music preview type that includes title (mapped from name)
export interface MusicPreview extends BaseVersionItem {
  title: string; // Required for UI components
  audio_url: string; // Required in this interface, changed from audioUrl
  name: string; // Required for compatibility with existing code
  final_version_url?: string; // Changed from finalVersionUrl
  stems_url?: string; // Changed from stemsUrl
  url?: string; // Alternative URL field for compatibility
  file_id?: string; // Changed from fileId
}

// Base project interface with common properties
export interface BaseProjectItem {
  id: string;
  client_name: string; // Changed from clientName
  client_email?: string; // Changed from clientEmail
  client_phone?: string; // Changed from clientPhone
  project_title: string; // Changed from projectTitle
  package_type: string; // Changed from packageType
  status: 'waiting' | 'feedback' | 'approved';
  created_at: string; // Changed from createdAt
  last_activity_date: string; // Changed from lastActivityDate
  expiration_date: string; // Changed from expirationDate
  versions: number;
  feedback?: string;
  preview_code?: string; // Already in snake_case
  previews?: MusicPreview[]; // Added previews property
}

// Complete project item with version list
export interface ProjectItem extends BaseProjectItem {
  versions_list: ProjectVersion[]; // Changed from versionsList
  feedback_history: FeedbackItem[]; // Changed from feedbackHistory
  history: any[];
  previews?: MusicPreview[];
}

// Project data that may have partial information
export interface ProjectData extends BaseProjectItem {
  versions_list?: ProjectVersion[]; // Changed from versionsList
  feedback_history?: any[]; // Changed from feedbackHistory
  history?: any[];
  previews?: MusicPreview[];
  project_files?: ProjectFile[]; // Already in snake_case
}

// Preview project data for client-facing views
export interface PreviewProjectData {
  client_name: string; // Changed from clientName
  project_title: string; // Changed from projectTitle
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
  package_type?: string; // Changed from packageType
  creation_date?: string; // Changed from creationDate
}

// Project file interface matching Supabase database schema
export interface ProjectFile {
  id: string;
  project_id: string; // Already in snake_case
  file_name: string; // Changed from fileName
  file_url: string; // Already in snake_case
  file_type: string; // Already in snake_case
  created_at: string; // Already in snake_case
  version?: number;
  notes?: string;
}

// Add a VersionItem type to ensure compatibility with existing code
export interface VersionItem extends BaseVersionItem {
  title: string; // Make title required for VersionItem
  audio_url: string; // Make audioUrl required for VersionItem, changed to snake_case
  final_version_url?: string; // Changed from finalVersionUrl
  stems_url?: string; // Changed from stemsUrl
  file_url?: string; // Already in snake_case
  file_id?: string; // Changed from fileId
  date_added?: string; // Changed from dateAdded
  additional_links?: any[]; // Changed from additionalLinks
}

// Export type for feedback items
export interface FeedbackItem {
  id: string;
  content: string;
  created_at: string; // Changed from createdAt
  status: string;
  version_id?: string; // Changed from versionId
}
