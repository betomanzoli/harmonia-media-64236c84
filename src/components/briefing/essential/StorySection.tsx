
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
import { Textarea } from "@/components/ui/textarea";
import { EssentialFormValues } from '../formSchema';

const StorySection: React.FC = () => {
  const form = useFormContext<EssentialFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="storyDescription"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descreva detalhadamente a história ou conceito</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Conte a história que deseja transformar em música" 
              className="min-h-[150px]" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Limite de 1000 caracteres
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StorySection;
