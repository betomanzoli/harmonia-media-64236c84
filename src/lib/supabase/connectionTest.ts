
import { createClient } from '@supabase/supabase-js';
import { supabase } from './client';

export const getSupabaseUrl = () => {
  return 'https://ivueqxyuflxsiecqvmgt.supabase.co';
};

export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Connection test error:', error);
    return { success: false, error: error.message };
  }
};

export const checkDatabaseConnection = async () => {
  return await testConnection();
};
