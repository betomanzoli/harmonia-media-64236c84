
import { supabase } from './client';
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
    
    // 2. Aplicar políticas RLS nas tabelas com nome específicos
    await applyTablePolicies();
    
    // 3. Aplicar políticas RLS usando método alternativo
    console.log('Aplicando políticas RLS via método securityService...');
    const rlsResult = await securityService.applyRLSPolicies();
    
    // 4. Configurar segurança de senha
    console.log('Configurando segurança de senha...');
    const passwordResult = await securityService.enhancePasswordSecurity();
    
    // 5. Configurar MFA
    console.log('Configurando MFA...');
    const mfaResult = await securityService.configureMFA();
    
    // 6. Validar configurações
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

// Função específica para aplicar políticas em tabelas individuais
const applyTablePolicies = async () => {
  try {
    const tables = [
      'admin_users',
      'audio_samples',
      'portfolio_items',
      'qualification_submissions',
      'system_settings'
    ];
    
    for (const table of tables) {
      console.log(`Aplicando políticas RLS para tabela: ${table}`);
      
      // Primeiro, vamos verificar se a tabela existe
      const { data: tableExists, error: tableCheckError } = await supabase
        .from(table)
        .select('count(*)')
        .limit(1)
        .single();
      
      if (tableCheckError && !tableCheckError.message.includes('JWT')) {
        console.warn(`Tabela ${table} não pode ser verificada:`, tableCheckError);
        continue;
      }

      // Política para permitir leitura para todos os usuários autenticados
      const { error: readPolicyError } = await supabase.rpc('create_auth_policy', {
        table_name: table,
        policy_name: `${table}_read_policy`,
        policy_definition: 'auth.role() = \'authenticated\'',
        operation: 'SELECT'
      });

      if (readPolicyError) {
        console.warn(`Erro ao criar política de leitura para ${table}:`, readPolicyError);
      }

      // Política para permitir escrita apenas para usuários administrativos
      const { error: writePolicyError } = await supabase.rpc('create_auth_policy', {
        table_name: table,
        policy_name: `${table}_write_policy`,
        policy_definition: 'auth.role() = \'authenticated\' AND auth.email() IN (SELECT email FROM admin_users)',
        operation: 'ALL'
      });

      if (writePolicyError) {
        console.warn(`Erro ao criar política de escrita para ${table}:`, writePolicyError);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao aplicar políticas específicas de tabela:', error);
    return { success: false, error };
  }
};

// SQL personalizado para criar função auxiliar de políticas RLS
const createAuthPolicyFunction = async () => {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE OR REPLACE FUNCTION create_auth_policy(
          table_name text,
          policy_name text,
          policy_definition text,
          operation text
        ) RETURNS void AS $$
        BEGIN
          -- Verifica se a política já existe
          IF EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' AND tablename = table_name AND policyname = policy_name
          ) THEN
            -- Remove a política existente
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, table_name);
          END IF;
          
          -- Cria a nova política
          EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR %s TO authenticated USING (%s)',
            policy_name, table_name, operation, policy_definition
          );
          
          -- Garante que RLS está habilitado para a tabela
          EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (error) {
      console.error('Erro ao criar função auxiliar para políticas:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao executar SQL para criar função de políticas:', error);
    return { success: false, error };
  }
};

// Exportar a função de configuração
export default applyAllSecurityConfigurations;
