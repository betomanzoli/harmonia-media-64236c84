
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
      console.log('[AddVersion] Processando input:', bandcampInput);
      
      // Usar a função de processamento melhorada
      const processedData = BandcampUtils.processInput(bandcampInput);
      console.log('[AddVersion] Dados processados:', processedData);
      
      if (!processedData.embedUrl && !processedData.originalUrl) {
        throw new Error('Não foi possível processar o código/URL fornecido. Verifique se é um código iframe válido do Bandcamp ou uma URL direta.');
      }

      // Preparar dados para inserção com múltiplos campos
      const insertData = {
        project_id: projectId,
        name: versionName,
        description: description || null,
        embed_url: processedData.embedUrl,
        bandcamp_url: processedData.originalUrl || processedData.embedUrl,
        original_bandcamp_url: bandcampInput,
        audio_url: processedData.originalUrl || processedData.embedUrl,
        recommended: isRecommended,
        version_id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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

      // Reset form
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

  const handleClose = () => {
    if (!isSubmitting) {
      setVersionName('');
      setDescription('');
      setBandcampInput('');
      setIsRecommended(false);
      setIsOpen(false);
    }
  };

  const handleRecommendedChange = (checked: boolean | "indeterminate") => {
    setIsRecommended(checked === true);
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
