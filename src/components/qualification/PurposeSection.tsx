
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues, purposeOptions } from "./qualificationFormSchema";

interface PurposeSectionProps {
  form: UseFormReturn<FormValues>;
}

const PurposeSection: React.FC<PurposeSectionProps> = ({ form }) => {
  const showOtherPurpose = form.watch("purpose").includes("other");

  return (
    <>
      {/* Finalidade da música */}
      <FormField
        control={form.control}
        name="purpose"
        render={() => (
          <FormItem>
            <div className="mb-2">
              <FormLabel>Finalidade da música*</FormLabel>
              <FormDescription>Pode selecionar mais de uma opção</FormDescription>
            </div>
            {purposeOptions.map((option) => (
              <FormField
                key={option.value}
                control={form.control}
                name="purpose"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.value}
                      className="flex flex-row items-start space-x-3 space-y-0 mb-1"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, option.value])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== option.value
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Outro propósito (condicional) */}
      {showOtherPurpose && (
        <FormField
          control={form.control}
          name="otherPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especifique a finalidade</FormLabel>
              <FormControl>
                <Input placeholder="Descreva a finalidade da música" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default PurposeSection;
