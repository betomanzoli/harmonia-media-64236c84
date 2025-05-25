
import { supabase } from '@/integrations/supabase/client';

export const testAuthConnection = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth test failed:', error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      authenticated: !!user,
      user: user ? { id: user.id, email: user.email } : null
    };
  } catch (error: any) {
    console.error('Auth test error:', error);
    return { success: false, error: error.message };
  }
};
