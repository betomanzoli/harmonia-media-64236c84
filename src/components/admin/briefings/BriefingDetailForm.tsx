
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

// Define a type for the formData that will be included in the Briefing type
interface BriefingFormData {
  [key: string]: any;
}

// Define the Briefing type with the correct properties
export interface Briefing {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  package_type: string;
  status: string;
  responses?: BriefingFormData; // This will store the form data
  created_at: string;
}

interface BriefingDetailFormProps {
  briefing: Briefing;
  onUpdate?: (updatedBriefing: Briefing) => void;
  onDelete?: (id: string) => void;
}

const BriefingDetailForm: React.FC<BriefingDetailFormProps> = ({
  briefing,
  onUpdate,
  onDelete
}) => {
  const [formState, setFormState] = useState<Briefing>({
    ...briefing,
    // Ensure responses exists
    responses: briefing.responses || {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setFormState({
      ...briefing,
      responses: briefing.responses || {}
    });
  }, [briefing]);

  const handleInputChange = (field: keyof Briefing, value: string) => {
    setFormState({
      ...formState,
      [field]: value
    });
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormState({
      ...formState,
      responses: {
        ...formState.responses,
        [field]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In a real app, you would call an API to update the briefing
      console.log('Updating briefing:', formState);
      
      if (onUpdate) {
        onUpdate(formState);
      }
      
      toast({
        title: 'Briefing atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating briefing:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o briefing.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este briefing?')) {
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, you would call an API to delete the briefing
      console.log('Deleting briefing:', briefing.id);
      
      if (onDelete) {
        onDelete(briefing.id);
      }
      
      toast({
        title: 'Briefing excluído',
        description: 'O briefing foi excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting briefing:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o briefing.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBriefingSection = (sectionName: string) => {
    const responses = formState.responses || {};
    
    if (!responses[sectionName]) {
      return <p className="text-gray-500 italic">Nenhuma resposta nesta seção.</p>;
    }

    return (
      <div className="space-y-4">
        {Object.entries(responses[sectionName]).map(([key, value]) => (
          <div key={key}>
            <p className="font-medium">{key}:</p>
            {isEditing ? (
              typeof value === 'string' ? (
                <Textarea
                  value={value}
                  onChange={(e) => 
                    handleFormDataChange(sectionName, {
                      ...responses[sectionName],
                      [key]: e.target.value
                    })
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-500 italic">Tipo de dados complexo - edição não suportada</p>
              )
            ) : (
              <p className="text-gray-700">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{formState.client_name || 'Sem nome'}</h2>
            <p className="text-sm text-gray-500">ID: {formState.id}</p>
          </div>
          <Badge className={getStatusBadgeColor(formState.status)}>
            {formState.status || 'pending'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
            {isEditing ? (
              <Input
                value={formState.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                required
              />
            ) : (
              <p className="text-gray-700">{formState.client_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email do Cliente</label>
            {isEditing ? (
              <Input
                type="email"
                value={formState.client_email}
                onChange={(e) => handleInputChange('client_email', e.target.value)}
                required
              />
            ) : (
              <p className="text-gray-700">{formState.client_email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            {isEditing ? (
              <Input
                value={formState.client_phone || ''}
                onChange={(e) => handleInputChange('client_phone', e.target.value)}
              />
            ) : (
              <p className="text-gray-700">{formState.client_phone || 'Não informado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pacote</label>
            {isEditing ? (
              <Select
                value={formState.package_type}
                onValueChange={(value) => handleInputChange('package_type', value)}
              >
                <SelectItem value="essencial">Essencial</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </Select>
            ) : (
              <p className="text-gray-700">{formState.package_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            {isEditing ? (
              <Select
                value={formState.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </Select>
            ) : (
              <p className="text-gray-700">{formState.status}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de Criação</label>
            <p className="text-gray-700">{new Date(formState.created_at).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </Card>

      {/* Respostas do Briefing */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Respostas do Briefing</h3>
        
        <div className="space-y-6">
          {formState.package_type === 'essencial' && (
            <>
              <div>
                <h4 className="text-md font-semibold mb-2">Informações Gerais</h4>
                {getBriefingSection('general')}
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">Preferências Musicais</h4>
                {getBriefingSection('preferences')}
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">História/Conceito</h4>
                {getBriefingSection('story')}
              </div>
            </>
          )}
          
          {formState.package_type === 'profissional' && (
            <>
              <div>
                <h4 className="text-md font-semibold mb-2">Conceito</h4>
                {getBriefingSection('concept')}
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">Detalhes Técnicos</h4>
                {getBriefingSection('technical')}
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">Requisitos Comerciais</h4>
                {getBriefingSection('commercial')}
              </div>
            </>
          )}
          
          {formState.package_type === 'premium' && (
            <>
              <div>
                <h4 className="text-md font-semibold mb-2">Conceito</h4>
                {getBriefingSection('concept')}
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">Paleta Emocional</h4>
                {getBriefingSection('emotions')}
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">Especificações Técnicas</h4>
                {getBriefingSection('technical')}
              </div>
              <div>
                <h4 className="text-md font-semibold mb-2">Preferências Estéticas</h4>
                {getBriefingSection('aesthetic')}
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        {isEditing ? (
          <div className="space-x-2">
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setFormState({
                  ...briefing,
                  responses: briefing.responses || {}
                });
                setIsEditing(false);
              }}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <Button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            disabled={isProcessing}
          >
            Editar Briefing
          </Button>
        )}

        <Button 
          type="button" 
          variant="outline" 
          className="text-red-500 hover:bg-red-50" 
          onClick={handleDelete} 
          disabled={isProcessing}
        >
          Excluir Briefing
        </Button>
      </div>
    </form>
  );
};

export default BriefingDetailForm;
