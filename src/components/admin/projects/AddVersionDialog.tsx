import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';

interface AddVersionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectId: string;
  onVersionAdded?: () => void;
}

// Função robusta para extrair o embedUrl do Bandcamp
const extractBandcampEmbedUrl = (input: string): string | null => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Se for embed direto
  if (trimmed.startsWith('https://bandcamp.com/EmbeddedPlayer/')) {
    return trimmed.startsWith('http') ? trimmed : 'https:' + trimmed;
  }

  // Extrair de iframe
  try {
    const iframeMatch = trimmed.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (iframeMatch && iframeMatch[1]) {
      let url = iframeMatch[1];
      if (!url.startsWith('http')) url = 'https:' + url;
      return url;
    }
  } catch (e) {
    // Continua
  }

  // Se for link de track, retorna null (não é embed)
  return null;
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      setVersionName('');
      setDescription('');
      setBandcampInput('');
      setIsRecommended(false);
      setError(null);
    }
  };

  const handleAddVersion = async () => {
    if (!versionName || !bandcampInput) {
      setError('Nome da versão e Código/URL Bandcamp são obrigatórios.');
      toast({
        title: "Campos obrigatórios",
        description: "Nome da versão e Código/URL Bandcamp são necessários.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const embedUrl = extractBandcampEmbedUrl(bandcampInput);

      if (!embedUrl) {
        throw new Error('Código ou URL inválido. Cole o código completo do iframe do Bandcamp.');
      }

      // Inserção simplificada, sem timestamps manuais
      const insertData = {
        project_id: projectId,
        name: versionName,
        description: description || null,
        bandcamp_url: embedUrl,
        recommended: isRecommended
      };

      const { data, error: insertError } = await supabase
        .from('project_versions')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Erro do banco: ${insertError.message}`);
      }

      toast({
        title: "Versão adicionada",
        description: `"${versionName}" foi adicionada ao projeto.`
      });

      if (onVersionAdded) onVersionAdded();
      handleClose();

    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      toast({
        title: "Erro ao adicionar",
        description: err.message || 'Não foi possível adicionar a versão.',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Adicionar Nova Versão</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Insira os detalhes da nova versão. Cole o código de incorporação completo do Bandcamp (iframe).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome da Versão *
            </Label>
            <Input
              id="name"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Versão 1 - Mix Inicial"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="(Opcional) Breve descrição da versão..."
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="bandcamp" className="text-right pt-2">
              Código Bandcamp (iframe) *
            </Label>
            <Textarea
              id="bandcamp"
              value={bandcampInput}
              onChange={(e) => setBandcampInput(e.target.value)}
              className="col-span-3 font-mono text-xs"
              placeholder='Cole o código iframe do Bandcamp aqui'
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div></div>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="recommended"
                checked={isRecommended}
                onCheckedChange={(checked) => setIsRecommended(checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="recommended">
                Marcar como versão recomendada
              </Label>
            </div>
          </div>

          {error && (
            <div className="grid grid-cols-4 gap-4">
              <div></div>
              <div className="col-span-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddVersion}
            disabled={isSubmitting || !versionName || !bandcampInput}
            className="bg-harmonia-green hover:bg-harmonia-green/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              'Adicionar Versão'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;
