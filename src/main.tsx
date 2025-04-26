
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initializeMockPreviewData } from './utils/mockPreviewsData'

// Initialize mock data for previews if none exists
initializeMockPreviewData();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
