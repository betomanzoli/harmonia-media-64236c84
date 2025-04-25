
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Package, User, ExternalLink } from 'lucide-react';

interface ClientInfo {
  name: string;
  email: string;
  packageType: string;
}

interface ProjectClientInfoProps {
  client: ClientInfo;
}

const ProjectClientInfo: React.FC<ProjectClientInfoProps> = ({ client }) => {
  const handleEmailClient = () => {
    window.open(`mailto:${client.email}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-harmonia-green">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{client.name}</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <Mail className="h-3.5 w-3.5 mr-1" />
              {client.email}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-sm bg-gray-50 p-3 rounded-md mb-4">
          <Package className="h-4 w-4 text-harmonia-green mr-2" />
          <span>Pacote: <span className="font-medium">{client.packageType}</span></span>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-1"
          onClick={handleEmailClient}
        >
          <Mail className="h-4 w-4" />
          Enviar E-mail
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectClientInfo;
