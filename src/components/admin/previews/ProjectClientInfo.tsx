
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from 'lucide-react';

interface ProjectClientInfoProps {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
}

const ProjectClientInfo: React.FC<ProjectClientInfoProps> = ({
  clientName,
  clientEmail,
  clientPhone
}) => {
  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cliente */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4" />
            Nome
          </div>
          <div className="font-medium">
            <p>{clientName}</p>
          </div>
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </div>
          <div className="font-medium">
            <p className="text-sm">{clientEmail}</p>
          </div>
        </div>
        
        {/* Telefone (se disponível) */}
        {clientPhone && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="mr-2 h-4 w-4" />
              Telefone
            </div>
            <div className="font-medium">
              <p className="text-sm">{clientPhone}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectClientInfo;
