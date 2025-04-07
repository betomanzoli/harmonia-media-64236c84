
import { useState, useCallback } from 'react';

export interface DebugInfo {
  connectionDetails: string;
  authSettings: string;
  supabaseUrl: string;
  storageInfo: string;
}

export function useDiagnostics() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    connectionDetails: '',
    authSettings: '',
    supabaseUrl: 'api.example.com (modo offline)',
    storageInfo: ''
  });

  const loadDebugInfo = useCallback(async () => {
    try {
      // Verificar informações de storage
      let storageAccessible = false;
      try {
        localStorage.setItem('storage-test', 'test');
        localStorage.removeItem('storage-test');
        storageAccessible = true;
      } catch (e) {
        console.error('Erro ao acessar localStorage:', e);
      }

      const authToken = localStorage.getItem('harmonia-admin-auth-token');
      const authUser = localStorage.getItem('harmonia-admin-auth-user');
      
      // Preparar informações de debug
      setDebugInfo({
        connectionDetails: JSON.stringify({
          online: navigator.onLine,
          userAgent: navigator.userAgent,
          language: navigator.language,
          timestamp: new Date().toISOString()
        }, null, 2),
        authSettings: JSON.stringify({
          hasToken: !!authToken,
          hasUser: !!authUser,
          offlineMode: sessionStorage.getItem('offline-admin-mode') === 'true'
        }, null, 2),
        supabaseUrl: 'api.example.com (modo offline)',
        storageInfo: `Storage acessível: ${storageAccessible ? 'Sim' : 'Não'}`
      });
    } catch (error) {
      console.error('Erro ao carregar informações de diagnóstico:', error);
      setDebugInfo({
        connectionDetails: 'Erro ao carregar',
        authSettings: 'Erro ao carregar',
        supabaseUrl: 'Erro ao carregar',
        storageInfo: 'Erro ao carregar'
      });
    }
  }, []);

  const runDiagnostics = useCallback(async () => {
    try {
      await loadDebugInfo();
      
      console.log('Diagnóstico executado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao executar diagnóstico:', error);
      return false;
    }
  }, [loadDebugInfo]);

  return {
    debugInfo,
    loadDebugInfo,
    runDiagnostics
  };
}
