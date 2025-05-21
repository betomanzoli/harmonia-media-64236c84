
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, Package, Calendar as CalendarIcon, Clock } from 'lucide-react';

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
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cliente */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            Cliente
          </div>
          <div className="font-medium">
            <p>{clientName}</p>
            <p className="text-sm text-muted-foreground">{clientEmail}</p>
          </div>
        </div>
        
        {/* Tipo de pacote */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Package className="mr-2 h-4 w-4" />
            Pacote
          </div>
          <div className="font-medium">{packageType}</div>
        </div>
        
        {/* Data de criação */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Data de criação
          </div>
          <div className="font-medium">{createdAt}</div>
        </div>
        
        {/* Data de expiração */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Expiração
          </div>
          <div className="font-medium">
            {expirationDate || "Sem data definida"}
          </div>
        </div>
        
        {/* Última atividade */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            Última atividade
          </div>
          <div className="font-medium">
            {lastActivityDate || "Sem atividade recente"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectClientInfo;
