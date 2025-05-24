
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PremiumBriefingFieldsProps {
  data: any;
  onChange: (data: any) => void;
  isDisabled?: boolean;
}

const PremiumBriefingFields: React.FC<PremiumBriefingFieldsProps> = ({ 
  data = {}, 
  onChange,
  isDisabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="concept">Conceito da Música</Label>
        <Textarea
          id="concept"
          name="concept"
          value={data.concept || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Descreva o conceito ou tema principal da música"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mood">Atmosfera Desejada</Label>
        <Input
          id="mood"
          name="mood"
          value={data.mood || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Ex: Alegre, Melancólica, Energética, Relaxante"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instruments">Instrumentos Preferidos</Label>
        <Input
          id="instruments"
          name="instruments"
          value={data.instruments || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Ex: Violão, Piano, Bateria, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vocalsType">Tipo de Vocal</Label>
        <Select
          value={data.vocalsType || ''}
          onValueChange={(value) => handleSelectChange('vocalsType', value)}
          disabled={isDisabled}
        >
          <SelectTrigger id="vocalsType">
            <SelectValue placeholder="Selecione o tipo de vocal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="feminino">Feminino</SelectItem>
            <SelectItem value="ambos">Ambos</SelectItem>
            <SelectItem value="instrumental">Apenas Instrumental</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="referenceLinks">Links de Referência</Label>
        <Textarea
          id="referenceLinks"
          name="referenceLinks"
          value={data.referenceLinks || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Links para músicas de referência (YouTube, Spotify, etc.)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lyrics">Ideias para Letra</Label>
        <Textarea
          id="lyrics"
          name="lyrics"
          value={data.lyrics || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Palavras-chave, frases ou ideias para a letra"
          rows={4}
        />
      </div>
    </div>
  );
};

export default PremiumBriefingFields;
