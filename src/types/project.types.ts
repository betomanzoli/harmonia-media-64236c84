
// Base version interface that all version-related types can extend from
export interface BaseVersionItem {
  id: string;
  name: string; // Keep for backward compatibility
  description: string;
  audioUrl?: string; // Optional here, but required in specific interfaces
  recommended?: boolean;
  final?: boolean;
  createdAt?: string;
  created_at?: string; // Added for compatibility with Supabase naming convention
  title?: string; // Add title property for UI display
  finalVersionUrl?: string; // Add final version URL for downloads
  stemsUrl?: string; // Add stems URL for downloads
  additionalLinks?: any[]; // Add support for additional links
  fileId?: string; // Add file ID for Google Drive links
  file_url?: string; // Add file URL for compatibility
  dateAdded?: string; // Add date added property
}

// Version type used in project.versionsList
export interface ProjectVersion extends BaseVersionItem {
  // Additional properties specific to ProjectVersion
  fileId?: string;
  file_url?: string; // Added for compatibility with Supabase naming convention
  audioUrl: string; // Required in this interface
  title: string; // Make title required in this interface
}

// Music preview type that includes title (mapped from name)
export interface MusicPreview extends BaseVersionItem {
  title: string; // Required for UI components
  audioUrl: string; // Required in this interface
  name: string; // Required for compatibility with existing code
  finalVersionUrl?: string; // Add for download functionality
  stemsUrl?: string; // Add for stems download functionality
  url?: string; // Alternative URL field for compatibility
  fileId?: string; // Add file ID for Google Drive links
}

// Base project interface with common properties
export interface BaseProjectItem {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string; // Add clientPhone property
  projectTitle: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  lastActivityDate: string;
  expirationDate: string;
  versions: number;
  feedback?: string;
  preview_code?: string; // Added preview_code property
  previews?: MusicPreview[]; // Added previews property
}

// Complete project item with version list
export interface ProjectItem extends BaseProjectItem {
  versionsList: ProjectVersion[];
  feedbackHistory: FeedbackItem[];
  history: any[];
  previews?: MusicPreview[];
}

// Project data that may have partial information
export interface ProjectData extends BaseProjectItem {
  versionsList?: ProjectVersion[];
  feedbackHistory?: any[];
  history?: any[];
  previews?: MusicPreview[];
  project_files?: ProjectFile[]; // Added for compatibility with Supabase project_files join
}

// Preview project data for client-facing views
export interface PreviewProjectData {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: MusicPreview[];
  packageType?: string;
  creationDate?: string;
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
// IMPORTANT: This was causing the error - make sure it's properly exported
export interface VersionItem extends BaseVersionItem {
  title: string; // Make title required for VersionItem
  audioUrl: string; // Make audioUrl required for VersionItem
  finalVersionUrl?: string; // Add for download functionality
  stemsUrl?: string; // Add for stems download functionality
  file_url?: string;
  fileId?: string;
  dateAdded?: string;
  additionalLinks?: any[];
}

// Export type for feedback items
export interface FeedbackItem {
  id: string;
  content: string;
  createdAt: string;
  status: string;
  versionId?: string; // Add versionId property
}
