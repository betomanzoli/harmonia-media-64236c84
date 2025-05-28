
import React from 'react';
import { useParams } from 'react-router-dom';
import { useClientPreview } from '@/hooks/useClientPreview';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Music, CheckCircle2, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import HarmoniaLogo from '@/components/ui/HarmoniaLogo';
import { useState } from 'react';

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const {
    project,
    isLoading,
    isAuthenticated,
    authError,
    authenticateClient,
    submitFeedback,
    approveVersion
  } = useClientPreview(previewCode || '');

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await authenticateClient(email.trim());
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      const success = await submitFeedback(feedback.trim(), email);
      if (success) {
        setFeedback('');
      }
    }
  };

  const handleApprove = async (versionId: string) => {
    await approveVersion(versionId, email);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <HarmoniaLogo size="lg" />
          <p className="mt-4 text-green-700">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <HarmoniaLogo size="md" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800">Acesso ao Projeto</h1>
            <p className="text-green-600">Insira seu email para acessar as prévias musicais</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthentication} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  required
                  className="mt-1"
                />
              </div>
              
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Acessar Projeto
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <HarmoniaLogo size="md" className="mx-auto mb-4" />
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600">O projeto solicitado não foi encontrado ou não está disponível.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'feedback':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Music className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Aguardando feedback';
      case 'feedback':
        return 'Feedback enviado';
      case 'approved':
        return 'Projeto aprovado';
      default:
        return 'Status desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <HarmoniaLogo size="md" />
            <div className="flex items-center space-x-2">
              {getStatusIcon(project.status)}
              <span className="text-sm font-medium text-gray-700">
                {getStatusText(project.status)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Project Info */}
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-green-800">{project.title}</h1>
            <p className="text-green-600">Cliente: {project.clientName}</p>
            {project.expirationDate && (
              <p className="text-sm text-gray-500">
                Acesso válido até: {project.expirationDate}
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Versions List */}
        {project.versions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-800">Versões Disponíveis</h2>
            {project.versions.map((version) => (
              <Card key={version.id} className={version.recommended ? 'ring-2 ring-green-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">{version.name}</h3>
                      {version.recommended && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Recomendada
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{version.dateAdded}</span>
                  </div>
                  {version.description && (
                    <p className="text-gray-600 text-sm">{version.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Audio Player */}
                  {version.audioUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <audio controls className="w-full">
                        <source src={version.audioUrl} type="audio/mpeg" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>
                    </div>
                  )}
                  
                  {/* Version Actions */}
                  {project.status === 'waiting' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleApprove(version.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprovar Esta Versão
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma versão disponível</h3>
                <p className="text-gray-600">As versões do projeto ainda não foram adicionadas.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Section */}
        {project.status !== 'approved' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-green-800">Enviar Feedback</h2>
              <p className="text-green-600">Compartilhe suas impressões sobre as versões apresentadas</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Suas observações</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Descreva suas impressões, sugestões ou pedidos de ajustes..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Enviar Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Current Feedback */}
        {project.feedback && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-green-800">Feedback Atual</h2>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">{project.feedback}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-green-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <HarmoniaLogo size="sm" className="mx-auto mb-2" />
            <p>© 2024 harmonIA - Produção Musical Inteligente</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientPreview;
