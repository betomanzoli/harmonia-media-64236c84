
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Play, Download, Star } from 'lucide-react';

interface PreviewVersionsListProps {
  versions: VersionItem[];
  projectId: string;
}

const PreviewVersionsList: React.FC<PreviewVersionsListProps> = ({ versions, projectId }) => {
  const handlePlayAudio = (url: string) => {
    window.open(url, '_blank');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Versões da Prévia</CardTitle>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Nenhuma versão foi adicionada ainda.</p>
            <p className="text-sm mt-2">Clique em "Adicionar Versão" para criar a primeira versão.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Versão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {version.recommended && (
                          <Star className="h-4 w-4 text-yellow-500 mr-2 fill-yellow-500" />
                        )}
                        <div>
                          <div className="font-medium">{version.name}</div>
                          {version.description && (
                            <div className="text-sm text-gray-500">{version.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{version.dateAdded}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativa
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handlePlayAudio(version.audioUrl || '')}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Ouvir
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <a 
                            href={version.audioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download={`preview_${projectId}_${version.name.replace(/\s+/g, '_')}.mp3`}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Baixar
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewVersionsList;
