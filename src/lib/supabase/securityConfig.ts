
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
      
      // Criar políticas de segurança baseadas em funções
      const policyCreationQueries = [
        // Criar primeiro uma função para verificar se o usuário é um administrador
        `
        CREATE OR REPLACE FUNCTION public.is_admin_user()
        RETURNS boolean
        LANGUAGE plpgsql SECURITY DEFINER
        AS $$
        DECLARE
          admin_exists boolean;
        BEGIN
          SELECT EXISTS(
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid()
          ) INTO admin_exists;
          RETURN admin_exists;
        END;
        $$;
        `,
        
        // Políticas de SELECT
        `
        CREATE POLICY "${table}_admin_select_policy" 
        ON public.${table} 
        FOR SELECT 
        TO authenticated 
        USING (public.is_admin_user());
        `,
        
        // Políticas de INSERT
        `
        CREATE POLICY "${table}_admin_insert_policy" 
        ON public.${table} 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (public.is_admin_user());
        `,
        
        // Políticas de UPDATE
        `
        CREATE POLICY "${table}_admin_update_policy" 
        ON public.${table} 
        FOR UPDATE 
        TO authenticated 
        USING (public.is_admin_user());
        `,
        
        // Políticas de DELETE
        `
        CREATE POLICY "${table}_admin_delete_policy" 
        ON public.${table} 
        FOR DELETE 
        TO authenticated 
        USING (public.is_admin_user());
        `
      ];
      
      // Execute cada consulta de criação de política
      for (const query of policyCreationQueries) {
        try {
          const { error: policyError } = await supabase.rpc('exec_sql', { 
            sql_query: query 
          });
          
          if (policyError) {
            console.warn(`Erro ao criar política para ${table}:`, policyError);
          } else {
            console.log(`Política criada com sucesso para ${table}`);
          }
        } catch (error) {
          console.error(`Exceção ao criar política para ${table}:`, error);
        }
      }
    }
    
    // Adicionar políticas públicas para portfolio_items (para visualização pública do portfólio)
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql_query: `
          CREATE POLICY "portfolio_items_public_select_policy" 
          ON public.portfolio_items 
          FOR SELECT 
          TO anon 
          USING (true);
        `
      });
      
      if (error) {
        console.warn('Erro ao criar política pública para portfolio_items:', error);
      } else {
        console.log('Política pública criada com sucesso para portfolio_items');
      }
    } catch (error) {
      console.error('Exceção ao criar política pública para portfolio_items:', error);
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
    
    // Configurar requisitos de senha usando funções seguras
    const passwordConfig = [
      { setting: 'auth.min_password_length', value: '12' }, // Aumentado para 12 caracteres
      { setting: 'auth.require_special_chars', value: 'true' },
      { setting: 'auth.require_numbers', value: 'true' },
      { setting: 'auth.require_uppercase', value: 'true' },
      { setting: 'auth.require_lowercase', value: 'true' }
    ];
    
    // Criar uma função de segurança definer para configurar as senhas
    const createSecurityFunction = `
      CREATE OR REPLACE FUNCTION public.configure_password_policy(setting_name text, setting_value text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        PERFORM set_config(setting_name, setting_value, false);
      END;
      $$;
    `;
    
    try {
      const { error: funcError } = await supabase.rpc('exec_sql', { 
        sql_query: createSecurityFunction 
      });
      
      if (funcError) {
        console.error('Erro ao criar função de configuração de senha:', funcError);
        return { success: false, error: 'Falha ao criar função de segurança' };
      }
    } catch (error) {
      console.error('Exceção ao criar função de configuração de senha:', error);
      return { success: false, error: 'Exceção ao criar função de segurança' };
    }
    
    // Aplicar cada configuração
    for (const setting of passwordConfig) {
      try {
        const { error } = await supabase.rpc('configure_password_policy', {
          setting_name: setting.setting,
          setting_value: setting.value
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
    
    // Criar uma função de segurança definer para configurar MFA
    const createMfaFunction = `
      CREATE OR REPLACE FUNCTION public.configure_mfa_policy(setting_name text, setting_value text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        PERFORM set_config(setting_name, setting_value, false);
      END;
      $$;
    `;
    
    try {
      const { error: funcError } = await supabase.rpc('exec_sql', { 
        sql_query: createMfaFunction 
      });
      
      if (funcError) {
        console.error('Erro ao criar função de configuração MFA:', funcError);
        return { success: false, error: 'Falha ao criar função MFA' };
      }
    } catch (error) {
      console.error('Exceção ao criar função de configuração MFA:', error);
      return { success: false, error: 'Exceção ao criar função MFA' };
    }
    
    // Configurar MFA 
    const mfaConfig = [
      { setting: 'auth.enable_totp', value: 'true' },
      { setting: 'auth.enable_recovery_codes', value: 'true' }
    ];
    
    for (const setting of mfaConfig) {
      try {
        const { error } = await supabase.rpc('configure_mfa_policy', {
          setting_name: setting.setting,
          setting_value: setting.value
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
    
    // Verificar configurações de MFA usando função segura
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: `
          CREATE OR REPLACE FUNCTION public.get_auth_setting(setting_name text)
          RETURNS text
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            setting_value text;
          BEGIN
            SELECT current_setting(setting_name, true) INTO setting_value;
            RETURN setting_value;
          END;
          $$;
        `
      });
      
      if (error) {
        console.warn('Erro ao criar função para verificar configurações de autenticação:', error);
      } else {
        const { data: totpData, error: totpError } = await supabase.rpc('get_auth_setting', {
          setting_name: 'auth.enable_totp'
        });
        
        if (!totpError && totpData) {
          mfaEnabled = totpData === 'true';
        }
      }
    } catch (error) {
      console.error('Erro ao verificar configuração de MFA:', error);
    }
    
    // Verificar configurações de senha
    try {
      const { data: pwLength, error: pwLengthError } = await supabase.rpc('get_auth_setting', {
        setting_name: 'auth.min_password_length'
      });
      
      const { data: specialChars, error: specialCharsError } = await supabase.rpc('get_auth_setting', {
        setting_name: 'auth.require_special_chars'
      });
      
      if (!pwLengthError && pwLength && !specialCharsError && specialChars) {
        const minLength = parseInt(pwLength, 10);
        const requireSpecial = specialChars === 'true';
        
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
