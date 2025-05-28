
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, Trash2, RefreshCw } from 'lucide-react';

interface ProjectVersion {
  id: string;
  name: string;
  description: string;
  trackNumber: number;
  bandcampUrl: string;
  embedUrl: string;
  createdAt: string;
  isRecommended: boolean;
  albumId?: string;
  trackId?: string;
}

interface VersionsTableProps {
  versions: ProjectVersion[];
  onDeleteVersion: (versionId: string) => void;
  onToggleRecommended: (versionId: string) => void;
  onRefreshEmbed: (version: ProjectVersion) => void;
}

const VersionsTable: React.FC<VersionsTableProps> = ({
  versions,
  onDeleteVersion,
  onToggleRecommended,
  onRefreshEmbed
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Track #</TableHead>
          <TableHead>IDs</TableHead>
          <TableHead>Recomendada</TableHead>
          <TableHead>Criada</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {versions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Nenhuma versão criada ainda.
            </TableCell>
          </TableRow>
        ) : (
          versions.map((version) => (
            <TableRow key={version.id}>
              <TableCell className="font-medium">
                {version.name}
                {version.isRecommended && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Recomendada
                  </span>
                )}
              </TableCell>
              <TableCell className="max-w-md truncate">{version.description}</TableCell>
              <TableCell>#{version.trackNumber}</TableCell>
              <TableCell className="text-xs text-gray-500">
                {version.albumId && version.trackId ? (
                  <div>
                    <div>Album: {version.albumId}</div>
                    <div>Track: {version.trackId}</div>
                  </div>
                ) : (
                  <span className="text-red-500">IDs não encontrados</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleRecommended(version.id)}
                  className={version.isRecommended ? 'text-green-600' : 'text-gray-400'}
                >
                  {version.isRecommended ? '⭐' : '☆'}
                </Button>
              </TableCell>
              <TableCell>{version.createdAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRefreshEmbed(version)}
                    title="Atualizar embed"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(version.bandcampUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(version.embedUrl, '_blank')}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600"
                    onClick={() => onDeleteVersion(version.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default VersionsTable;
