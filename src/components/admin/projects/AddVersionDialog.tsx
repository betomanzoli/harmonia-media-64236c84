import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AddVersionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectId: string;
  onVersionAdded?: () => void;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  setIsOpen,
  projectId,
  onVersionAdded,
}) => {
  const [versionName, setVersionName] = useState('');
  const [bandcampInput, setBandcampInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddVersion = async () => {
    if (!versionName || !bandcampInput) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ EXTRAÇÃO ULTRA-SIMPLES:
      let embedUrl = bandcampInput.trim();
      
      // Se tem iframe, extrair URL
      const match = embedUrl.match(/src=["']([^"']*bandcamp\.com[^"']*)["']/i);
      if (match) {
        embedUrl = match[1];
        if (!embedUrl.startsWith('http')) {
          embedUrl = 'https:' + embedUrl;
        }
      }

      // ✅ INSERT ULTRA-SIMPLES:
      const { error } = await supabase
        .from('project_versions')
        .insert({
          project_id: projectId,
          name: versionName,
          bandcamp_url: embedUrl
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Versão adicionada"
      });

      if (onVersionAdded) onVersionAdded();
      setIsOpen(false);
      setVersionName('');
      setBandcampInput('');

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Versão</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Nome da versão"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            disabled={isSubmitting}
          />
          
          <Textarea
            placeholder="Cole o código iframe do Bandcamp"
            value={bandcampInput}
            onChange={(e) => setBandcampInput(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddVersion}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
