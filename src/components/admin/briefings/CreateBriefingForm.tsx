
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBriefings } from '@/hooks/admin/useBriefings';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  packageType?: string;
}

interface CreateBriefingFormProps {
  onClose: () => void;
}

const CreateBriefingForm: React.FC<CreateBriefingFormProps> = ({ onClose }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [packageType, setPackageType] = useState("Essencial");
  const [description, setDescription] = useState("");
  const { addBriefing } = useBriefings();
  const { toast } = useToast();

  // Load clients on component mount
  useEffect(() => {
    // For demonstration, using localStorage
    const loadClients = () => {
      try {
        const storedClients = localStorage.getItem('harmonIA_clients');
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients);
          setClients(parsedClients);
        } else {
          // Sample clients
          const sampleClients = [
            { id: 'client1', name: 'Maria Silva', email: 'maria@example.com', phone: '+5511999999999', packageType: 'Premium' },
            { id: 'client2', name: 'João Santos', email: 'joao@example.com', phone: '+5521888888888', packageType: 'Essencial' },
            { id: 'client3', name: 'Empresa XYZ', email: 'contato@xyz.com', phone: '+5531777777777', packageType: 'Profissional' }
          ];
          setClients(sampleClients);
          localStorage.setItem('harmonIA_clients', JSON.stringify(sampleClients));
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };

    loadClients();
  }, []);

  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const selectedClient = clients.find(client => client.id === clientId);
    
    if (selectedClient) {
      setName(selectedClient.name);
      setEmail(selectedClient.email);
      setPhone(selectedClient.phone || '');
      
      // If client has a package type associated, set it
      if (selectedClient.packageType) {
        setPackageType(selectedClient.packageType);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check required fields
    if (!name.trim() || !email.trim() || !packageType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const formData = {
      name,
      email,
      phone,
      packageType,
      description,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'pending' as const,
      projectCreated: false
    };
    
    const newBriefingId = addBriefing(formData);
    
    toast({
      title: "Briefing criado",
      description: `Briefing ${newBriefingId} criado com sucesso.`
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientSelect">Cliente Existente (opcional)</Label>
        <Select 
          value={selectedClientId} 
          onValueChange={handleClientChange}
        >
          <SelectTrigger id="clientSelect">
            <SelectValue placeholder="Selecione um cliente existente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Novo Cliente</SelectItem>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.name} ({client.email})
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
            placeholder="Nome do cliente"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+55 (00) 00000-0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="packageType">Pacote *</Label>
          <Select 
            value={packageType} 
            onValueChange={setPackageType}
            required
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
        <Label htmlFor="description">Descrição do Projeto</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição do projeto musical"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Criar Briefing</Button>
      </div>
    </form>
  );
};

export default CreateBriefingForm;
