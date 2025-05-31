import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';
import { Heart, MessageCircle, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  client_name?: string;
  status: string;
  created_at: string;
  expires_at?: string;
}

interface Version {
  id: string;
  name: string;
  description?: string;
  bandcamp_url?: string;
  recommended: boolean;
  created_at: string;
}

interface Feedback {
  id: string;
  version_id: string;
  type: 'like' | 'comment' | 'approve' | 'request_changes';
  content?: string;
  created_at: string;
}

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (previewCode) {
      loadProjectData();
    }
  }, [previewCode]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ CORREÇÃO: Usar maybeSingle() em vez de single()
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('preview_code', previewCode)
        .maybeSingle();

      if (projectError) {
        console.error('Error fetching project:', projectError);
        setError('Erro ao carregar projeto');
        return;
      }

      if (!projectData) {
        setError('Preview não encontrado');
        return;
      }

      setProject(projectData);

      // Carregar versões do projeto
      const { data: versionsData, error: versionsError } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectData.id)
        .order('created_at', { ascending: false });

      if (versionsError) {
        console.error('Error fetching versions:', versionsError);
      } else {
        setVersions(versionsData || []);
      }

      // Carregar feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('project_id', projectData.id)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
      } else {
        setFeedback(feedbackData || []);
      }

    } catch (error) {
      console.error('Error loading project data:', error);
      setError('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (versionId: string, type: 'like' | 'approve' | 'request_changes', content?: string) => {
    try {
      setSubmittingFeedback(true);

      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          project_id: project?.id,
          version_id: versionId,
          type,
          content,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error submitting feedback:', error);
        return;
      }

      // Recarregar feedback
      await loadProjectData();
      setNewComment('');

    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Aguardando Feedback</Badge>;
      case 'feedback':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Em Revisão</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Aprovado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando preview...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Preview não encontrado</h2>
            <p className="text-gray-600">{error || 'O link que você acessou não é válido ou expirou.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{project.title}</CardTitle>
                <p className="text-gray-600 mt-1">Cliente: {project.client_name}</p>
                {project.description && (
                  <p className="text-gray-700 mt-2">{project.description}</p>
                )}
              </div>
              {getStatusBadge(project.status)}
            </div>
          </CardHeader>
        </Card>

        {/* Versions */}
        <div className="space-y-6">
          {versions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhuma versão disponível ainda.</p>
                <p className="text-sm text-gray-400 mt-2">As versões aparecerão aqui quando estiverem prontas.</p>
              </CardContent>
            </Card>
          ) : (
            versions.map((version) => (
              <Card key={version.id} className={version.recommended ? 'ring-2 ring-blue-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{version.name}</CardTitle>
                      {version.description && (
                        <p className="text-gray-600 mt-1">{version.description}</p>
                      )}
                    </div>
                    {version.recommended && (
                      <Badge className="bg-blue-100 text-blue-800">Recomendada</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bandcamp Player */}
                  {version.bandcamp_url && (
                    <BandcampEmbedPlayer
                      embedUrl={version.bandcamp_url}
                      title={version.name}
                      fallbackUrl={version.bandcamp_url}
                    />
                  )}

                  {/* Feedback Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => submitFeedback(version.id, 'like')}
                      disabled={submittingFeedback}
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Curtir
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => submitFeedback(version.id, 'approve')}
                      disabled={submittingFeedback}
                      className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Aprovar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => submitFeedback(version.id, 'request_changes')}
                      disabled={submittingFeedback}
                      className="flex items-center gap-2 text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Solicitar Mudanças
                    </Button>
                  </div>

                  {/* Comment Section */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Deixe seu comentário sobre esta versão..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button
                        onClick={() => submitFeedback(version.id, 'comment', newComment)}
                        disabled={!newComment.trim() || submittingFeedback}
                        size="sm"
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Existing Feedback */}
                  {feedback.filter(f => f.version_id === version.id).length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700">Feedback:</h4>
                      {feedback
                        .filter(f => f.version_id === version.id)
                        .map((fb) => (
                          <div key={fb.id} className="text-sm bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <span className="font-medium capitalize">{fb.type}</span>
                              <span className="text-gray-500 text-xs">
                                {new Date(fb.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            {fb.content && (
                              <p className="text-gray-700 mt-1">{fb.content}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="text-center py-6">
            <p className="text-sm text-gray-500">
              Este preview expira em: {project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : 'Data não definida'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Powered by harmonIA.media
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPreview;
