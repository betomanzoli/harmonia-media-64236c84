
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Briefing } from '@/hooks/admin/useBriefings';
import EssentialBriefingFields from './EssentialBriefingFields';
import PremiumBriefingFields from './PremiumBriefingFields';
import ProfessionalBriefingFields from './ProfessionalBriefingFields';

interface BriefingDetailFormProps {
  briefing: Briefing;
  isEditing: boolean;
  onClose: () => void;
  onUpdate?: (updatedBriefing: Briefing) => void;
}

const BriefingDetailForm: React.FC<BriefingDetailFormProps> = ({ 
  briefing, 
  isEditing, 
  onClose, 
  onUpdate 
}) => {
  const [formData, setFormData] = useState<Briefing>({ ...briefing });
  const [packageSpecificData, setPackageSpecificData] = useState(briefing.formData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (value: string) => {
    setFormData(prev => ({ ...prev, packageType: value }));
  };

  const handlePackageFieldsChange = (data: any) => {
    setPackageSpecificData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate({
        ...formData,
        formData: packageSpecificData
      });
    }
  };

  const renderPackageFields = () => {
    switch (formData.packageType) {
      case 'Essencial':
        return (
          <EssentialBriefingFields
            data={packageSpecificData}
            onChange={handlePackageFieldsChange}
            isDisabled={!isEditing}
          />
        );
      case 'Premium':
        return (
          <PremiumBriefingFields
            data={packageSpecificData}
            onChange={handlePackageFieldsChange}
            isDisabled={!isEditing}
          />
        );
      case 'Profissional':
        return (
          <ProfessionalBriefingFields
            data={packageSpecificData}
            onChange={handlePackageFieldsChange}
            isDisabled={!isEditing}
          />
        );
      default:
        return <p className="text-muted-foreground">Pacote não especificado</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Cliente</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="packageType">Pacote</Label>
          <Select 
            value={formData.packageType} 
            onValueChange={handlePackageChange}
            disabled={!isEditing}
          >
            <SelectTrigger id="packageType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essencial">Essencial</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Profissional">Profissional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          disabled={!isEditing}
          rows={3}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Informações Específicas do Pacote {formData.packageType}</h3>
        {renderPackageFields()}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {isEditing ? 'Cancelar' : 'Fechar'}
        </Button>
        {isEditing && <Button type="submit">Salvar Alterações</Button>}
      </div>
    </form>
  );
};

export default BriefingDetailForm;
