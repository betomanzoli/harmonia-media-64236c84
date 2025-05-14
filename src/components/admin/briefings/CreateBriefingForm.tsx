
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBriefings } from '@/hooks/admin/useBriefings';
import { useCustomers } from '@/hooks/admin/useCustomers';

const CreateBriefingForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { toast } = useToast();
  const { addBriefing } = useBriefings();
  const { addCustomer, customers } = useCustomers();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<PhoneWithCountryCode>({
    fullNumber: '',
    countryCode: '55',
    nationalNumber: ''
  });
  const [packageType, setPackageType] = useState('');
  const [description, setDescription] = useState('');
  const [useExistingCustomer, setUseExistingCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const handleSelectCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      if (customer.phone) {
        // Format phone to our structure
        const phoneNumber = customer.phone.replace(/\D/g, '');
        setPhone({
          fullNumber: `+${phoneNumber}`,
          countryCode: phoneNumber.substring(0, 2),
          nationalNumber: phoneNumber.substring(2)
        });
      }
      setSelectedCustomerId(customerId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !packageType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Verify phone has international format
    if (!phone.fullNumber || !phone.fullNumber.startsWith('+')) {
      toast({
        title: "Formato de telefone inválido",
        description: "O telefone deve estar no formato internacional (ex: +5511999999999)",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create new briefing
      const briefingId = addBriefing({
        name,
        email,
        packageType,
        phone: phone.fullNumber,
        description
      });
      
      // If this is a new customer, add them to the database
      if (!useExistingCustomer) {
        addCustomer({
          name,
          email,
          phone: phone.fullNumber,
          projects: 0,
          status: 'active',
          createdAt: new Date().toISOString()
        });
      }
      
      toast({
        title: "Briefing criado",
        description: `O briefing ${briefingId} foi criado com sucesso.`
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating briefing:', error);
      toast({
        title: "Erro ao criar briefing",
        description: "Ocorreu um erro ao criar o briefing. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Novo Briefing</h2>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="useExistingCustomer"
              checked={useExistingCustomer}
              onChange={() => setUseExistingCustomer(prev => !prev)}
              className="h-4 w-4 rounded border-gray-300 text-harmonia-green focus:ring-harmonia-green"
            />
            <Label htmlFor="useExistingCustomer">Usar cliente existente</Label>
          </div>
        </div>

        {useExistingCustomer ? (
          <div className="mb-6">
            <Label htmlFor="customerId">Selecione um cliente</Label>
            <Select value={selectedCustomerId} onValueChange={handleSelectCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Cliente *</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              disabled={useExistingCustomer && selectedCustomerId !== ''}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email do Cliente *</Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              disabled={useExistingCustomer && selectedCustomerId !== ''}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
            <PhoneInput
              id="phone"
              value={phone}
              onChange={setPhone}
              required
              disabled={useExistingCustomer && selectedCustomerId !== ''}
            />
            <p className="text-xs text-gray-400 mt-1">Formato internacional: +55 11 99999-9999</p>
          </div>
          
          <div>
            <Label htmlFor="packageType">Pacote *</Label>
            <Select value={packageType} onValueChange={setPackageType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pacote Essencial">Essencial</SelectItem>
                <SelectItem value="Pacote Profissional">Profissional</SelectItem>
                <SelectItem value="Pacote Premium">Premium</SelectItem>
                <SelectItem value="Pacote Personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Observações</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais sobre o briefing..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Criar Briefing</Button>
      </div>
    </form>
  );
};

export default CreateBriefingForm;
