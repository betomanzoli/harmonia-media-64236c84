import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface BriefingDetailFormProps {
  briefing: any;
  isEditing: boolean;
  onClose: () => void;
  onUpdate?: (updatedBriefing: any) => void;
}

const BriefingDetailForm: React.FC<BriefingDetailFormProps> = ({ 
  briefing,
  isEditing,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    ...briefing,
    notes: briefing.notes || ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-500">ID</Label>
          <p className="font-mono">{briefing.id}</p>
        </div>
        <div>
          <Label className="text-sm text-gray-500">Data de Criação</Label>
          <p>{briefing.createdAt}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-500">Nome do Cliente</Label>
          <p className="font-medium">{briefing.name}</p>
        </div>
        <div>
          <Label className="text-sm text-gray-500">Email</Label>
          <p>{briefing.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-gray-500">Telefone</Label>
          <p>{briefing.phoneNumber || 'Não informado'}</p>
        </div>
        <div>
          <Label className="text-sm text-gray-500">Pacote</Label>
          <p>{briefing.packageType}</p>
        </div>
      </div>
      
      <div>
        <Label className="text-sm text-gray-500">Descrição do Projeto</Label>
        <p className="p-2 bg-gray-50 rounded border">{briefing.description}</p>
      </div>
      
      {briefing.musicStyle && (
        <div>
          <Label className="text-sm text-gray-500">Estilo Musical</Label>
          <p>{briefing.musicStyle}</p>
        </div>
      )}
      
      {briefing.references && briefing.references.length > 0 && (
        <div>
          <Label className="text-sm text-gray-500">Referências</Label>
          <ul className="list-disc list-inside p-2 bg-gray-50 rounded border">
            {briefing.references.map((ref: string, index: number) => (
              <li key={index}>{ref}</li>
            ))}
          </ul>
        </div>
      )}
      
      {isEditing && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Novo</SelectItem>
              <SelectItem value="completed">Analisado</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notas/Observações</Label>
        <Textarea 
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Adicione notas ou observações sobre este briefing"
          rows={4}
          disabled={!isEditing}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {isEditing ? "Cancelar" : "Fechar"}
        </Button>
        {isEditing && (
          <Button type="submit">
            Salvar Alterações
          </Button>
        )}
      </div>
    </form>
  );
};

export default BriefingDetailForm;
