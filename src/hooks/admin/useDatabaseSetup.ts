
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
        // Check if the exec_sql function exists (required for other functions)
        const { data: funcExists, error: funcCheckError } = await supabase.rpc(
          'check_if_table_exists',
          { table_name: 'not_real_table_just_checking_function' }
        );
        
        if (funcCheckError && funcCheckError.message && 
            funcCheckError.message.includes('function') && 
            funcCheckError.message.includes('does not exist')) {
          console.log("Database functions don't exist or aren't accessible.");
          // The user will need to manually run the SQL migrations first
          return;
        }
        
        // Improved approach to verify table existence and create if needed
        const checkAndCreateTable = async (tableName: string, createFunctionName: string) => {
          try {
            console.log(`Checking if table ${tableName} exists...`);
            // Check if table exists with improved error handling
            const { error: checkError } = await supabase
              .from(tableName)
              .select('count(*)', { count: 'exact', head: true });
            
            if (checkError) {
              // If error indicates table doesn't exist, create it
              if (checkError.code === '42P01' || 
                  checkError.message?.includes('does not exist') ||
                  checkError.message?.toLowerCase().includes('relation') && 
                  checkError.message?.toLowerCase().includes('not')) {
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
        
        // Check and create the necessary tables with defensive retry logic
        const tables = [
          { name: 'preview_tokens', func: 'create_preview_tokens_table' },
          { name: 'access_logs', func: 'create_access_logs_table' },
          { name: 'project_files', func: 'create_project_files_table' },
          { name: 'preview_projects', func: 'create_preview_projects_table' }
        ];
        
        for (const table of tables) {
          await checkAndCreateTable(table.name, table.func);
        }
        
      } catch (err) {
        console.error("Error initializing database tables:", err);
      }
    };
    
    // Only run when online
    if (navigator.onLine) {
      initializeDatabase();
    } else {
      console.log('Application is offline. Database initialization skipped.');
    }
    
    // Add listener for online status changes
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        console.log('App is back online. Initializing database...');
        initializeDatabase();
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
    };
  }, []);
  
  return null;
};
