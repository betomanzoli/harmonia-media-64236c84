
export interface ProjectVersion {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  recommended?: boolean;
  final?: boolean;
  createdAt?: string;
}

export interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  recommended?: boolean;
  url?: string;
  fileId?: string;
  finalVersionUrl?: string;
  stemsUrl?: string;
}

export interface ProjectData {
  id: string;
  clientName: string;
  clientEmail?: string;
  projectTitle: string;
  packageType: string;
  status: 'waiting' | 'feedback' | 'approved';
  createdAt: string;
  lastActivityDate: string;
  expirationDate?: string;
  versionsList: ProjectVersion[];
  previews?: MusicPreview[];
  versions: number;
  feedback?: string;
  feedbackHistory: any[];
  history: any[];
}

export interface ProjectItem extends Omit<ProjectData, 'expirationDate'> {
  expirationDate: string; // Mark as required for ProjectItem
}

export interface PreviewProjectData {
  clientName: string;
  projectTitle: string;
  status: 'waiting' | 'feedback' | 'approved';
  previews: {
    id: string;
    title: string;
    description: string;
    audioUrl: string;
    recommended?: boolean;
  }[];
  packageType?: string;
  creationDate?: string;
}
