
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BriefingField {
  id: string;
  section_id: string;
  field_key: string;
  field_name: string;
  field_type: 'text' | 'textarea' | 'select' | 'multi_select' | 'radio' | 'checkbox' | 'file' | 'date';
  placeholder?: string;
  options?: any[];
  is_required: boolean;
  max_length?: number;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export interface BriefingSection {
  id: string;
  section_type: 'client_info' | 'project_details' | 'technical_specs' | 'creative_direction' | 'timeline';
  package_type: 'essencial' | 'profissional' | 'premium';
  title: string;
  description?: string;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export const useBriefingData = (packageType: 'essencial' | 'profissional' | 'premium') => {
  const [sections, setSections] = useState<BriefingSection[]>([]);
  const [fields, setFields] = useState<BriefingField[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBriefingData();
  }, [packageType]);

  const loadBriefingData = async () => {
    try {
      setLoading(true);

      // Load sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('briefing_sections')
        .select('*')
        .eq('package_type', packageType)
        .eq('is_active', true)
        .order('order_num');

      if (sectionsError) throw sectionsError;

      // Load fields
      const { data: fieldsData, error: fieldsError } = await supabase
        .from('briefing_fields')
        .select('*')
        .eq('is_active', true)
        .order('order_num');

      if (fieldsError) throw fieldsError;

      setSections(sectionsData || []);
      
      // Convert the fields data to match our interface
      const convertedFields: BriefingField[] = (fieldsData || []).map(field => ({
        ...field,
        options: Array.isArray(field.options) ? field.options : 
                typeof field.options === 'string' ? JSON.parse(field.options) : []
      }));
      
      setFields(convertedFields);

    } catch (error) {
      console.error('Error loading briefing data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as configurações do briefing.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldsForSection = (sectionId: string) => {
    return fields.filter(field => field.section_id === sectionId);
  };

  return {
    sections,
    fields,
    loading,
    getFieldsForSection,
    reloadData: loadBriefingData
  };
};
