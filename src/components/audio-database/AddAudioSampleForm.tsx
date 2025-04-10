
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioSample } from '@/types/audio';
import { PlusCircle } from 'lucide-react';

interface AddAudioSampleFormProps {
  onAddSample: (sample: Omit<AudioSample, "id" | "created_at">) => void;
}

const AddAudioSampleForm: React.FC<AddAudioSampleFormProps> = ({ onAddSample }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('harmonIA');
  const [previewDuration, setPreviewDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSample({
      title,
      genre,
      url,
      duration,
      description,
      artist,
      audio_url: url,
      preview_duration: previewDuration
    });

    // Reset form
    setTitle('');
    setGenre('');
    setUrl('');
    setDuration('');
    setDescription('');
    setPreviewDuration('');
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Adicionar Nova Amostra de Áudio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Piano Emocional"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Gênero</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: Pop, Clássico, Eletrônica"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL do Áudio</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 3:45"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artist">Artista</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                defaultValue="harmonIA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previewDuration">Duração da Prévia (opcional)</Label>
              <Input
                id="previewDuration"
                value={previewDuration}
                onChange={(e) => setPreviewDuration(e.target.value)}
                placeholder="Ex: 0:30"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o áudio e suas características"
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Amostra
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAudioSampleForm;
