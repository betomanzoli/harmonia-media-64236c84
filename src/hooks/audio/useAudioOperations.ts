
import { useState } from 'react';
import { AudioSample } from '@/types/audio';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { mockAudioSamples } from './useMockAudioData';

export function useAudioOperations(isOfflineMode: boolean) {
  const { toast } = useToast();

  const addAudioSample = async (newSample: Omit<AudioSample, 'id' | 'created_at'>) => {
    try {
      // Check if in offline mode
      if (isOfflineMode) {
        const mockId = Date.now().toString();
        const sampleWithId: AudioSample = {
          ...newSample,
          id: mockId,
          created_at: new Date().toISOString()
        };
        
        toast({
          title: "Amostra de áudio adicionada",
          description: "Amostra adicionada em modo offline.",
        });
        
        return { success: true, data: sampleWithId };
      }

      // Add to Supabase
      const response = await supabase
        .from('audio_samples')
        .insert([{ ...newSample, created_at: new Date().toISOString() }]);
        
      if (response.error) throw new Error(response.error.message);
      
      toast({
        title: "Amostra de áudio adicionada",
        description: "Amostra adicionada com sucesso ao banco de dados.",
      });
      
      return { success: true, data: newSample };
    } catch (e) {
      const error = e as Error;
      
      toast({
        title: "Erro ao adicionar amostra",
        description: error.message,
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  };

  const deleteAudioSample = async (id: string) => {
    try {
      // Check if in offline mode
      if (isOfflineMode) {
        toast({
          title: "Amostra removida",
          description: "Amostra removida em modo offline.",
        });
        
        return { success: true };
      }

      // Delete from Supabase
      const { error } = await supabase
        .from('audio_samples')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      
      toast({
        title: "Amostra removida",
        description: "Amostra removida com sucesso do banco de dados.",
      });
      
      return { success: true };
    } catch (e) {
      const error = e as Error;
      
      toast({
        title: "Erro ao remover amostra",
        description: error.message,
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  };

  const searchAudioSamples = async (query: string, category?: string) => {
    try {
      // Check if in offline mode
      if (isOfflineMode) {
        const filteredSamples = mockAudioSamples.filter(sample => {
          const matchesQuery = sample.title.toLowerCase().includes(query.toLowerCase()) || 
                            (sample.description && sample.description.toLowerCase().includes(query.toLowerCase())) ||
                            (sample.tags && sample.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())));
          
          const matchesCategory = !category || sample.category === category;
          
          return matchesQuery && matchesCategory;
        });
        
        return { success: true, data: filteredSamples };
      }

      // Fetch data from Supabase
      let query_builder = supabase.from('audio_samples').select('*');
      
      // Then add filters if needed
      if (query) {
        query_builder = query_builder.ilike('title', `%${query}%`);
      }
      
      if (category) {
        query_builder = query_builder.eq('style', category);
      }
      
      const { data, error } = await query_builder;
      
      if (error) throw new Error(error.message);
      
      return { success: true, data: data || [] };
    } catch (e) {
      const error = e as Error;
      
      // Fallback to filtered mock data
      const filteredSamples = mockAudioSamples.filter(sample => {
        const matchesQuery = sample.title.toLowerCase().includes(query.toLowerCase()) || 
                          (sample.description && sample.description.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = !category || sample.category === category;
        
        return matchesQuery && matchesCategory;
      });
      
      return { success: false, error, data: filteredSamples };
    }
  };

  return {
    addAudioSample,
    deleteAudioSample,
    searchAudioSamples
  };
}
