
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface CreateBriefingFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    packageType: initialData?.packageType || 'essencial',
    description: '',
    musicStyle: '',
    references: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert references string to array if provided
    const references = formData.references 
      ? formData.references.split('\n').filter(ref => ref.trim() !== '')
      : [];
      
    onSubmit({
      ...formData,
      references
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Cliente</Label>
        <Input 
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
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
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input 
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="packageType">Pacote</Label>
        <Select 
          value={formData.packageType}
          onValueChange={(value) => handleSelectChange('packageType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="essencial">Essencial</SelectItem>
            <SelectItem value="profissional">Profissional</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Projeto</Label>
        <Textarea 
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o projeto musical detalhadamente"
          rows={4}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="musicStyle">Estilo Musical</Label>
        <Input 
          id="musicStyle"
          name="musicStyle"
          value={formData.musicStyle}
          onChange={handleChange}
          placeholder="Pop, Rock, Jazz, Clássico, etc."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="references">Referências Musicais</Label>
        <Textarea 
          id="references"
          name="references"
          value={formData.references}
          onChange={handleChange}
          placeholder="Uma referência por linha"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
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
