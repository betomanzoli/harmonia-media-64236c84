
import { User } from '@supabase/supabase-js';

export interface ConnectionStatus {
  tested: boolean;
  connected: boolean;
  error?: string;
}

export interface AdminAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  testConnection: () => Promise<void>;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface AdminAuthProviderProps {
  children: React.ReactNode;
}
