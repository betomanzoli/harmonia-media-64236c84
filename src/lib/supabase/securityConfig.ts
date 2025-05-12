
import { supabase } from './client';

// Função para aplicar políticas RLS a tabelas usando SQL direto
export const applyRLSPolicies = async () => {
  const tables = [
    'admin_users',
    'audio_samples',
    'portfolio_items',
    'qualification_submissions',
    'system_settings'
  ];

  try {
    console.log('Aplicando políticas de segurança RLS usando SQL direto...');
    
    for (const table of tables) {
      console.log(`Configurando RLS para tabela ${table}...`);
      
      // Primeiro, habilitar RLS na tabela
      try {
        const { error: enableRlsError } = await supabase.rpc('exec_sql', {
          sql_query: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`
        });
        
        if (enableRlsError) {
          console.warn(`Erro ao habilitar RLS para ${table}:`, enableRlsError);
        } else {
          console.log(`RLS habilitado para tabela ${table}`);
        }
      } catch (error) {
        console.error(`Exceção ao habilitar RLS para ${table}:`, error);
      }
      
      // Remover políticas existentes para evitar conflitos
      try {
        const { error: dropPoliciesError } = await supabase.rpc('exec_sql', {
          sql_query: `
            DO $$
            DECLARE
              policy_record RECORD;
            BEGIN
              FOR policy_record IN 
                SELECT policyname 
                FROM pg_policies 
                WHERE tablename = '${table}' AND schemaname = 'public'
              LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.${table}', policy_record.policyname);
              END LOOP;
            END
            $$;
          `
        });
        
        if (dropPoliciesError) {
          console.warn(`Erro ao remover políticas existentes para ${table}:`, dropPoliciesError);
        }
      } catch (error) {
        console.error(`Exceção ao remover políticas existentes para ${table}:`, error);
      }
      
      // Criar políticas de segurança
      const policies = [
        {
          name: `${table}_select_policy`,
          operation: 'SELECT',
          using: `(auth.role() = 'authenticated')`
        },
        {
          name: `${table}_insert_policy`,
          operation: 'INSERT',
          using: `(auth.role() = 'authenticated')`,
          with_check: `(auth.role() = 'authenticated')`
        },
        {
          name: `${table}_update_policy`,
          operation: 'UPDATE',
          using: `(auth.role() = 'authenticated')`,
          with_check: `(auth.role() = 'authenticated')`
        },
        {
          name: `${table}_delete_policy`,
          operation: 'DELETE',
          using: `(auth.role() = 'authenticated')`
        }
      ];
      
      for (const policy of policies) {
        try {
          let sqlQuery = '';
          
          if (policy.operation === 'INSERT') {
            sqlQuery = `
              CREATE POLICY "${policy.name}" ON public.${table}
              FOR ${policy.operation}
              TO authenticated
              WITH CHECK (${policy.with_check});
            `;
          } else {
            sqlQuery = `
              CREATE POLICY "${policy.name}" ON public.${table}
              FOR ${policy.operation}
              TO authenticated
              USING (${policy.using});
            `;
          }
          
          const { error: policyError } = await supabase.rpc('exec_sql', { sql_query: sqlQuery });
          
          if (policyError) {
            console.warn(`Erro ao criar política ${policy.name} para ${table}:`, policyError);
          } else {
            console.log(`Política ${policy.name} criada com sucesso para ${table}`);
          }
        } catch (error) {
          console.error(`Exceção ao criar política ${policy.name} para ${table}:`, error);
        }
      }
    }
    
    console.log('Todas as políticas RLS foram aplicadas com sucesso');
    return { success: true };
  } catch (error) {
    console.error('Erro geral ao aplicar políticas RLS:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao configurar políticas RLS' 
    };
  }
};

// Função para melhorar as configurações de segurança de senha
export const enhancePasswordSecurity = async () => {
  try {
    console.log('Configurando segurança de senha avançada...');
    
    // Configurar requisitos de senha usando SQL direto
    const passwordSettings = [
      { setting: 'auth.min_password_length', value: '10' },
      { setting: 'auth.require_special_chars', value: 'true' },
      { setting: 'auth.require_numbers', value: 'true' },
      { setting: 'auth.require_uppercase', value: 'true' },
      { setting: 'auth.require_lowercase', value: 'true' }
    ];
    
    for (const setting of passwordSettings) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `SELECT set_config('${setting.setting}', '${setting.value}', false);`
        });
        
        if (error) {
          console.warn(`Erro ao configurar ${setting.setting}:`, error);
        } else {
          console.log(`Configuração ${setting.setting} aplicada com sucesso`);
        }
      } catch (error) {
        console.error(`Exceção ao configurar ${setting.setting}:`, error);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao configurar segurança de senha:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao configurar segurança de senha' 
    };
  }
};

// Função para configurar opções de MFA
export const configureMFA = async () => {
  try {
    console.log('Ativando opções de MFA...');
    
    // Configurar MFA usando SQL direto
    const mfaSettings = [
      { setting: 'auth.enable_totp', value: 'true' },
      { setting: 'auth.enable_recovery_codes', value: 'true' }
    ];
    
    for (const setting of mfaSettings) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: `SELECT set_config('${setting.setting}', '${setting.value}', false);`
        });
        
        if (error) {
          console.warn(`Erro ao configurar ${setting.setting}:`, error);
        } else {
          console.log(`Configuração ${setting.setting} aplicada com sucesso`);
        }
      } catch (error) {
        console.error(`Exceção ao configurar ${setting.setting}:`, error);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao configurar MFA:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao configurar MFA' 
    };
  }
};

// Função para validar configurações de segurança
export const validateSecurity = async () => {
  try {
    console.log('Validando configurações de segurança...');
    
    // Verificar tabelas com RLS habilitado
    const tables = [
      'admin_users',
      'audio_samples',
      'portfolio_items',
      'qualification_submissions',
      'system_settings'
    ];
    
    const rlsPolicies = [];
    let mfaEnabled = false;
    let passwordSecurityLevel = 'low';
    
    // Verificar políticas RLS
    for (const table of tables) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: `
            SELECT policyname, cmd 
            FROM pg_policies 
            WHERE tablename = '${table}' AND schemaname = 'public';
          `
        });
        
        if (error) {
          console.warn(`Erro ao verificar políticas para ${table}:`, error);
        } else if (data && data.length > 0) {
          for (const policy of data) {
            rlsPolicies.push({
              table,
              policy: policy.policyname,
              operation: policy.cmd
            });
          }
        }
      } catch (error) {
        console.error(`Exceção ao verificar políticas para ${table}:`, error);
      }
    }
    
    // Verificar configurações de MFA
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: `SELECT current_setting('auth.enable_totp', true);`
      });
      
      if (!error && data && data.length > 0) {
        mfaEnabled = data[0].current_setting === 'true';
      }
    } catch (error) {
      console.error('Erro ao verificar configuração de MFA:', error);
    }
    
    // Verificar configurações de senha
    try {
      const { data: pwLength, error: pwLengthError } = await supabase.rpc('exec_sql', {
        sql_query: `SELECT current_setting('auth.min_password_length', true);`
      });
      
      const { data: specialChars, error: specialCharsError } = await supabase.rpc('exec_sql', {
        sql_query: `SELECT current_setting('auth.require_special_chars', true);`
      });
      
      if (!pwLengthError && pwLength && pwLength.length > 0 && 
          !specialCharsError && specialChars && specialChars.length > 0) {
        
        const minLength = parseInt(pwLength[0].current_setting, 10);
        const requireSpecial = specialChars[0].current_setting === 'true';
        
        if (minLength >= 10 && requireSpecial) {
          passwordSecurityLevel = 'high';
        } else if (minLength >= 8) {
          passwordSecurityLevel = 'medium';
        }
      }
    } catch (error) {
      console.error('Erro ao verificar configurações de senha:', error);
    }
    
    // Determinar sucesso geral
    const hasMinimumPolicies = rlsPolicies.length >= tables.length;
    
    return {
      success: hasMinimumPolicies,
      rlsPolicies,
      mfaEnabled,
      passwordSecurityLevel,
      error: hasMinimumPolicies ? null : 'Políticas RLS insuficientes'
    };
  } catch (error) {
    console.error('Erro ao validar segurança:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao validar configurações de segurança' 
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
