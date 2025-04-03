import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileAudio, Info, Music, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AudioSample {
  id: string;
  title: string;
  style: string;
  mood: string;
  occasion: string;
  audio_url: string;
  preview_duration: string;
  created_at?: string;
}

const AudioDatabase: React.FC = () => {
  const { toast } = useToast();
  const [audioSamples, setAudioSamples] = useState<AudioSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    localStorage.getItem('zapierWebhookUrl') || ''
  );

  useEffect(() => {
    // In a real implementation, this would fetch from a database
    // For now, we'll use mock data stored in localStorage
    const savedData = localStorage.getItem('audioSamples');
    if (savedData) {
      setAudioSamples(JSON.parse(savedData));
    } else {
      // Initialize with sample data if nothing exists
      const sampleData: AudioSample[] = [
        {
          id: "001",
          title: "Música Romântica",
          style: "MPB",
          mood: "Romântico",
          occasion: "Casamento",
          audio_url: "https://example.com/audio/musica-romantica.mp3",
          preview_duration: "15s"
        },
        {
          id: "002",
          title: "Celebração Familiar",
          style: "Pop",
          mood: "Alegria",
          occasion: "Aniversário",
          audio_url: "https://example.com/audio/celebracao-familiar.mp3",
          preview_duration: "15s"
        }
      ];
      setAudioSamples(sampleData);
      localStorage.setItem('audioSamples', JSON.stringify(sampleData));
    }
    setIsLoading(false);
  }, []);

  const saveWebhookUrl = () => {
    localStorage.setItem('zapierWebhookUrl', webhookUrl);
    toast({
      title: "Webhook URL salva",
      description: "A URL do webhook do Zapier foi salva com sucesso.",
    });
  };

  const handleAddSample = (newSample: Omit<AudioSample, 'id'>) => {
    const newId = (audioSamples.length + 1).toString().padStart(3, '0');
    const sampleWithId = {
      ...newSample,
      id: newId,
      created_at: new Date().toISOString()
    };
    
    const updatedSamples = [...audioSamples, sampleWithId];
    setAudioSamples(updatedSamples);
    localStorage.setItem('audioSamples', JSON.stringify(updatedSamples));
    
    toast({
      title: "Amostra adicionada",
      description: `A amostra "${newSample.title}" foi adicionada com sucesso.`,
    });
  };

  const getApiUrl = () => {
    return `${window.location.origin}/api/audio-samples`;
  };

  const getJsonData = () => {
    return JSON.stringify(audioSamples, null, 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Os dados foram copiados para a área de transferência.",
    });
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Banco de Dados de Áudio</h1>
          <p className="text-muted-foreground">
            Gerencie e obtenha links para exemplos de áudio para integração com chatbots
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link to="/admin-j28s7d1k/portfolio">
            <Button variant="outline" className="flex items-center gap-1">
              <Music className="w-4 h-4 mr-1" />
              Portfólio
            </Button>
          </Link>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Info className="w-4 h-4 mr-2" />
                Como usar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Como usar esta página</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p>Esta página funciona como um banco de dados simples para suas amostras de áudio. Aqui estão algumas formas de usá-la:</p>
                
                <h3 className="font-semibold">Integração com Chatbots</h3>
                <p>Use o URL da API para buscar exemplos de áudio com base em parâmetros:</p>
                <code className="block bg-muted p-2 rounded">
                  {getApiUrl()}?style=MPB&mood=Romântico
                </code>
                
                <h3 className="font-semibold">Armazenamento de Arquivos</h3>
                <p>Para MVP, armazene os arquivos de áudio no GitHub ou em serviços como:</p>
                <ul className="list-disc pl-6">
                  <li>Google Drive (gere links compartilháveis)</li>
                  <li>Firebase Storage</li>
                  <li>AWS S3</li>
                </ul>
                
                <h3 className="font-semibold">Fluxo com Zapier/Make</h3>
                <p>Exemplo de fluxo para integração:</p>
                <ol className="list-decimal pl-6">
                  <li>Usuário envia briefing</li>
                  <li>Zapier/Make processa o estilo/ocasião</li>
                  <li>Busca exemplo relevante neste banco de dados</li>
                  <li>Envia resposta com link do áudio</li>
                </ol>
              </div>
            </DialogContent>
          </Dialog>
          
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Página Inicial
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Configuração de Integração</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="webhook" className="block text-sm font-medium mb-2">
                URL do Webhook (Zapier/Make)
              </label>
              <div className="flex gap-2">
                <input
                  id="webhook"
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="flex-1 p-2 border border-input rounded"
                />
                <Button onClick={saveWebhookUrl}>Salvar</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Configure um webhook no Zapier/Make para integração com chatbots
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">API & Dados</h2>
          <div className="p-4 border rounded bg-muted">
            <h3 className="font-medium mb-2">URL da API (simulada)</h3>
            <div className="flex items-center gap-2">
              <code className="text-xs flex-1 bg-background p-2 rounded">{getApiUrl()}</code>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => copyToClipboard(getApiUrl())}
              >
                Copiar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Adicione parâmetros como: ?style=MPB&mood=Romântico
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">JSON (exportação)</h3>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => copyToClipboard(getJsonData())}
            >
              Copiar JSON Completo
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Amostras de Áudio</h2>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de exemplos de áudio para integrações</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estilo</TableHead>
                <TableHead>Emoção</TableHead>
                <TableHead>Ocasião</TableHead>
                <TableHead className="text-right">Prévia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : audioSamples.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Nenhuma amostra de áudio encontrada</TableCell>
                </TableRow>
              ) : (
                audioSamples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>{sample.title}</TableCell>
                    <TableCell>{sample.style}</TableCell>
                    <TableCell>{sample.mood}</TableCell>
                    <TableCell>{sample.occasion}</TableCell>
                    <TableCell className="text-right">
                      <a 
                        href={sample.audio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-harmonia-green hover:underline"
                      >
                        <FileAudio className="w-4 h-4" />
                        Ouvir
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Nova Amostra</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const title = (form.elements.namedItem('title') as HTMLInputElement).value;
            const style = (form.elements.namedItem('style') as HTMLInputElement).value;
            const mood = (form.elements.namedItem('mood') as HTMLInputElement).value;
            const occasion = (form.elements.namedItem('occasion') as HTMLInputElement).value;
            const audio_url = (form.elements.namedItem('audio_url') as HTMLInputElement).value;
            const preview_duration = (form.elements.namedItem('preview_duration') as HTMLInputElement).value;
            
            handleAddSample({
              title,
              style,
              mood,
              occasion,
              audio_url,
              preview_duration
            });
            
            form.reset();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Título</label>
            <input
              id="title"
              name="title"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="Ex: Música Romântica"
            />
          </div>
          
          <div>
            <label htmlFor="audio_url" className="block text-sm font-medium mb-1">URL do Áudio</label>
            <input
              id="audio_url"
              name="audio_url"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="https://exemplo.com/audio.mp3"
            />
          </div>
          
          <div>
            <label htmlFor="style" className="block text-sm font-medium mb-1">Estilo Musical</label>
            <input
              id="style"
              name="style"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="Ex: MPB, Pop, Rock"
            />
          </div>
          
          <div>
            <label htmlFor="mood" className="block text-sm font-medium mb-1">Emoção</label>
            <input
              id="mood"
              name="mood"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="Ex: Romântico, Alegre, Melancólico"
            />
          </div>
          
          <div>
            <label htmlFor="occasion" className="block text-sm font-medium mb-1">Ocasião</label>
            <input
              id="occasion"
              name="occasion"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="Ex: Casamento, Aniversário, Homenagem"
            />
          </div>
          
          <div>
            <label htmlFor="preview_duration" className="block text-sm font-medium mb-1">Duração da Prévia</label>
            <input
              id="preview_duration"
              name="preview_duration"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="Ex: 15s, 30s"
              defaultValue="15s"
            />
          </div>
          
          <div className="md:col-span-2">
            <Button type="submit" className="bg-harmonia-green hover:bg-harmonia-green/90">
              Adicionar Amostra
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AudioDatabase;
