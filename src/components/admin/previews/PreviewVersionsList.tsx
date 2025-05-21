
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VersionItem } from '@/types/preview.types';
import VersionCard from './VersionCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PreviewVersionsListProps {
  versions: VersionItem[];
  projectId: string;
  onDeleteVersion?: (versionId: string) => void;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({ 
  versions, 
  projectId,
  onDeleteVersion 
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const finalVersions = versions.filter(v => v.final);
  const regularVersions = versions.filter(v => !v.final);
  
  const displayVersions = activeTab === 'all' 
    ? versions 
    : activeTab === 'final' 
      ? finalVersions 
      : regularVersions;

  // Handle version delete if onDeleteVersion is provided
  const handleDeleteVersion = (versionId: string) => {
    if (onDeleteVersion) {
      onDeleteVersion(versionId);
    } else {
      console.warn('onDeleteVersion not provided to PreviewVersionsList');
    }
  };

  return (
    <Card className="bg-gray-100 text-gray-900">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Versões ({versions.length})</CardTitle>
          <div className="flex items-center gap-2">
            {finalVersions.length > 0 && (
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                {finalVersions.length} final
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {versions.length > 0 ? (
          <>
            {finalVersions.length > 0 && regularVersions.length > 0 && (
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid grid-cols-3 w-full max-w-xs">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="regular">Prévias</TabsTrigger>
                  <TabsTrigger value="final">Finais</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
            
            <div className="space-y-4">
              {displayVersions.map((version) => (
                <VersionCard
                  key={version.id}
                  version={version}
                  projectId={projectId}
                  onDeleteVersion={onDeleteVersion ? handleDeleteVersion : undefined}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma versão adicionada ainda.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewVersionsList;
