
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  onPackageTypeChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="client-name">Nome do Cliente *</Label>
        <Input
          id="client-name"
          value={clientName}
          onChange={(e) => onClientNameChange(e.target.value)}
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
          onChange={(e) => onClientEmailChange(e.target.value)}
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="package-type">Pacote *</Label>
        <Select 
          value={packageType} 
          onValueChange={onPackageTypeChange}
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
    </div>
  );
};

export default ClientInfoForm;
