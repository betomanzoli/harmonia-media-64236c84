
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProjectMetadataCardProps {
  clientName: string;
  projectTitle: string;
  status: string;
  createdAt?: string;
  expirationDate?: string;
  packageType?: string;
}

const ProjectMetadataCard: React.FC<ProjectMetadataCardProps> = ({
  clientName,
  projectTitle,
  status,
  createdAt,
  expirationDate,
  packageType
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definido';
    
    try {
      // Try parsing as ISO date
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? dateString 
        : format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Título do Projeto</h3>
          <p className="font-medium">{projectTitle}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <h3 className="text-sm text-gray-500">Cliente</h3>
            <p className="font-medium">{clientName}</p>
          </div>
        </div>
        
        {packageType && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <div>
              <h3 className="text-sm text-gray-500">Pacote</h3>
              <p className="font-medium">{packageType}</p>
            </div>
          </div>
        )}
        
        {createdAt && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <div>
              <h3 className="text-sm text-gray-500">Criado em</h3>
              <p className="font-medium">{formatDate(createdAt)}</p>
            </div>
          </div>
        )}
        
        {expirationDate && (
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <div>
              <h3 className="text-sm text-gray-500">Expira em</h3>
              <p className="font-medium">{formatDate(expirationDate)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMetadataCard;
