
export interface BriefingSection {
  id: string;
  package_type: 'essencial' | 'profissional' | 'premium' | 'qualification';
  section_type: string;
  title: string;
  description: string | null;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export interface BriefingField {
  id: string;
  section_id: string;
  field_name: string;
  field_key: string;
  field_type: 'text' | 'textarea' | 'select' | 'multi_select' | 'radio' | 'checkbox' | 'file' | 'date';
  placeholder: string | null;
  options: any[] | null;
  is_required: boolean;
  max_length: number | null;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export interface BriefingData {
  id: string;
  client_id: string | null;
  package_type: 'essencial' | 'profissional' | 'premium' | 'qualification';
  status: 'pending' | 'completed' | 'approved';
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  project_id: string | null;
  is_deleted: boolean;
}

export interface BriefingFormData {
  [key: string]: any;
}
