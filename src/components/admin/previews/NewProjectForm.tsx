
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewProjectFormProps {
  onAddProject: (project: any) => string | null;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [packageType, setPackageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim() || !clientEmail.trim() || !packageType) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateEmail(clientEmail)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um endereço de e-mail válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create a date 30 days from now for expiration
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 30);
    
    // Create the project object
    const project = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      packageType,
      createdAt: today.toLocaleDateString('pt-BR'),
      status: 'waiting' as const,
      versions: 0,
      previewUrl: '',
      expirationDate: expirationDate.toLocaleDateString('pt-BR'),
      lastActivityDate: today.toLocaleDateString('pt-BR'),
      versionsList: []
    };
    
    try {
      const newProjectId = onAddProject(project);
      
      if (newProjectId) {
        // Reset form
        setClientName('');
        setClientEmail('');
        setPackageType('');
        
        toast({
          title: "Projeto criado com sucesso",
          description: `O projeto ${newProjectId} foi criado e está pronto para receber versões.`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-name">Nome do Cliente *</Label>
          <Input
            id="client-name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nome completo do cliente"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client-email">Email do Cliente *</Label>
          <Input
            id="client-email"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="package-type">Pacote *</Label>
        <Select 
          value={packageType} 
          onValueChange={setPackageType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Essencial">Essencial</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Profissional">Profissional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
