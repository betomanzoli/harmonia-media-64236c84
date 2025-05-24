
import { useToast } from '@/hooks/use-toast';
import { AudioSample } from '@/types/audio';

export function useAudioUtils() {
  const { toast } = useToast();

  // API URL generation function
  const getApiUrl = () => {
    return `https://api.harmonia.ai/audio-samples?key=demo123`;
  };

  // JSON data generation
  const getJsonData = (audioSamples: AudioSample[]) => {
    return JSON.stringify(audioSamples, null, 2);
  };

  // Copy to clipboard utility
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
    });
  };

  // Function to open storage folder
  const openFolder = (folderUrl: string) => {
    window.open(folderUrl, '_blank');
  };

  return {
    getApiUrl,
    getJsonData,
    copyToClipboard,
    openFolder
  };
}
