
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormValues, timelineOptions } from "./qualificationFormSchema";

interface TimelineSectionProps {
  form: UseFormReturn<FormValues>;
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="timeline"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Prazo necessário*</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {timelineOptions.map((option) => (
                <FormItem
                  key={option.id}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option.id} />
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

export default TimelineSection;
