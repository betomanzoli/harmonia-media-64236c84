
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface VersionPlayerCardProps {
  selectedVersion: VersionItem | null;
}

const VersionPlayerCard: React.FC<VersionPlayerCardProps> = ({ selectedVersion }) => {
  if (!selectedVersion) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhuma versão selecionada.</p>
        </CardContent>
      </Card>
    );
  }

  // Get audio URL based on fileId or URL property
  const audioUrl = selectedVersion.audioUrl || 
    (selectedVersion.fileId ? 
      `https://drive.google.com/uc?export=download&id=${selectedVersion.fileId}` : 
      selectedVersion.url);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{selectedVersion.name}</h3>
        {selectedVersion.description && (
          <p className="text-gray-600 mb-4">{selectedVersion.description}</p>
        )}
        {audioUrl && (
          <div className="w-full p-4 bg-gray-50 rounded-md">
            <audio 
              controls 
              className="w-full" 
              src={audioUrl}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VersionPlayerCard;
