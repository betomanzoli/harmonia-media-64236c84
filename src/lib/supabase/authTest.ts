
/**
 * Basic tests for Supabase authentication
 */

import supabaseClient from '@/integrations/supabase/client';

export const testAuth = async (): Promise<{
  success: boolean;
  message: string;
  user?: any;
}> => {
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      return {
        success: false,
        message: `Auth error: ${error.message}`,
      };
    }
    
    if (!data.session) {
      return {
        success: false,
        message: 'No active session found',
      };
    }
    
    return {
      success: true,
      message: 'Successfully authenticated',
      user: data.session.user,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Unexpected error: ${err.message || 'Unknown error'}`,
    };
  }
};

export default { testAuth };
