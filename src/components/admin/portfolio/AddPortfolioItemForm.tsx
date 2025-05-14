
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface PortfolioItem {
  title: string;
  description: string;
  audioUrl: string;
  fileId?: string;
  type: 'example' | 'comparison' | 'stem';
  featured?: boolean;
}

export interface AddPortfolioItemFormProps {
  onAdd: (item: PortfolioItem) => string | null;
  onCancel: () => void;
}

const AddPortfolioItemForm: React.FC<AddPortfolioItemFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [type, setType] = useState<'example' | 'comparison' | 'stem'>('example');
  const [featured, setFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!title.trim() || !description.trim() || !audioUrl.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Extract Google Drive file ID if possible
      const fileIdMatch = audioUrl.match(/[-\w]{25,}/);
      const fileId = fileIdMatch ? fileIdMatch[0] : '';
      
      const newItem: PortfolioItem = {
        title: title.trim(),
        description: description.trim(),
        audioUrl: audioUrl.trim(),
        fileId,
        type,
        featured
      };
      
      onAdd(newItem);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro ao adicionar item",
        description: "Ocorreu um erro ao adicionar o item ao portfólio. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Música para Casamento"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição detalhada do item"
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="audioUrl">URL do Google Drive</Label>
        <Input
          id="audioUrl"
          value={audioUrl}
          onChange={(e) => setAudioUrl(e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Item</Label>
        <Select
          value={type}
          onValueChange={(value: 'example' | 'comparison' | 'stem') => setType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="example">Exemplo</SelectItem>
            <SelectItem value="comparison">Comparação (AI vs Final)</SelectItem>
            <SelectItem value="stem">Stem (Instrumental/Vocal)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="featured"
          checked={featured}
          onCheckedChange={setFeatured}
        />
        <Label htmlFor="featured">Exibir em destaque no portfólio</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Item'}
        </Button>
      </div>
    </form>
  );
};

export default AddPortfolioItemForm;
