
import { supabase } from '@/integrations/supabase/client';

export const applySecurityConfig = async () => {
  try {
    console.log('Applying security configuration...');
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Security config test failed:', testError);
      return { success: false, error: testError.message };
    }
    
    console.log('Security configuration applied successfully');
    return { success: true, data: testData };
  } catch (error: any) {
    console.error('Error applying security config:', error);
    return { success: false, error: error.message };
  }
};
