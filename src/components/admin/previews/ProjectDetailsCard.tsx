
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { Edit, Save, Clock, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

interface ProjectDetailsCardProps {
  project: ProjectItem;
  onUpdate: (updates: Partial<ProjectItem>) => void;
}

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({ project, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({
    clientName: project.clientName,
    clientEmail: project.clientEmail || '',
    clientPhone: project.clientPhone || '',
    packageType: project.packageType
  });
  const { toast } = useToast();

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'waiting':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            Aguardando Feedback
          </Badge>
        );
      case 'feedback':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            Feedback Recebido
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700">
            Aprovado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Status Desconhecido
          </Badge>
        );
    }
  };
  
  const handleEditSubmit = () => {
    onUpdate(editedProject);
    setIsEditing(false);
    toast({
      title: 'Projeto atualizado',
      description: 'As informações do projeto foram atualizadas com sucesso.'
    });
  };
  
  const calculateDaysRemaining = (expirationDate: string) => {
    const now = new Date();
    const expirationTime = new Date(expirationDate).getTime();
    const diffTime = expirationTime - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Expirado há ${Math.abs(diffDays)} dias`;
    }
    
    return diffDays === 0 ? 'Expira hoje' : `${diffDays} dias restantes`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancelar' : <><Edit className="h-4 w-4 mr-2" /> Editar</>}
        </Button>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente</Label>
              <Input
                id="clientName"
                value={editedProject.clientName}
                onChange={(e) => setEditedProject({...editedProject, clientName: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="clientEmail">Email do Cliente</Label>
              <Input
                id="clientEmail"
                type="email"
                value={editedProject.clientEmail}
                onChange={(e) => setEditedProject({...editedProject, clientEmail: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="clientPhone">Telefone do Cliente</Label>
              <Input
                id="clientPhone"
                value={editedProject.clientPhone}
                onChange={(e) => setEditedProject({...editedProject, clientPhone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="packageType">Tipo de Pacote</Label>
              <Input
                id="packageType"
                value={editedProject.packageType}
                onChange={(e) => setEditedProject({...editedProject, packageType: e.target.value})}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">ID do Projeto:</span>
              <span className="font-medium">{project.id}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Cliente:</span>
              <span className="font-medium">{project.clientName}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Email:</span>
              <span>{project.clientEmail || 'Não informado'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Telefone:</span>
              <span>{project.clientPhone || 'Não informado'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Pacote:</span>
              <span>{project.packageType}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status:</span>
              {getStatusBadge(project.status)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Criado em:</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Expira em:</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span>{formatDate(project.expirationDate)}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({calculateDaysRemaining(project.expirationDate)})
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {isEditing && (
        <CardFooter className="flex justify-end">
          <Button onClick={handleEditSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectDetailsCard;
