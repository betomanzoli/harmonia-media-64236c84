
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FilePlus, Trash } from 'lucide-react';
import { VersionItem } from '@/types/preview.types';

interface VersionData {
  name: string;
  description: string;
  url: string;
  recommended: boolean;
}

interface MultipleVersionsTabProps {
  versions: VersionData[];
  onAddVersion: () => void;
  onRemoveVersion: (index: number) => void;
  onUpdateField: (index: number, field: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const MultipleVersionsTab: React.FC<MultipleVersionsTabProps> = ({
  versions,
  onAddVersion,
  onRemoveVersion,
  onUpdateField,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      {versions.map((version, index) => (
        <div key={index} className="bg-slate-800 border border-slate-700 rounded-md p-4 relative">
          <h3 className="text-md font-medium mb-3">Versão {index + 1}</h3>
          
          {versions.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
              onClick={() => onRemoveVersion(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da Versão*</label>
              <Input
                value={version.name}
                onChange={(e) => onUpdateField(index, 'name', e.target.value)}
                className="bg-slate-700 mt-1"
                placeholder="Ex: Versão Acústica"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={version.description}
                onChange={(e) => onUpdateField(index, 'description', e.target.value)}
                className="bg-slate-700 mt-1"
                placeholder="Breve descrição da versão"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">URL do Áudio*</label>
              <Input
                value={version.url}
                onChange={(e) => onUpdateField(index, 'url', e.target.value)}
                className="bg-slate-700 mt-1"
                placeholder="https://drive.google.com/..."
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`recommended-${index}`}
                checked={version.recommended}
                onCheckedChange={(checked) => 
                  onUpdateField(index, 'recommended', checked === true)
                }
              />
              <label 
                htmlFor={`recommended-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Versão Recomendada
              </label>
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center"
          onClick={onAddVersion}
        >
          <FilePlus className="w-4 h-4 mr-2" />
          Adicionar Outra Versão
        </Button>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700"
        >
          Adicionar {versions.length > 1 ? `${versions.length} Versões` : 'Versão'}
        </Button>
      </div>
    </div>
  );
};

export default MultipleVersionsTab;
