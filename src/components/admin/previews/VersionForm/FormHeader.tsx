
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  isFinalVersion: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  isFinalVersion
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título da Versão</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isFinalVersion ? "Ex: Versão Final" : "Ex: Versão Acústica"}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={isFinalVersion ? "Detalhes sobre a versão final" : "Detalhes sobre esta versão"}
          rows={3}
        />
      </div>
    </>
  );
};

export default FormHeader;
