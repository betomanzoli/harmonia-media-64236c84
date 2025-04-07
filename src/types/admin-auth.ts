
export interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export interface ConnectionStatus {
  tested: boolean;
  connected: boolean;
  error?: string;
  details?: any;
  networkOnline?: boolean;
  endpointStatus?: string;
}

export interface SecurityStatus {
  checked: boolean;
  hasIssues: boolean;
  details?: any;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: string;
}

export interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  securityStatus?: SecurityStatus;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  testConnection: () => Promise<void>;
  checkSecurityStatus?: () => Promise<void>;
}
