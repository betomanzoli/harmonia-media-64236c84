
import React from 'react';
import AudioPlayer from '../AudioPlayer';
import { FileAudio, Volume2 } from 'lucide-react';

interface AudioExampleProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre: string;
  type: string;
}

const AudioExample: React.FC<AudioExampleProps> = ({ 
  title, 
  subtitle, 
  audioSrc, 
  genre, 
  type 
}) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card hover:border-harmonia-green/40 transition-colors">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">{subtitle}</p>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">
            {genre}
          </span>
        </div>
      </div>
      <AudioPlayer 
        title={title} 
        subtitle={subtitle} 
        audioSrc={audioSrc} 
      />
      <div className="p-4 border-t border-border flex justify-between">
        <span className="text-xs text-gray-400">Ver detalhes do projeto</span>
        <div className="flex items-center gap-2">
          {type === "instrumental" ? (
            <Volume2 className="w-4 h-4 text-harmonia-green" />
          ) : (
            <FileAudio className="w-4 h-4 text-harmonia-green" />
          )}
          <span className="text-xs text-gray-400">
            {type === "instrumental" ? "Instrumental" : "Disponível em alta qualidade"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioExample;
