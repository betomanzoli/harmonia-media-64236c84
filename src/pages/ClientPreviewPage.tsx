
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, MessageCircle, Clock, Music, ArrowLeft, Star } from 'lucide-react';

interface Version {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  bandcampUrl: string;
  final: boolean;
  recommended: boolean;
  dateAdded: string;
  albumId?: string;
  trackId?: string;
}

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: Version[];
  expirationDate: string;
  packageType?: string;
}

const ClientPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [versionFeedbacks, setVersionFeedbacks] = useState<Record<string, string>>({});

  // Mock data sincronizado com o admin - em produção viria do Supabase
  useEffect(() => {
    if (projectId) {
      const mockProject: Project = {
        id: projectId,
        title: 'Música Personalizada - João Silva',
        clientName: 'João Silva',
        status: 'waiting',
        expirationDate: '15/02/2024',
        packageType: 'Premium',
        versions: [
          {
            id: '1',
            name: 'Versão 1 - Mix Inicial',
            description: 'Primeira versão com arranjo básico e instrumentos principais',
            embedUrl: 'https://bandcamp.com/EmbeddedPlayer/album=4290875691/size=small/bgcol=333333/linkcol=2ebd35/track=2755730140/transparent=true/',
            bandcampUrl: 'https://harmonia-media.bandcamp.com/track/vozes-em-harmonia-ex-05',
            final: false,
            recommended: true,
            dateAdded: '15/01/2024',
            albumId: '4290875691',
            trackId: '2755730140'
          }
        ]
      };
      
      setProject(mockProject);
    }
  }, [projectId]);

  const handleApproval = async (versionId: string) => {
    setIsSubmitting(true);
    
    try {
      console.log('Aprovando versão:', versionId);
      
      toast({
        title: "Versão aprovada!",
        description: "Sua aprovação foi registrada. Entraremos em contato em breve com os arquivos finais."
      });
      
      if (project) {
        setProject({
          ...project,
          status: 'approved'
        });
      }
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a aprovação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVersionFeedback = async (versionId: string) => {
    const versionFeedback = versionFeedbacks[versionId];
    if (!versionFeedback || !versionFeedback.trim()) {
      toast({
        title: "Feedback obrigatório",
        description: "Por favor, descreva as alterações desejadas para esta versão.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Enviando feedback para versão:', versionId, versionFeedback);
      
      toast({
        title: "Feedback enviado!",
        description: "Recebemos seu feedback para esta versão. Uma nova versão será criada em breve."
      });
      
      // Limpar feedback da versão
      setVersionFeedbacks(prev => ({ ...prev, [versionId]: '' }));
      
      if (project) {
        setProject({
          ...project,
          status: 'feedback'
        });
      }
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneralFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback obrigatório",
        description: "Por favor, descreva as alterações desejadas.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Enviando feedback geral:', feedback);
      
      toast({
        title: "Feedback enviado!",
        description: "Recebemos seu feedback. Uma nova versão será criada em breve."
      });
      
      setFeedback('');
      
      if (project) {
        setProject({
          ...project,
          status: 'feedback'
        });
      }
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      waiting: { label: 'Aguardando Feedback', color: 'bg-yellow-500' },
      feedback: { label: 'Feedback Enviado', color: 'bg-blue-500' },
      approved: { label: 'Aprovado', color: 'bg-green-500' }
    };
    
    const config = configs[status as keyof typeof configs];
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Carregando projeto...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Music className="h-8 w-8 text-harmonia-green mr-2" />
              <span className="text-2xl font-bold text-white">harmonIA</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
            <p className="text-gray-300 mb-2">Olá, {project.clientName}! Escute suas prévias e nos dê seu feedback.</p>
            {project.packageType && (
              <p className="text-gray-400 text-sm">Pacote: {project.packageType}</p>
            )}
            <div className="flex items-center justify-center gap-4 mt-4">
              {getStatusBadge(project.status)}
              <div className="text-gray-400 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Expira em: {project.expirationDate}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2">Como funciona:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Escute todas as versões disponíveis usando os players abaixo</li>
                <li>• Deixe feedback específico para cada versão ou feedback geral</li>
                <li>• Aprove a versão que mais gostar para finalizar o projeto</li>
                <li>• Você pode comentar mesmo após a aprovação</li>
              </ul>
            </CardContent>
          </Card>

          {/* Versions */}
          <div className="space-y-6 mb-8">
            {project.versions.map((version) => (
              <Card key={version.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      {version.name}
                      {version.recommended && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Star className="w-3 h-3 mr-1" />
                          Recomendada
                        </Badge>
                      )}
                      {version.final && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Final
                        </Badge>
                      )}
                    </CardTitle>
                    <span className="text-gray-400 text-sm">{version.dateAdded}</span>
                  </div>
                  {version.description && (
                    <p className="text-gray-300 text-sm">{version.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Bandcamp Player Embed */}
                  <div className="bg-gray-900 p-3 rounded">
                    <iframe
                      style={{ border: 0, width: '100%', height: '42px' }}
                      src={version.embedUrl}
                      seamless
                      title={`Player: ${version.name}`}
                      className="rounded"
                    />
                  </div>
                  
                  {/* Feedback específico da versão */}
                  {project.status !== 'approved' && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder={`Feedback específico para "${version.name}"...`}
                        value={versionFeedbacks[version.id] || ''}
                        onChange={(e) => setVersionFeedbacks(prev => ({ 
                          ...prev, 
                          [version.id]: e.target.value 
                        }))}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVersionFeedback(version.id)}
                          disabled={isSubmitting || !versionFeedbacks[version.id]?.trim()}
                          variant="outline"
                          size="sm"
                          className="text-gray-300 border-gray-600 hover:bg-gray-700"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Feedback desta Versão
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Botões de ação */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproval(version.id)}
                      disabled={isSubmitting || project.status === 'approved'}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar Esta Versão
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => window.open(version.bandcampUrl, '_blank')}
                      className="text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      Ouvir no Bandcamp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feedback Geral */}
          {project.status !== 'approved' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Feedback Geral do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Feedback geral sobre o projeto ou sugestões para uma nova versão..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                />
                <Button
                  onClick={handleGeneralFeedback}
                  disabled={isSubmitting || !feedback.trim()}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  Enviar Feedback Geral
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {project.status === 'approved' && (
            <Card className="bg-green-800 border-green-700">
              <CardContent className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Projeto Aprovado!</h3>
                <p className="text-green-200 mb-4">
                  Obrigado pela aprovação! Entraremos em contato em breve com os arquivos finais.
                </p>
                
                {/* Ainda permite comentários após aprovação */}
                <div className="mt-6 text-left">
                  <Textarea
                    placeholder="Comentários adicionais (opcional)..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="bg-green-700 border-green-600 text-white mb-3"
                    rows={3}
                  />
                  <Button
                    onClick={handleGeneralFeedback}
                    disabled={isSubmitting || !feedback.trim()}
                    variant="outline"
                    className="text-green-200 border-green-600 hover:bg-green-700"
                  >
                    Adicionar Comentário
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClientPreviewPage;
