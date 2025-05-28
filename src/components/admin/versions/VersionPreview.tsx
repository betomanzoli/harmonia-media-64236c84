
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface VersionPreviewProps {
  versions: ProjectVersion[];
}

const VersionPreview: React.FC<VersionPreviewProps> = ({ versions }) => {
  if (versions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévia do Player</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.filter(v => v.isRecommended).map((version) => (
            <div key={version.id}>
              <h3 className="font-medium mb-2">{version.name}</h3>
              <div className="bg-gray-50 p-2 rounded mb-2">
                <div className="text-xs text-gray-600">
                  <div>URL do Embed: {version.embedUrl}</div>
                  {version.albumId && version.trackId && (
                    <div>Album ID: {version.albumId} | Track ID: {version.trackId}</div>
                  )}
                </div>
              </div>
              <iframe
                src={version.embedUrl}
                style={{ border: 0, width: '100%', height: '42px' }}
                title={`Player ${version.name}`}
                onError={(e) => {
                  console.error('Iframe error for version:', version.id, e);
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionPreview;
