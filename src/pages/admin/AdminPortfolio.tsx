
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

interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  type: string;
  audioSrc: string;
  created_at?: string;
}

const AdminPortfolio: React.FC = () => {
  const { toast } = useToast();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    localStorage.getItem('portfolioWebhookUrl') || ''
  );

  useEffect(() => {
    // In a real implementation, this would fetch from a database
    // For now, we'll use mock data stored in localStorage
    const savedData = localStorage.getItem('portfolioItems');
    if (savedData) {
      setPortfolioItems(JSON.parse(savedData));
    } else {
      // Initialize with sample data if nothing exists
      const sampleData: PortfolioItem[] = [
        {
          id: "001",
          title: "Aniversário de 50 Anos",
          subtitle: "Homenagem para pai",
          genre: "MPB",
          type: "vocal",
          audioSrc: "https://example.com/audio/aniversario-50.mp3",
        },
        {
          id: "002",
          title: "Casamento Maria e João",
          subtitle: "Primeira dança",
          genre: "Pop",
          type: "instrumental",
          audioSrc: "https://example.com/audio/casamento-maria-joao.mp3",
        }
      ];
      setPortfolioItems(sampleData);
      localStorage.setItem('portfolioItems', JSON.stringify(sampleData));
    }
    setIsLoading(false);
  }, []);

  const saveWebhookUrl = () => {
    localStorage.setItem('portfolioWebhookUrl', webhookUrl);
    toast({
      title: "Webhook URL salva",
      description: "A URL do webhook do Zapier foi salva com sucesso.",
    });
  };

  const handleAddItem = (newItem: Omit<PortfolioItem, 'id'>) => {
    const newId = (portfolioItems.length + 1).toString().padStart(3, '0');
    const itemWithId = {
      ...newItem,
      id: newId,
      created_at: new Date().toISOString()
    };
    
    const updatedItems = [...portfolioItems, itemWithId];
    setPortfolioItems(updatedItems);
    localStorage.setItem('portfolioItems', JSON.stringify(updatedItems));
    
    toast({
      title: "Item adicionado",
      description: `O item "${newItem.title}" foi adicionado com sucesso.`,
    });
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
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Portfólio</h1>
          <p className="text-muted-foreground">
            Área administrativa para gerenciar exemplos de áudio do portfólio
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link to="/admin-j28s7d1k/audio-database">
            <Button variant="outline" className="flex items-center gap-1">
              <FileAudio className="w-4 h-4 mr-1" />
              Banco de Áudio
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
                <DialogTitle>Como usar o gerenciamento de portfólio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p>Esta página permite gerenciar os exemplos de áudio que aparecem no portfólio público do site. Você pode:</p>
                
                <h3 className="font-semibold">Adicionar novos exemplos</h3>
                <p>Use o formulário na parte inferior para adicionar novos exemplos ao portfólio.</p>
                
                <h3 className="font-semibold">Gerenciar exemplos existentes</h3>
                <p>Visualize, edite ou remova exemplos existentes na tabela principal.</p>
                
                <h3 className="font-semibold">Integração com automações</h3>
                <p>Configure webhooks para integrar com Zapier/Make para automatizar o processo de adição de novos exemplos.</p>
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
                Configure um webhook no Zapier/Make para integração com atualizações de portfólio
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exportar Dados</h2>
          <div className="p-4 border rounded bg-muted">
            <h3 className="font-medium mb-2">JSON (exportação)</h3>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => copyToClipboard(JSON.stringify(portfolioItems, null, 2))}
            >
              Copiar JSON Completo
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Itens do Portfólio</h2>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de exemplos do portfólio</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Subtítulo</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Prévia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : portfolioItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Nenhum item encontrado</TableCell>
                </TableRow>
              ) : (
                portfolioItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.subtitle}</TableCell>
                    <TableCell>{item.genre}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="text-right">
                      <a 
                        href={item.audioSrc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-harmonia-green hover:underline"
                      >
                        <Music className="w-4 h-4" />
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
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Item</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const title = (form.elements.namedItem('title') as HTMLInputElement).value;
            const subtitle = (form.elements.namedItem('subtitle') as HTMLInputElement).value;
            const genre = (form.elements.namedItem('genre') as HTMLInputElement).value;
            const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
            const audioSrc = (form.elements.namedItem('audioSrc') as HTMLInputElement).value;
            
            handleAddItem({
              title,
              subtitle,
              genre,
              type,
              audioSrc
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
              placeholder="Ex: Aniversário de 50 Anos"
            />
          </div>
          
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium mb-1">Subtítulo</label>
            <input
              id="subtitle"
              name="subtitle"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="Ex: Homenagem para pai"
            />
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium mb-1">Gênero Musical</label>
            <input
              id="genre"
              name="genre"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="Ex: MPB, Pop, Rock"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">Tipo</label>
            <select
              id="type"
              name="type"
              required
              className="w-full p-2 border border-input rounded"
            >
              <option value="vocal">Vocal</option>
              <option value="instrumental">Instrumental</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="audioSrc" className="block text-sm font-medium mb-1">URL do Áudio</label>
            <input
              id="audioSrc"
              name="audioSrc"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="https://exemplo.com/audio.mp3"
            />
          </div>
          
          <div className="md:col-span-2">
            <Button type="submit" className="bg-harmonia-green hover:bg-harmonia-green/90">
              Adicionar ao Portfólio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPortfolio;
