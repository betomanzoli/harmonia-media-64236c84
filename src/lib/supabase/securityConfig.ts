
import { supabase } from '@/integrations/supabase/client';

export const securityConfig = {
  testRLS: async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('RLS test failed:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Security config error:', error);
      return { success: false, error: error.message };
    }
  }
};
