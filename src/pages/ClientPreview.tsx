import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Music, Clock, Mail } from 'lucide-react';
import { useClientPreview } from '@/hooks/useClientPreview';
import HarmoniaLogo from '@/components/ui/HarmoniaLogo';

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  const {
    project,
    isLoading,
    isAuthenticated,
    authError,
    authenticateClient,
    submitFeedback,
    approveVersion
  } = useClientPreview(previewCode || '');

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      authenticateClient(email.trim());
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      const success = await submitFeedback(feedback.trim(), email);
      if (success) {
        setFeedback('');
        setShowFeedbackForm(false);
      }
    }
  };

  const handleApproveVersion = async (versionId: string) => {
    await approveVersion(versionId, email);
  };

  // Tela de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white">Carregando prévia...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Tela de autenticação
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
        <div className="container mx-auto px-4 py-8">
          {/* Logo e cabeçalho */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <HarmoniaLogo size="lg" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Prévia Musical</h1>
            <p className="text-gray-300">Acesse suas prévias musicais de forma segura</p>
          </div>

          {/* Formulário de autenticação */}
          <div className="max-w-md mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Verificação de Acesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuthentication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email cadastrado no projeto
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                      required
                    />
                  </div>
                  
                  {authError && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-md p-3">
                      <p className="text-red-200 text-sm">{authError}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Acessar Prévias
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    Use o email cadastrado no seu projeto para acessar as prévias musicais.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal com as prévias
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <HarmoniaLogo size="lg" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{project?.title}</h1>
          <p className="text-gray-300">Olá, {project?.clientName}! Aqui estão suas prévias musicais.</p>
        </div>

        {/* Status do projeto */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-3 h-5 w-5 text-gray-300" />
                  <span className="text-white font-medium">Status do Projeto:</span>
                </div>
                <Badge 
                  className={
                    project?.status === 'approved' ? 'bg-green-500' :
                    project?.status === 'feedback' ? 'bg-yellow-500' : 'bg-blue-500'
                  }
                >
                  {project?.status === 'approved' ? 'Aprovado' :
                   project?.status === 'feedback' ? 'Feedback Enviado' : 'Aguardando Avaliação'}
                </Badge>
              </div>
              {project?.expirationDate && (
                <p className="text-gray-300 text-sm mt-2">
                  Prazo para avaliação: {project.expirationDate}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Versões musicais */}
        <div className="max-w-4xl mx-auto space-y-6">
          {project?.versions.map((version, index) => (
            <Card key={version.id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Music className="mr-2 h-5 w-5" />
                    {version.name}
                    {version.recommended && (
                      <Badge className="ml-2 bg-yellow-500">Recomendada</Badge>
                    )}
                    {version.final && (
                      <Badge className="ml-2 bg-green-500">Final</Badge>
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{version.description}</p>
                <p className="text-gray-400 text-sm mb-4">Adicionado em: {version.dateAdded}</p>
                
                {/* Player de áudio ou link */}
                {version.audioUrl && (
                  <div className="mb-4 p-4 bg-white/5 rounded-lg">
                    {version.fileId ? (
                      <div className="text-center">
                        <p className="text-gray-300 mb-2">Arquivo hospedado no Google Drive</p>
                        <Button
                          onClick={() => window.open(`https://drive.google.com/file/d/${version.fileId}/view`, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Ouvir no Google Drive
                        </Button>
                      </div>
                    ) : (
                      <audio controls className="w-full">
                        <source src={version.audioUrl} type="audio/mpeg" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>
                    )}
                  </div>
                )}
                
                {/* Ações para versões */}
                {project?.status !== 'approved' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveVersion(version.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Aprovar Esta Versão
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Área de feedback */}
          {project?.status !== 'approved' && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project?.feedback ? (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Seu feedback anterior:</h4>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-gray-300">{project.feedback}</p>
                    </div>
                  </div>
                ) : null}
                
                {!showFeedbackForm ? (
                  <Button
                    onClick={() => setShowFeedbackForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Feedback
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-4">
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Compartilhe seus comentários, sugestões ou solicitações de ajustes..."
                      className="bg-white/20 border-white/30 text-white placeholder-gray-300 min-h-[120px]"
                      required
                    />
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Enviar Feedback
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setShowFeedbackForm(false)}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* Mensagem de aprovação */}
          {project?.status === 'approved' && (
            <Card className="bg-green-500/20 border-green-500/30">
              <CardContent className="p-6 text-center">
                <div className="text-green-300 mb-2">
                  <ThumbsUp className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-xl font-bold">Projeto Aprovado!</h3>
                </div>
                <p className="text-green-200">
                  Parabéns! Seu projeto foi aprovado e está sendo finalizado. 
                  Em breve você receberá os arquivos finais.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPreview;
