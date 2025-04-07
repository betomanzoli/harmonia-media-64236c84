
import { securityService } from './securityConfig';

/**
 * Função para aplicar todas as configurações de segurança no Supabase
 * Esta função pode ser chamada durante a inicialização do app
 * ou através de um painel administrativo
 */
export const applyAllSecurityConfigurations = async () => {
  console.log('Iniciando configuração de segurança do Supabase...');
  
  try {
    // 1. Aplicar políticas RLS nas tabelas
    const rlsResult = await securityService.applyRLSPolicies();
    if (!rlsResult.success) {
      console.warn('Aviso: Falha ao aplicar políticas RLS:', rlsResult.error);
    }
    
    // 2. Configurar segurança de senha
    const passwordResult = await securityService.enhancePasswordSecurity();
    if (!passwordResult.success) {
      console.warn('Aviso: Falha ao configurar segurança de senha:', passwordResult.error);
    }
    
    // 3. Configurar MFA
    const mfaResult = await securityService.configureMFA();
    if (!mfaResult.success) {
      console.warn('Aviso: Falha ao configurar MFA:', mfaResult.error);
    }
    
    // 4. Validar configurações
    const validationResult = await securityService.validateSecurity();
    
    console.log('Configuração de segurança concluída!');
    
    return {
      success: true,
      rlsConfigured: rlsResult.success,
      passwordConfigured: passwordResult.success,
      mfaConfigured: mfaResult.success,
      validationResults: validationResult
    };
  } catch (error: any) {
    console.error('Erro durante configuração de segurança:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido durante configuração de segurança'
    };
  }
};

// Exportar a função de configuração
export default applyAllSecurityConfigurations;
