import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AddVersionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectId: string;
  onVersionAdded?: () => void;
}

// ✅ FUNÇÃO ULTRA-SIMPLIFICADA PARA EXTRAIR URL:
const extractEmbedUrl = (input: string): string | null => {
  if (!input) return null;
  
  try {
    // Buscar src do iframe
    const srcMatch = input.match(/src=["']([^"']*bandcamp\.com\/EmbeddedPlayer[^"']*)["']/i);
    if (srcMatch && srcMatch[1]) {
      let url = srcMatch[1];
      // Garantir protocolo HTTPS
      if (!url.startsWith('http')) {
        url = 'https:' + url;
      }
      return url;
    }
    return null;
  } catch (error) {
    console.error('Extract error:', error);
    return null;
  }
};

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  setIsOpen,
  projectId,
  onVersionAdded,
}) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [bandcampInput, setBandcampInput] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!versionName || !bandcampInput) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const embedUrl = extractEmbedUrl(bandcampInput);
      
      if (!embedUrl) {
        throw new Error('Código iframe inválido');
      }

      // ✅ INSERÇÃO ULTRA-SIMPLES:
      const { error } = await supabase
        .from('project_versions')
        .insert({
          project_id: projectId,
          name: versionName,
          description: description || null,
          embed_url: embedUrl,
          recommended: isRecommended
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Versão adicionada com sucesso"
      });

      // Reset e fechar
      setVersionName('');
      setDescription('');
      setBandcampInput('');
      setIsRecommended(false);
      setIsOpen(false);

      if (onVersionAdded) {
        onVersionAdded();
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: error.message || 'Erro ao adicionar versão',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
          <DialogDescription>
            Cole o código iframe completo do Bandcamp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome da Versão *</Label>
            <Input
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="Ex: Versão 1"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label>Código Bandcamp *</Label>
            <Textarea
              value={bandcampInput}
              onChange={(e) => setBandcampInput(e.target.value)}
              placeholder="Cole o código iframe aqui"
              rows={4}
              className="font-mono text-xs"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recommended"
              checked={isRecommended}
              onCheckedChange={setIsRecommended}
              disabled={isSubmitting}
            />
            <Label htmlFor="recommended">Versão recomendada</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !versionName || !bandcampInput}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              'Adicionar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
