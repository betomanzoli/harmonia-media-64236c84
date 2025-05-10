
import { AdminUser } from '@/types/admin-auth';

// Demo admin users
const VALID_CREDENTIALS = [
  { 
    email: 'admin@harmonia.com', 
    password: 'admin123456',
    userData: {
      id: 'admin-1',
      email: 'admin@harmonia.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  },
  { 
    email: 'contato@harmonia.media', 
    password: 'harmonia2023',
    userData: {
      id: 'admin-2',
      email: 'contato@harmonia.media',
      name: 'Contato User',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  }
];

// Keys for localStorage
const AUTH_TOKEN_KEY = 'admin-auth-token';
const AUTH_USER_KEY = 'admin-auth-user';

export const localAuthService = {
  // Login function
  login: async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      console.log("Tentando login com:", email);
      
      // Check credentials
      const matchedUser = VALID_CREDENTIALS.find(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );
      
      if (!matchedUser) {
        console.log("Credenciais inválidas");
        return { 
          success: false, 
          error: 'Credenciais inválidas. Por favor, verifique seu email e senha.' 
        };
      }
      
      // Create a simple token (this would be JWT in a real app)
      const token = `demo-token-${Date.now()}`;
      
      // Store auth info in localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(matchedUser.userData));
      
      console.log("Login bem-sucedido, dados armazenados:", matchedUser.userData);
      
      return { 
        success: true,
        user: matchedUser.userData
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
    console.log("Logout realizado, dados de autenticação removidos");
  },
  
  // Check if user is authenticated
  getUser: (): AdminUser | null => {
    try {
      const userJson = localStorage.getItem(AUTH_USER_KEY);
      if (!userJson) {
        console.log("Nenhum usuário encontrado no localStorage");
        return null;
      }
      
      const user = JSON.parse(userJson) as AdminUser;
      console.log("Usuário encontrado no localStorage:", user.email);
      return user;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  },
  
  // Check if token exists
  isAuthenticated: (): boolean => {
    const hasToken = !!localStorage.getItem(AUTH_TOKEN_KEY);
    console.log("Verificação de autenticação:", hasToken ? "Autenticado" : "Não autenticado");
    return hasToken;
  }
};

export default localAuthService;
