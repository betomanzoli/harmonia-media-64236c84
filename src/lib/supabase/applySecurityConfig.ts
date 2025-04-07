
import { securityService } from './securityConfig';
import { runMigrations, createSQLPolicies } from './migrations';

/**
 * Função para aplicar todas as configurações de segurança no Supabase
 * Esta função pode ser chamada durante a inicialização do app
 * ou através de um painel administrativo
 */
export const applyAllSecurityConfigurations = async () => {
  console.log('Iniciando configuração de segurança do Supabase...');
  
  try {
    // 1. Executar migrações e criar políticas RLS
    console.log('Aplicando migrações e políticas RLS...');
    const migrationResult = await runMigrations();
    
    // Se migrações normais falharem, tente aplicar políticas SQL diretas
    if (!migrationResult.success) {
      console.log('Tentando aplicar políticas via SQL direto...');
      await createSQLPolicies();
    }
    
    // 2. Aplicar políticas RLS nas tabelas (método alternativo)
    console.log('Aplicando políticas RLS via método securityService...');
    const rlsResult = await securityService.applyRLSPolicies();
    if (!rlsResult.success) {
      console.warn('Aviso: Falha ao aplicar políticas RLS:', rlsResult.error);
    }
    
    // 3. Configurar segurança de senha
    console.log('Configurando segurança de senha...');
    const passwordResult = await securityService.enhancePasswordSecurity();
    if (!passwordResult.success) {
      console.warn('Aviso: Falha ao configurar segurança de senha:', passwordResult.error);
    }
    
    // 4. Configurar MFA
    console.log('Configurando MFA...');
    const mfaResult = await securityService.configureMFA();
    if (!mfaResult.success) {
      console.warn('Aviso: Falha ao configurar MFA:', mfaResult.error);
    }
    
    // 5. Validar configurações
    console.log('Validando configurações de segurança...');
    const validationResult = await securityService.validateSecurity();
    
    console.log('Configuração de segurança concluída!');
    
    return {
      success: true,
      rlsConfigured: rlsResult.success || migrationResult.success,
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
