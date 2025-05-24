
import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalFormValues } from '../formSchema';

const CommercialRequirementsSection: React.FC = () => {
  const form = useFormContext<ProfessionalFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="platforms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plataformas onde a música será utilizada</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Instagram, YouTube, TikTok, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Público-alvo do seu conteúdo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: jovens de 18-25 anos, profissionais, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="monetizationNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Necessidades específicas para monetização</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descreva como pretende monetizar o conteúdo" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CommercialRequirementsSection;
