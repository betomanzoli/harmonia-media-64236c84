
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './contexts/AuthContext';
import router from './routes';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="harmonia-theme">
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
