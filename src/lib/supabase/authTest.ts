
import { supabase } from './client';

// Função para verificar se há uma sessão ativa
const checkExistingSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao verificar sessão:', error);
      return { success: false, error: error.message };
    }
    
    if (data?.session) {
      return { 
        success: true, 
        hasSession: true, 
        user: data.session.user.email
      };
    }
    
    return { success: true, hasSession: false };
  } catch (err) {
    console.error('Exceção ao verificar sessão:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido' 
    };
  }
};

// Função para verificar o serviço de autenticação
const checkAuthService = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error && error.status !== 401) {  // 401 é esperado quando não autenticado
      console.error('Erro ao verificar serviço de autenticação:', error);
      return { 
        success: false, 
        error: `Serviço de autenticação com problema: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      message: 'Serviço de autenticação está respondendo normalmente' 
    };
  } catch (err) {
    console.error('Exceção ao verificar autenticação:', err);
    return { 
      success: false, 
      error: 'Falha ao acessar o serviço de autenticação' 
    };
  }
};

// Testar autenticação específica
export const testAuthSettings = async () => {
  try {
    console.log('Verificando configurações de autenticação...');
    
    // Verificar se já existe uma sessão
    const sessionResult = await checkExistingSession();
    
    if (!sessionResult.success) {
      return { 
        success: false, 
        error: `Problema com sessão: ${sessionResult.error}` 
      };
    }
    
    // Se houver sessão ativa, retornar informações do usuário
    if (sessionResult.hasSession) {
      return { 
        success: true, 
        message: 'Usuário autenticado', 
        user: sessionResult.user 
      };
    }
    
    // Se não houver sessão ativa, testar o serviço de autenticação
    return await checkAuthService();
    
  } catch (err) {
    console.error('Exceção ao verificar configurações de autenticação:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido' 
    };
  }
};
