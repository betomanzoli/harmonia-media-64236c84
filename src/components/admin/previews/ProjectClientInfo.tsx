
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectClientInfoProps {
  client: {
    name: string;
    email: string;
    packageType: string;
  };
}

const ProjectClientInfo: React.FC<ProjectClientInfoProps> = ({ client }) => {
  const { toast } = useToast();

  const handleEmailClick = () => {
    navigator.clipboard.writeText(client.email);
    toast({
      title: "Email copiado",
      description: "O email do cliente foi copiado para a área de transferência."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informações do cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500">Nome:</span>
            <p className="font-medium">{client.name}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-medium">{client.email}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEmailClick}
                className="h-8 w-8 p-0"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Pacote:</span>
            <p className="font-medium">{client.packageType}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectClientInfo;
