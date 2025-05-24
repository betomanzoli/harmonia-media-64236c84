
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
import { Textarea } from "@/components/ui/textarea";
import { PremiumFormValues } from '../formSchema';

const musicStyleOptions = [
  { label: "Pop Contemporâneo", value: "pop" },
  { label: "Rock Alternativo", value: "rock" },
  { label: "MPB/Bossa Nova", value: "mpb" },
  { label: "Eletrônica/Lo-fi", value: "eletronica" },
  { label: "Hip Hop/Trap", value: "hiphop" },
  { label: "Folk/Acústico", value: "folk" },
  { label: "Jazz/Blues", value: "jazz" },
  { label: "Clássica/Orquestral", value: "classica" },
  { label: "Funk/Soul", value: "funk" },
  { label: "Country/Sertanejo", value: "country" },
  { label: "Latina", value: "latina" },
  { label: "Reggae", value: "reggae" },
  { label: "Música de Cinema", value: "cinema" }
];

const soundCharacteristicsOptions = [
  { label: "Orgânico/acústico", value: "organico" },
  { label: "Eletrônico/processado", value: "eletronico" },
  { label: "Híbrido", value: "hibrido" },
  { label: "Minimalista", value: "minimalista" },
  { label: "Orquestral", value: "orquestral" },
  { label: "Outro", value: "outro" }
];

const AestheticPreferencesSection: React.FC = () => {
  const form = useFormContext<PremiumFormValues>();
  const soundCharacteristics = form.watch("soundCharacteristics") || [];
  
  return (
    <>
      <FormField
        control={form.control}
        name="musicStyles"
        render={() => (
          <FormItem>
            <FormLabel>Estilos musicais preferidos</FormLabel>
            <FormDescription>
              Selecione até 5 estilos para as diferentes propostas
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
                              
                              if (updatedStyles.length <= 5) {
                                field.onChange(updatedStyles);
                              }
                            }}
                            disabled={
                              !field.value?.includes(option.value) &&
                              field.value?.length >= 5
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
        name="referenceArtists"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Artistas de referência para cada estilo</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Liste artistas de referência para cada estilo selecionado" 
                className="min-h-[120px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="soundCharacteristics"
        render={() => (
          <FormItem>
            <FormLabel>Características sonoras específicas</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {soundCharacteristicsOptions.map((option) => (
                <FormField
                  key={option.value}
                  control={form.control}
                  name="soundCharacteristics"
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
                              const updatedCharacteristics = checked
                                ? [...field.value || [], option.value]
                                : field.value?.filter((value) => value !== option.value) || [];
                              
                              field.onChange(updatedCharacteristics);
                            }}
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
            {soundCharacteristics.includes("outro") && (
              <FormField
                control={form.control}
                name="otherSoundCharacteristic"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>Especifique outra característica sonora</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Qual outra característica?" />
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
    </>
  );
};

export default AestheticPreferencesSection;
