
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddVersionForm from './AddVersionForm';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface AddVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSubmit: (version: VersionItem) => void;
  projectStatus?: 'waiting' | 'feedback' | 'approved';
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onSubmit,
  projectStatus = 'waiting'
}) => {
  console.log(`AddVersionDialog - Project Status: ${projectStatus}`);
  
  const handleVersionSubmit = (version: VersionItem) => {
    onSubmit(version);
    onOpenChange(false);
  };
  
  const dialogTitle = projectStatus === 'approved' 
    ? "Adicionar Versão Final" 
    : "Adicionar Nova Versão";
    
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <AddVersionForm 
          onSubmit={handleVersionSubmit} 
          projectStatus={projectStatus}
          projectId={projectId} // Pass projectId to AddVersionForm
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
