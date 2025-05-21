
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddVersionForm from './AddVersionForm';
import { VersionItem } from '@/types/preview.types';

interface AddVersionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVersion: (version: VersionItem) => void;
  projectId: string;
  isFinalVersion?: boolean;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onAddVersion,
  projectId,
  isFinalVersion = false,
  packageType
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isFinalVersion ? 'Adicionar Versão Final' : 'Adicionar Nova Versão'}
          </DialogTitle>
        </DialogHeader>
        
        <AddVersionForm 
          projectId={projectId}
          onAddVersion={onAddVersion}
          onCancel={() => onOpenChange(false)}
          isFinalVersion={isFinalVersion}
          packageType={packageType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
