
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileAudio, FileMusic, Music, CheckCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeliveryFile {
  id: string;
  name: string;
  format: string;
  size: string;
  url: string;
}

interface DeliveryProps {
  projectId: string;
  projectTitle: string;
  completionDate: string;
  files: DeliveryFile[];
}

const FinalDeliverySystem: React.FC<DeliveryProps> = ({
  projectId,
  projectTitle,
  completionDate,
  files
}) => {
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleDownload = (file: DeliveryFile) => {
    setDownloading(prev => ({ ...prev, [file.id]: true }));

    // Simulate download process
    setTimeout(() => {
      try {
        // In a real app, this would be a real download
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.click();

        setDownloading(prev => ({ ...prev, [file.id]: false }));
        
        toast({
          title: "Download iniciado",
          description: `${file.name} será salvo no seu dispositivo.`
        });
      } catch (error) {
        console.error('Download error:', error);
        setDownloading(prev => ({ ...prev, [file.id]: false }));
        
        toast({
          title: "Erro ao baixar arquivo",
          description: "Não foi possível baixar o arquivo. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    }, 800);
  };

  const handleDownloadAll = () => {
    const allIds = files.map(file => file.id);
    const newDownloading = allIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    setDownloading(newDownloading);

    // Simulate sequential downloads
    files.forEach((file, index) => {
      setTimeout(() => {
        try {
          const link = document.createElement('a');
          link.href = file.url;
          link.download = file.name;
          link.click();
          
          setDownloading(prev => ({ ...prev, [file.id]: false }));
        } catch (error) {
          console.error(`Error downloading ${file.name}:`, error);
          setDownloading(prev => ({ ...prev, [file.id]: false }));
        }
      }, 800 * (index + 1));
    });

    toast({
      title: "Downloads iniciados",
      description: `Todos os ${files.length} arquivos serão baixados em sequência.`
    });
  };

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'wav':
      case 'aiff':
        return <FileAudio className="h-5 w-5 text-blue-500" />;
      case 'mp3':
      case 'ogg':
        return <Music className="h-5 w-5 text-purple-500" />;
      case 'zip':
        return <FileMusic className="h-5 w-5 text-amber-500" />;
      default:
        return <FileAudio className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Entrega Final</CardTitle>
          <CardDescription className="flex items-center text-sm">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
            Projeto finalizado e aprovado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">{projectTitle}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Concluído em {new Date(completionDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                className="bg-harmonia-green hover:bg-harmonia-green/90"
                onClick={handleDownloadAll}
                disabled={Object.values(downloading).some(v => v)}
              >
                <Download className="h-4 w-4 mr-1" />
                Baixar tudo
              </Button>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium text-gray-700">Arquivos disponíveis</h3>
              <p className="text-sm text-gray-500">
                Todos os arquivos da sua música finalizada estão disponíveis para download.
              </p>
            </div>

            <div className="border rounded-md divide-y">
              {files.map(file => (
                <div key={file.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.format)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.format.toUpperCase()} • {file.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    disabled={downloading[file.id]}
                  >
                    {downloading[file.id] ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-harmonia-green animate-spin mr-1"></div>
                        Baixando...
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Baixar
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col items-start">
          <p className="text-sm text-gray-500 mb-2">
            Caso precise de algum ajuste ou tenha dúvidas, entre em contato com nossa equipe.
          </p>
          <Button variant="outline" size="sm" onClick={() => window.harmonIAChatbot?.toggleChat()}>
            Falar com a equipe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FinalDeliverySystem;
