
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Utility hook to set up database tables if they don't exist
export const useDatabaseSetup = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      console.log("Checking and initializing database tables if needed...");
      
      try {
        // Check preview_tokens table
        const { error: previewTokensError } = await supabase
          .from('preview_tokens')
          .select('id')
          .limit(1);
          
        if (previewTokensError && previewTokensError.code === '42P01') {
          console.log("Creating preview_tokens table");
          
          // Create the preview_tokens table
          const { error } = await supabase.rpc('create_preview_tokens_table');
          if (error) console.error("Error creating preview_tokens table:", error);
        }
        
        // Check access_logs table
        const { error: accessLogsError } = await supabase
          .from('access_logs')
          .select('id')
          .limit(1);
          
        if (accessLogsError && accessLogsError.code === '42P01') {
          console.log("Creating access_logs table");
          
          // Create the access_logs table
          const { error } = await supabase.rpc('create_access_logs_table');
          if (error) console.error("Error creating access_logs table:", error);
        }
        
        // Check project_files table
        const { error: projectFilesError } = await supabase
          .from('project_files')
          .select('id')
          .limit(1);
          
        if (projectFilesError && projectFilesError.code === '42P01') {
          console.log("Creating project_files table");
          
          // Create the project_files table
          const { error } = await supabase.rpc('create_project_files_table');
          if (error) console.error("Error creating project_files table:", error);
        }
        
        // Check preview_projects table
        const { error: previewProjectsError } = await supabase
          .from('preview_projects')
          .select('id')
          .limit(1);
          
        if (previewProjectsError && previewProjectsError.code === '42P01') {
          console.log("Creating preview_projects table");
          
          // Create the preview_projects table directly
          await supabase.rpc('create_preview_projects_table');
        }
      } catch (err) {
        console.error("Error initializing database tables:", err);
      }
    };
    
    initializeDatabase();
  }, []);
  
  return null;
};
