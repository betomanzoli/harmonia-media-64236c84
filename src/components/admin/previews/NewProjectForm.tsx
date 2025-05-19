
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createId } from "@paralleldrive/cuid2";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  packageType?: string;
}

interface NewProjectFormProps {
  onAddProject: (project: any) => string | null;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [packageType, setPackageType] = useState<string>("Essencial");
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
      setClientName(selectedClient.name);
      setClientEmail(selectedClient.email);
      setClientPhone(selectedClient.phone || '');
      
      // If client has a package type associated, set it
      if (selectedClient.packageType) {
        setPackageType(selectedClient.packageType);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cliente existente.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a random 7-day expiration date from now
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    
    const newProject = {
      clientName: clientName,
      clientEmail: clientEmail,
      clientPhone: clientPhone,
      packageType: packageType,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      status: 'waiting' as const,
      versions: 0,
      previewUrl: `/preview/${createId()}`,
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: new Date().toLocaleDateString('pt-BR'),
      briefingId: `B${Math.floor(Math.random() * 1000)}`,
      versionsList: []
    };
    
    const newProjectId = onAddProject(newProject);
    
    if (newProjectId) {
      toast({
        title: "Projeto criado",
        description: `Projeto ${newProjectId} criado com sucesso.`
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="clientSelect">Selecionar Cliente Existente</Label>
          <Select 
            value={selectedClientId} 
            onValueChange={handleClientChange}
            required
          >
            <SelectTrigger id="clientSelect" className="w-full">
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={clientName}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email do Cliente</Label>
            <Input
              id="clientEmail"
              value={clientEmail}
              disabled
              className="bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientPhone">Telefone do Cliente</Label>
            <Input
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+55 (00) 00000-0000"
            />
          </div>
          <div>
            <Label htmlFor="packageType">Pacote</Label>
            <Select 
              value={packageType} 
              onValueChange={setPackageType}
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
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Inserir Prévias
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
