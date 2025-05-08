
// Base version interface that all version-related types can extend from
export interface BaseVersionItem {
  id: string;
  name: string;
  description: string;
  audioUrl?: string; // Made optional here
  recommended?: boolean;
  final?: boolean;
  createdAt?: string;
}

// Version type used in project.versionsList
export interface ProjectVersion extends BaseVersionItem {
  // Additional properties specific to ProjectVersion
  fileId?: string;
  finalVersionUrl?: string;
  stemsUrl?: string;
  file_url?: string; // Added for compatibility with Supabase naming convention
  created_at?: string; // Added for compatibility with Supabase naming convention
  audioUrl: string; // Required in this interface
}

// Music preview type that includes title (mapped from name)
export interface MusicPreview extends BaseVersionItem {
  title: string; // Required for UI components
  audioUrl: string; // Required in this interface
}

// Base project interface with common properties
export interface BaseProjectItem {
  id: string;
  clientName: string;
  clientEmail?: string;
  projectTitle: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  lastActivityDate: string;
  expirationDate: string;
  versions: number;
  feedback?: string;
  preview_code?: string; // Added preview_code property
}

// Complete project item with version list
export interface ProjectItem extends BaseProjectItem {
  versionsList: ProjectVersion[];
  feedbackHistory: any[];
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
