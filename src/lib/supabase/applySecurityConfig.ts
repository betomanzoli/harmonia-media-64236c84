
import { supabase } from './client';
import { securityService } from './securityConfig';

/**
 * Função para aplicar todas as configurações de segurança no Supabase
 * Esta função pode ser chamada durante a inicialização do app
 * ou através de um painel administrativo
 */
export const applyAllSecurityConfigurations = async () => {
  console.log('Iniciando configuração de segurança do Supabase...');
  
  try {
    // 1. Executar criação da função SQL auxiliar para facilitar operações
    await createHelperFunctions();
    
    // 2. Aplicar políticas RLS nas tabelas
    console.log('Aplicando políticas RLS via método securityService...');
    const rlsResult = await securityService.applyRLSPolicies();
    
    // 3. Configurar segurança de senha
    console.log('Configurando segurança de senha...');
    const passwordResult = await securityService.enhancePasswordSecurity();
    
    // 4. Configurar MFA
    console.log('Configurando MFA...');
    const mfaResult = await securityService.configureMFA();
    
    // 5. Validar configurações
    console.log('Validando configurações de segurança...');
    const validationResult = await securityService.validateSecurity();
    
    console.log('Configuração de segurança concluída!');
    
    return {
      success: true,
      rlsConfigured: rlsResult.success,
      passwordConfigured: passwordResult.success,
      mfaConfigured: mfaResult.success,
      validationResults: validationResult
    };
  } catch (error) {
    console.error('Erro durante configuração de segurança:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido durante configuração de segurança'
    };
  }
};

// Função para criar funções SQL auxiliares
const createHelperFunctions = async () => {
  try {
    console.log('Criando funções SQL auxiliares...');
    
    // Criar função exec_sql se não existir
    const { error: execSqlError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
        RETURNS SETOF json AS $$
        BEGIN
          RETURN QUERY EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (execSqlError) {
      console.warn('Erro ao criar função exec_sql (pode já existir):', execSqlError);
      
      // Tentar verificar se a função existe
      const { data, error: checkError } = await supabase.rpc('exec_sql', {
        sql_query: `
          SELECT routine_name 
          FROM information_schema.routines 
          WHERE routine_schema = 'public' 
          AND routine_name = 'exec_sql';
        `
      });
      
      if (checkError) {
        console.error('Erro ao verificar função exec_sql:', checkError);
        throw new Error('Não foi possível criar ou verificar função exec_sql');
      } else if (!data || data.length === 0) {
        console.error('Função exec_sql não existe e não pôde ser criada');
        throw new Error('Função exec_sql não pôde ser criada');
      } else {
        console.log('Função exec_sql já existe, continuando...');
      }
    } else {
      console.log('Função exec_sql criada com sucesso');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar funções auxiliares:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao criar funções auxiliares' 
    };
  }
};

// Exportar a função de configuração
export default applyAllSecurityConfigurations;
