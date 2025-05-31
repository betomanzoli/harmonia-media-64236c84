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
}

// **Improved Helper Function v4 with Debug Logs**
const extractBandcampData = (input: string): { embedUrl: string | null; fallbackUrl: string | null } => {
  console.log('[Bandcamp Extract Debug] Raw Input:', input); // Log raw input
  if (!input || typeof input !== 'string') {
    console.log('[Bandcamp Extract Debug] Input is null or not a string.');
    return { embedUrl: null, fallbackUrl: null };
  }

  const trimmedInput = input.trim();
  console.log('[Bandcamp Extract Debug] Trimmed Input:', trimmedInput);

  // 1. Check if the input is *just* the EmbeddedPlayer URL
  if (trimmedInput.startsWith('https://bandcamp.com/EmbeddedPlayer/')) {
    console.log('[Bandcamp Extract Debug] Input identified as direct Embed URL.');
    return { embedUrl: trimmedInput, fallbackUrl: null };
  }

  // 2. Try to extract from full <iframe> code (more lenient regex)
  const iframeSrcMatch = trimmedInput.match(/<iframe.*?src\s*=\s*["'](https?:\/\/bandcamp\.com\/EmbeddedPlayer\/[^"']+?)["']/i);
  const embedUrl = iframeSrcMatch && iframeSrcMatch[1] ? iframeSrcMatch[1] : null;
  console.log('[Bandcamp Extract Debug] iframeSrcMatch Result:', iframeSrcMatch);
  console.log('[Bandcamp Extract Debug] Extracted embedUrl:', embedUrl);

  // 3. Try to extract fallback URL from <a> tag within the iframe code
  let fallbackUrl: string | null = null;
  if (embedUrl) { // Only look for fallback if we found an iframe
    const fallbackMatch = trimmedInput.match(/<a.*?href\s*=\s*["'](https?:\/\/[^"']+?)["']/i);
    fallbackUrl = fallbackMatch && fallbackMatch[1] ? fallbackMatch[1] : null;
    console.log('[Bandcamp Extract Debug] fallbackMatch Result:', fallbackMatch);
    console.log('[Bandcamp Extract Debug] Extracted fallbackUrl:', fallbackUrl);
  } else {
     console.log('[Bandcamp Extract Debug] No embedUrl found from iframe, skipping fallback search.');
  }

  // If we found an embedUrl via iframe extraction, return it
  if (embedUrl) {
     console.log('[Bandcamp Extract Debug] Returning data extracted from iframe.');
    return { embedUrl, fallbackUrl };
  }

  // 4. If it wasn't the direct URL and wasn't a valid iframe, return null
  console.log('[Bandcamp Extract Debug] No valid embed URL found.');
  return { embedUrl: null, fallbackUrl: null };
};


const AddVersionDialog: React.FC<AddVersionDialogProps> = ({ isOpen, setIsOpen, projectId }) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [bandcampInput, setBandcampInput] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddVersion = async () => {
    if (!versionName || !bandcampInput) {
      setError('Nome da versão e Código/URL Bandcamp são obrigatórios.');
      toast({ title: "Campos obrigatórios", description: "Nome da versão e Código/URL Bandcamp são necessários.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    console.log('[Bandcamp Extract Debug] Calling extractBandcampData with:', bandcampInput);
    const { embedUrl, fallbackUrl } = extractBandcampData(bandcampInput);

    if (!embedUrl) {
      setError('Código ou URL inválido. Cole o código <iframe...> completo ou apenas a URL https://bandcamp.com/EmbeddedPlayer/... Verifique o console do navegador para detalhes.');
      toast({ title: "Entrada Inválida", description: "Não foi possível extrair a URL do player. Verifique o console (F12).", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error: insertError } = await supabase.from('project_versions').insert({
        project_id: projectId,
        name: versionName,
        description: description || null,
        original_bandcamp_url: fallbackUrl,
        embed_url: embedUrl,
        recommended: isRecommended,
      }).select().single();

      if (insertError) throw insertError;

      toast({ title: "Versão adicionada", description: `"${versionName}" foi adicionada ao projeto.` });
      setIsOpen(false);
      setVersionName('');
      setDescription('');
      setBandcampInput('');
      setIsRecommended(false);

    } catch (err: any) {
      console.error("Error adding version:", err);
      setError(`Erro ao adicionar versão: ${err.message}`);
      toast({ title: "Erro ao adicionar", description: `Não foi possível adicionar a versão. ${err.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
          <DialogDescription>
            Insira os detalhes da nova versão. Cole o código de incorporação completo do Bandcamp OU apenas a URL do player.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="versionName" className="text-right">
              Nome da Versão *
            </Label>
            <Input
              id="versionName"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              className="col-span-3"
              placeholder="Ex: Versão 1 - Mix Inicial"
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bandcampInput" className="text-right">
              Código/URL Bandcamp *
            </Label>
            <Textarea
              id="bandcampInput"
              value={bandcampInput}
              onChange={(e) => setBandcampInput(e.target.value)}
              className="col-span-3 font-mono text-xs"
              placeholder='Cole o código <iframe...> OU a URL https://bandcamp.com/EmbeddedPlayer/...'
              rows={4}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3 flex items-center space-x-2">
              <Checkbox
                id="isRecommended"
                checked={isRecommended}
                onCheckedChange={(checked) => setIsRecommended(checked as boolean)}
              />
              <Label htmlFor="isRecommended" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Marcar como versão recomendada
              </Label>
            </div>
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleAddVersion} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Adicionando...' : 'Adicionar Versão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVersionDialog;

