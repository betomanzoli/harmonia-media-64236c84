
import React from 'react';

interface PreviewVersion {
  id: string;
  title: string;
  url: string;
  date: string;
}

interface PreviewPlayerListProps {
  versions: PreviewVersion[];
  selectedVersion: string | null;
  setSelectedVersion: (id: string) => void;
  isApproved: boolean;
}

const PreviewPlayerList: React.FC<PreviewPlayerListProps> = ({
  versions,
  selectedVersion,
  setSelectedVersion,
  isApproved
}) => {
  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma versão disponível no momento.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Versões disponíveis</h3>
      
      {versions.map((version) => (
        <div
          key={version.id}
          className={`border p-4 rounded-md cursor-pointer transition-colors ${
            selectedVersion === version.id
              ? 'border-harmonia-green bg-green-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setSelectedVersion(version.id)}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">{version.title}</h4>
            <span className="text-sm text-gray-500">{version.date}</span>
          </div>
          
          <div className="bg-gray-100 p-2 rounded">
            <audio
              controls
              className="w-full"
              src={version.url}
            >
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
          
          {selectedVersion === version.id && isApproved && (
            <div className="mt-3 bg-green-100 text-green-800 p-2 rounded text-center text-sm">
              ✓ Esta versão foi aprovada
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreviewPlayerList;
