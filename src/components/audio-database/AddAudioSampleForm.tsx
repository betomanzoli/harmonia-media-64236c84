
import React from 'react';
import { Button } from "@/components/ui/button";
import { AudioSample } from '@/types/audio';

interface AddAudioSampleFormProps {
  onAddSample: (sample: Omit<AudioSample, 'id' | 'created_at'>) => void;
}

const AddAudioSampleForm: React.FC<AddAudioSampleFormProps> = ({ onAddSample }) => {
  return (
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
          
          onAddSample({
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
  );
};

export default AddAudioSampleForm;
