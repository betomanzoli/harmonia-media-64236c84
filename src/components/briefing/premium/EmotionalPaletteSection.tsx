
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
import { PremiumFormValues } from '../formSchema';

const emotionOptions = [
  { label: "Alegria", value: "alegria" },
  { label: "Tristeza", value: "tristeza" },
  { label: "Nostalgia", value: "nostalgia" },
  { label: "Esperança", value: "esperanca" },
  { label: "Determinação", value: "determinacao" },
  { label: "Serenidade", value: "serenidade" },
  { label: "Excitação", value: "excitacao" },
  { label: "Amor", value: "amor" },
  { label: "Tensão", value: "tensao" },
  { label: "Confiança", value: "confianca" },
  { label: "Mistério", value: "misterio" },
  { label: "Poder", value: "poder" }
];

const EmotionalPaletteSection: React.FC = () => {
  const form = useFormContext<PremiumFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="primaryEmotions"
        render={() => (
          <FormItem>
            <FormLabel>Emoções primárias</FormLabel>
            <FormDescription>
              Selecione até 3 emoções primárias
            </FormDescription>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {emotionOptions.map((option) => (
                <FormField
                  key={`primary-${option.value}`}
                  control={form.control}
                  name="primaryEmotions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={`primary-${option.value}`}
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
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="secondaryEmotions"
        render={() => (
          <FormItem>
            <FormLabel>Emoções secundárias</FormLabel>
            <FormDescription>
              Selecione até 3 emoções secundárias
            </FormDescription>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {emotionOptions.map((option) => (
                <FormField
                  key={`secondary-${option.value}`}
                  control={form.control}
                  name="secondaryEmotions"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={`secondary-${option.value}`}
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
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="emotionalProgression"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Progressão emocional desejada</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Ex: começa contemplativa e termina energética" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="centralMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mensagem central a ser transmitida</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Qual é a mensagem principal que a música deve transmitir?" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default EmotionalPaletteSection;
