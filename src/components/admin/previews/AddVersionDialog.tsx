
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddVersionForm from './AddVersionForm';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface AddVersionDialogProps {
  projectId: string;
  onAddVersion: (newVersion: VersionItem) => void;
  // Adding isOpen and onClose props to match how it's being used
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (version: VersionItem) => void;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({ 
  projectId, 
  onAddVersion,
  isOpen,
  onClose,
  onSubmit
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
      {!isOpen && (
        <Button className="w-full flex justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nova Versão
        </Button>
      )}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
        </DialogHeader>
        <AddVersionForm 
          projectId={projectId}
          onAddVersion={handleAddVersion}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
