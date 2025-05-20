
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EssentialBriefingFieldsProps {
  data: any;
  onChange: (data: any) => void;
  isDisabled?: boolean;
}

const EssentialBriefingFields: React.FC<EssentialBriefingFieldsProps> = ({ 
  data = {}, 
  onChange,
  isDisabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    onChange({ ...data, [name]: checked });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="occasion">Ocasião</Label>
        <Input
          id="occasion"
          name="occasion"
          value={data.occasion || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Ex: Aniversário, Casamento, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">História ou Mensagem</Label>
        <Textarea
          id="story"
          name="story"
          value={data.story || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Conte um pouco da história que deseja transformar em música"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emotions">Emoções Principais</Label>
        <Input
          id="emotions"
          name="emotions"
          value={data.emotions || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Ex: Alegria, Nostalgia, Emoção"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="references">Referências Musicais</Label>
        <Textarea
          id="references"
          name="references"
          value={data.references || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Informe cantores, bandas ou músicas de referência"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="certificate"
          checked={data.certificate || false}
          onCheckedChange={(checked) => 
            handleCheckboxChange('certificate', checked as boolean)
          }
          disabled={isDisabled}
        />
        <Label htmlFor="certificate" className="cursor-pointer">
          Inclui certificado de composição
        </Label>
      </div>
    </div>
  );
};

export default EssentialBriefingFields;
