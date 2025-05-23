
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { createId } from '@paralleldrive/cuid2';

export interface Briefing {
  id: string;
  client_name?: string;
  client_email?: string;
  package_type: string;
  status: 'pending' | 'completed' | 'in-progress';
  responses: Record<string, any>;
  created_at: string;
}

export const useBriefings = () => {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBriefings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('briefings')
        .select(`
          id,
          client_id,
          package_type,
          status,
          data:full_responses,
          created_at,
          clients(name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      // Transform the data
      const formattedBriefings: Briefing[] = data?.map((item: any) => ({
        id: item.id,
        client_name: item.clients?.name || 'Unknown Client',
        client_email: item.clients?.email || 'no-email',
        package_type: item.package_type || 'unknown',
        status: item.status || 'pending',
        responses: item.data || {},
        created_at: item.created_at,
      })) || [];
      
      setBriefings(formattedBriefings);
    } catch (err: any) {
      console.error('Error fetching briefings:', err);
      setError(err.message || 'Failed to load briefings');
      
      // Fallback to demo data in case of error
      setBriefings([
        {
          id: createId(),
          client_name: 'Demo Client',
          client_email: 'demo@example.com',
          package_type: 'essencial',
          status: 'pending',
          responses: { question1: 'Demo response' },
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefings();
  }, []);

  return {
    briefings,
    isLoading,
    error,
    refetch: fetchBriefings,
  };
};
