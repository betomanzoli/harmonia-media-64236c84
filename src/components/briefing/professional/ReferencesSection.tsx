
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

const ReferencesSection: React.FC = () => {
  const form = useFormContext<ProfessionalFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="referenceLinks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Links para músicas de referência (até 3)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Cole links do YouTube, Spotify, etc. (um por linha)" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="referenceArtists"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Artistas que considera importantes como inspiração</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Mencione artistas relevantes" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contentExamples"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exemplos de conteúdo onde a música será aplicada</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Links ou descrição do conteúdo" 
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

export default ReferencesSection;
