
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Package, Calendar, Clock, CalendarClock } from 'lucide-react';

interface ProjectClientInfoProps {
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  expirationDate: string;
  lastActivityDate: string;
}

const ProjectClientInfo: React.FC<ProjectClientInfoProps> = ({
  clientName,
  clientEmail,
  packageType,
  createdAt,
  expirationDate,
  lastActivityDate,
}) => {
  return (
    <Card className="bg-gray-100 text-gray-900">
      <CardHeader>
        <CardTitle className="text-lg">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <User className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{clientName}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{clientEmail}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Package className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Pacote</p>
            <p className="text-sm text-gray-500">{packageType}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Data de Criação</p>
            <p className="text-sm text-gray-500">{createdAt}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Data de Expiração</p>
            <p className="text-sm text-gray-500">{expirationDate}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <CalendarClock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Última Atividade</p>
            <p className="text-sm text-gray-500">{lastActivityDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectClientInfo;
