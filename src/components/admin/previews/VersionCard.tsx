import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Version } from '@/hooks/admin/useVersions'; // ✅ CORRIGIDO
import { Button } from "@/components/ui/button";
import { Play, Pause, Trash2, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface VersionCardProps {
  version: Version; // ✅ CORRIGIDO
  projectId: string;
  onDeleteVersion: (versionId: string) => void;
}

const VersionCard: React.FC<VersionCardProps> = ({
  version,
  projectId,
  onDeleteVersion
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(version.bandcamp_url || '')); // ✅ CORRIGIDO
  const { toast } = useToast();

  const handleTogglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      // Se temos uma URL do Bandcamp, abrir em nova aba
      if (version.bandcamp_url) { // ✅ CORRIGIDO
        window.open(version.bandcamp_url, '_blank'); // ✅ CORRIGIDO
        toast({
          title: "Abrindo áudio",
          description: "O áudio está sendo aberto em uma nova aba."
        });
        return;
      }
      
      // Caso contrário, tentar reproduzir diretamente
      audio.play().catch(error => {
        console.error('Erro ao reproduzir áudio:', error);
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir o áudio. Tente abrir no navegador.",
          variant: "destructive"
        });
        
        if (version.bandcamp_url) { // ✅ CORRIGIDO
          window.open(version.bandcamp_url, '_blank'); // ✅ CORRIGIDO
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  React.useEffect(() => {
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.pause();
    };
  }, [audio]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência."
      });
    }).catch(err => {
      console.error('Erro ao copiar link:', err);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive"
      });
    });
  };

  return (
    <Card className={`bg-white ${version.recommended ? 'border-green-500 border-2' : ''}`}> {/* ✅ CORRIGIDO */}
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-700">{version.name}</h3>
              <div className="flex gap-1">
                {version.recommended && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Recomendada
                  </Badge>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              {version.description || "Sem descrição"}
            </p>
            
            <div className="text-xs text-gray-500 mb-4">
              Adicionado em: {new Date(version.created_at).toLocaleDateString('pt-BR')} {/* ✅ CORRIGIDO */}
            </div>
            
            {/* URL do áudio */}
            {version.bandcamp_url && ( // ✅ CORRIGIDO
              <div className="mt-2">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                  <span className="font-medium">Áudio</span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => handleCopyLink(version.bandcamp_url!)} // ✅ CORRIGIDO
                      title="Copiar link"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => window.open(version.bandcamp_url, '_blank')} // ✅ CORRIGIDO
                      title="Abrir link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 sm:ml-4">
            <Button 
              variant="outline" 
              size="sm" 
              className={`${isPlaying ? 'bg-gray-100' : ''}`} 
              onClick={handleTogglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pausar' : 'Ouvir'}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover versão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover esta versão? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteVersion(version.id)} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionCard;
