import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Utility hook to set up database tables if they don't exist
export const useDatabaseSetup = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      console.log("Checking and initializing database tables if needed...");
      
      // Check if we're online before proceeding
      if (!navigator.onLine) {
        console.log('Application is offline. Skipping database initialization.');
        return;
      }
      
      try {
        // Improved approach to verify table existence and create if needed
        const checkAndCreateTable = async (tableName: string, createFunctionName: string) => {
          try {
            // Check if table exists with improved error handling
            const { error: checkError } = await supabase
              .from(tableName)
              .select('count(*)', { count: 'exact', head: true });
            
            if (checkError) {
              // If error indicates table doesn't exist, create it
              if (checkError.code === '42P01' || checkError.message?.includes('does not exist')) {
                console.log(`Table ${tableName} doesn't exist. Creating...`);
                
                try {
                  const { error: createError } = await supabase.rpc(createFunctionName);
                  
                  if (createError) {
                    console.error(`Error creating ${tableName} table:`, createError);
                  } else {
                    console.log(`Table ${tableName} created successfully.`);
                  }
                } catch (rpcError) {
                  console.error(`Error calling ${createFunctionName}:`, rpcError);
                }
              } else {
                // Other type of error occurred
                console.error(`Error checking ${tableName} table:`, checkError);
              }
            } else {
              console.log(`Table ${tableName} already exists.`);
            }
          } catch (err) {
            console.error(`Error in table verification process for ${tableName}:`, err);
          }
        };
        
        // Check and create the necessary tables
        await checkAndCreateTable('preview_tokens', 'create_preview_tokens_table');
        await checkAndCreateTable('access_logs', 'create_access_logs_table');
        await checkAndCreateTable('project_files', 'create_project_files_table');
        await checkAndCreateTable('preview_projects', 'create_preview_projects_table');
        
      } catch (err) {
        console.error("Error initializing database tables:", err);
      }
    };
    
    initializeDatabase();
  }, []);
  
  return null;
};
