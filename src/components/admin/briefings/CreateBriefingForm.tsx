import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useCustomers } from '@/hooks/admin/useCustomers';
import { supabase } from '@/lib/supabase';
import { createId } from '@paralleldrive/cuid2';

interface CreateBriefingFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [packageType, setPackageType] = useState('essencial');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const { customers, addCustomer, getCustomerByEmail } = useCustomers();
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  useEffect(() => {
    // Check if email exists when it changes
    if (email) {
      const existingCustomer = getCustomerByEmail(email);
      setIsExistingCustomer(!!existingCustomer);
      if (existingCustomer) {
        setName(existingCustomer.name);
        setPhone(existingCustomer.phone || '');
        setSelectedCustomerId(existingCustomer.id);
      }
    } else {
      setIsExistingCustomer(false);
    }
  }, [email, getCustomerByEmail]);

  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setName(selectedCustomer.name);
      setEmail(selectedCustomer.email);
      setPhone(selectedCustomer.phone || '');
      setSelectedCustomerId(customerId);
      setIsExistingCustomer(true);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setSelectedCustomerId('');
      setIsExistingCustomer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let clientId: string;

      // If a customer is selected, use that
      if (isExistingCustomer && selectedCustomerId) {
        clientId = selectedCustomerId;
      } else {
        // Otherwise create a new customer
        const customerData = {
          name,
          email,
          phone,
          status: 'active' as const,
          projects: 1,
          createdAt: new Date().toISOString(),
        };

        // Add to local storage and get the ID
        clientId = await addCustomer(customerData);

        // Also add to Supabase
        try {
          const { data: client, error } = await supabase
            .from('clients')
            .insert([
              {
                name,
                email,
                phone,
                company: null,
              }
            ])
            .select()
            .single();

          if (client && !error) {
            clientId = client.id;
          }
        } catch (error) {
          console.error('Error creating client in Supabase:', error);
          // Continue with local client ID
        }
      }

      // Create the briefing data
      const briefingId = createId();
      const briefingData = {
        id: briefingId,
        client_id: clientId,
        package_type: packageType,
        status: 'pending',
        data: {
          description,
          client_name: name,
          client_email: email,
          client_phone: phone,
        },
      };

      // Insert the briefing into Supabase
      const { data: briefing, error } = await supabase
        .from('briefings')
        .insert([briefingData])
        .select();

      if (error) {
        throw error;
      }

      // Call the onSubmit prop with the created briefing
      onSubmit(briefing?.[0] || briefingData);

      toast({
        title: "Briefing criado com sucesso",
        description: `O briefing para ${name} foi criado.`
      });

      onClose();

    } catch (error: any) {
      console.error('Error creating briefing:', error);
      toast({
        title: "Erro ao criar briefing",
        description: error.message || "Não foi possível criar o briefing",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Novo Briefing</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="customer-select">Cliente</Label>
          <Select onValueChange={handleCustomerSelect} value={selectedCustomerId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um cliente existente ou crie um novo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Novo Cliente</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="name">Nome do Cliente</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            required
            disabled={isExistingCustomer && selectedCustomerId !== ''}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@email.com"
            required
            disabled={isExistingCustomer && selectedCustomerId !== ''}
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
            disabled={isExistingCustomer && selectedCustomerId !== ''}
          />
        </div>

        <div>
          <Label htmlFor="packageType">Tipo de Pacote</Label>
          <Select value={packageType} onValueChange={setPackageType}>
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
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descrição do projeto musical"
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Criar Briefing'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateBriefingForm;
