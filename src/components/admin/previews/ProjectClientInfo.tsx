
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Calendar, Package } from 'lucide-react';

export interface ProjectClientInfoProps {
  clientName: string;
  clientEmail: string;
  packageType: string;
  createdAt: string;
  expirationDate: string;
  lastActivityDate?: string;
}

const ProjectClientInfo: React.FC<ProjectClientInfoProps> = ({ 
  clientName,
  clientEmail,
  packageType,
  createdAt,
  expirationDate,
  lastActivityDate = "N/A"
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start">
            <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
            <div>
              <p className="font-medium">{clientName}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {clientEmail}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Pacote</p>
              <p>{packageType}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Data de Criação</p>
              <p>{createdAt}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Último Acesso</p>
              <p>{lastActivityDate}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Expiração</p>
              <p>{expirationDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectClientInfo;
