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
  onVersionAdded?: () => void; // ✅ Callback para recarregar versões
}

// ✅ FUNÇÃO MELHORADA PARA EXTRAIR URL DO BANDCAMP:
const extractBandcampData = (input: string): { embedUrl: string | null; fallbackUrl: string | null } => {
  console.log('[Bandcamp Extract] Input:', input);
  
  if (!input || typeof input !== 'string') {
    return { embedUrl: null, fallbackUrl: null };
  }

  const trimmedInput = input.trim();
  
  // 1. Se é URL direta do EmbeddedPlayer
  if (trimmedInput.startsWith('https://bandcamp.com/EmbeddedPlayer/')) {
    console.log('[Bandcamp Extract] Direct embed URL found');
    return { embedUrl: trimmedInput, fallbackUrl: null };
  }
  
  // 2. Extrair de iframe (regex mais robusta)
  const iframeRegex = /<iframe[^>]*src=["']([^"']*bandcamp\.com\/EmbeddedPlayer\/[^"']*)["'][^>]*>/i;
  const iframeMatch = trimmedInput.match(iframeRegex);
  
  if (iframeMatch && iframeMatch[1]) {
    console.log('[Bandcamp Extract] Iframe embed URL found:', iframeMatch[1]);
    
    // Extrair URL de fallback do href
    const hrefRegex = /<a[^>]*href=["']([^"']*harmonia-media\.bandcamp\.com[^"']*)["'][^>]*>/i;
    const hrefMatch = trimmedInput.match(hrefRegex);
    
    return { 
      embedUrl: iframeMatch[1], 
      fallbackUrl: hrefMatch ? hrefMatch[1] : null 
    };
  }
  
  // 3. Se é URL normal do Bandcamp, tentar converter
  if (trimmedInput.includes('harmonia-media.bandcamp.com/track/')) {
    console.log('[Bandcamp Extract] Track URL found, but no embed code');
    return { embedUrl: null, fallbackUrl: trimmedInput };
  }
  
  console.log('[Bandcamp Extract] No valid URL found');
  return { embedUrl: null, fallbackUrl: null };
};

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  projectId, 
  onVersionAdded 
}) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [bandcampInput, setBandcampInput] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // ✅ FUNÇÃO PARA FECHAR MODAL FORÇADAMENTE:
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
      console.log('[Add Version] Starting process...');
      console.log('[Add Version] Project ID:', projectId);
      console.log('[Add Version] Version Name:', versionName);
      
      const { embedUrl, fallbackUrl } = extractBandcampData(bandcampInput);
      
      if (!embedUrl && !fallbackUrl) {
        throw new Error('Código ou URL inválido. Cole o código completo do iframe ou a URL do track.');
      }

      // ✅ INSERIR SEM ESPECIFICAR ID (deixar auto-gerar):
      const insertData = {
        project_id: projectId,
        name: versionName,
        description: description || null,
        bandcamp_url: embedUrl || fallbackUrl, // ✅ Usar campo correto
        recommended: isRecommended,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('[Add Version] Insert data:', insertData);

      const { data, error: insertError } = await supabase
        .from('project_versions')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('[Add Version] Supabase error:', insertError);
        throw new Error(`Erro do banco: ${insertError.message}`);
      }

      console.log('[Add Version] Success:', data);

      toast({ 
        title: "Versão adicionada", 
        description: `"${versionName}" foi adicionada ao projeto.` 
      });

      // ✅ RECARREGAR VERSÕES E FECHAR MODAL:
      if (onVersionAdded) {
        onVersionAdded();
      }
      
      handleClose();

    } catch (err: any) {
      console.error('[Add Version] Error:', err);
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
            {/* ✅ BOTÃO X PARA FECHAR FORÇADAMENTE: */}
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
            Insira os detalhes da nova versão. Cole o código de incorporação completo do Bandcamp OU apenas a URL do track.
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
              Código/URL Bandcamp *
            </Label>
            <Textarea
              id="bandcamp"
              value={bandcampInput}
              onChange={(e) => setBandcampInput(e.target.value)}
              className="col-span-3 font-mono text-xs"
              placeholder='Cole o código iframe OU a URL https://harmonia-media.bandcamp.com/track/...'
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
