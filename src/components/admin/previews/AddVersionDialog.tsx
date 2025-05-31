
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, File, FilePlus, Trash } from "lucide-react";
import AddVersionForm from './AddVersionForm';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface AddVersionDialogProps {
  projectId: string;
  onAddVersion: (newVersion: VersionItem) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (version: VersionItem) => void;
  isFinalVersion?: boolean;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  projectId,
  onAddVersion,
  isOpen,
  onOpenChange,
  onSubmit,
  isFinalVersion = false,
  packageType
}) => {
  const [localOpen, setLocalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'single' | 'multiple'>('single');
  const [multipleVersions, setMultipleVersions] = useState([
    { name: '', description: '', audioUrl: '', recommended: false }
  ]);

  const isDialogOpen = isOpen !== undefined ? isOpen : localOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (isOpen !== undefined && onOpenChange) {
      onOpenChange(open);
    } else {
      setLocalOpen(open);
    }
  };
  
  const handleAddVersion = (version: VersionItem) => {
    if (onSubmit) {
      onSubmit(version);
    } else if (onAddVersion) {
      onAddVersion(version);
    }
    
    if (isOpen !== undefined && onOpenChange) {
      onOpenChange(false);
    } else {
      setLocalOpen(false);
    }
  };

  const handleAddMultipleVersions = () => {
    const validVersions = multipleVersions.filter(v => v.name.trim() !== '' && v.audioUrl.trim() !== '');
    
    if (validVersions.length === 0) {
      return;
    }

    validVersions.forEach((versionData, index) => {
      const version: VersionItem = {
        id: `v${Date.now()}-${index}`,
        name: versionData.name,
        description: versionData.description || '',
        audioUrl: versionData.audioUrl,
        recommended: versionData.recommended,
        dateAdded: new Date().toLocaleDateString('pt-BR'),
        final: isFinalVersion
      };

      if (onAddVersion) {
        onAddVersion(version);
      }
    });

    if (isOpen !== undefined && onOpenChange) {
      onOpenChange(false);
    } else {
      setLocalOpen(false);
    }
    
    setMultipleVersions([{ name: '', description: '', audioUrl: '', recommended: false }]);
  };
  
  const addEmptyVersion = () => {
    setMultipleVersions([...multipleVersions, { name: '', description: '', audioUrl: '', recommended: false }]);
  };

  const removeVersion = (index: number) => {
    if (multipleVersions.length > 1) {
      const newVersions = [...multipleVersions];
      newVersions.splice(index, 1);
      setMultipleVersions(newVersions);
    }
  };

  const updateVersionField = (index: number, field: string, value: any) => {
    const updatedVersions = [...multipleVersions];
    updatedVersions[index] = { ...updatedVersions[index], [field]: value };
    setMultipleVersions(updatedVersions);
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {isOpen === undefined && (
        <Button variant="outline" onClick={() => setLocalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Nova Versão
        </Button>
      )}
      
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isFinalVersion ? "Adicionar Versão Final" : "Adicionar Nova Versão"}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'single' | 'multiple')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="single">Versão Única</TabsTrigger>
            <TabsTrigger value="multiple">Múltiplas Versões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
            <AddVersionForm 
              projectId={projectId} 
              onAddVersion={handleAddVersion} 
              onCancel={() => handleOpenChange(false)} 
              isFinalVersion={isFinalVersion} 
              packageType={packageType}
            />
          </TabsContent>
          
          <TabsContent value="multiple">
            <div className="space-y-6">
              {multipleVersions.map((version, index) => (
                <div key={index} className="bg-slate-800 border border-slate-700 rounded-md p-4 relative">
                  <h3 className="text-md font-medium mb-3">Versão {index + 1}</h3>
                  
                  {multipleVersions.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      onClick={() => removeVersion(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome da Versão*</label>
                      <Input
                        value={version.name}
                        onChange={(e) => updateVersionField(index, 'name', e.target.value)}
                        className="bg-slate-700 mt-1"
                        placeholder="Ex: Versão Acústica"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Descrição</label>
                      <Input
                        value={version.description}
                        onChange={(e) => updateVersionField(index, 'description', e.target.value)}
                        className="bg-slate-700 mt-1"
                        placeholder="Breve descrição da versão"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">URL do Áudio*</label>
                      <Input
                        value={version.audioUrl}
                        onChange={(e) => updateVersionField(index, 'audioUrl', e.target.value)}
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
                          updateVersionField(index, 'recommended', checked === true)
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
                  onClick={addEmptyVersion}
                >
                  <FilePlus className="w-4 h-4 mr-2" />
                  Adicionar Outra Versão
                </Button>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddMultipleVersions}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Adicionar {multipleVersions.length > 1 ? `${multipleVersions.length} Versões` : 'Versão'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
