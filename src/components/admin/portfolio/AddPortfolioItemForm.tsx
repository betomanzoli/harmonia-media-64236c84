
import React from 'react';
import { Button } from "@/components/ui/button";
import { PortfolioItem } from '@/hooks/usePortfolioItems';

interface AddPortfolioItemFormProps {
  onAddItem: (item: Omit<PortfolioItem, 'id'>) => void;
}

const AddPortfolioItemForm: React.FC<AddPortfolioItemFormProps> = ({ onAddItem }) => {
  return (
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
          
          onAddItem({
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
  );
};

export default AddPortfolioItemForm;
