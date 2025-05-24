
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBriefings } from '@/hooks/admin/useBriefings';
import { useCustomers } from '@/hooks/admin/useCustomers';

interface CreateBriefingFormProps {
  onSuccess: () => void;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ 
  onSuccess, 
  initialData 
}) => {
  const { toast } = useToast();
  const { createBriefing } = useBriefings();
  const { createCustomer } = useCustomers();
  
  const [formData, setFormData] = useState({
    clientName: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    projectDescription: '',
    packageType: 'essencial' as 'essencial' | 'profissional' | 'premium',
    budget: '',
    timeline: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.email || !formData.projectDescription) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, email e descrição do projeto.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Se não é um cliente existente, criar o cliente primeiro
      if (!initialData) {
        await createCustomer({
          name: formData.clientName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company
        });
      }

      // Criar o briefing
      const result = await createBriefing({
        clientName: formData.clientName,
        email: formData.email,
        projectDescription: formData.projectDescription,
        packageType: formData.packageType,
        budget: formData.budget,
        timeline: formData.timeline,
        phone: formData.phone,
        company: formData.company
      });

      if (result) {
        toast({
          title: "Briefing criado",
          description: "O briefing foi criado com sucesso.",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao criar briefing:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o briefing.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Briefing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="packageType">Tipo de Pacote</Label>
            <Select 
              value={formData.packageType} 
              onValueChange={(value) => handleInputChange('packageType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essencial">Essencial</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="projectDescription">Descrição do Projeto *</Label>
            <Textarea
              id="projectDescription"
              value={formData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              rows={4}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Orçamento</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="timeline">Prazo</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Briefing'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateBriefingForm;
