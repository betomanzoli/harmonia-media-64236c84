
/**
 * Project Item interface with snake_case properties to match Supabase database schema
 * and camelCase aliases for front-end components
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
  previews?: MusicPreview[];
  feedback_history?: FeedbackItem[];
  history?: HistoryItem[];
  preview_code?: string;
  client_email?: string;
  client_phone?: string;
  
  // Camel case aliases for front-end components
  clientName?: string;
  projectTitle?: string;
  packageType?: string;
  createdAt?: string;
  lastActivityDate?: string;
  expirationDate?: string;
  clientEmail?: string;
  clientPhone?: string;
  feedbackHistory?: FeedbackItem[];
}

/**
 * Music Preview interface with both snake_case properties and camelCase aliases
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
  
  // Camel case aliases for front-end components
  audioUrl?: string;
  url?: string;
  fileUrl?: string;
  fileId?: string;
  finalVersionUrl?: string;
  stemsUrl?: string;
  createdAt?: string;
  dateAdded?: string;
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
  // Camel case aliases
  audioUrl?: string;
  additionalLinks?: Array<string | { url: string; label: string }>;
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
  additionalLinks?: Array<string | { url: string; label: string }>;
  // Camel case aliases
  audioUrl?: string;
}

/**
 * Feedback Item interface
 */
export interface FeedbackItem {
  id: string;
  project_id: string;
  version_id?: string;
  comment: string;
  content?: string; // Alias for comment
  sentiment?: 'positive' | 'neutral' | 'negative';
  created_at: string;
  createdAt?: string; // Alias for created_at
  status?: string; // Status can be any string (more flexible than a union)
  versionId?: string; // Alias for version_id
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
  // Optional fields for local history items
  timestamp?: string;
  data?: { message: string };
}

/**
 * History Entry interface (for admin panel)
 */
export interface HistoryEntry {
  id?: string;
  action: string;
  timestamp: string;
  data: { message: string };
  project_id?: string;
  description?: string;
  created_at?: string;
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

/**
 * Project Data interface (for front-end use)
 */
export interface ProjectData {
  id: string;
  clientName: string;
  projectTitle: string;
  packageType: string;
  status: string;
  createdAt: string;
  lastActivityDate: string;
  expirationDate: string;
  versions: number;
  versionsList?: ProjectVersion[];
}

/**
 * Preview Project Data interface (for front-end use)
 */
export interface PreviewProjectData {
  projectTitle: string;
  clientName: string;
  status: 'waiting' | 'feedback' | 'approved';
  packageType?: string;
  creationDate?: string;
  extras?: string[];
}

/**
 * Phone Number with Country Code interface
 */
export interface PhoneWithCountryCode {
  countryCode: string;
  nationalNumber: string;
  fullNumber: string;
}

/**
 * Extra Service interface
 */
export interface ExtraService {
  id: string;
  name: string;
  description: string;
  price: number;
  selected?: boolean;
}
