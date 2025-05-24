
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPortfolioItemFormProps {
  onAdd: (item: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const AddPortfolioItemForm: React.FC<AddPortfolioItemFormProps> = ({ 
  onAdd, 
  onCancel, 
  initialData = null,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    genre: '',
    type: '',
    audioUrl: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        description: initialData.description || '',
        category: initialData.category || '',
        genre: initialData.genre || '',
        type: initialData.type || '',
        audioUrl: initialData.audioUrl || initialData.audioSrc || '',
        imageUrl: initialData.imageUrl || ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      id: initialData?.id,
      date: initialData?.date || new Date().toISOString().split('T')[0],
      audioSrc: formData.audioUrl // Ensure audioSrc is set for compatibility
    };
    
    onAdd(itemData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título da música"
            required
            className="bg-slate-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Subtítulo</label>
          <Input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtítulo ou finalidade"
            className="bg-slate-700"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição da música"
          className="bg-slate-700 min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger className="bg-slate-700">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Publicidade">Publicidade</SelectItem>
              <SelectItem value="Audiovisual">Audiovisual</SelectItem>
              <SelectItem value="Podcast">Podcast</SelectItem>
              <SelectItem value="Presente">Presente</SelectItem>
              <SelectItem value="Corporativo">Corporativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Gênero</label>
          <Input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Pop, Rock, MPB, etc."
            className="bg-slate-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger className="bg-slate-700">
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instrumental">Instrumental</SelectItem>
              <SelectItem value="vocal">Com Vocal</SelectItem>
              <SelectItem value="jingle">Jingle</SelectItem>
              <SelectItem value="vinheta">Vinheta</SelectItem>
              <SelectItem value="trilha">Trilha Sonora</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">URL do Áudio</label>
          <Input
            name="audioUrl"
            value={formData.audioUrl}
            onChange={handleChange}
            placeholder="https://example.com/audio.mp3"
            className="bg-slate-700"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">URL da Imagem (opcional)</label>
          <Input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="bg-slate-700"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          {isEditing ? 'Atualizar Item' : 'Adicionar Item'}
        </Button>
      </div>
    </form>
  );
};

export default AddPortfolioItemForm;
