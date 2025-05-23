
import { useState, useEffect } from 'react';
import supabaseClient from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface AudioSample {
  id: string;
  title: string;
  artist?: string;
  description?: string;
  audioUrl: string;
  coverUrl?: string;
  duration?: number;
  createdAt: Date;
}

export const useAudioSamples = (projectId?: string) => {
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSamples = async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch samples from portfolio_items table
      const { data, error: supabaseError } = await supabaseClient
        .from('portfolio_items')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', 'audio');
      
      if (supabaseError) throw new Error(supabaseError.message);
      
      if (data && data.length > 0) {
        const formattedSamples = data.map((item) => ({
          id: item.id,
          title: item.title || 'Untitled Sample',
          description: item.description || '',
          audioUrl: item.audio_url || '',
          coverUrl: item.thumbnail_url || '',
          createdAt: new Date(item.created_at || Date.now()),
        }));
        
        setSamples(formattedSamples);
      } else {
        // If no data, provide empty array
        setSamples([]);
      }
    } catch (err: any) {
      console.error('Error fetching audio samples:', err);
      setError(err.message);
      
      // Provide fallback demo data
      setSamples([
        {
          id: uuidv4(),
          title: 'Demo Audio Sample',
          artist: 'Demo Artist',
          description: 'This is a demo sample for preview purposes.',
          audioUrl: 'https://example.com/demo.mp3',
          coverUrl: 'https://placehold.co/400x400/6d28d9/ffffff?text=Demo+Audio',
          duration: 180,
          createdAt: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, [projectId]);

  const addSample = (sample: Omit<AudioSample, 'id' | 'createdAt'>) => {
    const newSample = {
      ...sample,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    setSamples((prev) => [...prev, newSample]);
    return newSample.id;
  };

  const removeSample = (id: string) => {
    setSamples((prev) => prev.filter((sample) => sample.id !== id));
  };

  const updateSample = (id: string, updates: Partial<AudioSample>) => {
    setSamples((prev) =>
      prev.map((sample) =>
        sample.id === id ? { ...sample, ...updates } : sample
      )
    );
  };

  return {
    samples,
    isLoading,
    error,
    addSample,
    removeSample,
    updateSample,
    refreshSamples: fetchSamples,
  };
};
