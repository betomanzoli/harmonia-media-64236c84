
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { generatePreviewLink } from '@/utils/previewLinkUtils';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { v4 as uuidv4 } from 'uuid';

export interface AddVersionFormProps {
  projectId: string; // Added this required prop
  onSubmit: (version: VersionItem) => void;
  projectStatus?: 'waiting' | 'feedback' | 'approved';
  onClose?: () => void;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ 
  projectId,
  onSubmit, 
  projectStatus = 'waiting',
  onClose 
}) => {
  const [name, setName] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isRecommended, setIsRecommended] = useState(true);
  const [isFinal, setIsFinal] = useState(projectStatus === 'approved');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVersion: VersionItem = {
      id: uuidv4(),
      name: name || 'Nova Versão',
      description: description || 'Sem descrição adicional',
      audioUrl: audioUrl,
      file_url: audioUrl, // For compatibility with both naming conventions
      recommended: isRecommended,
      final: isFinal,
      createdAt: new Date().toISOString()
    };
    
    console.log(`[AddVersionForm] Adding new version:`, newVersion);
    
    onSubmit(newVersion);
    onClose?.();
  };

  // Help function to convert Google Drive view URLs to embed URLs
  const handleDriveUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    
    // Check if it's a Google Drive URL that needs converting
    if (url.includes('drive.google.com/file/d/')) {
      // Extract the file ID
      const matches = url.match(/\/d\/([^\/]+)/);
      if (matches && matches[1]) {
        const fileId = matches[1];
        url = `https://drive.google.com/file/d/${fileId}/preview`;
        console.log(`[AddVersionForm] Converted Drive URL to embed URL: ${url}`);
      }
    }
    
    setAudioUrl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Versão</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Versão Acústica"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="audioUrl">URL do Áudio</Label>
        <Input
          id="audioUrl"
          value={audioUrl}
          onChange={handleDriveUrlChange}
          placeholder="https://drive.google.com/file/d/..."
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Cole o link do Google Drive, YouTube, SoundCloud ou qualquer serviço de áudio
        </p>
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva detalhes sobre esta versão..."
          rows={4}
        />
      </div>
      
      <div className="flex space-x-4">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="recommended" 
            checked={isRecommended} 
            onChange={(e) => setIsRecommended(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
          />
          <Label htmlFor="recommended" className="ml-2 text-sm">Recomendada</Label>
        </div>
        
        {projectStatus === 'approved' && (
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="final" 
              checked={isFinal} 
              onChange={(e) => setIsFinal(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            <Label htmlFor="final" className="ml-2 text-sm">Versão Final</Label>
          </div>
        )}
      </div>
      
      <div className="pt-2 flex justify-end space-x-3">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          <CheckCircle className="mr-2 h-4 w-4" />
          {projectStatus === 'approved' ? 'Adicionar Versão Final' : 'Adicionar Versão'}
        </Button>
      </div>
    </form>
  );
};

export default AddVersionForm;
