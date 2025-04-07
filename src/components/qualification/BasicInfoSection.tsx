
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues, referralOptions } from "./qualificationFormSchema";

interface BasicInfoSectionProps {
  form: UseFormReturn<FormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <>
      {/* Nome completo */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo*</FormLabel>
            <FormControl>
              <Input placeholder="Digite seu nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail*</FormLabel>
            <FormControl>
              <Input type="email" placeholder="seu@email.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Telefone */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone/WhatsApp*</FormLabel>
            <FormControl>
              <Input placeholder="(XX) XXXXX-XXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Como conheceu */}
      <FormField
        control={form.control}
        name="referralSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Como conheceu a harmonIA?*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {referralOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
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

export default BasicInfoSection;
