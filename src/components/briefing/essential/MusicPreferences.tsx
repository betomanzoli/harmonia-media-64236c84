
import React from 'react';
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EssentialFormValues } from '../formSchema';

const tempoOptions = [
  { label: "Lento e contemplativo", value: "lento" },
  { label: "Médio e equilibrado", value: "medio" },
  { label: "Animado e energético", value: "animado" },
  { label: "Não tenho preferência definida", value: "sem_preferencia" }
];

const MusicPreferences: React.FC = () => {
  const form = useFormContext<EssentialFormValues>();
  
  return (
    <>
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
    </>
  );
};

export default MusicPreferences;
