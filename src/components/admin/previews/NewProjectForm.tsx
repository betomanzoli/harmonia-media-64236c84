import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Package, DollarSign } from 'lucide-react';

interface NewProjectFormProps {
  onSubmit?: (projectData: any) => void;
  onCancel?: () => void;
}

interface ProjectFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageType: 'essencial' | 'profissional' | 'premium' | '';
  title: string;
  description: string;
  deadline: string;
  budget: number;
  priority: 'low' | 'medium' | 'high' | '';
  musicStyle: string;
  duration: string;
  notes: string;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    packageType: '',
    title: '',
    description: '',
    deadline: '',
    budget: 0,
    priority: '',
    musicStyle: '',
    duration: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando o campo for preenchido
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Nome do cliente é obrigatório';
    }
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email do cliente é obrigatório';
    }
    if (!formData.packageType) {
      newErrors.packageType = 'Tipo de pacote é obrigatório';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Título do projeto é obrigatório';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Prazo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const getPackagePrice = (packageType: string): number => {
    const prices = {
      essencial: 400,
      profissional: 800,
      premium: 1500
    };
    return prices[packageType as keyof typeof prices] || 0;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                placeholder="Nome completo do cliente"
                className={errors.clientName ? 'border-red-500' : ''}
              />
              {errors.clientName && (
                <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="clientEmail">Email do Cliente *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleChange('clientEmail', e.target.value)}
                placeholder="email@exemplo.com"
                className={errors.clientEmail ? 'border-red-500' : ''}
              />
              {errors.clientEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.clientEmail}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="clientPhone">Telefone do Cliente</Label>
            <Input
              id="clientPhone"
              value={formData.clientPhone}
              onChange={(e) => handleChange('clientPhone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalhes do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Pacote *</Label>
              {/* ✅ CORRIGIDO: Removido id prop */}
              <Select 
                value={formData.packageType} 
                onValueChange={(value) => handleChange('packageType', value)}
              >
                <SelectTrigger className={errors.packageType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione o pacote" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essencial">
                    <div className="flex items-center justify-between w-full">
                      <span>Essencial</span>
                      <Badge variant="outline" className="ml-2">R$ 400</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="profissional">
                    <div className="flex items-center justify-between w-full">
                      <span>Profissional</span>
                      <Badge variant="outline" className="ml-2">R$ 800</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="premium">
                    <div className="flex items-center justify-between w-full">
                      <span>Premium</span>
                      <Badge variant="outline" className="ml-2">R$ 1.500</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.packageType && (
                <p className="text-sm text-red-500 mt-1">{errors.packageType}</p>
              )}
            </div>

            <div>
              <Label>Prioridade</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Título do Projeto *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Música de Aniversário - João Silva"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição do Projeto</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva brevemente o projeto e suas particularidades..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="musicStyle">Estilo Musical</Label>
              <Select 
                value={formData.musicStyle} 
                onValueChange={(value) => handleChange('musicStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estilo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpb">MPB</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="sertanejo">Sertanejo</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="eletronica">Eletrônica</SelectItem>
                  <SelectItem value="folk">Folk/Acústico</SelectItem>
                  <SelectItem value="bossa_nova">Bossa Nova</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duração</Label>
              <Select 
                value={formData.duration} 
                onValueChange={(value) => handleChange('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2min">1-2 minutos</SelectItem>
                  <SelectItem value="2-3min">2-3 minutos</SelectItem>
                  <SelectItem value="3-4min">3-4 minutos</SelectItem>
                  <SelectItem value="4min+">Mais de 4 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Orçamento e Prazo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || getPackagePrice(formData.packageType)}
                onChange={(e) => handleChange('budget', parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                step="50"
              />
              {formData.packageType && (
                <p className="text-sm text-muted-foreground mt-1">
                  Valor sugerido para {formData.packageType}: R$ {getPackagePrice(formData.packageType)}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="deadline">Prazo de Entrega *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className={errors.deadline ? 'border-red-500' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deadline && (
                <p className="text-sm text-red-500 mt-1">{errors.deadline}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Adicione qualquer observação ou requisito especial para o projeto..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Resumo do Projeto */}
      {(formData.packageType || formData.priority) && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.packageType && (
                <Badge>
                  <Package className="h-3 w-3 mr-1" />
                  {formData.packageType}
                </Badge>
              )}
              {formData.priority && (
                <Badge className={getPriorityColor(formData.priority)}>
                  Prioridade: {formData.priority}
                </Badge>
              )}
              {formData.budget > 0 && (
                <Badge variant="outline">
                  <DollarSign className="h-3 w-3 mr-1" />
                  R$ {formData.budget.toLocaleString('pt-BR')}
                </Badge>
              )}
              {formData.deadline && (
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(formData.deadline).toLocaleDateString('pt-BR')}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          Criar Projeto
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
