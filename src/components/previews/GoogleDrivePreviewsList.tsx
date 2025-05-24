
import React from 'react';

interface GoogleDrivePreviewsListProps {
  projectId: string | undefined;
}

const GoogleDrivePreviewsList: React.FC<GoogleDrivePreviewsListProps> = ({ projectId }) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-xl font-semibold mb-4">Prévia via Google Drive</h3>
      <p className="text-gray-600 mb-4">
        As prévias para este projeto estão disponíveis no Google Drive. Clique no botão abaixo para acessar.
      </p>
      <a 
        href={`https://drive.google.com/drive/folders/${projectId || 'example'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-4 py-2 bg-harmonia-green hover:bg-harmonia-green/90 text-white rounded-md"
      >
        Acessar no Google Drive
      </a>
    </div>
  );
};

export default GoogleDrivePreviewsList;
