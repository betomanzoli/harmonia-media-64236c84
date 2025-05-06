
// Base version interface that all version-related types can extend from
export interface BaseVersionItem {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  recommended?: boolean;
  final?: boolean;
  createdAt: string; // Required to satisfy all interfaces
}

// Version type used in project.versionsList
export interface ProjectVersion extends BaseVersionItem {
  // Additional properties specific to ProjectVersion
  fileId?: string;
  finalVersionUrl?: string;
  stemsUrl?: string;
}

// Music preview type that includes title (mapped from name)
export interface MusicPreview extends BaseVersionItem {
  title: string; // Required for UI components
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
