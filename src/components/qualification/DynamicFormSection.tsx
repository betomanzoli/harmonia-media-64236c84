
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BriefingSection, BriefingField } from "@/types/briefing";
import { Label } from "@/components/ui/label";

interface DynamicFormSectionProps {
  section: BriefingSection;
  fields: BriefingField[];
  form: any; // Use proper typing from react-hook-form if needed
}

const DynamicFormSection: React.FC<DynamicFormSectionProps> = ({ section, fields, form }) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{section.title}</h3>
        {section.description && (
          <p className="text-sm text-gray-400">{section.description}</p>
        )}
      </div>

      {fields.map((field) => (
        <RenderFormField 
          key={field.id} 
          field={field} 
          form={form} 
        />
      ))}
    </div>
  );
};

interface RenderFormFieldProps {
  field: BriefingField;
  form: any;
}

const RenderFormField: React.FC<RenderFormFieldProps> = ({ field, form }) => {
  const options = field.options ? JSON.parse(field.options) : [];

  switch (field.field_type) {
    case 'text':
      return (
        <FormField
          control={form.control}
          name={field.field_key}
          rules={{ required: field.is_required }}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.field_name}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={field.placeholder || ''} 
                  {...formField} 
                  maxLength={field.max_length || undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'textarea':
      return (
        <FormField
          control={form.control}
          name={field.field_key}
          rules={{ required: field.is_required }}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.field_name}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={field.placeholder || ''} 
                  {...formField} 
                  maxLength={field.max_length || undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'select':
      return (
        <FormField
          control={form.control}
          name={field.field_key}
          rules={{ required: field.is_required }}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.field_name}</FormLabel>
              <Select 
                onValueChange={formField.onChange} 
                defaultValue={formField.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || "Selecione uma opção"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'radio':
      return (
        <FormField
          control={form.control}
          name={field.field_key}
          rules={{ required: field.is_required }}
          render={({ field: formField }) => (
            <FormItem className="space-y-3">
              <FormLabel>{field.field_name}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                  className="flex flex-col space-y-1"
                >
                  {options.map((option: any) => (
                    <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'checkbox':
      return (
        <div className="space-y-3">
          <Label>{field.field_name}</Label>
          <div className="space-y-2">
            {options.map((option: any) => (
              <FormField
                key={option.value}
                control={form.control}
                name={field.field_key}
                render={({ field: formField }) => {
                  return (
                    <FormItem
                      key={option.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={formField.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? formField.onChange([...(formField.value || []), option.value])
                              : formField.onChange(
                                  formField.value?.filter((value: string) => value !== option.value) || []
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{option.label}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </div>
      );

    default:
      return null;
  }
};

export default DynamicFormSection;
