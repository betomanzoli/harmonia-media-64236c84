
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Package } from 'lucide-react';

interface ProjectHeaderProps {
  projectTitle?: string;
  clientName: string;
  packageType?: string;
  className?: string;
  projectId?: string;
  status?: 'waiting' | 'feedback' | 'approved';
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectTitle,
  clientName,
  packageType,
  className = "",
  projectId,
  status
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-bold mb-2">{projectTitle || `Projeto ${projectId}`}</h1>
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-gray-600 mr-3">Cliente: {clientName}</span>
        {packageType && (
          <Badge variant="outline" className="flex items-center bg-zinc-400">
            <Package className="h-3 w-3 mr-1" />
            {packageType}
          </Badge>
        )}
        {status && (
          <Badge variant="outline" className={`ml-2 ${
            status === 'approved' ? 'bg-green-100 text-green-800' :
            status === 'feedback' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status === 'approved' ? 'Aprovado' :
             status === 'feedback' ? 'Feedback' : 'Aguardando'}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
