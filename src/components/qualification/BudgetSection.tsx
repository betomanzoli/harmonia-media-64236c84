
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues, budgetOptions } from "./qualificationFormSchema";

interface BudgetSectionProps {
  form: UseFormReturn<FormValues>;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="budget"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Orçamento aproximado*</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {budgetOptions.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {option.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BudgetSection;
