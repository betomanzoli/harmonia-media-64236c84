
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalFormValues } from '../formSchema';

const purposeOptions = [
  { label: "Identidade sonora para marca/conteúdo", value: "identidade_sonora" },
  { label: "Trilha para vídeo/podcast", value: "trilha" },
  { label: "Conteúdo para monetização", value: "monetizacao" },
  { label: "Outro", value: "outro" }
];

const ConceptSection: React.FC = () => {
  const form = useFormContext<ProfessionalFormValues>();
  const purpose = form.watch("purpose");
  
  return (
    <>
      <FormField
        control={form.control}
        name="storyDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descreva detalhadamente a história, marca ou conceito</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o que deseja transformar em música" 
                className="min-h-[150px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Limite de 1500 caracteres
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qual o propósito principal desta música?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o propósito" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {purposeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {purpose === "outro" && (
        <FormField
          control={form.control}
          name="otherPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especifique outro propósito</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Qual o propósito?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default ConceptSection;
