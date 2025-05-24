
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail, Package, User, Phone, Building } from 'lucide-react';
import { BriefingItem } from '@/hooks/admin/useBriefings';

interface BriefingDetailFormProps {
  briefing: BriefingItem;
  isEditing?: boolean;
  onClose: () => void;
  onUpdate?: (briefing: BriefingItem) => void;
}

const BriefingDetailForm: React.FC<BriefingDetailFormProps> = ({ 
  briefing, 
  isEditing = false, 
  onClose,
  onUpdate 
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-500">Novo</Badge>;
      case 'completed':
        return <Badge className="bg-yellow-500">Analisado</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Briefing: {briefing.clientName}
            </CardTitle>
            {getStatusBadge(briefing.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Nome do Cliente
              </Label>
              <Input value={briefing.clientName} readOnly={!isEditing} />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input value={briefing.email} readOnly={!isEditing} />
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4" />
              Pacote Selecionado
            </Label>
            <Input value={briefing.packageType} readOnly />
          </div>

          <div>
            <Label className="mb-2 block">Descrição do Projeto</Label>
            <Textarea 
              value={briefing.projectDescription} 
              readOnly={!isEditing}
              rows={4}
            />
          </div>

          {briefing.budget && (
            <div>
              <Label className="mb-2 block">Orçamento</Label>
              <Input value={briefing.budget} readOnly={!isEditing} />
            </div>
          )}

          {briefing.timeline && (
            <div>
              <Label className="mb-2 block">Prazo</Label>
              <Input value={briefing.timeline} readOnly={!isEditing} />
            </div>
          )}

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Data de Criação
            </Label>
            <Input value={briefing.createdAt} readOnly />
          </div>

          <div className="flex justify-end space-x-2">
            {isEditing && (
              <Button 
                onClick={() => onUpdate && onUpdate(briefing)}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                Salvar Alterações
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              {isEditing ? 'Cancelar' : 'Fechar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BriefingDetailForm;
