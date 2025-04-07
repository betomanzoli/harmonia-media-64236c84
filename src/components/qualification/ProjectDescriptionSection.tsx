
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./qualificationFormSchema";

interface ProjectDescriptionSectionProps {
  form: UseFormReturn<FormValues>;
}

const ProjectDescriptionSection: React.FC<ProjectDescriptionSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Breve descrição do projeto*</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Descreva brevemente o que você imagina para sua música..."
              className="resize-none"
              maxLength={300}
              {...field}
            />
          </FormControl>
          <div className="text-xs text-right text-gray-400">
            {field.value.length}/300 caracteres
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProjectDescriptionSection;
