
import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ProfessionalFormValues } from '../formSchema';

const CallSchedulingSection: React.FC = () => {
  const form = useFormContext<ProfessionalFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="callAvailability"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Disponibilidade para chamada de detalhamento
              </FormLabel>
              <FormDescription>
                Chamada de 15 minutos para discutir detalhes específicos
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch("callAvailability") && (
        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Melhor horário para contato</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Dias úteis após as 18h" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default CallSchedulingSection;
