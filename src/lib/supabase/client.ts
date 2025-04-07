
import { createClient } from '@supabase/supabase-js';

// Base Supabase configuration
const supabaseUrl = 'https://thqxrpvbnrbdcyjtcgwo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocXhycHZibm5yYmRjeWp0Y2d3byIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzEyNTEzMjEzLCJleHAiOjIwMjgwODkyMTN9.C4-pzdZ59Nd0z_jVBTxpPyxX1WD1FLOjEUSNL1eDZR8';

console.warn('⚠️ Usando chaves padrão do Supabase. Configure as variáveis de ambiente para produção.');
console.log('URL Supabase:', supabaseUrl);

// Inicializar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'harmonia-admin-auth', // Chave dedicada para sessão administrativa
  },
});

// Utility function to safely get the Supabase URL
export const getSupabaseUrl = () => supabaseUrl;

console.log('🔌 Cliente Supabase inicializado.');

// Verificar configurações de segurança ao inicializar
(async () => {
  try {
    const { error } = await supabase.from('system_settings').select('count').limit(1);
    if (error) {
      if (error.code === 'PGRST301') {
        console.warn('⚠️ AVISO DE SEGURANÇA: As tabelas estão com RLS habilitado mas sem políticas.');
        console.warn('ℹ️ Use o componente SecuritySettingsCard para configurar as políticas de segurança.');
      }
    }
  } catch (err) {
    console.error('Erro ao verificar configurações de segurança:', err);
  }
})();
