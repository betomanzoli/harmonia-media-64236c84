
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
import { PremiumFormValues } from '../formSchema';

const TechnicalSpecsSection: React.FC = () => {
  const form = useFormContext<PremiumFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="exactDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração exata necessária</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 2:45, 3 minutos e 20 segundos, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="specificMarkers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pontos de marcação específicos (para sincronização)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: mudança de clima aos 0:45, final com fade out, etc." 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="mixingNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Necessidades de mixagem especiais</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: destaque nos graves, espacialidade, etc." 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="vocalTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipos de vocais específicos (se aplicável)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: soprano feminino, voz grave masculina, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="masteringNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Necessidades de masterização para plataformas específicas</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: otimizado para Spotify, adequado para publicidade em TV, etc." 
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

export default TechnicalSpecsSection;
