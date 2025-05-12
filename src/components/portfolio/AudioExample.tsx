
import React from 'react';
import LimitedAudioPlayer from '@/components/LimitedAudioPlayer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioExampleProps {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre?: string;
  type?: string;
  onDelete?: (title: string) => void;
  isAdmin?: boolean;
}

const AudioExample: React.FC<AudioExampleProps> = ({ 
  title, 
  subtitle, 
  audioSrc,
  genre,
  type,
  onDelete,
  isAdmin = false
}) => {
  const { toast } = useToast();
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(title);
      toast({
        title: "Música removida",
        description: `A música "${title}" foi removida do portfólio.`
      });
    }
  };

  const handleContactClick = () => {
    // Open WhatsApp or redirect to contact page
    window.open('https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20música%20' + encodeURIComponent(title), '_blank');
  };
  
  return (
    <Card className="p-4">
      <div className="mb-3 flex justify-between">
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-gray-500">
            {subtitle}
            {genre && <span className="ml-1">| {genre}</span>}
            {type && <span className="ml-1">| {type}</span>}
          </p>
        </div>
        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <LimitedAudioPlayer 
        title={title} 
        subtitle={genre ? `${subtitle} | ${genre}` : subtitle} 
        audioSrc={audioSrc}
        previewDuration={30}
      />
      {!isAdmin && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Esta é uma prévia de 30 segundos. Deseja ouvir a música completa?
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={handleContactClick}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Entrar em contato
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AudioExample;
