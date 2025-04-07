
import { User } from '@supabase/supabase-js';

export interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export interface ConnectionStatus {
  tested: boolean;
  connected: boolean;
  error?: string;
}

export interface SecurityStatus {
  checked: boolean;
  hasIssues: boolean;
  details?: any;
}

export interface AdminAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  securityStatus?: SecurityStatus;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  testConnection: () => Promise<void>;
  checkSecurityStatus?: () => Promise<void>;
}
