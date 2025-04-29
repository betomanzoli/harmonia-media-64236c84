
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddVersionForm from './AddVersionForm';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface AddVersionDialogProps {
  projectId: string;
  onAddVersion: (newVersion: VersionItem) => void;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({ projectId, onAddVersion }) => {
  const [open, setOpen] = useState(false);

  const handleAddVersion = (version: VersionItem) => {
    onAddVersion(version);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nova Versão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
        </DialogHeader>
        <AddVersionForm 
          projectId={projectId}
          onAddVersion={handleAddVersion}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
