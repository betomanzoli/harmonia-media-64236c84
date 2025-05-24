import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivueqxyuflxsiecqvmgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM';

const hybridStorage = {
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
    localStorage.removeItem(key);
    document.cookie = `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: hybridStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Funções mockadas atualizadas
const createMockQueryResponse = () => ({
  data: null,
  error: null,
  count: 0,
  status: 200,
  statusText: 'OK'
});

export default supabase;
