
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddVersionForm from './AddVersionForm';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface AddVersionDialogProps {
  projectId: string;
  onAddVersion: (newVersion: VersionItem) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (version: VersionItem) => void;
  isFinalVersion?: boolean;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  projectId,
  onAddVersion,
  isOpen,
  onClose,
  onSubmit,
  isFinalVersion = false,
  packageType
}) => {
  // Use local state only if isOpen is not provided from props
  const [localOpen, setLocalOpen] = useState(false);

  // Determine if dialog is open based on props or local state
  const isDialogOpen = isOpen !== undefined ? isOpen : localOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (isOpen !== undefined && onClose) {
      // If controlled from parent
      if (!open) onClose();
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
    
    if (isOpen !== undefined && onClose) {
      onClose();
    } else {
      setLocalOpen(false);
    }
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
      
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isFinalVersion ? "Adicionar Versão Final" : "Adicionar Nova Versão"}</DialogTitle>
        </DialogHeader>
        <AddVersionForm 
          projectId={projectId} 
          onAddVersion={handleAddVersion} 
          onCancel={() => handleOpenChange(false)} 
          isFinalVersion={isFinalVersion} 
          packageType={packageType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
