
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
import { Checkbox } from "@/components/ui/checkbox";

interface ProfessionalBriefingFieldsProps {
  data: any;
  onChange: (data: any) => void;
  isDisabled?: boolean;
}

const ProfessionalBriefingFields: React.FC<ProfessionalBriefingFieldsProps> = ({ 
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    onChange({ ...data, [name]: checked });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="projectType">Tipo de Projeto</Label>
        <Select
          value={data.projectType || ''}
          onValueChange={(value) => handleSelectChange('projectType', value)}
          disabled={isDisabled}
        >
          <SelectTrigger id="projectType">
            <SelectValue placeholder="Selecione o tipo de projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jingle">Jingle Comercial</SelectItem>
            <SelectItem value="soundtrack">Trilha Sonora</SelectItem>
            <SelectItem value="theme">Música Tema</SelectItem>
            <SelectItem value="identity">Identidade Sonora</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Marca ou Empresa</Label>
        <Input
          id="brand"
          name="brand"
          value={data.brand || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Nome da marca ou empresa"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience">Público-Alvo</Label>
        <Input
          id="targetAudience"
          name="targetAudience"
          value={data.targetAudience || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Ex: Jovens adultos 18-35, Profissionais, Famílias"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="concept">Conceito e Objetivos</Label>
        <Textarea
          id="concept"
          name="concept"
          value={data.concept || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Explique o conceito da peça e os objetivos a serem alcançados"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duração Desejada</Label>
        <Input
          id="duration"
          name="duration"
          value={data.duration || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Ex: 30 segundos, 1 minuto, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="commercialUse">Uso Comercial</Label>
        <Select
          value={data.commercialUse || ''}
          onValueChange={(value) => handleSelectChange('commercialUse', value)}
          disabled={isDisabled}
        >
          <SelectTrigger id="commercialUse">
            <SelectValue placeholder="Selecione o tipo de uso comercial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tv">Televisão</SelectItem>
            <SelectItem value="radio">Rádio</SelectItem>
            <SelectItem value="web">Internet</SelectItem>
            <SelectItem value="multiple">Múltiplas Plataformas</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="needCall"
          checked={data.needCall || false}
          onCheckedChange={(checked) => 
            handleCheckboxChange('needCall', checked as boolean)
          }
          disabled={isDisabled}
        />
        <Label htmlFor="needCall" className="cursor-pointer">
          Necessita de reunião de alinhamento
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalRequirements">Requisitos Adicionais</Label>
        <Textarea
          id="additionalRequirements"
          name="additionalRequirements"
          value={data.additionalRequirements || ''}
          onChange={handleChange}
          disabled={isDisabled}
          placeholder="Outros requisitos ou informações importantes"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProfessionalBriefingFields;
