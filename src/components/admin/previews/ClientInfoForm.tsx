
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClientInfoFormProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageType: string;
  onClientNameChange: (value: string) => void;
  onClientEmailChange: (value: string) => void;
  onClientPhoneChange: (value: string) => void;
  onPackageTypeChange: (value: string) => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientName, 
  clientEmail,
  clientPhone,
  packageType,
  onClientNameChange,
  onClientEmailChange,
  onClientPhoneChange,
  onPackageTypeChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="clientName">Nome do Cliente</Label>
        <Input 
          id="clientName" 
          value={clientName} 
          onChange={(e) => onClientNameChange(e.target.value)}
          placeholder="Nome completo do cliente"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="clientEmail">Email do Cliente</Label>
        <Input 
          id="clientEmail" 
          type="email"
          value={clientEmail} 
          onChange={(e) => onClientEmailChange(e.target.value)}
          placeholder="email@exemplo.com"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="clientPhone">Telefone do Cliente</Label>
        <Input 
          id="clientPhone" 
          type="tel"
          value={clientPhone} 
          onChange={(e) => onClientPhoneChange(e.target.value)}
          placeholder="(00) 00000-0000"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="packageType">Tipo de Pacote</Label>
        <Select value={packageType} onValueChange={onPackageTypeChange}>
          <SelectTrigger id="packageType" className="mt-1">
            <SelectValue placeholder="Selecione o pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Música Personalizada - Essencial">Música Personalizada - Essencial</SelectItem>
            <SelectItem value="Música Personalizada - Premium">Música Personalizada - Premium</SelectItem>
            <SelectItem value="Música Personalizada - Profissional">Música Personalizada - Profissional</SelectItem>
            <SelectItem value="Jingle Publicitário">Jingle Publicitário</SelectItem>
            <SelectItem value="Música para Casamento">Música para Casamento</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ClientInfoForm;
