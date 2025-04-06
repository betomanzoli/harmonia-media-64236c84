
import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
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
import { BriefingFormValues } from './formSchema';
import { siteConfig } from '@/config/site';

const ProjectInfoSection: React.FC = () => {
  const form = useFormContext<BriefingFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="selectedPackage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pacote de interesse</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o pacote desejado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="essencial">Pacote Essencial - R${siteConfig.pricing.basePrice}</SelectItem>
                <SelectItem value="profissional">Pacote Profissional - R${siteConfig.pricing.professionalPrice}</SelectItem>
                <SelectItem value="premium">Pacote Premium - R${siteConfig.pricing.premiumPrice}</SelectItem>
                <SelectItem value="personalizado">Pacote Personalizado (a consultar)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Você pode ver os detalhes dos pacotes <a href={siteConfig.urls.packages} className="text-harmonia-green underline">aqui</a>
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="occasion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qual é a ocasião?</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma ocasião" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="aniversario">Aniversário</SelectItem>
                <SelectItem value="casamento">Casamento</SelectItem>
                <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                <SelectItem value="presente">Presente</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="style"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qual estilo musical você prefere?</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: MPB, pop, instrumental etc" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="story"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Conte sua história ou objetivo</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o que você imagina para sua música, incluindo emoções, momentos especiais ou qualquer detalhe que considere importante." 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Quanto mais detalhes você fornecer, melhor poderemos entender sua visão.
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  );
};

export default ProjectInfoSection;
