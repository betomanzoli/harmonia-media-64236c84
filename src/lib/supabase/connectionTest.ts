
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

// Teste de conectividade básica para o endpoint Supabase
const testEndpointConnectivity = async () => {
  try {
    const supabaseUrl = getSupabaseUrl();
    const testUrl = `${supabaseUrl}/.well-known/ready?ts=${Date.now()}`;
    
    console.log('Testando disponibilidade básica do endpoint Supabase:', testUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
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

// RPC test for connection checking
const testRpcConnection = async () => {
  try {
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('Erro ao verificar versão do Supabase:', error);
      return { success: false, error, message: error.message };
    }
    
    return { success: true, data, message: 'RPC funcionando corretamente' };
  } catch (err) {
    console.error('Exceção ao chamar RPC:', err);
    return { 
      success: false, 
      error: err, 
      message: err instanceof Error ? err.message : 'Erro desconhecido no teste RPC' 
    };
  }
};

// Table test for connection checking
const testTableConnection = async () => {
  try {
    const { data, error } = await supabase.from('system_settings').select('count(*)', { count: 'exact' });
    
    if (error) {
      console.error('Erro de conexão com o Supabase (tabela):', error);
      return { 
        success: false, 
        error, 
        message: `Falha ao acessar tabela: ${error.message}. Código: ${error.code}` 
      };
    }
    
    return { 
      success: true, 
      data, 
      message: 'Conexão com tabela system_settings bem-sucedida' 
    };
  } catch (err) {
    console.error('Exceção ao testar conexão com tabela:', err);
    return { 
      success: false, 
      error: err, 
      message: err instanceof Error ? err.message : 'Erro ao testar tabela' 
    };
  }
};

// Adicionando função para diagnóstico de conexão
export const testSupabaseConnection = async () => {
  try {
    console.log('Testando conexão com o Supabase...');
    
    // Verificação básica de internet
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        connected: false,
        error: 'Sem conexão com a internet. Verifique sua rede.',
        networkStatus: 'offline'
      };
    }
    
    // Verificar configuração
    const config = validateConfiguration();
    if (!config.isValid) {
      return { 
        connected: false, 
        error: config.issues.join(', '),
        configStatus: 'invalid'
      };
    }
    
    // Teste básico de conectividade do endpoint
    const endpointTest = await testEndpointConnectivity();
    if (!endpointTest.success) {
      return {
        connected: false,
        error: `Falha no acesso ao endpoint Supabase: ${endpointTest.error}`,
        endpointStatus: 'unreachable',
        details: endpointTest
      };
    }
    
    // Testar RPC primeiro
    const rpcResult = await testRpcConnection();
    
    if (rpcResult.success) {
      console.log('Conexão RPC com o Supabase bem-sucedida!');
      return { 
        connected: true, 
        data: rpcResult.data,
        method: 'rpc'
      };
    }
    
    // Se RPC falhar, testar tabela
    console.log('Teste RPC falhou, tentando teste de tabela...');
    const tableResult = await testTableConnection();
    
    if (tableResult.success) {
      console.log('Conexão com tabela bem-sucedida!');
      return { 
        connected: true, 
        data: tableResult.data,
        method: 'table'
      };
    }
    
    // Ambos os testes falharam
    return { 
      connected: false, 
      error: `Falha em ambos os métodos: ${rpcResult.message}, ${tableResult.message}`,
      methods: {
        rpc: rpcResult,
        table: tableResult
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
