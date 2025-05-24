
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';
import { BriefingFormValues } from '@/hooks/useCreateBriefingForm';

interface ClientInfoSectionProps {
  form: UseFormReturn<BriefingFormValues>;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Cliente</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@exemplo.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <PhoneInput
                value={field.value as PhoneWithCountryCode}
                onChange={(val: PhoneWithCountryCode) => field.onChange(val)}
                placeholder="(00) 00000-0000"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ClientInfoSection;
