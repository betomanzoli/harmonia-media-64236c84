
import React from 'react';
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BriefingFormValues } from './formSchema';

const PersonalInfoSection: React.FC = () => {
  const form = useFormContext<BriefingFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seu nome completo</FormLabel>
            <FormControl>
              <Input placeholder="Digite seu nome" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu e-mail</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="contactPreference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferência de contato</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma forma de contato" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp (resposta em até 2h)</SelectItem>
                <SelectItem value="email">E-mail (resposta em até 24h)</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoSection;
