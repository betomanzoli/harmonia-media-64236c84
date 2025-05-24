
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Upload } from 'lucide-react';

interface AddPortfolioItemFormProps {
  initialData?: any;
  onAdd: (item: any) => void | string;
  onCancel: () => void;
  isEditing?: boolean;
}

const AddPortfolioItemForm: React.FC<AddPortfolioItemFormProps> = ({
  initialData,
  onAdd,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || 'music',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    audioUrl: initialData?.audioUrl || '',
    videoUrl: initialData?.videoUrl || '',
    featured: initialData?.featured || false,
    published: initialData?.published || true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field
    if (errors[name]) {
      const { [name]: _, ...rest } = errors;
      setErrors(rest);
    }
  };
  
  const handleToggle = (name: string) => (value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'A URL da imagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onAdd({
        ...formData,
        id: initialData?.id || `item-${Date.now()}`,
        createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Título</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Digite o título do item"
        />
        {errors.title && (
          <p className="text-red-400 text-sm flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> {errors.title}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category" className="text-white">Categoria</Label>
        <Select 
          value={formData.category} 
          onValueChange={handleSelectChange('category')}
        >
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="music">Música</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
            <SelectItem value="event">Evento</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Descreva o item do portfólio"
          rows={4}
        />
        {errors.description && (
          <p className="text-red-400 text-sm flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> {errors.description}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-white">URL da Imagem</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="https://exemplo.com/imagem.jpg"
        />
        {errors.imageUrl && (
          <p className="text-red-400 text-sm flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" /> {errors.imageUrl}
          </p>
        )}
      </div>
      
      {formData.category === 'music' && (
        <div className="space-y-2">
          <Label htmlFor="audioUrl" className="text-white">URL do Áudio</Label>
          <Input
            id="audioUrl"
            name="audioUrl"
            value={formData.audioUrl}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="https://exemplo.com/audio.mp3"
          />
        </div>
      )}
      
      {formData.category === 'video' && (
        <div className="space-y-2">
          <Label htmlFor="videoUrl" className="text-white">URL do Vídeo</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="https://youtube.com/watch?v=exemplo"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="featured"
            checked={formData.featured}
            onCheckedChange={handleToggle('featured')}
          />
          <Label htmlFor="featured" className="text-white">Destaque</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="published"
            checked={formData.published}
            onCheckedChange={handleToggle('published')}
          />
          <Label htmlFor="published" className="text-white">Publicado</Label>
        </div>
      </div>
      
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Upload className="h-4 w-4 mr-2" />
          {isEditing ? 'Atualizar Item' : 'Adicionar Item'}
        </Button>
      </div>
    </form>
  );
};

export default AddPortfolioItemForm;
