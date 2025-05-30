
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BandcampEmbedPlayer from './BandcampEmbedPlayer';
import { BandcampUtils } from '@/components/admin/bandcamp/BandcampUtils';

const BandcampTestPlayer: React.FC = () => {
  const workingExamples = BandcampUtils.getWorkingExamples();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Teste dos Bandcamp Embeds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Testando os embeds com os IDs corretos dos seus exemplos funcionais
          </p>
          
          <div className="space-y-4">
            {workingExamples.map((example, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium mb-2">
                  Exemplo {index + 1} - Track ID: {example.trackId}
                </h4>
                <BandcampEmbedPlayer 
                  embedUrl={example.embedUrl}
                  title={`Teste Track ${example.trackId}`}
                  fallbackUrl={example.directUrl}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Embed URL: {example.embedUrl}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BandcampTestPlayer;
