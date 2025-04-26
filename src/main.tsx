
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initializeMockPreviewData } from './utils/mockPreviewsData'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from "@/components/ui/toaster"

// Initialize mock data for previews if none exists
initializeMockPreviewData();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  </BrowserRouter>
);
