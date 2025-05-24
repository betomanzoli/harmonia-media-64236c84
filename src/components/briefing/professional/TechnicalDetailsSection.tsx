
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
import { ProfessionalFormValues } from '../formSchema';

const structureOptions = [
  { label: "Tradicional (intro, verso, refrão, verso, refrão, bridge, refrão)", value: "tradicional" },
  { label: "Narrativa (desenvolvimento contínuo)", value: "narrativa" },
  { label: "Minimalista (loops com pequenas variações)", value: "minimalista" },
  { label: "Não tenho preferência definida", value: "sem_preferencia" }
];

const TechnicalDetailsSection: React.FC = () => {
  const form = useFormContext<ProfessionalFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="bpm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo/BPM aproximado (se tiver preferência)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 120 BPM, rápido, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="instruments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instrumentos que você gostaria de destacar</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: violão, piano, bateria, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="structure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estrutura preferida</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma estrutura" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {structureOptions.map(option => (
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
        name="specificDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração específica necessária</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 2:30, 3 minutos, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TechnicalDetailsSection;
