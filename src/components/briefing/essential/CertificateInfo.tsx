
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
import { EssentialFormValues } from '../formSchema';

const CertificateInfo: React.FC = () => {
  const form = useFormContext<EssentialFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="certificateName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo como deve aparecer no certificado</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome completo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="certificateCPF"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF para emissão do certificado digital</FormLabel>
            <FormControl>
              <Input {...field} placeholder="CPF (apenas números)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CertificateInfo;
