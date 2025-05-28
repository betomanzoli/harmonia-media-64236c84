
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, MessageCircle, Clock, Music, ArrowLeft } from 'lucide-react';
import { BandcampUtils } from '@/components/admin/bandcamp/BandcampUtils';

interface Version {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  bandcampUrl: string;
  final: boolean;
  recommended: boolean;
  dateAdded: string;
}

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: 'waiting' | 'feedback' | 'approved';
  versions: Version[];
  expirationDate: string;
}

const ClientPreviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - em produção viria do Supabase
  useEffect(() => {
    if (projectId) {
      // Simulação de carregamento do projeto
      const mockProject: Project = {
        id: projectId,
        title: 'Música Personalizada - João Silva',
        clientName: 'João Silva',
        status: 'waiting',
        expirationDate: '2024-02-15',
        versions: [
          {
            id: '1',
            name: 'Versão 1 - Mix Inicial',
            description: 'Primeira versão com arranjo básico',
            embedUrl: BandcampUtils.generateEmbedUrl('4290875691', '1'),
            bandcampUrl: 'https://harmonia-media.bandcamp.com/album/promocionais-harmonia-01?t=1',
            final: false,
            recommended: true,
            dateAdded: '2024-01-15'
          },
          {
            id: '2',
            name: 'Versão 2 - Ajustes de Mixagem',
            description: 'Versão com melhorias na mixagem e masterização',
            embedUrl: BandcampUtils.generateEmbedUrl('4290875691', '2'),
            bandcampUrl: 'https://harmonia-media.bandcamp.com/album/promocionais-harmonia-01?t=2',
            final: false,
            recommended: false,
            dateAdded: '2024-01-20'
          }
        ]
      };
      
      setProject(mockProject);
    }
  }, [projectId]);

  const handleApproval = async (versionId: string) => {
    setIsSubmitting(true);
    
    try {
      // Em produção: atualizar status no Supabase
      console.log('Aprovando versão:', versionId);
      
      toast({
        title: "Versão aprovada!",
        description: "Sua aprovação foi registrada. Entraremos em contato em breve."
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

  const handleFeedback = async () => {
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
      // Em produção: salvar feedback no Supabase
      console.log('Enviando feedback:', feedback);
      
      toast({
        title: "Feedback enviado!",
        description: "Recebemos seu feedback. Uma nova versão será criada em breve."
      });
      
      if (project) {
        setProject({
          ...project,
          status: 'feedback'
        });
      }
      
      setFeedback('');
      
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
            <p className="text-gray-300">Olá, {project.clientName}! Escute suas prévias e nos dê seu feedback.</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              {getStatusBadge(project.status)}
              <div className="text-gray-400 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Expira em: {project.expirationDate}
              </div>
            </div>
          </div>

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
                          Recomendada
                        </Badge>
                      )}
                      {version.final && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
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
                <CardContent>
                  {/* Bandcamp Player Embed */}
                  <div className="mb-4">
                    <iframe
                      style={{ border: 0, width: '100%', height: '120px' }}
                      src={version.embedUrl}
                      seamless
                      title={`Player: ${version.name}`}
                      className="rounded"
                    />
                  </div>
                  
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

          {/* Feedback Section */}
          {project.status !== 'approved' && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Precisa de Ajustes? Deixe seu Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Descreva as alterações que gostaria de ver na próxima versão..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                />
                <Button
                  onClick={handleFeedback}
                  disabled={isSubmitting || !feedback.trim()}
                  className="bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  Enviar Feedback
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
                <p className="text-green-200">
                  Obrigado pela aprovação! Entraremos em contato em breve com os arquivos finais.
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClientPreviewPage;
