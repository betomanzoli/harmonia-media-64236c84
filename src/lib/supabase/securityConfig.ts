
import { supabase } from './client';

// Function to apply RLS policies to tables
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
      // Create basic read policy for authenticated users
      await supabase.rpc('create_rls_policy', {
        table_name: table,
        policy_name: `${table}_read_policy`,
        definition: `auth.role() = 'authenticated'`,
        operation: 'SELECT'
      });
      
      // Create basic write policy for authenticated users
      await supabase.rpc('create_rls_policy', {
        table_name: table,
        policy_name: `${table}_write_policy`,
        definition: `auth.role() = 'authenticated'`,
        operation: 'ALL'
      });
      
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

// Function to enhance password security settings
export const enhancePasswordSecurity = async () => {
  try {
    console.log('Configurando segurança de senha avançada...');
    
    // Configure stronger password requirements
    await supabase.rpc('configure_auth_settings', {
      password_min_length: 10,
      password_require_special_char: true,
      password_require_number: true,
      password_require_uppercase: true,
      password_require_lowercase: true
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao configurar segurança de senha:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao configurar segurança de senha' 
    };
  }
};

// Function to configure MFA options
export const configureMFA = async () => {
  try {
    console.log('Ativando opções de MFA...');
    
    // Enable MFA options
    await supabase.rpc('configure_mfa', {
      enable_totp: true,
      enable_recovery_codes: true
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao configurar MFA:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao configurar MFA' 
    };
  }
};

// Run security validations
export const validateSecurity = async () => {
  try {
    console.log('Validando configurações de segurança...');
    
    // Check for RLS policies
    const { data: rlsPolicies, error: rlsError } = await supabase
      .from('pg_policies')
      .select('*');
      
    if (rlsError) throw rlsError;
    
    // Check for MFA configuration
    const { data: mfaConfig, error: mfaError } = await supabase
      .rpc('get_mfa_status');
      
    if (mfaError) throw mfaError;
    
    // Check password security settings
    const { data: passwordConfig, error: passwordError } = await supabase
      .rpc('get_password_settings');
      
    if (passwordError) throw passwordError;
    
    return { 
      success: true,
      rlsPolicies: rlsPolicies || [],
      mfaEnabled: mfaConfig?.enabled || false,
      passwordSecurityLevel: passwordConfig?.security_level || 'low'
    };
  } catch (error: any) {
    console.error('Erro ao validar segurança:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao validar configurações de segurança' 
    };
  }
};

// Export all security functions
export const securityService = {
  applyRLSPolicies,
  enhancePasswordSecurity,
  configureMFA,
  validateSecurity
};
