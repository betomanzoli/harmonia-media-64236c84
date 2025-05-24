import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

// Sistema de armazenamento híbrido para navegadores privados
const getHybridStorage = () => ({
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`))
        ?.split('=')[1];
      return cookie ? decodeURIComponent(cookie) : null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Secure; SameSite=None; Partitioned`;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      document.cookie = `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getHybridStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'harmonia-auth'
  },
  global: {
    fetch: (...args: Parameters<typeof fetch>) => {
      return fetch(...args).catch(error => {
        console.error('Supabase fetch error:', error);
        throw error;
      });
    }
  }
});

export const getSupabaseUrl = () => supabaseUrl;

console.log('🔌 Cliente Supabase inicializado com conexão atualizada.');
