
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BriefingSection {
  id: string;
  package_type: 'essencial' | 'profissional' | 'premium' | 'qualification';
  section_type: string;
  title: string;
  description: string;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export interface BriefingField {
  id: string;
  section_id: string;
  field_key: string;
  field_name: string;
  field_type: 'select' | 'textarea' | 'text' | 'date' | 'checkbox' | 'file' | 'radio' | 'multi_select';
  placeholder: string;
  is_required: boolean;
  order_num: number;
  is_active: boolean;
  options: any;
  max_length: number;
  created_at: string;
}

export const useBriefingData = () => {
  const [sections, setSections] = useState<BriefingSection[]>([]);
  const [fields, setFields] = useState<{ [sectionId: string]: BriefingField[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('briefing_sections')
        .select('*')
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;

      const mappedSections: BriefingSection[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        package_type: ['essencial', 'profissional', 'premium', 'qualification'].includes(item.package_type) 
          ? item.package_type as BriefingSection['package_type']
          : 'essencial',
        section_type: String(item.section_type || ''),
        title: String(item.title || ''),
        description: String(item.description || ''),
        order_num: Number(item.order_num || 0),
        is_active: Boolean(item.is_active),
        created_at: String(item.created_at || new Date().toISOString())
      }));

      setSections(mappedSections);
      return mappedSections;
    } catch (error) {
      console.error('Error loading briefing sections:', error);
      setSections([]);
      return [];
    }
  };

  const loadFields = async (sections: BriefingSection[]) => {
    try {
      const sectionIds = sections.map(s => s.id);
      if (sectionIds.length === 0) return;

      const { data, error } = await supabase
        .from('briefing_fields')
        .select('*')
        .in('section_id', sectionIds)
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;

      const mappedFields: BriefingField[] = (data || []).map((item: any) => ({
        id: String(item.id || ''),
        section_id: String(item.section_id || ''),
        field_key: String(item.field_key || ''),
        field_name: String(item.field_name || ''),
        field_type: ['select', 'textarea', 'text', 'date', 'checkbox', 'file', 'radio', 'multi_select'].includes(item.field_type)
          ? item.field_type as BriefingField['field_type']
          : 'text',
        placeholder: String(item.placeholder || ''),
        is_required: Boolean(item.is_required),
        order_num: Number(item.order_num || 0),
        is_active: Boolean(item.is_active),
        options: item.options || null,
        max_length: Number(item.max_length || 0),
        created_at: String(item.created_at || new Date().toISOString())
      }));

      const groupedFields = mappedFields.reduce((acc, field) => {
        const sectionId = field.section_id;
        if (!acc[sectionId]) {
          acc[sectionId] = [];
        }
        acc[sectionId].push(field);
        return acc;
      }, {} as { [sectionId: string]: BriefingField[] });

      setFields(groupedFields);
    } catch (error) {
      console.error('Error loading briefing fields:', error);
      setFields({});
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const loadedSections = await loadSections();
      await loadFields(loadedSections);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    sections,
    fields,
    isLoading,
    reload: async () => {
      setIsLoading(true);
      const loadedSections = await loadSections();
      await loadFields(loadedSections);
      setIsLoading(false);
    }
  };
};
