
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
        // Verificar se estamos online antes de prosseguir
        if (!navigator.onLine) {
          console.log('Aplicação está offline. Pulando verificação de funções.');
          return;
        }
        
        // Verificar se as funções existem de maneira segura
        try {
          // Tentar chamar uma função para testar
          const { error } = await supabase.rpc('check_if_table_exists', { table_name: 'not_real_table' });
          
          if (error && error.message && error.message.includes('Could not find the function')) {
            console.log("Database functions don't exist, creating them...");
            
            try {
              // Execute SQL file to create functions
              const response = await fetch('/supabase/migrations/20250522_create_db_functions.sql');
              
              if (!response.ok) {
                console.error(`Failed to fetch SQL file: ${response.status} ${response.statusText}`);
                return;
              }
              
              const sql = await response.text();
              
              // Split into individual statements and execute them
              const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
              
              for (const statement of statements) {
                try {
                  await supabase.rpc('exec_sql', { sql: statement });
                } catch (err) {
                  console.warn("Error executing SQL statement, may already exist:", err);
                }
              }
              
              console.log("Database functions created successfully");
            } catch (fetchError) {
              console.error("Error fetching or executing SQL file:", fetchError);
            }
          } else if (error) {
            // Se o erro não for "função não encontrada", pode ser outro problema
            console.log("Outro erro ao verificar funções:", error);
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
    
    initializeDatabaseFunctions();
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
