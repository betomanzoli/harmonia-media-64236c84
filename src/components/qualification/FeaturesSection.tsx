
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues, featureOptions } from "./qualificationFormSchema";

interface FeaturesSectionProps {
  form: UseFormReturn<FormValues>;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="features"
      render={() => (
        <FormItem>
          <div className="mb-2">
            <FormLabel>Funcionalidades desejadas</FormLabel>
            <FormDescription>Pode selecionar mais de uma opção</FormDescription>
          </div>
          {featureOptions.map((option) => (
            <FormField
              key={option.id}
              control={form.control}
              name="features"
              render={({ field }) => {
                return (
                  <FormItem
                    key={option.id}
                    className="flex flex-row items-start space-x-3 space-y-0 mb-1"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== option.id
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
  );
};

export default FeaturesSection;
