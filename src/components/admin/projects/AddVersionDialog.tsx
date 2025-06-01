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

// ✅ FUNÇÃO ULTRA-ROBUSTA PARA EXTRAIR URL:
const extractEmbedUrl = (input: string): string | null => {
  console.log('[Extract] Input recebido:', input);
  
  if (!input) {
    console.log('[Extract] Input vazio');
    return null;
  }
  
  try {
    // Buscar src do iframe com regex mais flexível
    const srcMatch = input.match(/src=["']([^"']*bandcamp\.com[^"']*)["']/i);
    if (srcMatch && srcMatch[1]) {
      let url = srcMatch[1];
      
      // Garantir protocolo HTTPS
      if (!url.startsWith('http')) {
        url = 'https:' + url;
      }
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      
      console.log('[Extract] URL extraída:', url);
      return url;
    }
    
    console.log('[Extract] Nenhuma URL encontrada no input');
    return null;
    
  } catch (error) {
    console.error('[Extract] Erro:', error);
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
      console.log('[AddVersion] URL extraída para salvar:', embedUrl);
      
      if (!embedUrl) {
        throw new Error('Não foi possível extrair a URL do player do código fornecido');
      }

      // ✅ INSERÇÃO EM MÚLTIPLAS COLUNAS PARA GARANTIR COMPATIBILIDADE:
      const insertData = {
        project_id: projectId,
        name: versionName,
        description: description || null,
        embed_url: embedUrl,           // ✅ Campo principal
        bandcamp_url: embedUrl,        // ✅ Campo alternativo
        original_bandcamp_url: bandcampInput, // ✅ Código original
        recommended: isRecommended
      };

      console.log('[AddVersion] Dados para inserir:', insertData);

      const { data, error } = await supabase
        .from('project_versions')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('[AddVersion] Erro do Supabase:', error);
        throw error;
      }

      console.log('[AddVersion] Versão inserida com sucesso:', data);

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
      console.error('[AddVersion] Erro geral:', error);
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
