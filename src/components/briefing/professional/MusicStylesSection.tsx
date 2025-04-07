
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfessionalFormValues } from '../formSchema';

const musicStyleOptions = [
  { label: "Pop contemporâneo", value: "pop" },
  { label: "Rock alternativo", value: "rock" },
  { label: "MPB/Bossa Nova", value: "mpb" },
  { label: "Eletrônica/Lo-fi", value: "eletronica" },
  { label: "Hip Hop/Trap", value: "hiphop" },
  { label: "Folk/Acústico", value: "folk" },
  { label: "Jazz/Blues", value: "jazz" },
  { label: "Outro", value: "outro" }
];

const MusicStylesSection: React.FC = () => {
  const form = useFormContext<ProfessionalFormValues>();
  const musicStyles = form.watch("musicStyles") || [];
  
  return (
    <FormField
      control={form.control}
      name="musicStyles"
      render={() => (
        <FormItem>
          <FormLabel>Estilos musicais desejados</FormLabel>
          <FormDescription>
            Selecione até 3 para criarmos diferentes versões
          </FormDescription>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {musicStyleOptions.map((option) => (
              <FormField
                key={option.value}
                control={form.control}
                name="musicStyles"
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
                            const updatedStyles = checked
                              ? [...field.value || [], option.value]
                              : field.value?.filter((value) => value !== option.value) || [];
                            
                            if (updatedStyles.length <= 3) {
                              field.onChange(updatedStyles);
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
          {musicStyles.includes("outro") && (
            <FormField
              control={form.control}
              name="otherMusicStyle"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Especifique outro estilo musical</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Qual outro estilo musical?" />
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

export default MusicStylesSection;
