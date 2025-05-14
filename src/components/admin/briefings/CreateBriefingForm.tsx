
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CreateBriefingFormProps {
  onClose: () => void;
  onSubmit: (briefingData: any) => void;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageType: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create formData specific to package type
    let packageFormData = {};
    
    switch (formData.packageType) {
      case 'Essencial':
        packageFormData = {
          story: '',
          emotions: [],
          musicStyle: '',
          artists: '',
          tempo: '',
          specificWords: '',
          duration: '',
          vocalPreference: ''
        };
        break;
      case 'Profissional':
        packageFormData = {
          concept: '',
          purpose: '',
          musicStyles: [],
          tempo: '',
          instruments: '',
          structure: '',
          references: [],
          usePlatforms: [],
          targetAudience: ''
        };
        break;
      case 'Premium':
        packageFormData = {
          concept: '',
          objectives: '',
          audience: '',
          primaryEmotions: [],
          secondaryEmotions: [],
          progression: '',
          message: '',
          styles: [],
          references: [],
          soundCharacteristics: []
        };
        break;
      default:
        break;
    }
    
    // Submit with package-specific form data
    onSubmit({
      ...formData,
      formData: packageFormData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Criar Novo Briefing</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Nome do Cliente</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome completo do cliente"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@exemplo.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">Telefone</label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+55 (11) 99999-9999"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="packageType">Pacote</label>
          <Select
            value={formData.packageType}
            onValueChange={(value) => handleSelectChange('packageType', value)}
          >
            <SelectTrigger id="packageType">
              <SelectValue placeholder="Selecione um pacote" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essencial">Essencial</SelectItem>
              <SelectItem value="Profissional">Profissional</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Descrição</label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Breve descrição do projeto"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar Briefing
        </Button>
      </div>
    </form>
  );
};

export default CreateBriefingForm;
