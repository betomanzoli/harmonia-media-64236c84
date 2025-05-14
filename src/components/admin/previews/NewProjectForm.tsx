
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import PreviewVersionInput from './PreviewVersionInput';
import { useToast } from "@/hooks/use-toast";
import { useNewProjectForm } from '@/hooks/admin/useNewProjectForm';
import ClientInfoForm from './ClientInfoForm';
import { Input } from '@/components/ui/input';
import { useCustomers } from '@/hooks/admin/useCustomers';
import PhoneInput, { PhoneWithCountryCode } from '@/components/PhoneInput';

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
  
  const handleSelectCustomer = (customer: any) => {
    setClientName(customer.name);
    setClientEmail(customer.email);
    
    // Format phone number if exists
    if (customer.phone) {
      const phoneNumber = customer.phone.replace(/\D/g, '');
      const countryCode = phoneNumber.substring(0, 2);
      const nationalNumber = phoneNumber.substring(2);
      
      setClientPhone({
        fullNumber: `+${phoneNumber}`,
        countryCode,
        nationalNumber
      });
    }
    
    setSearchTerm('');
    setShowResults(false);
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
        <h3 className="text-lg font-semibold">Informações do Cliente</h3>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Buscar cliente por nome ou email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(e.target.value.length > 0);
                }}
              />
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setShowResults(false);
              }}
            >
              Limpar
            </Button>
          </div>
          
          {showResults && searchTerm.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-popover shadow-md rounded-md border p-2 max-h-60 overflow-auto">
              {filteredCustomers.length === 0 ? (
                <div className="py-2 px-3 text-sm text-muted-foreground">
                  Nenhum cliente encontrado
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div 
                    key={customer.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer rounded-sm"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
        <ClientInfoForm 
          clientName={clientName}
          clientEmail={clientEmail}
          packageType={packageType}
          onClientNameChange={setClientName}
          onClientEmailChange={setClientEmail}
          onPackageTypeChange={setPackageType}
        />
        
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

        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 pb-4">
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
          {isSubmitting ? 'Criando...' : 'Criar Projeto'}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
