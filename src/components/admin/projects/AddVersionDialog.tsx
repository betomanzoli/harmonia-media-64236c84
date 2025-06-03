// src/components/admin/projects/AddVersionDialog.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AddVersionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectId: string;
  onVersionAdded?: () => void;
  packageType?: string;
}

// Função segura para extrair URL de embed/pública
const extractBandcampEmbedUrl = (input: string): string | null => {
  if (!input || input.includes('bandcamp.com/private/')) return null; // Ignora links privados
  try {
    const srcMatch = input.match(/src=["']([^"']*(?:bandcamp\.com|bcbits\.com)[^"']*)["']/i);
    if (srcMatch && srcMatch[1]) {
      let url = srcMatch[1];
      // Garante HTTPS e remove parâmetros desnecessários (ex: size, bgcol, etc.)
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      urlObj.search = ''; // Limpa query params
      return urlObj.toString();
    }
    // Se for URL direta pública
    if (input.includes('bandcamp.com') || input.includes('bcbits.com')) {
      const urlObj = new URL(input.trim().startsWith('http') ? input.trim() : 'https://' + input.trim());
      // Verifica se não é um link privado disfarçado
      if (!urlObj.pathname.includes('/private/')) {
         urlObj.search = ''; // Limpa query params
         return urlObj.toString();
      }
    }
    return null;
  } catch (error) {
    console.error('[ExtractEmbedURL] Erro:', error);
    return null;
  }
};

// Função para validar link privado
const validateBandcampPrivateUrl = (input: string): string | null => {
  if (!input) return null;
  const trimmedInput = input.trim();
  if (trimmedInput.startsWith('https://bandcamp.com/private/')) {
    try {
      // Tenta criar uma URL para validar o formato básico
      new URL(trimmedInput);
      return trimmedInput;
    } catch (e) {
      return null; // Formato inválido
    }
  }
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
  const [bandcampEmbedInput, setBandcampEmbedInput] = useState('');
  const [bandcampPrivateUrl, setBandcampPrivateUrl] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Limpa um campo quando o outro é preenchido
  useEffect(() => {
    if (bandcampEmbedInput) {
      setBandcampPrivateUrl('');
    }
  }, [bandcampEmbedInput]);

  useEffect(() => {
    if (bandcampPrivateUrl) {
      setBandcampEmbedInput('');
    }
  }, [bandcampPrivateUrl]);

  const handleSubmit = async () => {
    if (!versionName.trim()) {
      toast({ title: "Erro", description: "O nome da versão é obrigatório.", variant: "destructive" });
      return;
    }
    if (!bandcampEmbedInput.trim() && !bandcampPrivateUrl.trim()) {
      toast({ title: "Erro", description: "Forneça o Código/URL de Embed OU o Link Privado.", variant: "destructive" });
      return;
    }

    let embedUrl: string | null = null;
    let privateUrl: string | null = null;
    let originalUrl: string | undefined = undefined;

    if (bandcampEmbedInput.trim()) {
      embedUrl = extractBandcampEmbedUrl(bandcampEmbedInput);
      if (!embedUrl) {
        toast({ title: "Erro", description: "Código/URL de Embed inválido. Verifique o formato.", variant: "destructive" });
        return;
      }
      originalUrl = bandcampEmbedInput.trim(); // Guarda o input original para referência
    } else if (bandcampPrivateUrl.trim()) {
      privateUrl = validateBandcampPrivateUrl(bandcampPrivateUrl);
      if (!privateUrl) {
        toast({ title: "Erro", description: "Link Privado inválido. Deve começar com https://bandcamp.com/private/...", variant: "destructive" });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const insertData = {
        project_id: projectId,
        name: versionName.trim(),
        description: description.trim() || null,
        embed_url: embedUrl, // Pode ser null se for link privado
        bandcamp_private_url: privateUrl, // Pode ser null se for embed
        original_bandcamp_url: originalUrl, // Guarda o input original do embed/url público
        recommended: isRecommended,
      };

      const { error } = await supabase
        .from('project_versions')
        .insert(insertData);

      if (error) throw error;

      toast({ title: "Sucesso", description: `Versão "${versionName}" adicionada com sucesso` });

      // Reset form
      setVersionName('');
      setDescription('');
      setBandcampEmbedInput('');
      setBandcampPrivateUrl('');
      setIsRecommended(false);
      setIsOpen(false);

      if (onVersionAdded) {
        onVersionAdded();
      }

    } catch (error: any) {
      console.error('[AddVersion] Erro:', error);
      toast({ title: "Erro ao Adicionar", description: error.message || 'Não foi possível adicionar a versão.', variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setVersionName('');
      setDescription('');
      setBandcampEmbedInput('');
      setBandcampPrivateUrl('');
      setIsRecommended(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da versão. Use o campo de Embed/URL OU o campo de Link Privado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="versionName">Nome da Versão *</Label>
            <Input
              id="versionName"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="Ex: Versão Master 1, Mixagem Preliminar 2"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Alguma observação sobre esta versão?"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          {/* Campo para Embed/URL Pública */}
          <div>
            <Label htmlFor="bandcampEmbed">Código de Embed / URL Pública</Label>
            <Textarea
              id="bandcampEmbed"
              value={bandcampEmbedInput}
              onChange={(e) => setBandcampEmbedInput(e.target.value)}
              placeholder="Cole o código <iframe> ou a URL pública da faixa/álbum"
              rows={3}
              className="font-mono text-xs"
              disabled={isSubmitting || !!bandcampPrivateUrl} // Desabilita se link privado estiver preenchido
            />
             <p className="text-xs text-muted-foreground mt-1">Use este campo para players incorporados.</p>
          </div>

          <div className="text-center text-sm text-muted-foreground font-medium">OU</div>

          {/* Campo para Link Privado */}
          <div>
            <Label htmlFor="bandcampPrivate">Link Privado Bandcamp</Label>
            <Input
              id="bandcampPrivate"
              type="url"
              value={bandcampPrivateUrl}
              onChange={(e) => setBandcampPrivateUrl(e.target.value)}
              placeholder="https://bandcamp.com/private/..."
              disabled={isSubmitting || !!bandcampEmbedInput} // Desabilita se embed/url estiver preenchido
            />
            <p className="text-xs text-muted-foreground mt-1">Use este campo para links privados que abrem a página do Bandcamp.</p>
          </div>

          {/* Checkbox Recomendada */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="recommended"
              checked={isRecommended}
              onCheckedChange={(checked) => setIsRecommended(Boolean(checked))}
              disabled={isSubmitting}
            />
            <Label htmlFor="recommended">Marcar como versão recomendada</Label>
          </div>
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
            onClick={handleSubmit}
            disabled={isSubmitting || !versionName.trim() || (!bandcampEmbedInput.trim() && !bandcampPrivateUrl.trim())}
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

