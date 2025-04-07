
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  testSupabaseConnection, 
  testAuthSettings, 
  getSupabaseUrl 
} from '@/lib/supabase';
import { DebugInfo } from '@/hooks/admin/useAdminLoginForm';

export function useDiagnostics() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    connectionDetails: 'Não testado',
    authSettings: 'Não testado',
    supabaseUrl: '',
    storageInfo: '',
  });
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loadDebugInfo = useCallback(async () => {
    try {
      const supabaseUrlInfo = getSupabaseUrl() || 'URL não disponível';
      
      let storageInfo = 'Não disponível';
      try {
        const storageTested = localStorage.getItem('harmonia-admin-auth-tested');
        const storageSession = localStorage.getItem('harmonia-admin-auth');
        storageInfo = `Teste: ${storageTested ? 'Presente' : 'Ausente'}, Sessão: ${storageSession ? 'Presente' : 'Ausente'}`;
      } catch (e) {
        storageInfo = `Erro ao acessar localStorage: ${e instanceof Error ? e.message : 'Desconhecido'}`;
      }
      
      setDebugInfo(prev => ({
        ...prev,
        supabaseUrl: supabaseUrlInfo,
        storageInfo
      }));
    } catch (e) {
      console.error('Erro ao carregar informações de diagnóstico:', e);
    }
  }, []);

  const runDiagnostics = async () => {
    setIsLoading(true);
    
    try {
      // Verificação básica de conectividade com a internet
      if (!navigator.onLine) {
        throw new Error('Sem conexão com a internet. Verifique sua rede.');
      }

      // Teste do endpoint do Supabase
      const supabaseUrl = getSupabaseUrl();
      
      // Adicionar timestamp para evitar cache
      const testUrl = `${supabaseUrl}/.well-known/ready?ts=${Date.now()}`;
      console.log('Testando disponibilidade do Supabase via fetch direto:', testUrl);
      
      try {
        const response = await fetch(testUrl, { 
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          // Tempo limite de 5 segundos
          signal: AbortSignal.timeout(5000)
        });
        
        const connectivityStatus = response.ok 
          ? 'Endpoint do Supabase está respondendo' 
          : `Endpoint responde com status ${response.status}`;
        
        console.log('Resposta do teste de disponibilidade:', connectivityStatus);
      } catch (fetchErr) {
        console.error('Erro no teste direto do endpoint:', fetchErr);
      }
      
      // Testes padrão
      const connectionTest = await testSupabaseConnection();
      const authTest = await testAuthSettings();
      
      setDebugInfo(prev => ({
        ...prev,
        connectionDetails: JSON.stringify(connectionTest, null, 2),
        authSettings: JSON.stringify(authTest, null, 2),
      }));
      
      toast.toast({
        title: 'Diagnóstico concluído',
        description: connectionTest.connected 
          ? 'Conexão com o Supabase estabelecida com sucesso!' 
          : 'Problemas de conexão detectados. Verifique os detalhes.',
      });
    } catch (err) {
      console.error('Erro ao executar diagnóstico:', err);
      toast.toast({
        title: 'Erro',
        description: 'Falha ao executar diagnóstico completo.',
        variant: 'destructive',
      });
      
      // Atualiza as informações de erro para exibição
      setDebugInfo(prev => ({
        ...prev,
        connectionDetails: JSON.stringify({
          error: err instanceof Error ? err.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
          online: navigator.onLine
        }, null, 2)
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    debugInfo,
    loadDebugInfo,
    runDiagnostics,
    isLoading,
    setIsLoading
  };
}
