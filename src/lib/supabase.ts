import { createClient } from '@supabase/supabase-js';

// ✅ VARIÁVEIS DE AMBIENTE PARA VITE (baseado nos search results)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ VALIDAÇÃO DAS VARIÁVEIS
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam variáveis de ambiente do Supabase. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
}

// ✅ CRIAR CLIENTE SUPABASE (configuração otimizada)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ✅ EXPORT DEFAULT PARA COMPATIBILIDADE
export default supabase;

// ✅ LOG APENAS EM DESENVOLVIMENTO
if (import.meta.env.DEV) {
  console.log('✅ Supabase inicializado:', supabaseUrl);
}
