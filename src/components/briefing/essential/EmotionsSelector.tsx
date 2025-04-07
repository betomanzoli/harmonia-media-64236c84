
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EssentialFormValues } from '../formSchema';

const emotionOptions = [
  { label: "Alegria/Celebração", value: "alegria" },
  { label: "Nostalgia/Saudade", value: "nostalgia" },
  { label: "Amor/Romance", value: "amor" },
  { label: "Superação/Força", value: "superacao" },
  { label: "Reflexão/Introspecção", value: "reflexao" },
  { label: "Amizade/Conexão", value: "amizade" },
  { label: "Outro", value: "outro" }
];

const EmotionsSelector: React.FC = () => {
  const form = useFormContext<EssentialFormValues>();
  const emotions = form.watch("emotions") || [];
  
  return (
    <FormField
      control={form.control}
      name="emotions"
      render={() => (
        <FormItem>
          <FormLabel>Quais emoções principais você gostaria que a música transmitisse?</FormLabel>
          <FormDescription>
            Selecione até 3 emoções
          </FormDescription>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {emotionOptions.map((option) => (
              <FormField
                key={option.value}
                control={form.control}
                name="emotions"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const updatedEmotions = checked
                              ? [...field.value || [], option.value]
                              : field.value?.filter((value) => value !== option.value) || [];
                            
                            if (updatedEmotions.length <= 3) {
                              field.onChange(updatedEmotions);
                            }
                          }}
                          disabled={
                            !field.value?.includes(option.value) &&
                            field.value?.length >= 3
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          {emotions.includes("outro") && (
            <FormField
              control={form.control}
              name="otherEmotion"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Especifique outra emoção</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Qual outra emoção?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmotionsSelector;
