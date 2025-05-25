
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BriefingSection {
  id: string;
  package_type: string;
  section_type: string;
  title: string;
  description?: string;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

interface BriefingField {
  id: string;
  section_id: string;
  field_key: string;
  field_name: string;
  field_type: string;
  placeholder?: string;
  options?: any;
  max_length?: number;
  is_required: boolean;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export const useBriefingData = () => {
  const [sections, setSections] = useState<BriefingSection[]>([]);
  const [fields, setFields] = useState<Record<string, BriefingField[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBriefingData = async () => {
      try {
        // Load sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('briefing_sections')
          .select('*')
          .eq('is_active', true)
          .order('order_num');

        if (sectionsError) throw sectionsError;

        const typedSections: BriefingSection[] = (sectionsData || []).map((item: any) => ({
          id: String(item.id || ''),
          package_type: String(item.package_type || ''),
          section_type: String(item.section_type || ''),
          title: String(item.title || ''),
          description: item.description ? String(item.description) : undefined,
          order_num: Number(item.order_num || 0),
          is_active: Boolean(item.is_active),
          created_at: String(item.created_at || new Date().toISOString())
        }));

        setSections(typedSections);

        // Load fields for each section
        const { data: fieldsData, error: fieldsError } = await supabase
          .from('briefing_fields')
          .select('*')
          .eq('is_active', true)
          .order('order_num');

        if (fieldsError) throw fieldsError;

        const typedFields: BriefingField[] = (fieldsData || []).map((item: any) => ({
          id: String(item.id || ''),
          section_id: String(item.section_id || ''),
          field_key: String(item.field_key || ''),
          field_name: String(item.field_name || ''),
          field_type: String(item.field_type || ''),
          placeholder: item.placeholder ? String(item.placeholder) : undefined,
          options: item.options,
          max_length: item.max_length ? Number(item.max_length) : undefined,
          is_required: Boolean(item.is_required),
          order_num: Number(item.order_num || 0),
          is_active: Boolean(item.is_active),
          created_at: String(item.created_at || new Date().toISOString())
        }));

        // Group fields by section_id
        const groupedFields: Record<string, BriefingField[]> = {};
        typedFields.forEach(field => {
          if (!groupedFields[field.section_id]) {
            groupedFields[field.section_id] = [];
          }
          groupedFields[field.section_id].push(field);
        });

        setFields(groupedFields);
      } catch (error) {
        console.error('Error loading briefing data:', error);
        setSections([]);
        setFields({});
      } finally {
        setIsLoading(false);
      }
    };

    loadBriefingData();
  }, []);

  return {
    sections,
    fields,
    isLoading
  };
};
