
import { supabase, getSupabaseUrl } from './client';

// Utility function for validating configuration
export const validateConfiguration = () => {
  const issues = [];
  const supabaseUrl = getSupabaseUrl();
  
  if (!supabaseUrl || !supabaseUrl.includes('https://')) {
    issues.push('URL do Supabase inválida ou não configurada');
  }
  
  // We can't directly check the key presence, so we'll check if it's defined indirectly
  if (!supabase) {
    issues.push('Cliente Supabase não inicializado corretamente');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// Basic connectivity test for the Supabase endpoint
const testEndpointConnectivity = async () => {
  try {
    const supabaseUrl = getSupabaseUrl();
    // Use a more reliable endpoint
    const testUrl = `${supabaseUrl}/rest/v1/?apikey=public-anon-key`;
    
    console.log('Testando disponibilidade básica do endpoint Supabase:', testUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Extended timeout
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'public-anon-key'
      },
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok || response.status === 404) { // 404 is actually fine for this test
      return { 
        success: true, 
        message: `Endpoint do Supabase está respondendo (status ${response.status})` 
      };
    } else {
      return { 
        success: false, 
        error: `Endpoint responde com status de erro: ${response.status}` 
      };
    }
  } catch (err) {
    console.error('Erro ao testar conectividade do endpoint:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido',
      errorType: err instanceof DOMException && err.name === 'AbortError' ? 'timeout' : 'fetch'
    };
  }
};

// Simple test for connection checking
const testSimpleConnection = async () => {
  try {
    const { data, error } = await supabase.from('system_settings').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erro ao verificar tabela do Supabase:', error);
      return { success: false, error, message: error.message };
    }
    
    return { success: true, data, message: 'Conexão com tabela system_settings bem-sucedida' };
  } catch (err) {
    console.error('Exceção ao testar conexão com tabela:', err);
    return { 
      success: false, 
      error: err, 
      message: err instanceof Error ? err.message : 'Erro ao testar tabela' 
    };
  }
};

// Export function for connection diagnostics
export const testSupabaseConnection = async () => {
  try {
    console.log('Testando conexão com o Supabase...');
    
    // Basic internet connectivity check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        connected: false,
        error: 'Sem conexão com a internet. Verifique sua rede.',
        networkStatus: 'offline'
      };
    }
    
    // Check configuration
    const config = validateConfiguration();
    if (!config.isValid) {
      return { 
        connected: false, 
        error: config.issues.join(', '),
        configStatus: 'invalid'
      };
    }
    
    // Basic endpoint connectivity test
    const endpointTest = await testEndpointConnectivity();
    if (!endpointTest.success) {
      // Special handling for CORS issues
      if (endpointTest.error && (
          endpointTest.error.includes('CORS') || 
          endpointTest.error.includes('Failed to fetch')
      )) {
        console.log('Possível problema de CORS detectado, tentando teste simples...');
        // Try the simple test anyway as it might work despite CORS issues with the raw endpoint
        const simpleTest = await testSimpleConnection();
        if (simpleTest.success) {
          console.log('Teste simples bem-sucedido apesar do problema CORS!');
          return {
            connected: true,
            data: simpleTest.data,
            method: 'simple',
            corsWarning: true
          };
        }
      }
      
      return {
        connected: false,
        error: `Falha no acesso ao endpoint Supabase: ${endpointTest.error}`,
        endpointStatus: 'unreachable',
        details: endpointTest
      };
    }
    
    // If endpoint test passes, try the simple test
    console.log('Teste de endpoint bem-sucedido, tentando teste simples...');
    const simpleResult = await testSimpleConnection();
    
    if (simpleResult.success) {
      console.log('Conexão com tabela bem-sucedida!');
      return { 
        connected: true, 
        data: simpleResult.data,
        method: 'simple'
      };
    }
    
    // If simple test fails but endpoint test passed
    return { 
      connected: false, 
      error: `Endpoint acessível, mas falha na operação com a tabela: ${simpleResult.message}`,
      methods: {
        endpoint: endpointTest,
        simple: simpleResult
      }
    };
    
  } catch (err) {
    console.error('Exceção geral ao testar conexão:', err);
    return { 
      connected: false, 
      error: err instanceof Error ? err.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    };
  }
};
