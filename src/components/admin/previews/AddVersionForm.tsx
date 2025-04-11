
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2, Upload, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddVersionFormProps {
  projectId: string;
  onAddComplete: (versionName: string) => void;
}

// Expanded list of music categories
const MUSIC_CATEGORIES = [
  { value: 'completa', label: 'Versão Completa' },
  { value: 'acustica', label: 'Acústica' },
  { value: 'orquestrada', label: 'Orquestrada' },
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'eletronica', label: 'Eletrônica' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'classicarefrao', label: 'Clássica com Refrão' },
  { value: 'instrumental', label: 'Instrumental' },
  { value: 'vocal', label: 'Versão Vocal' },
  { value: 'remix', label: 'Remix' },
  { value: 'alternativa', label: 'Alternativa' },
  { value: 'ambiente', label: 'Música Ambiente' },
  { value: 'lofi', label: 'Lo-Fi' },
  { value: 'samba', label: 'Samba' },
  { value: 'bossanova', label: 'Bossa Nova' },
  { value: 'mpb', label: 'MPB' },
  { value: 'regional', label: 'Regional' },
  { value: 'cinematografica', label: 'Cinematográfica' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'jingle', label: 'Jingle' },
  { value: 'outros', label: 'Outros' }
];

interface VersionItem {
  title: string;
  description: string;
  category: string;
  audioFile: File | null;
  isRecommended: boolean;
}

const AddVersionForm: React.FC<AddVersionFormProps> = ({ projectId, onAddComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<VersionItem[]>([{
    title: '',
    description: '',
    category: '',
    audioFile: null,
    isRecommended: false
  }]);
  const { toast } = useToast();

  const handleAddVersion = () => {
    setVersions([...versions, {
      title: '',
      description: '',
      category: '',
      audioFile: null,
      isRecommended: false
    }]);
  };

  const handleRemoveVersion = (index: number) => {
    if (versions.length === 1) {
      toast({
        title: "Atenção",
        description: "É necessário pelo menos uma versão.",
        variant: "destructive"
      });
      return;
    }
    
    setVersions(versions.filter((_, i) => i !== index));
  };

  const handleTitleChange = (index: number, value: string) => {
    const newVersions = [...versions];
    newVersions[index].title = value;
    setVersions(newVersions);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newVersions = [...versions];
    newVersions[index].description = value;
    setVersions(newVersions);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newVersions = [...versions];
    newVersions[index].category = value;
    setVersions(newVersions);
  };

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newVersions = [...versions];
      newVersions[index].audioFile = event.target.files[0];
      setVersions(newVersions);
    }
  };

  const handleRecommendedChange = (index: number) => {
    const newVersions = versions.map((version, i) => ({
      ...version,
      isRecommended: i === index
    }));
    setVersions(newVersions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (versions.some(v => !v.title || !v.description || !v.category || !v.audioFile)) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos e adicione arquivos de áudio para cada versão.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would upload the files and create the versions
      // For now, we'll just simulate a successful upload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Determine the name to return (first version or recommended version)
      const recommendedVersion = versions.find(v => v.isRecommended) || versions[0];
      
      onAddComplete(recommendedVersion.title);
      
      toast({
        title: "Versões adicionadas",
        description: `${versions.length} versões foram adicionadas com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar versões:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar as versões. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-6 pr-4">
          {versions.map((version, index) => (
            <Card key={index} className="p-4 border-l-4 border-l-harmonia-green/60">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Versão {index + 1}</h4>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveVersion(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${index}`}>Título da Versão</Label>
                  <Input
                    id={`title-${index}`}
                    value={version.title}
                    onChange={e => handleTitleChange(index, e.target.value)}
                    placeholder="Ex: Versão Acústica"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`category-${index}`}>Categoria</Label>
                  <Select 
                    value={version.category} 
                    onValueChange={(value) => handleCategoryChange(index, value)}
                  >
                    <SelectTrigger id={`category-${index}`}>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {MUSIC_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor={`file-${index}`}>Arquivo de Áudio</Label>
                <div className="flex items-center">
                  <Input
                    id={`file-${index}`}
                    type="file"
                    accept="audio/*"
                    onChange={e => handleFileChange(index, e)}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById(`file-${index}`)?.click()}
                    className="w-full flex items-center justify-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {version.audioFile ? version.audioFile.name : "Selecionar Arquivo"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor={`description-${index}`}>Descrição da Versão</Label>
                <Textarea
                  id={`description-${index}`}
                  value={version.description}
                  onChange={e => handleDescriptionChange(index, e.target.value)}
                  placeholder="Descreva as características desta versão musical..."
                  required
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id={`recommended-${index}`}
                  name="recommended-version"
                  checked={version.isRecommended}
                  onChange={() => handleRecommendedChange(index)}
                  className="mr-2"
                />
                <Label htmlFor={`recommended-${index}`} className="text-sm">
                  Marcar como versão recomendada para o cliente
                </Label>
              </div>
            </Card>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAddVersion}
            className="w-full border-dashed border-2"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar outra versão
          </Button>
        </div>
      </ScrollArea>
      
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={() => onAddComplete('')}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processando...
            </>
          ) : (
            <>Adicionar {versions.length} {versions.length === 1 ? 'versão' : 'versões'}</>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddVersionForm;
