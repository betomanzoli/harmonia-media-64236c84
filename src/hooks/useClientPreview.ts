
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClientPreview = (previewCode: string) => {
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (previewCode) {
      loadPreviewData();
    }
  }, [previewCode]);

  const loadPreviewData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('preview_code', previewCode)
        .single();

      if (error) throw error;
      setPreviewData(data);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a prévia.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    previewData,
    isLoading,
    reloadPreview: loadPreviewData
  };
};
