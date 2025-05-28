
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
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
            
            {field.type === 'select' && (
              <Select
                value={values[field.id] || ''}
                onValueChange={(value) => onChange(field.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DynamicFormSection;
