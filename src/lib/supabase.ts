
import { createClient } from '@supabase/supabase-js';

// Usar valores de ambiente ou valores padrão para desenvolvimento local
// ATENÇÃO: Em produção, sempre use variáveis de ambiente reais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MTQwMzkwLCJleHAiOjE5MzE3MTYzOTB9.example-key';

// Como estamos usando valores padrão, não precisamos desta verificação
// mas manteremos o log para informar o desenvolvedor
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não encontradas. Usando valores padrão para desenvolvimento. Certifique-se de configurar as variáveis de ambiente em produção.');
}

// Criar o cliente Supabase com os valores disponíveis
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Para projetos reais, você precisará configurar um arquivo .env.local com:
// VITE_SUPABASE_URL=sua-url-real-do-projeto
// VITE_SUPABASE_ANON_KEY=sua-chave-anon-real
