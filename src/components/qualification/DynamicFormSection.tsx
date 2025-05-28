
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BriefingField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  label: string;
  required?: boolean;
  options?: string[];
}

interface BriefingSection {
  id: string;
  title: string;
  fields: BriefingField[];
}

interface DynamicFormSectionProps {
  section: BriefingSection;
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

const DynamicFormSection: React.FC<DynamicFormSectionProps> = ({
  section,
  values,
  onChange
}) => {
  return (
    <div className="space-y-4">
      {section.fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {field.type === 'text' && (
            <Input
              id={field.id}
              value={values[field.id] || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              required={field.required}
            />
          )}
          
          {field.type === 'textarea' && (
            <Textarea
              id={field.id}
              value={values[field.id] || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              required={field.required}
            />
          )}
          
          {field.type === 'select' && field.options && (
            <Select
              value={values[field.id] || ''}
              onValueChange={(value) => onChange(field.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {field.type === 'radio' && field.options && (
            <RadioGroup
              value={values[field.id] || ''}
              onValueChange={(value) => onChange(field.id, value)}
            >
              {field.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      ))}
    </div>
  );
};

export default DynamicFormSection;
