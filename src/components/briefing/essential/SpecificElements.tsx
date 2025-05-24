
import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EssentialFormValues } from '../formSchema';

const durationOptions = [
  { label: "Curta (1-2 minutos)", value: "curta" },
  { label: "Média (2-3 minutos)", value: "media" },
  { label: "Longa (3-4 minutos)", value: "longa" }
];

const vocalOptions = [
  { label: "Masculino", value: "masculino" },
  { label: "Feminino", value: "feminino" },
  { label: "Sem preferência", value: "sem_preferencia" },
  { label: "Sem vocal (instrumental)", value: "instrumental" }
];

const SpecificElements: React.FC = () => {
  const form = useFormContext<EssentialFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="specificPhrases"
        render={({ field }) => (
          <FormItem>
            <FormLabel>A música deve incluir alguma frase ou palavra específica?</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Nome de pessoa, frase especial, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração aproximada desejada</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {durationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="vocalPreference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferência de vocal</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma preferência de vocal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vocalOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SpecificElements;
