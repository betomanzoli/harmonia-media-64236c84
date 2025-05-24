
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PremiumFormValues } from '../formSchema';

const RegistrationSection: React.FC = () => {
  const form = useFormContext<PremiumFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="registrationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo como deve aparecer no registro</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome completo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="registrationCPFCNPJ"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF/CNPJ</FormLabel>
            <FormControl>
              <Input {...field} placeholder="CPF ou CNPJ (apenas números)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de nascimento</FormLabel>
            <FormControl>
              <Input {...field} placeholder="DD/MM/AAAA" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="fullAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço completo com CEP</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Endereço completo (rua, número, complemento, bairro, cidade, estado, CEP)" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="authorizesRegistration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Autorizo o registro da obra em meu nome na Biblioteca Nacional
              </FormLabel>
              <FormDescription>
                Concordo que a harmonIA poderá realizar o registro da obra musical em meu nome na Biblioteca Nacional, 
                garantindo assim meus direitos autorais sobre a composição. Entendo que para isso, forneci dados 
                pessoais verdadeiros e válidos necessários para este registro.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default RegistrationSection;
