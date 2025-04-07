
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Interface para as configurações do sistema
export interface SystemSettings {
  webhook_url: string;
  email_notifications_enabled: string;
  chat_bot_enabled: string;
  whatsapp_integration_enabled: string;
  admin_email: string;
  [key: string]: string; // Índice dinâmico para permitir acessar qualquer propriedade
}

interface SaveSettingResult {
  success: boolean;
  error?: string;
}

// Hook personalizado para gerenciar configurações do sistema
export function useSystemSettings() {
  const [settings, setSettings] = useState<Partial<SystemSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const settingsObj: Partial<SystemSettings> = {};
      data?.forEach(item => {
        settingsObj[item.key as keyof SystemSettings] = item.value;
      });
      
      setSettings(settingsObj);
    } catch (err: any) {
      console.error('Erro ao carregar configurações:', err);
      setError(err.message || 'Falha ao carregar configurações do sistema');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Salvar uma configuração específica
  const saveSetting = async (key: keyof SystemSettings, value: string): Promise<SaveSettingResult> => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert(
          { key, value },
          { onConflict: 'key' }
        );
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado local
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      return { success: true };
    } catch (err: any) {
      console.error('Erro ao salvar configuração:', err);
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
    saveSetting
  };
}

export default useSystemSettings;
