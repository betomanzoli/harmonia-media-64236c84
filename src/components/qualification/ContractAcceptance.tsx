
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { qualificationFormSchema } from "./qualificationFormSchema";

type FormValues = z.infer<typeof qualificationFormSchema>;

const ContractAcceptance: React.FC = () => {
  const form = useFormContext<FormValues>();

  return (
    <div className="border border-border rounded-lg p-6 mt-8 bg-card">
      <h3 className="text-lg font-semibold mb-4">Termos de Serviço</h3>
      
      <div className="mb-6 text-sm text-gray-400 max-h-60 overflow-y-auto p-4 bg-background rounded-md">
        <p className="mb-4">
          Ao prosseguir, você reconhece que leu e concorda com os Termos de Serviço e a Política de Reembolso e Revisões da harmonIA.
        </p>
        <p className="mb-4">
          A harmonIA atuará como "despachante musical", intermediando o acesso a tecnologias de inteligência artificial 
          para criação musical, com intervenção humana especializada.
        </p>
        <p>
          Os direitos sobre a música criada variam conforme o pacote escolhido, 
          conforme detalhado nos contratos específicos disponíveis em nossa página de Termos.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox 
                checked={field.value} 
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">
              Eu li e concordo com os Termos de Serviço e reconheço as limitações de cada pacote
            </FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContractAcceptance;
