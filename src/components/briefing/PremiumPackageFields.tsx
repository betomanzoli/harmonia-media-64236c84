
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
import { PremiumFormValues } from './formSchema';

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

const PremiumPackageFields: React.FC = () => {
  const form = useFormContext<PremiumFormValues>();
  const soundCharacteristics = form.watch("soundCharacteristics") || [];
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold pt-4">Conceito e Aplicação Estratégica</h3>
      
      <FormField
        control={form.control}
        name="conceptDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição detalhada do conceito e valores</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva detalhadamente o conceito e valores que a música deve representar" 
                className="min-h-[150px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Limite de 2000 caracteres
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="strategicObjectives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objetivos estratégicos para a composição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Explique quais são os objetivos estratégicos para esta música" 
                className="min-h-[120px]" 
                {...field} 
              />
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
            <FormLabel>Público-alvo e contexto de utilização</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o público-alvo e em quais contextos a música será utilizada" 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="brandIdentity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Identidade da marca ou projeto</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva a identidade da marca ou projeto que a música representará" 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-semibold pt-4">Paleta Emocional</h3>
      
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
      
      <h3 className="text-lg font-semibold pt-4">Preferências Estéticas Completas</h3>
      
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
      
      <h3 className="text-lg font-semibold pt-4">Especificações Técnicas</h3>
      
      <FormField
        control={form.control}
        name="exactDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duração exata necessária</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: 2:45, 3 minutos e 20 segundos, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="specificMarkers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pontos de marcação específicos (para sincronização)</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: mudança de clima aos 0:45, final com fade out, etc." 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="mixingNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Necessidades de mixagem especiais</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: destaque nos graves, espacialidade, etc." 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="vocalTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipos de vocais específicos (se aplicável)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ex: soprano feminino, voz grave masculina, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="masteringNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Necessidades de masterização para plataformas específicas</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Ex: otimizado para Spotify, adequado para publicidade em TV, etc." 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-semibold pt-4">Documentação para Registro na Biblioteca Nacional</h3>
      
      <FormField
        control={form.control}
        name="registrationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome completo como deve aparecer no registro</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome completo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="registrationCPFCNPJ"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF/CNPJ</FormLabel>
            <FormControl>
              <Input {...field} placeholder="CPF ou CNPJ (apenas números)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de nascimento</FormLabel>
            <FormControl>
              <Input {...field} placeholder="DD/MM/AAAA" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="fullAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço completo com CEP</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Endereço completo (rua, número, complemento, bairro, cidade, estado, CEP)" 
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="authorizesRegistration"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Autorizo o registro da obra em meu nome na Biblioteca Nacional
              </FormLabel>
              <FormDescription>
                Concordo que a harmonIA poderá realizar o registro da obra musical em meu nome na Biblioteca Nacional, 
                garantindo assim meus direitos autorais sobre a composição. Entendo que para isso, forneci dados 
                pessoais verdadeiros e válidos necessários para este registro.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PremiumPackageFields;
