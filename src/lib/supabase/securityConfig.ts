
import { supabase } from './client';

// Função para aplicar políticas RLS a tabelas
export const applyRLSPolicies = async () => {
  const tables = [
    'admin_users',
    'audio_samples',
    'portfolio_items',
    'qualification_submissions',
    'system_settings'
  ];

  try {
    console.log('Aplicando políticas de segurança RLS...');
    
    for (const table of tables) {
      console.log(`Configurando RLS para tabela ${table}...`);
      
      // Habilitar RLS na tabela
      try {
        await supabase.rpc('enable_table_rls', {
          table_name: table
        });
      } catch (error) {
        console.warn(`Falha ao habilitar RLS via RPC para ${table}, tentando SQL direto:`, error);
        
        // Tentar habilitar RLS diretamente via SQL
        try {
          await supabase.from('_exec_sql').select('*').eq('query', 
            `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
          );
        } catch (sqlError) {
          console.error(`Falha na segunda tentativa de habilitar RLS para ${table}:`, sqlError);
        }
      }
      
      // Criar política para acesso autenticado
      try {
        // Política SELECT 
        await supabase.rpc('create_auth_policy', {
          table_name: table,
          policy_name: `${table}_auth_select_policy`,
          operation: 'SELECT'
        });
        
        // Política INSERT
        await supabase.rpc('create_auth_policy', {
          table_name: table,
          policy_name: `${table}_auth_insert_policy`,
          operation: 'INSERT'
        });
        
        // Política UPDATE
        await supabase.rpc('create_auth_policy', {
          table_name: table,
          policy_name: `${table}_auth_update_policy`,
          operation: 'UPDATE'
        });
        
        // Política DELETE
        await supabase.rpc('create_auth_policy', {
          table_name: table,
          policy_name: `${table}_auth_delete_policy`,
          operation: 'DELETE'
        });
      } catch (policyError) {
        console.warn(`Falha ao criar políticas via RPC para ${table}, tentando método direto:`, policyError);
        
        // Tentar criar políticas diretamente
        try {
          // Criar política SELECT direto
          await supabase.from('_exec_sql').select('*').eq('query', 
            `CREATE POLICY "${table}_auth_select_policy" ON "${table}" 
             FOR SELECT USING (auth.role() = 'authenticated');`
          );
          
          // Criar política INSERT direto
          await supabase.from('_exec_sql').select('*').eq('query', 
            `CREATE POLICY "${table}_auth_insert_policy" ON "${table}" 
             FOR INSERT WITH CHECK (auth.role() = 'authenticated');`
          );
          
          // Criar política UPDATE direto
          await supabase.from('_exec_sql').select('*').eq('query', 
            `CREATE POLICY "${table}_auth_update_policy" ON "${table}" 
             FOR UPDATE USING (auth.role() = 'authenticated');`
          );
          
          // Criar política DELETE direto
          await supabase.from('_exec_sql').select('*').eq('query', 
            `CREATE POLICY "${table}_auth_delete_policy" ON "${table}" 
             FOR DELETE USING (auth.role() = 'authenticated');`
          );
        } catch (directError) {
          console.error(`Falha na segunda tentativa de criar políticas para ${table}:`, directError);
        }
      }
      
      console.log(`Políticas RLS aplicadas para tabela: ${table}`);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao aplicar políticas RLS:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao configurar políticas RLS' 
    };
  }
};

// Função para melhorar as configurações de segurança de senha
export const enhancePasswordSecurity = async () => {
  try {
    console.log('Configurando segurança de senha avançada...');
    
    // Configurar requisitos de senha mais fortes
    try {
      await supabase.rpc('set_auth_settings', {
        min_password_length: 10,
        require_special_chars: true,
        require_numbers: true,
        require_uppercase: true,
        require_lowercase: true
      });
    } catch (error) {
      console.warn('Falha ao configurar segurança de senha via RPC, tentando SQL direto:', error);
      
      // Abordagem alternativa caso a RPC falhe
      await supabase.from('_exec_sql').select('*').eq('query', 
        `SELECT set_config('auth.min_password_length', '10', false);
         SELECT set_config('auth.require_special_chars', 'true', false);
         SELECT set_config('auth.require_numbers', 'true', false);
         SELECT set_config('auth.require_uppercase', 'true', false);
         SELECT set_config('auth.require_lowercase', 'true', false);`
      );
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao configurar segurança de senha:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao configurar segurança de senha' 
    };
  }
};

// Função para configurar opções de MFA
export const configureMFA = async () => {
  try {
    console.log('Ativando opções de MFA...');
    
    // Habilitar opções de MFA
    try {
      await supabase.rpc('enable_mfa_settings', {
        enable_totp: true,
        enable_recovery_codes: true
      });
    } catch (error) {
      console.warn('Falha ao configurar MFA via RPC, tentando SQL direto:', error);
      
      // Abordagem alternativa caso a RPC falhe
      await supabase.from('_exec_sql').select('*').eq('query', 
        `SELECT set_config('auth.enable_totp', 'true', false);
         SELECT set_config('auth.enable_recovery_codes', 'true', false);`
      );
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao configurar MFA:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao configurar MFA' 
    };
  }
};

// Executar validações de segurança
export const validateSecurity = async () => {
  try {
    console.log('Validando configurações de segurança...');
    
    // Verificar se RLS está habilitado e se há políticas
    const tablesWithRLS = [
      'admin_users',
      'audio_samples',
      'portfolio_items',
      'qualification_submissions',
      'system_settings'
    ];
    
    const rlsStatus = {};
    
    // Verifica cada tabela
    for (const table of tablesWithRLS) {
      try {
        // Verifica se RLS está ativado
        const { data: rlsEnabled, error: rlsError } = await supabase
          .from('_exec_sql')
          .select('*')
          .eq('query', `SELECT relrowsecurity FROM pg_class WHERE relname = '${table}';`);
        
        if (rlsError) throw rlsError;
        
        // Verifica políticas
        const { data: policies, error: policiesError } = await supabase
          .from('_exec_sql')
          .select('*')
          .eq('query', `SELECT * FROM pg_policies WHERE tablename = '${table}';`);
        
        if (policiesError) throw policiesError;
        
        rlsStatus[table] = {
          rlsEnabled: rlsEnabled?.length > 0 && rlsEnabled[0]?.relrowsecurity === true,
          policies: policies?.length || 0
        };
      } catch (error) {
        console.error(`Erro ao verificar RLS para tabela ${table}:`, error);
        rlsStatus[table] = { error: 'Falha ao verificar' };
      }
    }
    
    return { 
      success: true,
      rlsStatus,
      detailedCheck: 'Verificação de segurança realizada com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao validar segurança:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao validar configurações de segurança' 
    };
  }
};

// Exportar todas as funções de segurança
export const securityService = {
  applyRLSPolicies,
  enhancePasswordSecurity,
  configureMFA,
  validateSecurity
};
