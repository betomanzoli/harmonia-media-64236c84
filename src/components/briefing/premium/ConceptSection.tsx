
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
import { Textarea } from "@/components/ui/textarea";
import { PremiumFormValues } from '../formSchema';

const ConceptSection: React.FC = () => {
  const form = useFormContext<PremiumFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="conceptDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição detalhada do conceito e valores</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva detalhadamente o conceito e valores que a música deve representar" 
                className="min-h-[150px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Limite de 2000 caracteres
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="strategicObjectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos estratégicos para a composição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Explique quais são os objetivos estratégicos para esta música" 
                className="min-h-[120px]" 
                {...field} 
              />
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
            <FormLabel>Público-alvo e contexto de utilização</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o público-alvo e em quais contextos a música será utilizada" 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="brandIdentity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Identidade da marca ou projeto</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva a identidade da marca ou projeto que a música representará" 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ConceptSection;
