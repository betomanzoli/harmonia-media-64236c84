
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BriefingItem {
  id: string;
  name: string;
  email: string;
  packageType: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'approved';
}

export const useBriefings = () => {
  const [briefings, setBriefings] = useState<BriefingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load briefings from Supabase or localStorage
  const loadBriefings = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('briefings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Map from database format
        const mappedBriefings: BriefingItem[] = data.map(item => ({
          id: item.id,
          name: item.client_name,
          email: item.client_email,
          packageType: item.package_type,
          createdAt: new Date(item.created_at).toLocaleDateString('pt-BR'),
          status: item.status || 'pending'
        }));
        
        setBriefings(mappedBriefings);
      } else {
        // Fallback to localStorage
        const storedBriefings = localStorage.getItem('harmonIA_briefings');
        if (storedBriefings) {
          setBriefings(JSON.parse(storedBriefings));
        } else {
          // Sample data if nothing exists
          const sampleBriefings: BriefingItem[] = [
            {
              id: 'B0001',
              name: 'Maria Silva',
              email: 'maria@example.com',
              packageType: 'Essencial',
              createdAt: new Date().toLocaleDateString('pt-BR'),
              status: 'pending'
            },
            {
              id: 'B0002',
              name: 'João Santos',
              email: 'joao@example.com',
              packageType: 'Premium',
              createdAt: new Date().toLocaleDateString('pt-BR'),
              status: 'completed'
            }
          ];
          setBriefings(sampleBriefings);
        }
      }
    } catch (err) {
      console.error('Error loading briefings:', err);
      
      // Fallback to localStorage if Supabase fails
      const storedBriefings = localStorage.getItem('harmonIA_briefings');
      if (storedBriefings) {
        setBriefings(JSON.parse(storedBriefings));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load briefings on component mount
  useEffect(() => {
    loadBriefings();
  }, [loadBriefings]);
  
  // Get briefing by ID
  const getBriefingById = useCallback((id: string) => {
    return briefings.find(briefing => briefing.id === id) || null;
  }, [briefings]);
  
  // Get briefing by email
  const getBriefingByEmail = useCallback((email: string) => {
    return briefings.find(briefing => briefing.email.toLowerCase() === email.toLowerCase()) || null;
  }, [briefings]);

  return {
    briefings,
    isLoading,
    getBriefingById,
    getBriefingByEmail,
    loadBriefings
  };
};
