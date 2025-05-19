
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface ProjectVersionsListProps {
  versions: VersionItem[];
  selectedVersion: VersionItem | null;
  onVersionSelect: (version: VersionItem) => void;
}

const ProjectVersionsList: React.FC<ProjectVersionsListProps> = ({ 
  versions, 
  selectedVersion, 
  onVersionSelect 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Versões ({versions.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {versions.length > 0 ? (
          versions.map((version) => (
            <Card 
              key={version.id}
              className={`cursor-pointer p-3 ${selectedVersion?.id === version.id ? 'border-primary ring-1 ring-primary' : 'hover:bg-gray-50'}`}
              onClick={() => onVersionSelect(version)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{version.name}</h3>
                  {version.description && (
                    <p className="text-sm text-gray-500">{version.description}</p>
                  )}
                </div>
                {version.recommended && (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Recomendada
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma versão adicionada ainda.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectVersionsList;
