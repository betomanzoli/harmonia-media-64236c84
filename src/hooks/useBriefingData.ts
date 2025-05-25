
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BriefingSection, BriefingField } from '@/types/briefing';
import { useToast } from './use-toast';

export function useBriefingData(packageType: 'essencial' | 'profissional' | 'premium' | 'qualification') {
  const [sections, setSections] = useState<BriefingSection[]>([]);
  const [fields, setFields] = useState<{ [sectionId: string]: BriefingField[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBriefingStructure = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch sections for the selected package type
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('briefing_sections')
          .select('*')
          .eq('package_type', packageType)
          .eq('is_active', true)
          .order('order_num');

        if (sectionsError) {
          throw sectionsError;
        }

        setSections(sectionsData || []);

        // Fetch fields for each section
        if (sectionsData && sectionsData.length > 0) {
          const fieldsObj: { [sectionId: string]: BriefingField[] } = {};
          
          for (const section of sectionsData) {
            const { data: fieldsData, error: fieldsError } = await supabase
              .from('briefing_fields')
              .select('*')
              .eq('section_id', section.id)
              .eq('is_active', true)
              .order('order_num');

            if (fieldsError) {
              console.error(`Error fetching fields for section ${section.id}:`, fieldsError);
              continue;
            }

            fieldsObj[section.id] = fieldsData || [];
          }

          setFields(fieldsObj);
        }

      } catch (err: any) {
        console.error('Error fetching briefing structure:', err);
        setError(err.message || 'Failed to load briefing form structure');
        toast({
          title: "Erro ao carregar formulário",
          description: "Não foi possível carregar a estrutura do formulário. Por favor, tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBriefingStructure();
  }, [packageType, toast]);

  const saveBriefingData = async (data: any, clientId?: string) => {
    try {
      const { data: savedData, error } = await supabase
        .from('briefings')
        .insert([
          {
            client_id: clientId || null,
            package_type: packageType,
            data: data,
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data: savedData };
    } catch (err: any) {
      console.error('Error saving briefing data:', err);
      toast({
        title: "Erro ao salvar dados",
        description: err.message || "Não foi possível salvar os dados do briefing",
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };

  return {
    sections,
    fields,
    isLoading,
    error,
    saveBriefingData
  };
}
