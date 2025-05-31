import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AddVersionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectId: string;
  // onVersionAdded: (newVersion: any) => void; // Callback might not be needed if using realtime hooks
}

// Helper function to extract src and optionally the fallback URL from Bandcamp embed code
const extractBandcampDataFromEmbed = (embedCode: string): { embedUrl: string | null; fallbackUrl: string | null } => {
  if (!embedCode || typeof embedCode !== 'string') {
    return { embedUrl: null, fallbackUrl: null };
  }

  // Extract src from iframe tag
  const srcMatch = embedCode.match(/<iframe.*?src="(https?:\/\/bandcamp\.com\/EmbeddedPlayer\/.*?)"/);
  const embedUrl = srcMatch && srcMatch[1] ? srcMatch[1] : null;

  // Extract fallback URL from anchor tag
  const fallbackMatch = embedCode.match(/<a.*?href="(https?:\[email protected]\/\/.*?)"/);
  const fallbackUrl = fallbackMatch && fallbackMatch[1] ? fallbackMatch[1] : null;

  return { embedUrl, fallbackUrl };
};

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({ isOpen, setIsOpen, projectId }) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [bandcampEmbedCode, setBandcampEmbedCode] = useState(''); // Changed from bandcampUrl
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddVersion = async () => {
    // Validate required fields
    if (!versionName || !bandcampEmbedCode) {
      setError('Nome da versão e Código de Incorporação são obrigatórios.');
      toast({ title: "Campos obrigatórios", description: "Nome da versão e Código de Incorporação são necessários.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Extract data from embed code
    const { embedUrl, fallbackUrl } = extractBandcampDataFromEmbed(bandcampEmbedCode);

    if (!embedUrl) {
      setError('Código de incorporação inválido. Certifique-se de colar o código <iframe> completo do Bandcamp.');
      toast({ title: "Código Inválido", description: "Não foi possível encontrar a URL do player no código fornecido.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error: insertError } = await supabase.from('project_versions').insert({
        project_id: projectId,
        name: versionName,
        description: description || null, // Use null if empty
        original_bandcamp_url: fallbackUrl, // Save the fallback URL as the original
        embed_url: embedUrl,              // Save the extracted embed URL
        recommended: isRecommended,
      }).select().single();

      if (insertError) throw insertError;

      toast({ title: "Versão adicionada", description: `"${versionName}" foi adicionada ao projeto.` });
      // onVersionAdded(data); // Callback if needed
      setIsOpen(false); // Close dialog
      // Reset form fields
      setVersionName('');
      setDescription('');
      setBandcampEmbedCode('');
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
            Insira os detalhes da nova versão musical. Cole o código de incorporação completo do Bandcamp.
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
            <Label htmlFor="bandcampEmbed" className="text-right">
              Código Bandcamp *
            </Label>
            <Textarea // Changed to Textarea for better pasting
              id="bandcampEmbed"
              value={bandcampEmbedCode}
              onChange={(e) => setBandcampEmbedCode(e.target.value)}
              className="col-span-3 font-mono text-xs"
              placeholder='Cole o código <iframe...> completo aqui'
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

