
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from 'lucide-react';
import { useCustomers } from '@/hooks/admin/useCustomers';

interface BriefingDetailFormProps {
  briefing: any;
  isEditing?: boolean;
  onClose: () => void;
  onUpdate?: (updatedBriefing: any) => void;
}

const BriefingDetailForm: React.FC<BriefingDetailFormProps> = ({ 
  briefing, 
  isEditing = false,
  onClose,
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: briefing.name || '',
    email: briefing.email || '',
    phone: briefing.phone || '',
    packageType: briefing.packageType || 'essencial',
    description: briefing.description || '',
    status: briefing.status || 'pending'
  });
  const { toast } = useToast();
  const { customers, getCustomerByEmail } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  useEffect(() => {
    // Check if this customer exists
    if (formData.email) {
      const existingCustomer = getCustomerByEmail(formData.email);
      if (existingCustomer) {
        setIsExistingCustomer(true);
        setSelectedCustomerId(existingCustomer.id);
      } else {
        setIsExistingCustomer(false);
        setSelectedCustomerId('');
      }
    }
  }, [formData.email, getCustomerByEmail]);

  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone || ''
      }));
      setSelectedCustomerId(customerId);
      setIsExistingCustomer(true);
    } else {
      setIsExistingCustomer(false);
      setSelectedCustomerId('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    
    setIsLoading(true);
    
    try {
      // Create updated briefing object
      const updatedBriefing = {
        ...briefing,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        packageType: formData.packageType,
        description: formData.description,
        status: formData.status,
        formData: {
          ...(briefing.formData || {}),
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          description: formData.description
        }
      };
      
      // Call onUpdate prop
      if (onUpdate) {
        onUpdate(updatedBriefing);
      }
      
    } catch (error) {
      console.error('Error updating briefing:', error);
      toast({
        title: "Erro ao atualizar briefing",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'completed':
        return <Badge className="bg-yellow-500">Analisado</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Briefing {briefing.id}
          <span className="ml-2">
            {getStatusBadge(briefing.status)}
          </span>
        </h3>
        <div>
          <Badge variant="outline" className="text-gray-500">
            Criado em: {briefing.createdAt}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {isEditing && (
          <div>
            <Label htmlFor="customer-select">Cliente</Label>
            <Select 
              value={selectedCustomerId} 
              onValueChange={handleCustomerSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um cliente existente ou mantenha os dados atuais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Dados Atuais / Novo Cliente</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="name">
            Nome do Cliente
            {isExistingCustomer && <span className="ml-2 text-green-500 text-xs">(Cliente existente)</span>}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing || (isEditing && isExistingCustomer && selectedCustomerId !== '')}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing || (isEditing && isExistingCustomer && selectedCustomerId !== '')}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing || (isEditing && isExistingCustomer && selectedCustomerId !== '')}
            className={!isEditing ? "bg-gray-50" : ""}
          />
        </div>

        <div>
          <Label htmlFor="packageType">Tipo de Pacote</Label>
          {isEditing ? (
            <Select 
              value={formData.packageType} 
              onValueChange={(value) => handleSelectChange('packageType', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essencial">Essencial</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={formData.packageType}
              disabled
              className="bg-gray-50"
            />
          )}
        </div>

        {isEditing && (
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Novo</SelectItem>
                <SelectItem value="completed">Analisado</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`min-h-[100px] ${!isEditing ? "bg-gray-50" : ""}`}
          />
        </div>

        {briefing.projectCreated ? (
          <div className="p-3 bg-green-50 rounded-md flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">Projeto já foi criado a partir deste briefing</span>
          </div>
        ) : (
          <div className="p-3 bg-gray-100 rounded-md flex items-center">
            <X className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">Nenhum projeto criado ainda</span>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {isEditing ? "Cancelar" : "Fechar"}
        </Button>
        
        {isEditing && (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default BriefingDetailForm;
