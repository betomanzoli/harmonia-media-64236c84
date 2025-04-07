
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./qualificationFormSchema";

interface ContractAcceptanceProps {
  form: UseFormReturn<FormValues>;
}

const ContractAcceptance: React.FC<ContractAcceptanceProps> = ({ form }) => {
  return (
    <div className="mb-6">
      <Collapsible>
        <CollapsibleTrigger className="text-sm text-harmonia-green underline">
          Ver termos e condições
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 p-4 bg-background/60 text-xs border border-border rounded-md max-h-40 overflow-y-auto">
          <div className="space-y-2">
            <p>Ao enviar este formulário, você concorda com nossa política de privacidade e termos de uso.</p>
            <p>Seus dados serão utilizados apenas para contato relacionado ao serviço de criação musical.</p>
            <p>Após a análise do seu formulário, entraremos em contato para apresentar a recomendação de pacote mais adequada às suas necessidades.</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Aceite dos termos */}
      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal">
                Concordo com os termos de serviço e política de privacidade
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContractAcceptance;
