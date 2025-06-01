import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClientPreview } from '@/hooks/useClientPreview_fixed'; // <-- Use o hook corrigido
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Send, ThumbsUp, Lock } from 'lucide-react';
import BandcampEmbedPlayer from '@/components/previews/BandcampEmbedPlayer_fixed'; // <-- Use o player corrigido
import PublicHeader from '@/components/layout/PublicHeader'; // <-- Importar Header (ajuste o caminho)
import PublicFooter from '@/components/layout/PublicFooter'; // <-- Importar Footer (ajuste o caminho)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ClientPreviewPage: React.FC = () => {
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
    approveProject,
    reloadPreviewData
  } = useClientPreview(previewCode);

  const [clientEmailInput, setClientEmailInput] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticateClient(clientEmailInput);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast({ title: "Feedback Vazio", description: "Por favor, escreva seu feedback.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const result = await submitFeedback(feedbackText);
    if (result.success) {
      toast({ title: "Feedback Enviado!", description: "Obrigado! Seu feedback foi registrado." });
      setFeedbackText(''); // Limpa o campo
    } else {
      toast({ title: "Erro ao Enviar", description: result.error || "Não foi possível enviar o feedback.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleApproveProject = async () => {
    setIsSubmitting(true);
    const result = await approveProject();
    if (result.success) {
      toast({ title: "Projeto Aprovado!", description: "Obrigado! Sua aprovação foi registrada." });
    } else {
      toast({ title: "Erro ao Aprovar", description: result.error || "Não foi possível aprovar o projeto.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting': return <Badge className="bg-yellow-100 text-yellow-800">Aguardando Avaliação</Badge>;
      case 'feedback': return <Badge className="bg-blue-100 text-blue-800">Feedback Recebido</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // --- Renderização --- 

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-harmonia-green mx-auto mb-4" />
            <p className="text-gray-600">Carregando prévia...</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-grow flex items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Erro ao Carregar</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-gray-700">{error}</p>
              <Button variant="link" onClick={reloadPreviewData} className="mt-4">Tentar novamente</Button>
            </CardContent>
          </Card>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // --- Tela de Autenticação (se não autenticado) --- 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <Card className="max-w-md w-full shadow-lg">
            <CardHeader className="text-center">
              <Lock className="h-8 w-8 mx-auto text-harmonia-green mb-2" />
              <CardTitle>Acesso Restrito</CardTitle>
              <CardDescription>Para visualizar esta prévia, por favor, confirme seu email.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuthentication} className="space-y-4">
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">Seu Email</label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="Digite o email associado a este projeto"
                    value={clientEmailInput}
                    onChange={(e) => setClientEmailInput(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                {authError && (
                  <p className="text-sm text-red-600 text-center">{authError}</p>
                )}
                <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90" disabled={isAuthenticating}>
                  {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {isAuthenticating ? 'Verificando...' : 'Acessar Prévia'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // --- Conteúdo da Prévia (se autenticado) --- 
  if (!previewData) {
     // Caso raro, mas para segurança
     return <div>Erro inesperado: Dados da prévia não disponíveis após autenticação.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <main className="flex-grow container mx-auto py-8 px-4">
        {/* Informações do Projeto */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">{previewData.title}</CardTitle>
                <CardDescription className="mt-1">Cliente: {previewData.clientName}</CardDescription>
              </div>
              {getStatusBadge(previewData.status)}
            </div>
          </CardHeader>
        </Card>

        {/* Mensagens de Status */}
        {previewData.status === 'approved' && (
          <Card className="mb-6 border-green-300 bg-green-50 text-green-800">
            <CardContent className="p-4 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 flex-shrink-0" />
              <p className="font-medium">Este projeto foi aprovado! Entraremos em contato em breve com os arquivos finais.</p>
            </CardContent>
          </Card>
        )}
        {previewData.status === 'feedback' && (
          <Card className="mb-6 border-blue-300 bg-blue-50 text-blue-800">
            <CardContent className="p-4 flex items-center gap-2">
              <Send className="h-5 w-5 flex-shrink-0" />
              <p className="font-medium">Feedback recebido. Nossa equipe analisará suas sugestões.</p>
            </CardContent>
          </Card>
        )}

        {/* Abas: Versões e Feedback */}
        <Tabs defaultValue="versions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="versions">Versões Propostas ({previewData.versions.length})</TabsTrigger>
            <TabsTrigger value="feedback" disabled={previewData.status === 'approved'}>Enviar Feedback / Aprovar</TabsTrigger>
          </TabsList>

          {/* Conteúdo Aba Versões */}
          <TabsContent value="versions">
            <Card>
              <CardHeader>
                <CardTitle>Avaliação de Prévias Musicais</CardTitle>
                <CardDescription>Abaixo você encontrará as versões musicais para avaliação. Ouça cada uma delas e escolha sua favorita ou envie um feedback para ajustes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {previewData.versions.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Nenhuma versão disponível no momento.</p>
                ) : (
                  previewData.versions.map((version) => (
                    <div key={version.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-gray-800">{version.name}</h3>
                        {version.recommended && <Badge className="bg-yellow-100 text-yellow-800">Recomendada</Badge>}
                      </div>
                      {version.description && <p className="text-sm text-gray-600 mb-3">{version.description}</p>}
                      <BandcampEmbedPlayer
                        embedUrl={version.embed_url} // <-- Passa a embed_url
                        title={version.name}
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conteúdo Aba Feedback */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Seu Feedback ou Aprovação</CardTitle>
                <CardDescription>Use o espaço abaixo para detalhar os ajustes desejados ou aprove o projeto se estiver satisfeito.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Escreva aqui suas observações, sugestões ou pedidos de ajustes..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  disabled={isSubmitting || previewData.status === 'approved'}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting || !feedbackText.trim() || previewData.status === 'approved'}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Enviar Feedback
                  </Button>
                  <Button
                    onClick={handleApproveProject}
                    disabled={isSubmitting || previewData.status === 'approved'}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ThumbsUp className="h-4 w-4 mr-2" />}
                    Aprovar Projeto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Próximos Passos (Exemplo) */}
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
                <p>1. Avalie as versões disponíveis e ouça a que mais lhe agrada.</p>
                <p>2. Envie seu feedback detalhado ou aprove o projeto diretamente.</p>
                <p>3. Compartilhe suas impressões ou solicite ajustes, se necessário.</p>
            </CardContent>
        </Card>

      </main>
      <PublicFooter />
    </div>
  );
};

export default ClientPreviewPage;

