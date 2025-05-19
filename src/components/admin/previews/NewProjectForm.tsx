import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { Plus, X, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface NewProjectFormProps {
  onAddProject: (project: any) => Promise<string | null>;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [packageType, setPackageType] = useState('');
  const [versions, setVersions] = useState([{ id: '1', name: '', description: '', audioUrl: '' }]);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddVersion = () => {
    const newId = (versions.length + 1).toString();
    setVersions([...versions, { id: newId, name: '', description: '', audioUrl: '' }]);
  };
  
  const handleRemoveVersion = (id: string) => {
    setVersions(versions.filter(version => version.id !== id));
  };
  
  const handleVersionChange = (id: string, field: string, value: string) => {
    setVersions(versions.map(version =>
      version.id === id ? { ...version, [field]: value } : version
    ));
  };
  
  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setPackageType('');
    setVersions([{ id: '1', name: '', description: '', audioUrl: '' }]);
    setExpirationDate(undefined);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !clientEmail || !packageType || versions.length === 0) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    const project = {
      clientName,
      clientEmail,
      clientPhone,
      packageType,
      versions: versions.length,
      versionsList: versions,
      status: 'waiting',
      createdAt: format(new Date(), 'dd/MM/yyyy'),
      expirationDate: expirationDate ? format(new Date(expirationDate), 'dd/MM/yyyy') : format(addDays(new Date(), 7), 'dd/MM/yyyy'),
      lastActivityDate: format(new Date(), 'dd/MM/yyyy'),
      previewUrl: ''
    };
    
    try {
      setIsSubmitting(true);
      const newProjectId = await onAddProject(project);
      if (newProjectId) {
        // Reset form after successful submission
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="clientName">Nome do Cliente</Label>
        <Input
          type="text"
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="clientEmail">Email do Cliente</Label>
        <Input
          type="email"
          id="clientEmail"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="clientPhone">Telefone do Cliente</Label>
        <Input
          type="tel"
          id="clientPhone"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="packageType">Pacote Contratado</Label>
        <Select onValueChange={setPackageType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Essencial">Essencial</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Profissional">Profissional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Data de Expiração</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {expirationDate ? (
                format(expirationDate, "PPP")
              ) : (
                <span>Escolha uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={expirationDate}
              onSelect={setExpirationDate}
              disabled={(date) =>
                date < new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label>Versões Musicais</Label>
        {versions.map((version) => (
          <div key={version.id} className="grid grid-cols-12 gap-4 items-start mb-4">
            <div className="col-span-1">
              <Button variant="destructive" size="icon" onClick={() => handleRemoveVersion(version.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="col-span-5">
              <Label htmlFor={`versionName-${version.id}`}>Título</Label>
              <Input
                type="text"
                id={`versionName-${version.id}`}
                value={version.name}
                onChange={(e) => handleVersionChange(version.id, 'name', e.target.value)}
              />
            </div>
            <div className="col-span-6">
              <Label htmlFor={`versionAudioUrl-${version.id}`}>URL do Áudio</Label>
              <Input
                type="text"
                id={`versionAudioUrl-${version.id}`}
                value={version.audioUrl}
                onChange={(e) => handleVersionChange(version.id, 'audioUrl', e.target.value)}
              />
            </div>
            <div className="col-span-11">
              <Label htmlFor={`versionDescription-${version.id}`}>Descrição</Label>
              <Textarea
                id={`versionDescription-${version.id}`}
                value={version.description}
                onChange={(e) => handleVersionChange(version.id, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={handleAddVersion}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Versão
        </Button>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar Projeto'}
      </Button>
    </form>
  );
};

export default NewProjectForm;
