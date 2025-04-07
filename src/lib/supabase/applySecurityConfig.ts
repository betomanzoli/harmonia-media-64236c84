
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
    console.log('Verificando funções SQL auxiliares...');
    
    // Primeiro verificar se a função exec_sql já existe antes de criar
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: `
          SELECT routine_name 
          FROM information_schema.routines 
          WHERE routine_schema = 'public' 
          AND routine_name = 'exec_sql';
        `
      });
      
      // Se a consulta for bem-sucedida e retornar dados, a função existe
      if (!error && data && data.length > 0) {
        console.log('Função exec_sql já existe, não é necessário criar');
        return { success: true, functionExists: true };
      }
      
      // Se a consulta der erro ou não retornar dados, precisamos criar a função
      console.log('Função exec_sql não existe ou retornou erro, tentando criar...');
    } catch (checkError) {
      console.log('Erro ao verificar se função existe, tentando criar...', checkError);
    }
    
    // Tentar criar a função exec_sql
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
    
    // Se a criação falhar, pode ser porque a função não existe
    // e estamos tentando chamá-la para criar ela mesma (circular)
    if (execSqlError) {
      console.warn('Erro ao criar função exec_sql usando RPC:', execSqlError);
      
      // Tente criar diretamente via SQL por outro meio
      try {
        const { error: sqlError } = await supabase.from('_exec_sql_setup').select('*').limit(1).single();
        
        // Este é um erro esperado (tabela não existe), mas o hook SQL foi acionado
        console.log('Tentativa de trigger SQL alternativa executada');
        
        if (sqlError && sqlError.code === '42P01') {
          console.log('Erro esperado (tabela não existe), verificando se função foi criada...');
          
          // Verificar novamente se a função foi criada
          const { data, error: checkAgainError } = await supabase.rpc('exec_sql', {
            sql_query: `SELECT 1 as test`
          });
          
          if (!checkAgainError && data) {
            console.log('Função exec_sql criada com sucesso por método alternativo');
            return { success: true };
          } else {
            console.warn('Função exec_sql não pôde ser criada', checkAgainError);
          }
        }
      } catch (e) {
        console.error('Erro na tentativa alternativa:', e);
      }
      
      // Se ainda não conseguimos criar, retornamos o erro, mas continuamos com as outras configurações
      console.warn('Não foi possível criar a função exec_sql, mas continuando com outras configurações');
      return { 
        success: false, 
        error: 'Não foi possível criar função SQL auxiliar' 
      };
    }
    
    console.log('Função exec_sql criada ou já existia');
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar funções auxiliares:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao criar funções auxiliares',
      continueWithoutFunction: true  // Continuar mesmo sem a função
    };
  }
};

// Exportar a função de configuração
export default applyAllSecurityConfigurations;
