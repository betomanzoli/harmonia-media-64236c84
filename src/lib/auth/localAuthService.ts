
import { AdminUser } from '@/types/admin-auth';

// Demo admin user
const DEMO_ADMIN: AdminUser = {
  id: 'admin-1',
  email: 'admin@harmonia.com',
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date().toISOString()
};

// For a real app you would hash passwords, but for demo purposes we'll use plain text
const VALID_CREDENTIALS = [
  { email: 'admin@harmonia.com', password: 'admin123456' }
];

// Keys for localStorage
const AUTH_TOKEN_KEY = 'harmonia-admin-auth-token';
const AUTH_USER_KEY = 'harmonia-admin-auth-user';

export const localAuthService = {
  // Login function
  login: async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Check credentials
      const matchedUser = VALID_CREDENTIALS.find(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );
      
      if (!matchedUser) {
        return { 
          success: false, 
          error: 'Credenciais inválidas. Por favor, tente novamente.' 
        };
      }
      
      // Create a simple token (this would be JWT in a real app)
      const token = `demo-token-${Date.now()}`;
      
      // Store auth info in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_ADMIN));
      
      return { 
        success: true,
        user: DEMO_ADMIN
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { 
        success: false, 
        error: 'Ocorreu um erro durante o login. Por favor, tente novamente.' 
      };
    }
  },
  
  // Logout function
  logout: async (): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear auth data from localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
  
  // Check if user is authenticated
  getUser: (): AdminUser | null => {
    try {
      const userJson = localStorage.getItem(AUTH_USER_KEY);
      if (!userJson) return null;
      
      return JSON.parse(userJson) as AdminUser;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  },
  
  // Check if token exists
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }
};

export default localAuthService;
