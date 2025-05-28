
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Music, Lock, User, Mail } from 'lucide-react';
import BandcampPlayer from '@/components/BandcampPlayer';
import ClientFeedbackForm from '@/components/client/ClientFeedbackForm';
import { supabase } from '@/integrations/supabase/client';

interface ProjectVersion {
  id: string;
  name: string;
  description?: string;
  bandcampUrl: string;
  recommended?: boolean;
}

interface ProjectData {
  id: string;
  title: string;
  client_name: string;
  status: 'waiting' | 'feedback' | 'approved';
  expires_at?: string;
  versions: ProjectVersion[];
}

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [project, setProject] = useState<ProjectData | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const authenticateClient = async () => {
    if (!email || !previewCode) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para acessar a prévia.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('preview_code', previewCode)
        .eq('client_email', email)
        .single();

      if (error || !data) {
        toast({
          title: "Acesso negado",
          description: "Email não autorizado para este projeto ou código inválido.",
          variant: "destructive"
        });
        return;
      }

      // Transform data
      const projectData: ProjectData = {
        id: data.id,
        title: data.title || 'Projeto harmonIA',
        client_name: data.client_name || 'Cliente',
        status: data.status as 'waiting' | 'feedback' | 'approved',
        expires_at: data.expires_at,
        versions: Array.isArray(data.versions) ? data.versions.map((v: any) => ({
          id: v.id || `v${Date.now()}`,
          name: v.name || 'Versão',
          description: v.description,
          bandcampUrl: v.bandcampUrl || v.url || '',
          recommended: v.recommended || false
        })) : []
      };

      setProject(projectData);
      setIsAuthenticated(true);
      
      // Auto-select recommended version
      const recommendedVersion = projectData.versions.find(v => v.recommended);
      if (recommendedVersion) {
        setSelectedVersion(recommendedVersion.id);
      }

      toast({
        title: "Acesso liberado",
        description: `Bem-vindo(a), ${data.client_name}!`
      });

    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast({
        title: "Erro",
        description: "Houve um erro ao verificar o acesso. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedback: string): Promise<boolean> => {
    if (!project || !email) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          feedback,
          status: 'feedback'
        })
        .eq('id', project.id)
        .eq('client_email', email);

      if (error) throw error;
      
      setProject(prev => prev ? { ...prev, status: 'feedback' } : null);
      return true;
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      return false;
    }
  };

  const handleApprove = async (versionId: string): Promise<boolean> => {
    if (!project || !email) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'approved' })
        .eq('id', project.id)
        .eq('client_email', email);

      if (error) throw error;
      
      setProject(prev => prev ? { ...prev, status: 'approved' } : null);
      return true;
    } catch (error) {
      console.error('Erro ao aprovar versão:', error);
      return false;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Music className="h-8 w-8 text-harmonia-green mr-2" />
              <span className="text-2xl font-bold">harmonIA</span>
            </div>
            <CardTitle>Acesso à Prévia Musical</CardTitle>
            <p className="text-gray-600">Insira seu email para acessar sua música</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email cadastrado
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticateClient()}
              />
            </div>
            <Button 
              onClick={authenticateClient}
              disabled={isLoading || !email}
              className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
            >
              {isLoading ? "Verificando..." : "Acessar Prévia"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green mx-auto mb-4"></div>
          <p>Carregando projeto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Music className="h-8 w-8 text-harmonia-green mr-2" />
            <span className="text-2xl font-bold">harmonIA</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600">Olá, {project.client_name}! Aqui estão suas prévias musicais.</p>
        </div>

        {/* Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Status: </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  project.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'feedback' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {project.status === 'waiting' ? 'Aguardando sua avaliação' :
                   project.status === 'feedback' ? 'Feedback enviado' : 'Aprovado'}
                </span>
              </div>
              {project.expires_at && (
                <div className="text-sm text-gray-600">
                  Expira em: {new Date(project.expires_at).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Versions */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Suas Prévias Musicais</h2>
          
          {project.versions.length > 0 ? (
            <div className="space-y-4">
              {project.versions.map((version) => (
                <Card 
                  key={version.id} 
                  className={`cursor-pointer transition-all ${
                    selectedVersion === version.id ? 'border-harmonia-green ring-2 ring-harmonia-green/20' : 'hover:border-harmonia-green/50'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{version.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {version.recommended && (
                          <span className="bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded text-xs">
                            Recomendada
                          </span>
                        )}
                        {selectedVersion === version.id && (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                            Selecionada
                          </span>
                        )}
                      </div>
                    </div>
                    {version.description && (
                      <p className="text-gray-600 text-sm">{version.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {version.bandcampUrl && (
                      <BandcampPlayer 
                        bandcampUrl={version.bandcampUrl}
                        title={version.name}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Suas prévias musicais estarão disponíveis em breve!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Feedback Form */}
        {project.versions.length > 0 && (
          <ClientFeedbackForm
            projectId={project.id}
            selectedVersion={selectedVersion}
            onFeedbackSubmit={handleFeedbackSubmit}
            onApprove={handleApprove}
            status={project.status}
          />
        )}
      </div>
    </div>
  );
};

export default ClientPreview;
