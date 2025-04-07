
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ProfessionalFormValues } from './formSchema';

const purposeOptions = [
  { label: "Identidade sonora para marca/conteúdo", value: "identidade_sonora" },
  { label: "Trilha para vídeo/podcast", value: "trilha" },
  { label: "Conteúdo para monetização", value: "monetizacao" },
  { label: "Outro", value: "outro" }
];

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

const structureOptions = [
  { label: "Tradicional (intro, verso, refrão, verso, refrão, bridge, refrão)", value: "tradicional" },
  { label: "Narrativa (desenvolvimento contínuo)", value: "narrativa" },
  { label: "Minimalista (loops com pequenas variações)", value: "minimalista" },
  { label: "Não tenho preferência definida", value: "sem_preferencia" }
];

const ProfessionalPackageFields: React.FC = () => {
  const form = useFormContext<ProfessionalFormValues>();
  const purpose = form.watch("purpose");
  const musicStyles = form.watch("musicStyles") || [];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold pt-4">História e Conceito</h3>
      
      <FormField
        control={form.control}
        name="storyDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descreva detalhadamente a história, marca ou conceito</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o que deseja transformar em música" 
                className="min-h-[150px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Limite de 1500 caracteres
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="purpose"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qual o propósito principal desta música?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o propósito" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {purposeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {purpose === "outro" && (
        <FormField
          control={form.control}
          name="otherPurpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especifique outro propósito</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Qual o propósito?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <h3 className="text-lg font-semibold pt-4">Preferências Estilísticas</h3>
      
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
      
      <h3 className="text-lg font-semibold pt-4">Detalhamento Técnico</h3>
      
      <FormField
        control={form.control}
        name="bpm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo/BPM aproximado (se tiver preferência)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 120 BPM, rápido, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="instruments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instrumentos que você gostaria de destacar</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: violão, piano, bateria, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="structure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estrutura preferida</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma estrutura" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {structureOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="specificDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração específica necessária</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 2:30, 3 minutos, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-semibold pt-4">Referências</h3>
      
      <FormField
        control={form.control}
        name="referenceLinks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Links para músicas de referência (até 3)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Cole links do YouTube, Spotify, etc. (um por linha)" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="referenceArtists"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Artistas que considera importantes como inspiração</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Mencione artistas relevantes" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contentExamples"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exemplos de conteúdo onde a música será aplicada</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Links ou descrição do conteúdo" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-semibold pt-4">Requisitos para Uso Comercial</h3>
      
      <FormField
        control={form.control}
        name="platforms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plataformas onde a música será utilizada</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Instagram, YouTube, TikTok, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Público-alvo do seu conteúdo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: jovens de 18-25 anos, profissionais, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="monetizationNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Necessidades específicas para monetização</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descreva como pretende monetizar o conteúdo" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-semibold pt-4">Agendamento de Chamada (Opcional)</h3>
      
      <FormField
        control={form.control}
        name="callAvailability"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Disponibilidade para chamada de detalhamento
              </FormLabel>
              <FormDescription>
                Chamada de 15 minutos para discutir detalhes específicos
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch("callAvailability") && (
        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Melhor horário para contato</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Dias úteis após as 18h" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ProfessionalPackageFields;
