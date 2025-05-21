
// Define and export the types
export interface VersionItem {
  id: string;
  name: string;
  description?: string;
  fileId?: string;
  recommended?: boolean;
  final?: boolean;
  dateAdded?: string;
  url?: string;
  audioUrl?: string;
  additionalLinks?: Array<{ label: string; url: string }>;
}

export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  packageType?: string;
  createdAt: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: number;
  previewUrl?: string;
  expirationDate?: string;
  lastActivityDate?: string;
  versionsList?: VersionItem[];
  briefingId?: string;
  history?: any[];
  feedback?: string;
  [key: string]: any; // Allow for additional properties
}
