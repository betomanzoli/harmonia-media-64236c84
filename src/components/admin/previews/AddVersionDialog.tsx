
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VersionItem } from '@/types/preview.types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SingleVersionTab from './VersionDialog/SingleVersionTab';
import MultipleVersionsTab from './VersionDialog/MultipleVersionsTab';

interface VersionData {
  name: string;
  description: string;
  url: string;
  recommended: boolean;
}

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
  // Use local state only if isOpen is not provided from props
  const [localOpen, setLocalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'single' | 'multiple'>('single');
  const [multipleVersions, setMultipleVersions] = useState<VersionData[]>([
    { name: '', description: '', url: '', recommended: false }
  ]);

  // Determine if dialog is open based on props or local state
  const isDialogOpen = isOpen !== undefined ? isOpen : localOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (isOpen !== undefined && onOpenChange) {
      // If controlled from parent
      onOpenChange(open);
    } else {
      // If controlled locally
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
    // Filter out empty versions
    const validVersions = multipleVersions.filter(v => v.name.trim() !== '' && v.url.trim() !== '');
    
    if (validVersions.length === 0) {
      return;
    }

    // Add versions one by one
    validVersions.forEach((versionData, index) => {
      const version: VersionItem = {
        id: `v${Date.now()}-${index}`,
        name: versionData.name,
        description: versionData.description || '',
        audioUrl: versionData.url,
        recommended: versionData.recommended,
        dateAdded: new Date().toLocaleDateString('pt-BR'),
        final: isFinalVersion
      };

      if (onAddVersion) {
        onAddVersion(version);
      }
    });

    // Close dialog
    if (isOpen !== undefined && onOpenChange) {
      onOpenChange(false);
    } else {
      setLocalOpen(false);
    }
    
    // Reset form
    setMultipleVersions([{ name: '', description: '', url: '', recommended: false }]);
  };
  
  const addEmptyVersion = () => {
    setMultipleVersions([...multipleVersions, { name: '', description: '', url: '', recommended: false }]);
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
      {/* Only render the trigger button if not externally controlled */}
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
            <SingleVersionTab
              projectId={projectId}
              onAddVersion={handleAddVersion}
              onCancel={() => handleOpenChange(false)}
              isFinalVersion={isFinalVersion}
              packageType={packageType}
            />
          </TabsContent>
          
          <TabsContent value="multiple">
            <MultipleVersionsTab
              versions={multipleVersions}
              onAddVersion={addEmptyVersion}
              onRemoveVersion={removeVersion}
              onUpdateField={updateVersionField}
              onSubmit={handleAddMultipleVersions}
              onCancel={() => handleOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
