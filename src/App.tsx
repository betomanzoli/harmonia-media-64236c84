
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import './App.css';
import routes from './routes';
import { initializeSupabaseProjects } from './utils/seedSupabaseProjects';

function App() {
  useEffect(() => {
    // Seed Supabase with projects from localStorage when the app loads
    initializeSupabaseProjects();
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      <ScrollToTop />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
