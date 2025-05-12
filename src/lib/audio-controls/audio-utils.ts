
import { toast } from "@/hooks/use-toast";

export const setupAudioElement = (audioRef: React.RefObject<HTMLAudioElement>) => {
  if (!audioRef.current) return;
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
};

export const handlePreviewEnd = () => {
  toast({
    title: "Prévia finalizada",
    description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
  });
};

export const handlePreviewLimit = () => {
  toast({
    title: "Prévia limitada",
    description: "Esta é apenas uma prévia de 30 segundos. Entre em contato para ouvir a versão completa."
  });
};
