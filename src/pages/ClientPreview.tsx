// src/pages/ClientPreview_v3.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input'; // Use Input from shadcn
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer';
import { useClientPreview, ClientPreviewVersion } from '@/hooks/useClientPreview'; // <-- Fixed import path
import { ThumbsUp, Send, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';

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
  } = useClientPreview(previewCode); // <-- Use the corrected hook

  const [clientEmailInput, setClientEmailInput] = useState('');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select recommended or first version when data loads *after* authentication
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
    // Error/Success messages are handled by the hook's state (authError, isAuthenticated)
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
    if (!selectedVersion) return; // Should not happen if selectedVersionId is set

    setIsSubmitting(true);
    const result = await submitFeedback(feedbackText, selectedVersionId, selectedVersion.name);
    setIsSubmitting(false);

    if (result.success) {
      toast({ title: "Feedback enviado!", description: "Obrigado! Seu feedback foi registrado." });
      setFeedbackText(''); // Clear textarea
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
      case 'waiting': return <Badge className="bg-yellow-100 text-yellow-800">Aguardando Avaliação</Badge>;
      case 'feedback': return <Badge className="bg-blue-100 text-blue-800">Feedback Recebido</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      default: return <Badge variant="secondary">Indefinido</Badge>;
    }
  };

  // --- Render Logic ---

  if (isLoading && !previewData) { // Show initial loading only before project data is fetched
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando prévia...</p>
        </div>
      </div>
    );
  }

  if (error) { // Show general errors (invalid code, expired, etc.)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-700 flex items-center"><AlertCircle className="mr-2"/> Erro ao Carregar</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-gray-700">{error}</p>
            <p className="text-sm text-gray-500 mt-4">Verifique o link ou entre em contato.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!previewData) { // Should not happen if error is not set, but good fallback
     return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Não foi possível carregar os dados.</p></div>;
  }

  // --- Authenticated View ---
  const renderAuthenticatedContent = () => (
    <>
      {/* Status Messages */}
      {previewData.status === 'approved' && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-center text-green-800">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <div>
                <span className="font-medium">Projeto Aprovado!</span>
                {previewData.approved_version_id && (
                   <p className="text-sm">Versão "{previewData.versions.find(v => v.id === previewData.approved_version_id)?.name || 'ID: '+previewData.approved_version_id}" foi selecionada. Em breve você receberá os arquivos finais.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Versions List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Versões Disponíveis ({previewData.versions.length})</h2>
        {isLoading && <p className="text-sm text-gray-500 flex items-center"><Loader2 className="h-4 w-4 animate-spin mr-2"/> Carregando versões...</p>}
        {previewData.versions.length === 0 && !isLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma versão disponível no momento.</p>
            </CardContent>
          </Card>
        ) : (
          previewData.versions.map((version) => (
            <Card
              key={version.id}
              className={`cursor-pointer transition-all overflow-hidden ${
                selectedVersionId === version.id
                  ? 'ring-2 ring-blue-500 border-blue-300'
                  : 'hover:border-gray-300'
              } ${version.recommended ? 'border-yellow-400 hover:border-yellow-500' : ''}`}
              onClick={() => setSelectedVersionId(version.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {version.name}
                      {selectedVersionId === version.id && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">Selecionada</Badge>
                      )}
                    </CardTitle>
                    {version.description && (
                      <p className="text-gray-600 mt-1 text-sm">{version.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Adicionada em: {new Date(version.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {version.recommended && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs whitespace-nowrap">Recomendada</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Bandcamp Player - Ensure consistent size via className or style */} 
                {(version.embed_url || version.audio_url) && (
                  <div className="mb-2 bg-gray-100 p-2 rounded">
                    <BandcampEmbedPlayer
                      embedUrl={version.embed_url || version.audio_url!} // Use embed_url first
                      title={version.name}
                      fallbackUrl={version.original_bandcamp_url || version.audio_url} // Provide fallback
                      className="w-full h-32 md:h-28" // **Standardized Height**
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Feedback/Approval Section (only if versions exist and not already approved) */} 
      {previewData.versions.length > 0 && previewData.status !== 'approved' && (
        <Card className="mt-8 shadow-sm">
          <CardHeader>
            <CardTitle>Sua Avaliação</CardTitle>
            <CardDescription>
              Selecione uma versão acima e envie seu feedback ou aprove-a diretamente.
              {selectedVersionId && ` Versão selecionada: "${previewData.versions.find(v=>v.id === selectedVersionId)?.name}"`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Escreva seu feedback sobre a versão selecionada..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              disabled={isSubmitting || !selectedVersionId}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !selectedVersionId || !feedbackText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Enviar Feedback da Versão Selecionada
              </Button>
              <Button
                onClick={handleApproveVersion}
                disabled={isSubmitting || !selectedVersionId}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ThumbsUp className="h-4 w-4 mr-2" />}
                Aprovar Versão Selecionada
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );

  // --- Render Main Structure ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */} 
        <Card className="mb-6 shadow-md overflow-hidden">
          <CardHeader className="bg-white border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">{previewData.title}</CardTitle>
                <p className="text-gray-600 mt-1">Cliente: {previewData.clientName}</p>
                <p className="text-sm text-gray-500 mt-1">Pacote: {previewData.packageType || 'Não especificado'}</p>
              </div>
              {getStatusBadge(previewData.status)}
            </div>
          </CardHeader>
        </Card>

        {/* Authentication Gate */} 
        {!isAuthenticated ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Verificação de Acesso</CardTitle>
              <CardDescription>Para visualizar as versões, por favor, confirme seu email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Digite o email associado a este projeto"
                value={clientEmailInput}
                onChange={(e) => setClientEmailInput(e.target.value)}
                disabled={isAuthenticating}
              />
              {authError && (
                <p className="text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {authError}</p>
              )}
              <Button onClick={handleAuthentication} disabled={isAuthenticating || !clientEmailInput.trim()}>
                {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Verificar Email e Acessar
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Render main content only after authentication
          renderAuthenticatedContent()
        )}

        {/* Footer */} 
        <div className="text-center mt-10 text-sm text-gray-500">
          <p>
            {previewData.expirationDate
              ? `Esta prévia expira em: ${previewData.expirationDate}`
              : 'Prévia sem data de expiração definida.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            harmonIA.media &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientPreview;
