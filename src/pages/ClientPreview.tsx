
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientPreview } from '@/hooks/useClientPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Music, CheckCircle, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    project,
    previewData,
    isLoading,
    error,
    isAuthenticated,
    authError,
    authenticateClient,
    submitFeedback,
    approveVersion
  } = useClientPreview(previewCode || '');

  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authenticateClient(email);
    if (success) {
      toast({
        title: "Autenticado com sucesso!",
        description: "Agora você pode visualizar e dar feedback sobre o projeto.",
      });
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma versão antes de enviar feedback.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const success = await submitFeedback(feedback, email);
    
    if (success) {
      toast({
        title: "Feedback enviado!",
        description: "Seu feedback foi enviado com sucesso. Nossa equipe irá analisar e retornar em breve.",
      });
      setFeedback('');
    } else {
      toast({
        title: "Erro ao enviar feedback",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const handleApproveVersion = async () => {
    if (!selectedVersion) {
      toast({
        title: "Selecione uma versão",
        description: "Por favor, selecione uma versão antes de aprovar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const success = await approveVersion(selectedVersion, email);
    
    if (success) {
      toast({
        title: "Versão aprovada!",
        description: "Parabéns! Sua música foi aprovada e seguirá para a finalização.",
      });
    } else {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar a versão. Tente novamente.",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-harmonia-green mx-auto mb-4" />
            <p className="text-gray-600">Carregando preview do projeto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Preview não encontrado</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate('/')}>
                Voltar à página inicial
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-20 px-6 md:px-10 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Acesso ao Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuthenticate} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu email cadastrado"
                    required
                  />
                  {authError && (
                    <p className="text-sm text-red-600 mt-1">{authError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Acessar Preview
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Project Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{previewData?.title}</CardTitle>
                  <p className="text-gray-600">Cliente: {previewData?.clientName}</p>
                  <p className="text-sm text-gray-500">Pacote: {previewData?.packageType}</p>
                </div>
                <div className="text-right">
                  <Badge variant={
                    previewData?.status === 'approved' ? 'default' : 
                    previewData?.status === 'feedback' ? 'secondary' : 'outline'
                  }>
                    {previewData?.status === 'waiting' && <Clock className="h-3 w-3 mr-1" />}
                    {previewData?.status === 'feedback' && <MessageSquare className="h-3 w-3 mr-1" />}
                    {previewData?.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {previewData?.status === 'waiting' ? 'Aguardando' : 
                     previewData?.status === 'feedback' ? 'Feedback' : 'Aprovado'}
                  </Badge>
                  {previewData?.expirationDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Expira em: {previewData.expirationDate}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Versions List */}
          <Card>
            <CardHeader>
              <CardTitle>Versões Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {previewData?.versions.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Nenhuma versão disponível ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {previewData?.versions.map((version) => (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedVersion === version.id ? 'border-harmonia-green bg-green-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedVersion(version.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{version.name}</h4>
                          {version.description && (
                            <p className="text-sm text-gray-600">{version.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {version.recommended && (
                            <Badge variant="secondary">Recomendada</Badge>
                          )}
                          <span className="text-xs text-gray-500">{version.dateAdded}</span>
                        </div>
                      </div>
                      
                      {version.audioUrl && (
                        <audio controls className="w-full mt-2">
                          <source src={version.audioUrl} type="audio/mpeg" />
                          Seu navegador não suporta o elemento de áudio.
                        </audio>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Section */}
          {previewData?.status !== 'approved' && previewData?.versions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Seu Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Comentários e Sugestões</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Compartilhe suas impressões sobre a música, sugestões de mudanças, ou confirme se está satisfeito com o resultado..."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={!selectedVersion || isSubmitting}
                    variant="outline"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Enviar Feedback
                  </Button>
                  
                  <Button
                    onClick={handleApproveVersion}
                    disabled={!selectedVersion || isSubmitting}
                    className="bg-harmonia-green hover:bg-harmonia-green/90"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Aprovar Versão
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approved Message */}
          {previewData?.status === 'approved' && (
            <Card className="border-green-500 bg-green-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Projeto Aprovado!
                </h3>
                <p className="text-green-700">
                  Parabéns! Sua música foi aprovada e agora seguirá para a etapa de finalização. 
                  Você receberá o arquivo final em breve.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Previous Feedback */}
          {previewData?.feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Feedback Anterior</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{previewData.feedback}</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientPreview;
