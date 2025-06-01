
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';
import { useClientPreview } from '@/hooks/useClientPreview';
import { Heart, MessageCircle, ThumbsUp, ThumbsDown, Send, Loader2 } from 'lucide-react';

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const { toast } = useToast();
  const { previewData, isLoading, error, submitFeedback, approveVersion } = useClientPreview(previewCode || '');
  
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [clientEmail, setClientEmail] = useState('');

  useEffect(() => {
    if (previewData && previewData.versions.length > 0) {
      // Selecionar a primeira versão recomendada ou a primeira disponível
      const recommendedVersion = previewData.versions.find(v => v.recommended);
      setSelectedVersion(recommendedVersion?.id || previewData.versions[0].id);
    }
  }, [previewData]);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback necessário",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    if (!clientEmail.trim()) {
      toast({
        title: "Email necessário",
        description: "Por favor, informe seu email.",
        variant: "destructive"
      });
      return;
    }

    setSubmittingFeedback(true);
    
    try {
      const success = await submitFeedback(feedback, clientEmail);
      if (success) {
        toast({
          title: "Feedback enviado!",
          description: "Seu feedback foi enviado com sucesso. Nossa equipe analisará suas sugestões."
        });
        setFeedback('');
      } else {
        toast({
          title: "Erro ao enviar feedback",
          description: "Não foi possível enviar seu feedback. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar feedback",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleApproveVersion = async () => {
    if (!selectedVersion) {
      toast({
        title: "Versão não selecionada",
        description: "Por favor, selecione uma versão antes de aprovar.",
        variant: "destructive"
      });
      return;
    }

    if (!clientEmail.trim()) {
      toast({
        title: "Email necessário",
        description: "Por favor, informe seu email.",
        variant: "destructive"
      });
      return;
    }

    setSubmittingFeedback(true);
    
    try {
      const success = await approveVersion(selectedVersion, clientEmail);
      if (success) {
        toast({
          title: "Versão aprovada!",
          description: "Sua aprovação foi registrada. Em breve você receberá os arquivos finais."
        });
      } else {
        toast({
          title: "Erro ao aprovar",
          description: "Não foi possível registrar sua aprovação. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando Avaliação</Badge>;
      case 'feedback':
        return <Badge className="bg-blue-100 text-blue-800">Feedback Recebido</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      default:
        return <Badge variant="secondary">Status Desconhecido</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando preview...</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
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

  const selectedVersionData = previewData.versions.find(v => v.id === selectedVersion);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">{previewData.title}</CardTitle>
                <p className="text-gray-600 mt-1">Cliente: {previewData.clientName}</p>
                <p className="text-sm text-gray-500 mt-1">Pacote: {previewData.packageType}</p>
              </div>
              {getStatusBadge(previewData.status)}
            </div>
          </CardHeader>
        </Card>

        {/* Status Messages */}
        {previewData.status === 'approved' && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="py-4">
              <div className="flex items-center text-green-800">
                <ThumbsUp className="h-5 w-5 mr-2" />
                <span className="font-medium">Projeto aprovado! Em breve você receberá os arquivos finais.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {previewData.status === 'feedback' && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="flex items-center text-blue-800">
                <MessageCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Feedback recebido! Nossa equipe está trabalhando nas modificações.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Input */}
        {!clientEmail && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informe seu email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Seu email para identificação"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={() => toast({ title: "Email confirmado!" })}>
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Versions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Versões Disponíveis ({previewData.versions.length})</h2>
          
          {previewData.versions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhuma versão disponível ainda.</p>
                <p className="text-sm text-gray-400 mt-2">As versões aparecerão aqui quando estiverem prontas.</p>
              </CardContent>
            </Card>
          ) : (
            previewData.versions.map((version) => (
              <Card 
                key={version.id} 
                className={`cursor-pointer transition-all ${
                  selectedVersion === version.id 
                    ? 'ring-2 ring-blue-500 border-blue-200' 
                    : 'hover:border-gray-300'
                } ${version.recommended ? 'border-yellow-400' : ''}`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {version.name}
                        {selectedVersion === version.id && (
                          <Badge className="bg-blue-100 text-blue-800">Selecionada</Badge>
                        )}
                      </CardTitle>
                      {version.description && (
                        <p className="text-gray-600 mt-1">{version.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Adicionada em: {version.dateAdded}</p>
                    </div>
                    {version.recommended && (
                      <Badge className="bg-yellow-100 text-yellow-800">Recomendada</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Bandcamp Player */}
                  {version.bandcampUrl && (
                    <div className="mb-4">
                      <BandcampEmbedPlayer
                        embedUrl={version.bandcampUrl}
                        title={version.name}
                        fallbackUrl={version.bandcampUrl}
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Feedback Section */}
        {previewData.versions.length > 0 && clientEmail && previewData.status !== 'approved' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Avaliação da Versão</CardTitle>
              {selectedVersionData && (
                <p className="text-sm text-gray-600">
                  Versão selecionada: {selectedVersionData.name}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Escreva seu feedback sobre a versão selecionada..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
              
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback || !selectedVersion}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {submittingFeedback ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Enviar Feedback
                </Button>
                
                <Button
                  onClick={handleApproveVersion}
                  disabled={submittingFeedback || !selectedVersion}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {submittingFeedback ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsUp className="h-4 w-4" />
                  )}
                  Aprovar Versão
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="text-center py-6">
            <p className="text-sm text-gray-500">
              {previewData.expirationDate 
                ? `Este preview expira em: ${previewData.expirationDate}`
                : 'Preview sem data de expiração'
              }
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
