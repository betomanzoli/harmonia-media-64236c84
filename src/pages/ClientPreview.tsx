
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
import Logo from '@/components/Logo';
// Use the hook that supports private links
import { useClientPreview, ClientPreviewVersion } from '@/hooks/useClientPreview'; 
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
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-harmonia-green mx-auto mb-4" />
            <p className="text-gray-300">Carregando prévia...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <Card className="max-w-md mx-auto shadow-2xl border-red-500/20 bg-gray-900">
            <CardHeader className="bg-red-900/20 border-b border-red-500/20">
              <CardTitle className="text-red-400 flex items-center">
                <AlertCircle className="mr-2"/> Erro ao Carregar
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-gray-300">{error}</p>
              <p className="text-sm text-gray-500 mt-4">Verifique o link ou entre em contato.</p>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  if (!previewData) {
     return (
       <PublicLayout>
         <div className="min-h-screen bg-black flex items-center justify-center">
           <p className="text-gray-300">Não foi possível carregar os dados.</p>
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
          <Card className="mb-8 border-harmonia-green bg-harmonia-green/10">
            <CardContent className="py-6">
              <div className="flex items-center text-harmonia-green">
                <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-lg">Projeto Aprovado!</span>
                  {previewData.approved_version_id && (
                     <p className="text-sm mt-1 text-gray-300">Versão "{previewData.versions.find(v => v.id === previewData.approved_version_id)?.name || 'ID: '+previewData.approved_version_id}" foi selecionada. Em breve você receberá os arquivos finais.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {previewData.status === 'feedback' && (
          <Card className="mb-8 border-blue-500/30 bg-blue-500/10">
            <CardContent className="py-6">
              <div className="flex items-center text-blue-400">
                <Info className="h-6 w-6 mr-3 flex-shrink-0" />
                <span className="font-semibold">Feedback recebido! Nossa equipe está analisando suas sugestões.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Versions List */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Versões Disponíveis</h2>
            <p className="text-gray-400">{previewData.versions.length} {previewData.versions.length === 1 ? 'versão' : 'versões'} para sua avaliação</p>
          </div>
          
          {isLoading && <p className="text-sm text-gray-400 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin mr-2"/> Carregando versões...</p>}
          {previewData.versions.length === 0 && !isLoading ? (
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="text-center py-12">
                <Music className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">Nenhuma versão disponível no momento.</p>
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
                    className={`cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-2xl bg-gray-900 ${
                      isSelected
                        ? 'ring-2 ring-harmonia-green border-harmonia-green shadow-2xl shadow-harmonia-green/20'
                        : 'hover:border-harmonia-green/50 border-gray-700'
                    } ${version.recommended ? 'border-yellow-500/50 hover:border-yellow-400' : ''}`}
                    onClick={() => setSelectedVersionId(version.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-white flex items-center gap-3 flex-wrap">
                            {version.name}
                            {isSelected && (
                              <Badge className="bg-harmonia-green text-black text-xs">Selecionada</Badge>
                            )}
                            {isPrivate && (
                               <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">Link Privado</Badge>
                            )}
                          </CardTitle>
                          {version.description && (
                            <p className="text-gray-400 mt-2 break-words">{version.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">Adicionada em: {new Date(version.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        {version.recommended && (
                          <Badge className="bg-yellow-500 text-black text-xs whitespace-nowrap">⭐ Recomendada</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Player ou Botão de Link Privado */}
                      {isPrivate ? (
                        <div className="p-6 bg-gradient-to-br from-harmonia-green/10 to-harmonia-green/5 rounded-lg border border-harmonia-green/20 flex flex-col items-center justify-center text-center min-h-[120px]">
                          <Music className="w-8 h-8 text-harmonia-green mb-3" />
                          <p className="text-white font-medium mb-4">Esta versão usa um link privado. Clique abaixo para ouvir no Bandcamp.</p>
                          <Button 
                            onClick={(e) => { 
                              e.stopPropagation();
                              handleOpenPrivateLink(version.bandcamp_private_url!)
                            }}
                            className="bg-harmonia-green hover:bg-harmonia-green/90 text-black font-semibold"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir Link Privado
                          </Button>
                        </div>
                      ) : (version.embed_url || version.audio_url) ? (
                        <div className="mb-3 bg-gray-800 p-3 rounded-lg">
                          <BandcampEmbedPlayer
                            embedUrl={version.embed_url || version.audio_url!} 
                            title={version.name}
                            fallbackUrl={version.original_bandcamp_url || version.audio_url}
                            className="w-full h-32 md:h-28"
                          />
                        </div>
                      ) : (
                         <div className="p-6 bg-gray-800 rounded-lg text-center border border-gray-700">
                           <p className="text-gray-400 font-medium">⚠️ Nenhuma URL de áudio encontrada.</p>
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
          <Card className="mt-12 shadow-2xl border-gray-700 bg-gray-900">
            <CardHeader className="bg-gradient-to-r from-harmonia-green/10 to-harmonia-green/5 border-b border-gray-700">
              <CardTitle className="text-2xl text-white">Sua Avaliação</CardTitle>
              <CardDescription className="text-gray-400">
                Selecione uma versão acima e envie seu feedback ou aprove-a diretamente.
                {selectedVersionId && ` Versão selecionada: "${previewData.versions.find(v=>v.id === selectedVersionId)?.name}"`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              {/* Instrução para Link Privado */}
              {isSelectedVersionPrivate && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400 flex items-start gap-3">
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
                className="border-gray-700 bg-gray-800 text-white focus:border-harmonia-green focus:ring-harmonia-green/20"
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
                  className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90 text-black font-semibold py-3"
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
      <div className="bg-black min-h-screen">
        {/* Header Card with Hero-style gradient */} 
        <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white relative overflow-hidden">
          {/* Background pattern similar to Hero */}
          <div className="absolute inset-0 bg-gradient-to-br from-harmonia-green/5 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(44,219,102,0.1),transparent_50%)]"></div>
          
          <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
            <div className="text-center space-y-6">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <Logo />
              </div>
              
              {/* Project title with gradient similar to Hero */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6">
                {previewData.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
                <span className="flex items-center gap-2">
                  <span className="text-harmonia-green font-semibold">Cliente:</span> 
                  <span className="text-gray-300">{previewData.clientName}</span>
                </span>
                {previewData.packageType && (
                  <span className="flex items-center gap-2">
                    <span className="text-harmonia-green font-semibold">Pacote:</span> 
                    <span className="text-gray-300">{previewData.packageType}</span>
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
            <Card className="shadow-2xl border-gray-700 bg-gray-900">
              <CardHeader className="text-center border-b border-gray-700">
                <CardTitle className="text-2xl text-white">Verificação de Acesso</CardTitle>
                <CardDescription className="text-gray-400">Para visualizar as versões, por favor, confirme seu email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <Input
                  type="email"
                  placeholder="Digite o email associado a este projeto"
                  value={clientEmailInput}
                  onChange={(e) => setClientEmailInput(e.target.value)}
                  disabled={isAuthenticating}
                  className="border-gray-700 bg-gray-800 text-white focus:border-harmonia-green focus:ring-harmonia-green/20 py-3"
                />
                {authError && (
                  <p className="text-sm text-red-400 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 mr-2"/> {authError}
                  </p>
                )}
                <Button 
                  onClick={handleAuthentication} 
                  disabled={isAuthenticating || !clientEmailInput.trim()}
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-black font-semibold py-3"
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

        {/* Footer similar to public site */} 
        <div className="bg-black border-t border-gray-800 text-center py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <p className="mb-4 text-gray-300">
              {previewData.expirationDate
                ? `Esta prévia expira em: ${previewData.expirationDate}`
                : 'Prévia sem data de expiração definida.'}
            </p>
            <p className="text-gray-500 text-sm">
              harmonIA.media &copy; {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ClientPreview;
