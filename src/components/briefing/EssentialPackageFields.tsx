
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
import { EssentialFormValues } from './formSchema';

const emotionOptions = [
  { label: "Alegria/Celebração", value: "alegria" },
  { label: "Nostalgia/Saudade", value: "nostalgia" },
  { label: "Amor/Romance", value: "amor" },
  { label: "Superação/Força", value: "superacao" },
  { label: "Reflexão/Introspecção", value: "reflexao" },
  { label: "Amizade/Conexão", value: "amizade" },
  { label: "Outro", value: "outro" }
];

const tempoOptions = [
  { label: "Lento e contemplativo", value: "lento" },
  { label: "Médio e equilibrado", value: "medio" },
  { label: "Animado e energético", value: "animado" },
  { label: "Não tenho preferência definida", value: "sem_preferencia" }
];

const durationOptions = [
  { label: "Curta (1-2 minutos)", value: "curta" },
  { label: "Média (2-3 minutos)", value: "media" },
  { label: "Longa (3-4 minutos)", value: "longa" }
];

const vocalOptions = [
  { label: "Masculino", value: "masculino" },
  { label: "Feminino", value: "feminino" },
  { label: "Sem preferência", value: "sem_preferencia" },
  { label: "Sem vocal (instrumental)", value: "instrumental" }
];

const EssentialPackageFields: React.FC = () => {
  const form = useFormContext<EssentialFormValues>();
  const emotions = form.watch("emotions") || [];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold pt-4">História ou Conceito</h3>
      
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
      
      <h3 className="text-lg font-semibold pt-4">Preferências Musicais</h3>
      
      <FormField
        control={form.control}
        name="musicStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estilo musical preferido</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estilo musical" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="mpb">MPB</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="eletronica">Eletrônica</SelectItem>
                <SelectItem value="sertanejo">Sertanejo</SelectItem>
                <SelectItem value="funk">Funk</SelectItem>
                <SelectItem value="rap">Rap/Hip-Hop</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="blues">Blues</SelectItem>
                <SelectItem value="classica">Música Clássica</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="referenceArtists"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Artistas de referência</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Mencione até 3 artistas que você gosta" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="tempo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Velocidade/andamento preferido</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um andamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tempoOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-semibold pt-4">Elementos Específicos</h3>
      
      <FormField
        control={form.control}
        name="specificPhrases"
        render={({ field }) => (
          <FormItem>
            <FormLabel>A música deve incluir alguma frase ou palavra específica?</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: Nome de pessoa, frase especial, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração aproximada desejada</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {durationOptions.map(option => (
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
        name="vocalPreference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferência de vocal</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma preferência de vocal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vocalOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-semibold pt-4">Informações para Certificado Digital</h3>
      
      <FormField
        control={form.control}
        name="certificateName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo como deve aparecer no certificado</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome completo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="certificateCPF"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF para emissão do certificado digital</FormLabel>
            <FormControl>
              <Input {...field} placeholder="CPF (apenas números)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EssentialPackageFields;
