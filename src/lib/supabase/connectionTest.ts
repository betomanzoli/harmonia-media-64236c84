
/**
 * Basic tests for Supabase connection
 */

import supabaseClient from '@/integrations/supabase/client';

export const testConnection = async (): Promise<{
  success: boolean;
  message: string;
  status?: number;
}> => {
  try {
    const { error } = await supabaseClient.from('system_settings').select('key').limit(1);
    
    if (error) {
      return {
        success: false,
        message: `Connection error: ${error.message}`,
        status: error.code === 'PGRST116' ? 403 : 500,
      };
    }
    
    return {
      success: true,
      message: 'Successfully connected to Supabase',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Unexpected error: ${err.message || 'Unknown error'}`,
      status: 500,
    };
  }
};

export default { testConnection };
