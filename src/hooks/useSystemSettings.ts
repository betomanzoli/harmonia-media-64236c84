
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Interface para as configurações do sistema
export interface SystemSettings {
  marketing_webhook_url?: { url: string };
  notifications_webhook_url?: { url: string };
  email_notifications_enabled?: boolean;
  chat_bot_enabled?: boolean;
  whatsapp_integration_enabled?: boolean;
  admin_email?: string;
  [key: string]: any; // Índice dinâmico para permitir acessar qualquer propriedade
}

interface SaveSettingResult {
  success: boolean;
  error?: string;
}

// Hook personalizado para gerenciar configurações do sistema
export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar todas as configurações
  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');
        
      if (error) {
        throw error;
      }
      
      // Converter a lista de pares chave-valor em um objeto
      const settingsObj: SystemSettings = {};
      data?.forEach(item => {
        settingsObj[item.key] = item.value;
      });
      
      setSettings(settingsObj);
      return settingsObj;
    } catch (err: any) {
      console.error('Erro ao carregar configurações:', err);
      setError(err.message || 'Falha ao carregar configurações do sistema');
      return {};
    } finally {
      setIsLoading(false);
    }
  };
  
  // Obter uma configuração específica
  const getSetting = async (key: string): Promise<any> => {
    try {
      // Primeiro, tenta usar o cache
      if (settings[key] !== undefined) {
        return settings[key];
      }
      
      // Se não tiver em cache, busca do banco de dados
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();
        
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 = No rows returned
          throw error;
        }
        return null;
      }
      
      // Atualizar o cache
      if (data) {
        setSettings(prev => ({
          ...prev,
          [key]: data.value
        }));
        return data.value;
      }
      
      return null;
    } catch (err: any) {
      console.error(`Erro ao buscar configuração ${key}:`, err);
      return null;
    }
  };
  
  // Salvar uma configuração específica
  const saveSetting = async (key: string, value: any): Promise<SaveSettingResult> => {
    try {
      // Verificar se a configuração já existe
      const { data: existingData, error: fetchError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let saveError;
      
      if (existingData?.id) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('system_settings')
          .update({ 
            value,
            updated_at: new Date().toISOString()
          })
          .eq('key', key);
        
        saveError = error;
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('system_settings')
          .insert([{ 
            key,
            value
          }]);
        
        saveError = error;
      }
      
      if (saveError) {
        throw saveError;
      }
      
      // Atualizar o cache
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      toast({
        title: "Configuração salva",
        description: "A configuração foi atualizada com sucesso.",
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao salvar configuração:', err);
      
      toast({
        title: "Erro ao salvar",
        description: err.message || "Não foi possível salvar a configuração.",
        variant: "destructive"
      });
      
      return { 
        success: false, 
        error: err.message || 'Falha ao salvar configuração' 
      };
    }
  };
  
  // Carregar configurações quando o componente montar
  useEffect(() => {
    loadSettings();
  }, []);
  
  return {
    settings,
    isLoading,
    error,
    loadSettings,
    getSetting,
    saveSetting
  };
}

export default useSystemSettings;
