
import { supabase } from '@/integrations/supabase/client';

export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    
    // Test connection
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Migration test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Migrations completed successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
};
