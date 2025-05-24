
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PortfolioPage from './pages/PortfolioPage';
import QuestionsPage from './pages/QuestionsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBriefings from './pages/admin/AdminBriefings';
import PreviewProjectPage from './pages/admin/PreviewProjectPage';
import MusicSubmissionPage from './pages/MusicSubmissionPage';
import PreviewPage from './pages/PreviewPage';
import MusicPreviews from './pages/MusicPreviews';
import MusicPreviewPage from './pages/MusicPreviewPage';
import AuthCallback from './pages/AuthCallback';
import AuthPreviewPage from './pages/AuthPreviewPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useDatabaseSetup } from './hooks/admin/useDatabaseSetup';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  // Initialize database tables
  useDatabaseSetup();

  // Create database functions if they don't exist
  useEffect(() => {
    const initializeDatabaseFunctions = async () => {
      try {
        // Check if we're online before proceeding
        if (!navigator.onLine) {
          console.log('Application is offline. Skipping database function verification.');
          return;
        }
        
        // Safely check if the functions exist
        try {
          console.log('Checking if database functions exist...');
          
          // First check if exec_sql exists since it's needed for other functions
          const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
          
          if (error && error.message && error.message.includes('function')) {
            console.log("Database functions don't exist, creating them...");
            
            try {
              // Correct path to SQL file in the public directory
              const response = await fetch('/supabase/migrations/20250522_create_db_functions.sql');
              
              if (!response.ok) {
                console.error(`Failed to fetch SQL file: ${response.status} ${response.statusText}`);
                return;
              }
              
              const sql = await response.text();
              
              // Execute SQL directly with Supabase - this will need RLS permissions
              // We'll use a special SQL executor function that should already exist
              console.log('Executing SQL to create database functions...');
              
              // Create individual statements from the SQL file
              const statements = sql
                .split(';')
                .filter(stmt => stmt.trim().length > 0)
                .map(stmt => stmt.trim() + ';');
              
              // Log how many statements we found for diagnostic purposes
              console.log(`Found ${statements.length} SQL statements to execute`);
              
              // Since we can't execute multiple statements at once through RPC,
              // we need to create a basic function first if it doesn't exist
              const initStatement = `
                CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
                RETURNS void AS $$
                BEGIN
                  EXECUTE sql;
                END;
                $$ LANGUAGE plpgsql SECURITY DEFINER;
              `;
              
              try {
                // Create or replace the exec_sql function directly
                const { error: execSqlError } = await supabase.rpc('exec_sql', { 
                  sql: initStatement 
                });
                
                if (execSqlError) {
                  // If even this fails, we need administrator intervention
                  console.error("Failed to create exec_sql function:", execSqlError);
                  console.log("Please contact the administrator to run the SQL migrations manually.");
                  return;
                }
                
                // Now we can execute the rest of the statements
                for (const statement of statements) {
                  if (statement.length > 10) { // Skip very short statements
                    try {
                      await supabase.rpc('exec_sql', { sql: statement });
                    } catch (err) {
                      console.warn("Error executing SQL statement, may already exist:", err);
                    }
                  }
                }
                
                console.log("Database functions created successfully");
              } catch (execError) {
                console.error("Error executing SQL:", execError);
              }
            } catch (fetchError) {
              console.error("Error fetching or executing SQL file:", fetchError);
            }
          } else if (error) {
            // If the error is not about missing functions, log it
            console.log("Error checking functions:", error);
          } else {
            console.log("Database functions already exist.");
          }
        } catch (rpcError) {
          console.error("Error calling RPC function:", rpcError);
        }
      } catch (error) {
        console.error("Error initializing database functions:", error);
      }
    };
    
    // Only initialize functions when online
    if (navigator.onLine) {
      initializeDatabaseFunctions();
    } else {
      console.log('Application is offline. Database function initialization skipped.');
    }
    
    // Listen for when we come back online
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        console.log('App is back online. Initializing database functions...');
        initializeDatabaseFunctions();
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
    };
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Public Preview Routes */}
      <Route path="/preview/:projectId" element={<PreviewPage />} />
      <Route path="/music-preview/:previewId" element={<MusicPreviews />} />
      <Route path="/view-preview/:projectId" element={<MusicPreviewPage />} />
      <Route path="/auth/preview/:projectId" element={<AuthPreviewPage />} />
      
      {/* Music Submission */}
      <Route path="/submit-music" element={<MusicSubmissionPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route 
        path="/admin-j28s7d1k" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-j28s7d1k/projects" 
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-j28s7d1k/projects/:projectId" 
        element={
          <ProtectedRoute>
            <PreviewProjectPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-j28s7d1k/briefings" 
        element={
          <ProtectedRoute>
            <AdminBriefings />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;
