
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Utility hook to set up database tables if they don't exist
export const useDatabaseSetup = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      console.log("Checking and initializing database tables if needed...");
      
      try {
        // Verificar existência das tabelas com tratamento de erro aprimorado
        const checkTableExists = async (tableName: string, createFunction: string) => {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('id')
              .limit(1);
            
            // Se ocorrer um erro do tipo "tabela não existe" (código 42P01)
            if (error && error.code === '42P01') {
              console.log(`Creating ${tableName} table`);
              
              try {
                const { error: createError } = await supabase.rpc(createFunction);
                if (createError) {
                  console.error(`Error creating ${tableName} table:`, createError);
                } else {
                  console.log(`Successfully created ${tableName} table`);
                }
              } catch (rpcError) {
                console.error(`Failed to call ${createFunction}:`, rpcError);
              }
            }
          } catch (err) {
            console.error(`Error checking ${tableName} table:`, err);
          }
        };
        
        // Verificar cada tabela
        await checkTableExists('preview_tokens', 'create_preview_tokens_table');
        await checkTableExists('access_logs', 'create_access_logs_table');
        await checkTableExists('project_files', 'create_project_files_table');
        await checkTableExists('preview_projects', 'create_preview_projects_table');
        
      } catch (err) {
        console.error("Error initializing database tables:", err);
      }
    };
    
    initializeDatabase();
  }, []);
  
  return null;
};
