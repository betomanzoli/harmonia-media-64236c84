
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import PreviewVersionInput from './PreviewVersionInput';
import { useToast } from "@/hooks/use-toast";
import { useNewProjectForm } from '@/hooks/admin/useNewProjectForm';
import { Input } from '@/components/ui/input';
import { useCustomers } from '@/hooks/admin/useCustomers';
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewProjectFormProps {
  onAddProject: (project: any) => string | null;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({
  onAddProject
}) => {
  const {
    formState: {
      clientName,
      clientEmail,
      packageType,
      versions,
      isSubmitting
    },
    setters: {
      setClientName,
      setClientEmail,
      setPackageType,
      setIsSubmitting
    },
    actions: {
      addVersion,
      removeVersion,
      updateVersion,
      resetForm
    }
  } = useNewProjectForm();
  
  const { toast } = useToast();
  const { customers } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<PhoneWithCountryCode>({
    fullNumber: '',
    countryCode: '55',
    nationalNumber: ''
  });
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Limit to 5 results
  
  const handleSelectCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    setSelectedClientId(customer.id);
    setClientName(customer.name);
    setClientEmail(customer.email);
    
    // Format phone number if exists
    if (customer.phone) {
      const phoneNumber = customer.phone.replace(/\D/g, '');
      const countryCode = phoneNumber.substring(0, 2);
      const nationalNumber = phoneNumber.substring(2);
      
      setClientPhone({
        fullNumber: customer.phone,
        countryCode,
        nationalNumber
      });
    }
  };

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
    
    // Validate phone format
    if (!clientPhone.fullNumber || !clientPhone.fullNumber.startsWith('+')) {
      toast({
        title: "Formato de telefone inválido",
        description: "O telefone deve estar no formato internacional (ex: +5511999999999)",
        variant: "destructive"
      });
      return;
    }
    
    const hasEmptyVersions = versions.some(v => !v.title.trim() || !v.description.trim() || !v.audioUrl.trim());
    if (hasEmptyVersions) {
      toast({
        title: "Versões incompletas",
        description: "Por favor, preencha todas as informações das versões.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const project = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.fullNumber,
        packageType: packageType,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        status: 'waiting' as const,
        versions: versions.length,
        previewUrl: '',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        lastActivityDate: new Date().toLocaleDateString('pt-BR'),
        versionsList: versions.map((v, index) => ({
          id: `v${index + 1}`,
          name: v.title,
          description: v.description,
          audioUrl: v.audioUrl,
          dateAdded: new Date().toLocaleDateString('pt-BR'),
          // Extract fileId from Google Drive URL
          fileId: v.audioUrl.match(/[-\w]{25,}/) ? v.audioUrl.match(/[-\w]{25,}/)![0] : ''
        }))
      };
      
      const newProjectId = onAddProject(project);
      if (newProjectId) {
        resetForm();
        toast({
          title: "Projeto criado com sucesso",
          description: `O projeto ${newProjectId} foi criado com ${versions.length} versão(ões).`
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Selecione um Cliente</h3>
        
        <div>
          <label htmlFor="clientSelect" className="block text-sm font-medium mb-1">
            Cliente
          </label>
          <Select onValueChange={handleSelectCustomer} value={selectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium">
              Nome do Cliente
            </label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome do cliente"
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium">
              E-mail do Cliente
            </label>
            <Input
              id="clientEmail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Email do cliente"
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="packageType" className="block text-sm font-medium">
            Pacote Contratado *
          </label>
          <Select onValueChange={setPackageType} value={packageType}>
            <SelectTrigger>
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
        
        <div className="space-y-2">
          <label htmlFor="clientPhone" className="block text-sm font-medium">
            Telefone (WhatsApp) *
          </label>
          <PhoneInput
            id="clientPhone"
            value={clientPhone}
            onChange={setClientPhone}
            label=""
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Formato internacional necessário para funcionar com WhatsApp
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Versões Musicais</h3>
          <Button type="button" onClick={addVersion} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Versão
          </Button>
        </div>

        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 pb-4">
          {versions.map((version, index) => (
            <div key={index} className="version-container">
              <PreviewVersionInput 
                index={index} 
                title={version.title} 
                description={version.description} 
                audioUrl={version.audioUrl} 
                recommended={false} 
                onTitleChange={(i, value) => updateVersion(i, 'title', value)} 
                onDescriptionChange={(i, value) => updateVersion(i, 'description', value)} 
                onAudioUrlChange={(i, value) => updateVersion(i, 'audioUrl', value)} 
                onRecommendedChange={(i, value) => {}} 
                onRemove={removeVersion} 
                canRemove={versions.length > 1} 
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Inserir Prévias'}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
