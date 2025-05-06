
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';

const PreviewDebugPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [actualProjectId, setActualProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      const isEncodedLink = isValidEncodedPreviewLink(projectId);
      let decodedId: string | null = null;

      if (isEncodedLink) {
        decodedId = getProjectIdFromPreviewLink(projectId);
      } else {
        decodedId = projectId;
      }

      setActualProjectId(decodedId);

      toast({
        title: "Debug mode",
        description: `Modo de depuração ativado para projeto: ${decodedId || projectId}`,
        variant: "default"
      });
    }
  }, [projectId, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Modo de Depuração da Prévia</h2>
        <p className="text-gray-700">
          ID do Projeto (Codificado): {projectId}
        </p>
        <p className="text-gray-700">
          ID do Projeto (Decodificado): {actualProjectId || "N/A"}
        </p>
        <p className="text-gray-700">
          Este é um ambiente de depuração para auxiliar no desenvolvimento.
        </p>
      </div>
    </div>
  );
};

export default PreviewDebugPage;
