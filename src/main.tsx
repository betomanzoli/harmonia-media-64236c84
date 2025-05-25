
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { cleanupWindowEthereum, setupGlobalErrorHandling } from './utils/windowCleanup.ts'
import './index.css'

// Immediate cleanup of ethereum-related objects
cleanupWindowEthereum();

// Setup global error handling
setupGlobalErrorHandling();

// Ensure clean initialization by removing any crypto-related scripts
const cleanupAndRender = () => {
  try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    
    // Fallback rendering
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f9fafb; padding: 1rem;">
          <div style="max-width: 400px; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
            <div style="width: 48px; height: 48px; background: #fee2e2; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
              ⚠️
            </div>
            <h1 style="font-size: 1.25rem; font-weight: bold; color: #111; margin-bottom: 0.5rem;">Erro de Carregamento</h1>
            <p style="color: #666; margin-bottom: 1.5rem;">Não foi possível carregar a aplicação. Recarregue a página ou entre em contato conosco.</p>
            <button onclick="window.location.reload()" style="background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
              Recarregar Página
            </button>
          </div>
        </div>
      `;
    }
  }
};

// Run cleanup and render
cleanupAndRender();
