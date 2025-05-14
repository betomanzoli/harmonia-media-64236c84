
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useBriefings } from '@/hooks/admin/useBriefings';
import { useCustomers } from '@/hooks/admin/useCustomers';
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';

interface CreateBriefingFormProps {
  onClose: () => void;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose }) => {
  const { addBriefing } = useBriefings();
  const { toast } = useToast();
  const { customers } = useCustomers();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<PhoneWithCountryCode>({
    fullNumber: '',
    countryCode: '55',
    nationalNumber: ''
  });
  const [packageType, setPackageType] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const handleSelectClient = (clientId: string) => {
    const customer = customers.find(c => c.id === clientId);
    if (!customer) return;
    
    setSelectedClientId(customer.id);
    setName(customer.name);
    setEmail(customer.email);
    
    if (customer.phone) {
      const phoneNumber = customer.phone.replace(/\D/g, '');
      const countryCode = phoneNumber.substring(0, 2);
      const nationalNumber = phoneNumber.substring(2);
      
      setPhone({
        fullNumber: customer.phone,
        countryCode,
        nationalNumber
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !packageType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate phone format
    if (!phone.fullNumber || !phone.fullNumber.startsWith('+')) {
      toast({
        title: "Formato de telefone inválido",
        description: "O telefone deve estar no formato internacional (ex: +5511999999999)",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const briefingId = addBriefing({
        name,
        email,
        phone: phone.fullNumber,
        packageType,
        description,
        status: 'pending',
        createdAt: new Date().toLocaleDateString('pt-BR'),
        projectCreated: false
      });
      
      toast({
        title: "Briefing criado",
        description: `O briefing ${briefingId} foi criado com sucesso.`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao criar briefing",
        description: "Ocorreu um erro ao criar o briefing. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Novo Briefing</DialogTitle>
        <DialogDescription>
          Preencha as informações para criar um novo briefing
        </DialogDescription>
      </DialogHeader>
      
      <Separator className="my-4" />
      
      <div className="space-y-4 mt-4">
        <div className="mb-4">
          <Label htmlFor="clientSelect">Cliente Existente</Label>
          <Select onValueChange={handleSelectClient} value={selectedClientId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um cliente existente" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cliente *</Label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail do Cliente *</Label>
            <Input 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              type="email"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
            <PhoneInput
              id="phone"
              value={phone}
              onChange={setPhone}
              label=""
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Formato internacional necessário para WhatsApp
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="packageType">Tipo de Pacote *</Label>
            <Select onValueChange={setPackageType} value={packageType}>
              <SelectTrigger id="packageType">
                <SelectValue placeholder="Selecione o pacote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Essencial">Essencial</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Profissional">Profissional</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description"
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Informações adicionais sobre o briefing"
            rows={4}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Briefing'}
        </Button>
      </div>
    </form>
  );
};

export default CreateBriefingForm;
