
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  Volume2, 
  Star, 
  MessageCircle, 
  CheckCircle, 
  Clock,
  Music
} from 'lucide-react';
import PreviewPlayerList from './PreviewPlayerList';
import PreviewProjectDetails from './PreviewProjectDetails';
import { supabase } from '@/integrations/supabase/client';

interface MusicPreview {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  url?: string;
  recommended?: boolean;
}

interface MusicPreviewSystemProps {
  projectId: string;
  userEmail?: string;
}

const MusicPreviewSystem: React.FC<MusicPreviewSystemProps> = ({ 
  projectId, 
  userEmail 
}) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Carregar dados do projeto
  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);

      // Buscar projeto na tabela preview_projects
      const { data: previewProject, error: previewError } = await supabase
        .from('preview_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (previewError) {
        console.error('Erro ao buscar projeto preview:', previewError);
        // Fallback para dados mock se não encontrar no banco
        setProjectData(createMockProjectData());
        setIsLoading(false);
        return;
      }

      // Buscar versões do projeto
      const { data: versions, error: versionsError } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (versionsError) {
        console.error('Erro ao buscar versões:', versionsError);
      }

      const formattedVersions: MusicPreview[] = versions?.map(version => ({
        id: version.version_id,
        title: version.name,
        description: version.description || 'Versão para aprovação',
        audioUrl: version.audio_url || `https://drive.google.com/uc?export=download&id=${version.file_id}`,
        recommended: version.recommended
      })) || [];

      setProjectData({
        projectTitle: previewProject.project_title,
        clientName: previewProject.client_name,
        status: previewProject.status,
        packageType: previewProject.package_type,
        createdAt: previewProject.created_at,
        expiresAt: previewProject.expiration_date,
        previews: formattedVersions.length > 0 ? formattedVersions : createMockPreviews()
      });

    } catch (error) {
      console.error('Erro ao carregar dados do projeto:', error);
      setProjectData(createMockProjectData());
    } finally {
      setIsLoading(false);
    }
  };

  const createMockProjectData = () => ({
    projectTitle: 'Música Personalizada',
    clientName: 'Cliente',
    status: 'waiting',
    packageType: 'Profissional',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    previews: createMockPreviews()
  });

  const createMockPreviews = (): MusicPreview[] => [
    {
      id: 'v1',
      title: 'Versão Acústica',
      description: 'Versão suave com violão e piano',
      audioUrl: 'https://drive.google.com/uc?export=download&id=1H62ylCwQYJ23BLpygtvNmCgwTDcHX6Cl',
      recommended: true
    },
    {
      id: 'v2',
      title: 'Versão Orquestral',
      description: 'Arranjo completo com cordas e metais',
      audioUrl: 'https://drive.google.com/uc?export=download&id=11c6JahRd5Lx0iKCL_gHZ0zrZ3LFBJ47a'
    },
    {
      id: 'v3',
      title: 'Versão Minimalista',
      description: 'Abordagem simplificada com foco na melodia',
      audioUrl: 'https://drive.google.com/uc?export=download&id=1fCsWubN8pXwM-mRlDtnQFTCkBbIkuUyW'
    }
  ];

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersion(versionId);
  };

  const handlePlay = (preview: MusicPreview) => {
    if (currentlyPlaying === preview.id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(preview.id);
      
      // Log da reprodução
      if (userEmail) {
        logPreviewAccess('play', preview.id);
      }
    }
  };

  const logPreviewAccess = async (action: string, versionId?: string) => {
    try {
      await supabase
        .from('preview_access_logs')
        .insert({
          project_id: projectId,
          email: userEmail || 'unknown',
          accessed_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Erro ao registrar acesso:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    if (!feedback.trim()) {
      toast({
        title: "Feedback necessário",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      // Salvar feedback no banco
      const { error } = await supabase
        .from('feedbacks')
        .insert({
          project_id: projectId,
          user_email: userEmail || 'unknown',
          comments: feedback,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      // Atualizar status do projeto
      await supabase
        .from('preview_projects')
        .update({ 
          status: 'feedback',
          last_activity_date: new Date().toISOString()
        })
        .eq('id', projectId);

      toast({
        title: "Feedback enviado!",
        description: "Obrigado pelo seu feedback. Nossa equipe já está trabalhando nas modificações.",
      });

      setProjectData(prev => prev ? {...prev, status: 'feedback'} : null);
      setFeedback('');
      setSelectedVersion(null);

    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma das versões antes de aprovar.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Salvar aprovação no banco
      const { error } = await supabase
        .from('feedbacks')
        .insert({
          project_id: projectId,
          user_email: userEmail || 'unknown',
          comments: `Versão aprovada: ${selectedVersion}`,
          status: 'approved'
        });

      if (error) {
        throw error;
      }

      // Atualizar status do projeto
      await supabase
        .from('preview_projects')
        .update({ 
          status: 'approved',
          last_activity_date: new Date().toISOString()
        })
        .eq('id', projectId);

      toast({
        title: "Música aprovada!",
        description: "Estamos felizes que você gostou! Vamos finalizar sua música e entregar em breve.",
      });

      setProjectData(prev => prev ? {...prev, status: 'approved'} : null);

    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
          <p className="mt-4 text-gray-500">Carregando prévias...</p>
        </div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-8 text-center">
            <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Prévia não encontrada
            </h3>
            <p className="text-gray-500">
              O código de prévia fornecido não é válido ou expirou.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-blue-500"><Clock className="mr-1 h-3 w-3" />Aguardando</Badge>;
      case 'feedback':
        return <Badge className="bg-yellow-500"><MessageCircle className="mr-1 h-3 w-3" />Feedback</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Aprovado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {projectData.projectTitle}
          </h1>
          <p className="text-gray-600 mb-4">
            Projeto para {projectData.clientName}
          </p>
          {getStatusBadge(projectData.status)}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Prévias */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Versões Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <PreviewPlayerList
                  previews={projectData.previews}
                  selectedVersion={selectedVersion}
                  onVersionSelect={handleVersionSelect}
                  onPlay={handlePlay}
                />
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Seu Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Conte-nos o que achou das versões. Que mudanças gostaria de ver?"
                  rows={4}
                  disabled={projectData.status === 'approved'}
                />
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={!selectedVersion || !feedback.trim() || isSubmittingFeedback || projectData.status === 'approved'}
                    variant="outline"
                  >
                    {isSubmittingFeedback ? 'Enviando...' : 'Solicitar Mudanças'}
                  </Button>
                  
                  <Button
                    onClick={handleApprove}
                    disabled={!selectedVersion || projectData.status === 'approved'}
                    className="bg-harmonia-green hover:bg-harmonia-green/90"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprovar Esta Versão
                  </Button>
                </div>

                {projectData.status === 'approved' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">
                      ✅ Projeto aprovado! Sua música está sendo finalizada.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <PreviewProjectDetails project={{
              projectTitle: projectData.projectTitle,
              clientName: projectData.clientName,
              status: projectData.status,
              packageType: projectData.packageType,
              creationDate: new Date(projectData.createdAt).toLocaleDateString('pt-BR')
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPreviewSystem;
