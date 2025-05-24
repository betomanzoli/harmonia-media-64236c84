
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Mail, FileAudio, Download, ExternalLink } from 'lucide-react';

interface Version {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  feedback: string | null;
}

interface ProjectDetailsProps {
  project?: {
    id: string;
    clientName: string;
    clientEmail: string;
    packageType: string;
    status: string;
    createdAt: string;
    versions: Version[];
  }
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  if (!project) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Selecione um projeto para ver os detalhes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary">Aguardando</Badge>;
      case 'feedback':
        return <Badge variant="outline">Feedback</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processando</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">{project.id}: {project.clientName}</h2>
            <p className="text-gray-500">{project.clientEmail}</p>
          </div>
          <div>
            {getStatusBadge(project.status)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Pacote</h3>
            <p className="font-medium">{project.packageType}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Data de Criação</h3>
            <p className="font-medium">{project.createdAt}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Versões</h3>
            <p className="font-medium">{project.versions.length}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Histórico de Versões</h3>
        
        <div className="space-y-4">
          {project.versions.map((version) => (
            <div key={version.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{version.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {version.createdAt}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Abrir</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <FileAudio className="h-5 w-5 text-blue-500" />
                <audio controls className="w-full h-10">
                  <source src={version.url} type="audio/mp3" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
              
              {version.feedback ? (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <h5 className="text-xs font-medium text-gray-500 mb-1">Feedback do Cliente</h5>
                  <p className="text-sm">{version.feedback}</p>
                </div>
              ) : (
                project.status === 'feedback' && (
                  <div className="mt-3 border border-dashed border-yellow-300 bg-yellow-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-600">Aguardando feedback do cliente</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
