
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Calendar, Package } from 'lucide-react';

export interface ProjectClientInfoProps {
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
  lastActivityDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{clientName}</p>
            <p className="text-sm text-gray-500">Nome do cliente</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{clientEmail}</p>
            <p className="text-sm text-gray-500">Email de contato</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Package className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">{packageType}</p>
            <p className="text-sm text-gray-500">Tipo de pacote</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Criado em
            </span>
            <span className="font-medium">{createdAt}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Expira em
            </span>
            <span className="font-medium">{expirationDate}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1 flex items-center">
              <Calendar className="h-3 w-3 mr-1" /> Última atividade
            </span>
            <span className="font-medium">{lastActivityDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectClientInfo;
