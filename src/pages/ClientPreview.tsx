
// src/pages/ClientPreview.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';
import PublicLayout from '@/layouts/PublicLayout';
// Use the hook that supports private links
import { useClientPreview, ClientPreviewVersion } from '@/hooks/useClientPreview_with_private_link'; 
import { ThumbsUp, Send, Loader2, AlertCircle, CheckCircle, Info, ExternalLink, Music } from 'lucide-react';

const ClientPreview: React.FC = () => {
  const { previewCode } = useParams<{ previewCode: string }>();
  const { toast } = useToast();
  const {
    previewData,
    isLoading,
    error,
    isAuthenticated,
    isAuthenticating,
    authError,
    authenticateClient,
    submitFeedback,
    approveVersion
  } = useClientPreview(previewCode);

  const [clientEmailInput, setClientEmailInput] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select recommended or first version
  useEffect(() => {
    if (isAuthenticated && previewData && previewData.versions.length > 0 && !selectedVersionId) {
      const recommendedVersion = previewData.versions.find(v => v.recommended);
      setSelectedVersionId(recommendedVersion?.id || previewData.versions[0].id);
    }
  }, [isAuthenticated, previewData, selectedVersionId]);

  const handleAuthentication = async () => {
    if (!clientEmailInput.trim()) {
      toast({ title: "Email necessário", description: "Por favor, insira seu email.", variant: "destructive" });
      return;
    }
    await authenticateClient(clientEmailInput);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedVersionId) {
      toast({ title: "Seleção necessária", description: "Selecione uma versão para enviar feedback.", variant: "destructive" });
      return;
    }
    if (!feedbackText.trim()) {
      toast({ title: "Feedback necessário", description: "Escreva seu feedback antes de enviar.", variant: "destructive" });
      return;
    }

    const selectedVersion = previewData?.versions.find(v => v.id === selectedVersionId);
    if (!selectedVersion) return;

    setIsSubmitting(true);
    const result = await submitFeedback(feedbackText, selectedVersionId, selectedVersion.name);
    setIsSubmitting(false);

    if (result.success) {
      toast({ title: "Feedback enviado!", description: "Obrigado! Seu feedback foi registrado." });
      setFeedbackText('');
    } else {
      toast({ title: "Erro ao enviar", description: result.error || "Não foi possível enviar seu feedback.", variant: "destructive" });
    }
  };

  const handleApproveVersion = async () => {
    if (!selectedVersionId) {
      toast({ title: "Seleção necessária", description: "Selecione a versão que deseja aprovar.", variant: "destructive" });
      return;
    }

    const selectedVersion = previewData?.versions.find(v => v.id === selectedVersionId);
    if (!selectedVersion) return;

    setIsSubmitting(true);
    const result = await approveVersion(selectedVersionId, selectedVersion.name);
    setIsSubmitting(false);

    if (result.success) {
      toast({ title: "Versão Aprovada!", description: `A versão "${selectedVersion.name}" foi marcada como aprovada.` });
    } else {
      toast({ title: "Erro ao aprovar", description: result.error || "Não foi possível aprovar a versão.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'waiting': return <Badge className="bg-yellow-500 text-white">Aguardando Avaliação</Badge>;
      case 'feedback': return <Badge className="bg-blue-500 text-white">Feedback Recebido</Badge>;
      case 'approved': return <Badge className="bg-harmonia-green text-white">Aprovado</Badge>;
      default: return <Badge variant="secondary">Indefinido</Badge>;
    }
  };

  const handleOpenPrivateLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=1000,height=700');
  };

  // --- Render Logic ---

  if (isLoading && !previewData) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-harmonia-green mx-auto mb-4" />
            <p className="text-harmonia-gray-medium">Carregando prévia...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <Card className="max-w-md mx-auto shadow-lg border-red-200">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <CardTitle className="text-red-700 flex items-center">
                <AlertCircle className="mr-2"/> Erro ao Carregar
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-harmonia-gray-dark">{error}</p>
              <p className="text-sm text-harmonia-gray-medium mt-4">Verifique o link ou entre em contato.</p>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  if (!previewData) {
     return (
       <PublicLayout>
         <div className="min-h-[60vh] flex items-center justify-center">
           <p>Não foi possível carregar os dados.</p>
         </div>
       </PublicLayout>
     );
  }

  // --- Authenticated View ---
  const renderAuthenticatedContent = () => {
    const selectedVersionData = previewData?.versions.find(v => v.id === selectedVersionId);
    const isSelectedVersionPrivate = !!selectedVersionData?.bandcamp_private_url;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Messages */}
        {previewData.status === 'approved' && (
          <Card className="mb-8 border-harmonia-green bg-green-50">
            <CardContent className="py-6">
              <div className="flex items-center text-green-800">
                <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-lg">Projeto Aprovado!</span>
                  {previewData.approved_version_id && (
                     <p className="text-sm mt-1">Versão "{previewData.versions.find(v => v.id === previewData.approved_version_id)?.name || 'ID: '+previewData.approved_version_id}" foi selecionada. Em breve você receberá os arquivos finais.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {previewData.status === 'feedback' && (
          <Card className="mb-8 border-blue-300 bg-blue-50">
            <CardContent className="py-6">
              <div className="flex items-center text-blue-800">
                <Info className="h-6 w-6 mr-3 flex-shrink-0" />
                <span className="font-semibold">Feedback recebido! Nossa equipe está analisando suas sugestões.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Versions List */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-harmonia-dark mb-2">Versões Disponíveis</h2>
            <p className="text-harmonia-gray-medium">{previewData.versions.length} {previewData.versions.length === 1 ? 'versão' : 'versões'} para sua avaliação</p>
          </div>
          
          {isLoading && <p className="text-sm text-harmonia-gray-medium flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin mr-2"/> Carregando versões...</p>}
          {previewData.versions.length === 0 && !isLoading ? (
            <Card className="border-harmonia-gray-light">
              <CardContent className="text-center py-12">
                <Music className="h-16 w-16 mx-auto mb-4 text-harmonia-gray-light" />
                <p className="text-harmonia-gray-medium text-lg">Nenhuma versão disponível no momento.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {previewData.versions.map((version) => {
                const isPrivate = !!version.bandcamp_private_url;
                const isSelected = selectedVersionId === version.id;

                return (
                  <Card
                    key={version.id}
                    className={`cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-lg ${
                      isSelected
                        ? 'ring-2 ring-harmonia-green border-harmonia-green shadow-lg'
                        : 'hover:border-harmonia-light-green'
                    } ${version.recommended ? 'border-yellow-400 hover:border-yellow-500' : 'border-harmonia-gray-light'}`}
                    onClick={() => setSelectedVersionId(version.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-harmonia-dark flex items-center gap-3 flex-wrap">
                            {version.name}
                            {isSelected && (
                              <Badge className="bg-harmonia-green text-white text-xs">Selecionada</Badge>
                            )}
                            {isPrivate && (
                               <Badge variant="outline" className="text-xs border-harmonia-gray-medium text-harmonia-gray-medium">Link Privado</Badge>
                            )}
                          </CardTitle>
                          {version.description && (
                            <p className="text-harmonia-gray-medium mt-2 break-words">{version.description}</p>
                          )}
                          <p className="text-xs text-harmonia-gray-light mt-2">Adicionada em: {new Date(version.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        {version.recommended && (
                          <Badge className="bg-yellow-500 text-white text-xs whitespace-nowrap">⭐ Recomendada</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Player ou Botão de Link Privado */}
                      {isPrivate ? (
                        <div className="p-6 bg-gradient-to-br from-harmonia-green/10 to-harmonia-light-green/20 rounded-lg border border-harmonia-light-green flex flex-col items-center justify-center text-center min-h-[120px]">
                          <Music className="w-8 h-8 text-harmonia-green mb-3" />
                          <p className="text-harmonia-dark font-medium mb-4">Esta versão usa um link privado. Clique abaixo para ouvir no Bandcamp.</p>
                          <Button 
                            onClick={(e) => { 
                              e.stopPropagation();
                              handleOpenPrivateLink(version.bandcamp_private_url!)
                            }}
                            className="bg-harmonia-green hover:bg-harmonia-green/90 text-white"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir Link Privado
                          </Button>
                        </div>
                      ) : (version.embed_url || version.audio_url) ? (
                        <div className="mb-3 bg-harmonia-light p-3 rounded-lg">
                          <BandcampEmbedPlayer
                            embedUrl={version.embed_url || version.audio_url!} 
                            title={version.name}
                            fallbackUrl={version.original_bandcamp_url || version.audio_url}
                            className="w-full h-32 md:h-28"
                          />
                        </div>
                      ) : (
                         <div className="p-6 bg-harmonia-light rounded-lg text-center border border-harmonia-gray-light">
                           <p className="text-harmonia-gray-medium font-medium">⚠️ Nenhuma URL de áudio encontrada.</p>
                         </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Feedback/Approval Section */}
        {previewData.versions.length > 0 && previewData.status !== 'approved' && (
          <Card className="mt-12 shadow-lg border-harmonia-gray-light">
            <CardHeader className="bg-gradient-to-r from-harmonia-green/5 to-harmonia-light-green/10 border-b border-harmonia-gray-light">
              <CardTitle className="text-2xl text-harmonia-dark">Sua Avaliação</CardTitle>
              <CardDescription className="text-harmonia-gray-medium">
                Selecione uma versão acima e envie seu feedback ou aprove-a diretamente.
                {selectedVersionId && ` Versão selecionada: "${previewData.versions.find(v=>v.id === selectedVersionId)?.name}"`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              {/* Instrução para Link Privado */}
              {isSelectedVersionPrivate && (
                <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-start gap-3">
                  <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-semibold">Importante:</span> Como esta versão usa um link privado com múltiplas faixas, por favor, mencione o <span className="font-semibold">nome da faixa específica</span> que você está avaliando ou aprovando no campo de feedback abaixo.
                  </span>
                </div>
              )}
              <Textarea
                placeholder={isSelectedVersionPrivate 
                  ? "Escreva seu feedback sobre a versão selecionada (não esqueça de mencionar a faixa específica)..." 
                  : "Escreva seu feedback sobre a versão selecionada..."
                }
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
                disabled={isSubmitting || !selectedVersionId}
                className="border-harmonia-gray-light focus:border-harmonia-green focus:ring-harmonia-green/20"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting || !selectedVersionId || !feedbackText.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar Feedback da Versão Selecionada
                </Button>
                <Button
                  onClick={handleApproveVersion}
                  disabled={isSubmitting || !selectedVersionId}
                  className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90 text-white py-3"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ThumbsUp className="h-4 w-4 mr-2" />}
                  Aprovar Versão Selecionada
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // --- Render Main Structure ---
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-harmonia-light via-white to-harmonia-light min-h-screen">
        {/* Header Card */} 
        <div className="bg-gradient-to-r from-harmonia-dark to-harmonia-gray-dark text-white">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{previewData.title}</h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg">
                <span className="flex items-center gap-2">
                  <span className="text-harmonia-light-green">Cliente:</span> 
                  {previewData.clientName}
                </span>
                {previewData.packageType && (
                  <span className="flex items-center gap-2">
                    <span className="text-harmonia-light-green">Pacote:</span> 
                    {previewData.packageType}
                  </span>
                )}
                {getStatusBadge(previewData.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Gate */} 
        {!isAuthenticated ? (
          <div className="container mx-auto px-4 py-12 max-w-md">
            <Card className="shadow-xl border-harmonia-gray-light">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-harmonia-dark">Verificação de Acesso</CardTitle>
                <CardDescription className="text-harmonia-gray-medium">Para visualizar as versões, por favor, confirme seu email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  type="email"
                  placeholder="Digite o email associado a este projeto"
                  value={clientEmailInput}
                  onChange={(e) => setClientEmailInput(e.target.value)}
                  disabled={isAuthenticating}
                  className="border-harmonia-gray-light focus:border-harmonia-green focus:ring-harmonia-green/20 py-3"
                />
                {authError && (
                  <p className="text-sm text-red-600 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-2"/> {authError}
                  </p>
                )}
                <Button 
                  onClick={handleAuthentication} 
                  disabled={isAuthenticating || !clientEmailInput.trim()}
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white py-3"
                >
                  {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verificar Email e Acessar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          renderAuthenticatedContent()
        )}

        {/* Footer */} 
        <div className="bg-harmonia-dark text-center py-8 text-harmonia-light border-t border-harmonia-gray-medium">
          <div className="container mx-auto px-4">
            <p className="mb-2">
              {previewData.expirationDate
                ? `Esta prévia expira em: ${previewData.expirationDate}`
                : 'Prévia sem data de expiração definida.'}
            </p>
            <p className="text-harmonia-gray-light text-sm">
              harmonIA.media &copy; {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ClientPreview;
