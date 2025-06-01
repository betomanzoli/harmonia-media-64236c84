
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
import { BandcampUtils } from '@/components/admin/bandcamp/BandcampUtils';

interface AddVersionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  projectId: string;
  onVersionAdded?: () => void;
  packageType?: string;
}

const AddVersionDialog: React.FC<AddVersionDialogProps> = ({
  isOpen,
  setIsOpen,
  projectId,
  onVersionAdded,
  packageType
}) => {
  const [versionName, setVersionName] = useState('');
  const [description, setDescription] = useState('');
  const [bandcampInput, setBandcampInput] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!versionName.trim() || !bandcampInput.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[AddVersion] Iniciando processamento:', {
        projectId,
        versionName,
        bandcampInput: bandcampInput.substring(0, 100) + '...'
      });
      
      // Processar o input do Bandcamp
      const processedData = BandcampUtils.processInput(bandcampInput);
      console.log('[AddVersion] Dados processados:', processedData);
      
      // Determinar a URL de áudio a ser usada
      let audioUrl = '';
      let embedUrl = '';
      let originalUrl = '';
      
      if (processedData.embedUrl) {
        audioUrl = processedData.embedUrl;
        embedUrl = processedData.embedUrl;
      }
      
      if (processedData.originalUrl) {
        originalUrl = processedData.originalUrl;
        // Se não temos embed, usar a URL original como áudio
        if (!audioUrl) {
          audioUrl = processedData.originalUrl;
        }
      }
      
      // Se ainda não temos URL de áudio, usar o input original
      if (!audioUrl) {
        audioUrl = bandcampInput.trim();
      }

      // Preparar dados para inserção
      const insertData = {
        project_id: projectId,
        name: versionName.trim(),
        description: description.trim() || null,
        audio_url: audioUrl,
        embed_url: embedUrl || null,
        bandcamp_url: originalUrl || audioUrl,
        original_bandcamp_url: bandcampInput.trim(),
        recommended: isRecommended
      };

      console.log('[AddVersion] Dados para inserir:', insertData);

      // Inserir no banco de dados
      const { data, error } = await supabase
        .from('project_versions')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('[AddVersion] Erro do Supabase:', error);
        throw new Error(`Erro ao salvar no banco: ${error.message}`);
      }

      console.log('[AddVersion] Versão inserida com sucesso:', data);

      toast({
        title: "Sucesso",
        description: `Versão "${versionName}" adicionada com sucesso`
      });

      // Reset form
      setVersionName('');
      setDescription('');
      setBandcampInput('');
      setIsRecommended(false);
      setIsOpen(false);

      // Chamar callback para recarregar dados
      if (onVersionAdded) {
        console.log('[AddVersion] Chamando callback onVersionAdded');
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

  const handleClose = () => {
    if (!isSubmitting) {
      setVersionName('');
      setDescription('');
      setBandcampInput('');
      setIsRecommended(false);
      setIsOpen(false);
    }
  };

  const handleRecommendedChange = (checked: boolean) => {
    setIsRecommended(checked);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Versão</DialogTitle>
          <DialogDescription>
            Cole o código iframe completo do Bandcamp ou a URL direta da música
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
            <Label>Código Bandcamp / URL *</Label>
            <Textarea
              value={bandcampInput}
              onChange={(e) => setBandcampInput(e.target.value)}
              placeholder="Cole aqui o código iframe completo ou a URL direta do Bandcamp"
              rows={4}
              className="font-mono text-xs"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Aceita: código iframe completo, URL direta da música, ou URL de embed
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recommended"
              checked={isRecommended}
              onCheckedChange={handleRecommendedChange}
              disabled={isSubmitting}
            />
            <Label htmlFor="recommended">Versão recomendada</Label>
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
            disabled={isSubmitting || !versionName.trim() || !bandcampInput.trim()}
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
