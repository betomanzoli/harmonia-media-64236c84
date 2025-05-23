
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
  // Add these properties to match what's used in BriefingDetailForm
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  packageType?: string; // Alias for package_type for backward compatibility
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
      const formattedBriefings: Briefing[] = data?.map((item: any) => {
        const briefing: Briefing = {
          id: item.id,
          client_name: item.clients?.name || 'Unknown Client',
          client_email: item.clients?.email || 'no-email',
          package_type: item.package_type || 'unknown',
          status: item.status || 'pending',
          responses: item.data || {},
          created_at: item.created_at,
          // Add these properties to match what's used in BriefingDetailForm
          name: item.clients?.name,
          email: item.clients?.email,
          phone: item.data?.phone || '',
          description: item.data?.description || '',
        };
        
        // Add packageType as an alias for package_type
        briefing.packageType = briefing.package_type;
        
        return briefing;
      }) || [];
      
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
          packageType: 'essencial', // Add alias
          name: 'Demo Client', // Add name
          email: 'demo@example.com', // Add email
          phone: '123-456-7890', // Add phone
          description: 'Demo briefing description', // Add description
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
