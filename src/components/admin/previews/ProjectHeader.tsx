
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Package } from 'lucide-react';

export interface ProjectHeaderProps {
  projectTitle: string;
  clientName: string;
  packageType?: string;
  className?: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectTitle,
  clientName,
  packageType,
  className = ""
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-bold mb-2">{projectTitle}</h1>
      <div className="flex items-center">
        <span className="text-gray-600 mr-3">Cliente: {clientName}</span>
        {packageType && (
          <Badge variant="outline" className="flex items-center bg-zinc-400">
            <Package className="h-3 w-3 mr-1" />
            {packageType}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
