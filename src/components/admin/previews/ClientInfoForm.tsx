
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientInfoFormProps {
  clientName: string;
  clientEmail: string;
  packageType: string;
  onClientNameChange: (value: string) => void;
  onClientEmailChange: (value: string) => void;
  onPackageTypeChange: (value: string) => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientName,
  clientEmail,
  packageType,
  onClientNameChange,
  onClientEmailChange,
  onPackageTypeChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nome do Cliente</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            placeholder="Nome completo do cliente"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientEmail">E-mail do Cliente</Label>
          <Input
            id="clientEmail"
            value={clientEmail}
            onChange={(e) => onClientEmailChange(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="packageType">Pacote Contratado</Label>
        <Select 
          value={packageType} 
          onValueChange={onPackageTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pacote Essencial">Essencial</SelectItem>
            <SelectItem value="Pacote Profissional">Profissional</SelectItem>
            <SelectItem value="Pacote Premium">Premium</SelectItem>
            <SelectItem value="Pacote Personalizado">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClientInfoForm;
