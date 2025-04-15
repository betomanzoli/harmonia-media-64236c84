
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PortfolioItem } from '@/hooks/usePortfolioItems';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface AddPortfolioItemFormProps {
  onAddItem: (item: Omit<PortfolioItem, 'id'>) => void;
}

const AddPortfolioItemForm: React.FC<AddPortfolioItemFormProps> = ({ onAddItem }) => {
  const [portfolioType, setPortfolioType] = useState<'example' | 'comparison' | 'stem'>('example');
  const [instrumentType, setInstrumentType] = useState('');
  const [comparisonDescription, setComparisonDescription] = useState('');
  const { toast } = useToast();

  const handleTypeChange = (value: string) => {
    setPortfolioType(value as 'example' | 'comparison' | 'stem');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const subtitle = (form.elements.namedItem('subtitle') as HTMLInputElement).value;
    const genre = (form.elements.namedItem('genre') as HTMLInputElement).value;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
    const audioSrc = (form.elements.namedItem('audioSrc') as HTMLInputElement).value;
    const category = genre; // Using genre as category
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value || `${title} - ${subtitle}`;
    
    // Validar campos específicos para cada tipo
    if (portfolioType === 'comparison' && !comparisonDescription) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha a descrição da comparação.",
        variant: "destructive"
      });
      return;
    }
    
    if (portfolioType === 'stem' && !instrumentType) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione o instrumento para o stem.",
        variant: "destructive"
      });
      return;
    }
    
    // Criar objeto com dados do item
    const newItem = {
      title,
      subtitle,
      genre,
      type,
      audioSrc,
      category,
      description,
      imageUrl: '/images/portfolio/portfolio-default.jpg', // Default image
      clientName: 'harmonIA Music',
      date: new Date().toISOString().split('T')[0],
      audioUrl: audioSrc, // Same as audioSrc for compatibility
      portfolioType, // Novo campo para categorizar
      instrumentType: portfolioType === 'stem' ? instrumentType : undefined, // Apenas para stems
      comparisonDescription: portfolioType === 'comparison' ? comparisonDescription : undefined, // Apenas para comparações
      // Persistência - salvar no localStorage
      persistData: true
    };
    
    // Adicionar item e salvar no localStorage para persistência
    onAddItem(newItem);
    
    // Salvar dados no localStorage para manter após atualização
    const existingItems = JSON.parse(localStorage.getItem('portfolio-items') || '[]');
    localStorage.setItem('portfolio-items', JSON.stringify([...existingItems, newItem]));
    
    toast({
      title: "Item adicionado com sucesso",
      description: `O item "${title}" foi adicionado ao portfólio na categoria "${portfolioType}".`,
    });
    
    // Resetar formulário
    form.reset();
    if (portfolioType === 'comparison') setComparisonDescription('');
    if (portfolioType === 'stem') setInstrumentType('');
  };

  return (
    <div className="border rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4">Adicionar Novo Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">Categoria do item</label>
            <Select defaultValue="example" onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione onde este item deve aparecer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="example">Exemplos</SelectItem>
                <SelectItem value="comparison">Comparações</SelectItem>
                <SelectItem value="stem">Stems</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Escolha onde este item aparecerá no portfólio</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          {portfolioType === 'stem' && (
            <div className="md:col-span-2">
              <label htmlFor="instrumentType" className="block text-sm font-medium mb-1">Instrumento/Faixa</label>
              <select
                id="instrumentType"
                value={instrumentType}
                onChange={(e) => setInstrumentType(e.target.value)}
                required
                className="w-full p-2 border border-input rounded"
              >
                <option value="">Selecione o instrumento</option>
                <option value="vocal">Voz/Vocal</option>
                <option value="guitarra">Guitarra</option>
                <option value="baixo">Baixo</option>
                <option value="bateria">Bateria</option>
                <option value="teclado">Teclado/Piano</option>
                <option value="cordas">Cordas</option>
                <option value="sopro">Sopro</option>
                <option value="percussao">Percussão</option>
                <option value="completo">Música Completa</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          )}
          
          {portfolioType === 'comparison' && (
            <div className="md:col-span-2">
              <label htmlFor="comparisonDescription" className="block text-sm font-medium mb-1">Explicação da Comparação</label>
              <input
                id="comparisonDescription"
                value={comparisonDescription}
                onChange={(e) => setComparisonDescription(e.target.value)}
                required
                className="w-full p-2 border border-input rounded"
                placeholder="Ex: Diferença entre versões masterizadas e não masterizadas"
              />
            </div>
          )}
          
          <div className="md:col-span-2">
            <label htmlFor="audioSrc" className="block text-sm font-medium mb-1">URL do Áudio</label>
            <input
              id="audioSrc"
              name="audioSrc"
              required
              className="w-full p-2 border border-input rounded"
              placeholder="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Para Google Drive, use a ID do arquivo neste formato: https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição (opcional)</label>
            <textarea
              id="description"
              name="description"
              className="w-full p-2 border border-input rounded"
              placeholder="Descrição detalhada do item"
              rows={3}
            />
          </div>
          
          <div className="md:col-span-2">
            <Button type="submit" className="bg-harmonia-green hover:bg-harmonia-green/90">
              Adicionar ao Portfólio
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPortfolioItemForm;
