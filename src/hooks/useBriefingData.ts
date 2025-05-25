
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

        // Type-safe mapping for sections
        const typedSections: BriefingSection[] = (sectionsData || []).map((item: any) => ({
          id: item.id as string,
          package_type: item.package_type as string,
          section_type: item.section_type as string,
          title: item.title as string,
          description: item.description as string,
          order_num: item.order_num as number,
          is_active: item.is_active as boolean,
          created_at: item.created_at as string
        }));

        setSections(typedSections);

        // Fetch fields for each section
        if (typedSections && typedSections.length > 0) {
          const fieldsObj: { [sectionId: string]: BriefingField[] } = {};
          
          for (const section of typedSections) {
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

            // Type-safe mapping for fields
            const typedFields: BriefingField[] = (fieldsData || []).map((item: any) => ({
              id: item.id as string,
              section_id: item.section_id as string,
              field_key: item.field_key as string,
              field_name: item.field_name as string,
              field_type: item.field_type as string,
              placeholder: item.placeholder as string,
              is_required: item.is_required as boolean,
              order_num: item.order_num as number,
              is_active: item.is_active as boolean,
              options: item.options,
              max_length: item.max_length as number,
              created_at: item.created_at as string
            }));

            fieldsObj[section.id] = typedFields;
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
