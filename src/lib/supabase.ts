import { createClient } from '@supabase/supabase-js';

// ✅ USAR VARIÁVEIS DE AMBIENTE CORRETAS PARA VITE
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ FALLBACK PARA DESENVOLVIMENTO (remover em produção)
const fallbackUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// ✅ VERIFICAÇÃO E FALLBACK
const finalUrl = supabaseUrl || fallbackUrl;
const finalKey = supabaseAnonKey || fallbackKey;

// ✅ VERIFICAR SE AS VARIÁVEIS ESTÃO DISPONÍVEIS
if (!finalUrl || !finalKey) {
  console.error('❌ Erro: Variáveis do Supabase não encontradas');
  console.error('URL:', finalUrl);
  console.error('Key disponível:', !!finalKey);
}

// ✅ CRIAR CLIENTE COM CONFIGURAÇÃO OTIMIZADA
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'harmonia-media@1.0.0'
    }
  },
  db: {
    schema: 'public'
  }
});

// ✅ LOG PARA DEBUG (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('✅ Supabase client inicializado:', {
    url: finalUrl,
    hasKey: !!finalKey,
    mode: import.meta.env.MODE
  });
}

// ✅ EXPORT DEFAULT PARA COMPATIBILIDADE
export default supabase;

// ✅ TYPES PARA TYPESCRIPT
export type Database = any; // Definir types específicos depois
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
