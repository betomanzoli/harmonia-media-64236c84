
import { supabase, getSupabaseUrl } from './client';

/**
 * Testa a conexão com o Supabase e retorna informações detalhadas
 * sobre o status da conexão
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('Testando conexão com Supabase...');
    
    // Definir um timeout para a requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos
    
    // Verificar se a conectividade básica da web está ok
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn('Sem conexão com a internet');
      return {
        connected: false,
        tested: true,
        error: 'Sem conexão com a internet',
        networkOnline: false,
        url: getSupabaseUrl()
      };
    }
    
    try {
      // Testar a conexão mais simples possível
      const { error } = await supabase.from('system_settings')
        .select('count(*)', { count: 'exact', head: true })
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Erro na conexão com Supabase:', error);
        return {
          connected: false,
          tested: true,
          error: error.message || 'Erro ao conectar com Supabase',
          errorType: error.code || 'unknown',
          networkOnline: true,
          url: getSupabaseUrl()
        };
      }
      
      return {
        connected: true,
        tested: true,
        networkOnline: true,
        url: getSupabaseUrl()
      };
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('Erro ao testar Supabase:', fetchError);
      
      // Verificar se é um erro de timeout
      if (fetchError.name === 'AbortError') {
        return {
          connected: false,
          tested: true,
          error: 'Timeout ao conectar com Supabase',
          errorType: 'timeout',
          networkOnline: navigator.onLine,
          url: getSupabaseUrl()
        };
      }
      
      // Erro de CORS ou outro erro de fetch
      return {
        connected: false,
        tested: true,
        error: fetchError.message || 'Falha ao conectar com Supabase',
        errorType: 'fetch',
        networkOnline: navigator.onLine,
        url: getSupabaseUrl()
      };
    }
  } catch (err: any) {
    console.error('Exceção ao testar conexão:', err);
    return {
      connected: false,
      tested: true,
      error: err.message || 'Erro inesperado ao testar conexão',
      errorType: 'exception',
      networkOnline: typeof navigator !== 'undefined' ? navigator.onLine : false,
      url: getSupabaseUrl()
    };
  }
};

export default testSupabaseConnection;
