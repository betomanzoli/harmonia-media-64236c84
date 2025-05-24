
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { briefingStorage } from '@/utils/briefingStorage';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, CheckCircle } from 'lucide-react';

const ContractPremium: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [briefingData, setBriefingData] = useState(null);

  const briefingId = searchParams.get('briefing');

  useEffect(() => {
    if (!briefingId) {
      toast({
        title: "Erro",
        description: "ID do briefing não encontrado. Redirecionando...",
        variant: "destructive"
      });
      navigate('/briefing');
      return;
    }

    const data = briefingStorage.getBriefingData(briefingId);
    if (!data) {
      toast({
        title: "Dados não encontrados",
        description: "Dados do briefing não encontrados. Redirecionando...",
        variant: "destructive"
      });
      navigate('/briefing');
      return;
    }

    setBriefingData(data);

    if (data.contractAccepted) {
      setAccepted(true);
    }
  }, [briefingId, navigate, toast]);

  const handleAccept = async () => {
    if (!briefingId || !accepted) return;

    setIsLoading(true);

    try {
      briefingStorage.updateBriefingData(briefingId, {
        contractAccepted: true
      });

      localStorage.setItem(`contract_${briefingId}`, 'accepted');

      toast({
        title: "Contrato aceito",
        description: "Redirecionando para pagamento...",
      });

      navigate(`/pagamento/premium?briefing=${briefingId}`);
      
    } catch (error) {
      console.error('Erro ao aceitar contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar aceite. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="h-16 w-16 text-harmonia-green mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Contrato de Prestação de Serviços
            </h1>
            <h2 className="text-xl text-harmonia-green font-semibold">
              Pacote Premium
            </h2>
            <p className="text-gray-600 mt-2">
              Por favor, leia atentamente os termos antes de prosseguir
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-harmonia-green" />
                Resumo do Pacote Premium
              </CardTitle>
              <CardDescription>
                Confira os detalhes do seu projeto e os serviços incluídos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Informações do Projeto</h3>
                  <p><strong>Cliente:</strong> {briefingData.clientName}</p>
                  <p><strong>Email:</strong> {briefingData.email}</p>
                  <p><strong>Descrição:</strong> {briefingData.projectDescription}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Serviços Incluídos</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• 1 música personalizada (duração ilimitada)</li>
                    <li>• Revisões ilimitadas*</li>
                    <li>• Entrega completa: MP3, WAV, STEMS e MIDI</li>
                    <li>• Prazo de 3-5 dias úteis</li>
                    <li>• Licença comercial completa</li>
                    <li>• Consultoria musical dedicada</li>
                    <li>• Produção exclusiva com compositor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Termos e Condições</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 rounded-md border p-4">
                <div className="space-y-4 text-sm">
                  <h4 className="font-semibold">1. OBJETO DO CONTRATO</h4>
                  <p>
                    A HarmonIA se compromete a criar uma música personalizada conforme especificações 
                    do briefing fornecido pelo contratante, incluindo todos os serviços premium descritos.
                  </p>

                  <h4 className="font-semibold">2. PRAZO DE ENTREGA</h4>
                  <p>
                    O prazo para entrega da música personalizada é de 3 a 5 dias úteis, contados a partir 
                    da confirmação do pagamento e aprovação final do briefing detalhado.
                  </p>

                  <h4 className="font-semibold">3. REVISÕES</h4>
                  <p>
                    Revisões ilimitadas dentro do prazo de 30 dias após a primeira entrega. 
                    *Limitadas a alterações razoáveis que não alterem completamente o conceito original.
                  </p>

                  <h4 className="font-semibold">4. DIREITOS AUTORAIS E LICENCIAMENTO</h4>
                  <p>
                    Licença comercial completa concedida ao contratante, incluindo uso irrestrito em 
                    mídias sociais, publicidade, eventos, streaming e distribuição comercial.
                  </p>

                  <h4 className="font-semibold">5. PAGAMENTO</h4>
                  <p>
                    O pagamento deve ser realizado integralmente antes do início da produção. 
                    Valor: R$ 997,00 (novecentos e noventa e sete reais).
                  </p>

                  <h4 className="font-semibold">6. ARQUIVOS ENTREGUES</h4>
                  <p>
                    Entrega completa incluindo: Master em WAV e MP3, STEMS individuais de todos os 
                    instrumentos, arquivo MIDI para flexibilidade total e possíveis adaptações.
                  </p>

                  <h4 className="font-semibold">7. PRODUÇÃO EXCLUSIVA</h4>
                  <p>
                    Sessão dedicada com compositor profissional, incluindo reuniões de alinhamento, 
                    acompanhamento em tempo real e consultoria musical especializada.
                  </p>

                  <h4 className="font-semibold">8. GARANTIA PREMIUM</h4>
                  <p>
                    Garantia de satisfação total ou refund parcial. Suporte técnico por 90 dias 
                    para questões relacionadas aos arquivos entregues.
                  </p>

                  <h4 className="font-semibold">9. EXCLUSIVIDADE</h4>
                  <p>
                    A música criada será única e exclusiva para o contratante. Não será revendida 
                    ou reutilizada para outros clientes.
                  </p>

                  <h4 className="font-semibold">10. POLÍTICA DE CANCELAMENTO</h4>
                  <p>
                    Cancelamentos podem ser solicitados em até 48 horas após o pagamento, com reembolso integral. 
                    Após início da produção, reembolso proporcional conforme andamento.
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2 mb-6">
                <Checkbox 
                  id="accept-contract" 
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(!!checked)}
                />
                <Label 
                  htmlFor="accept-contract"
                  className="text-sm leading-tight cursor-pointer"
                >
                  Li e aceito todos os termos e condições deste contrato de prestação de serviços. 
                  Concordo com os prazos, valores e políticas descritas acima.
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/briefing')}
                  className="flex-1"
                >
                  Voltar ao Briefing
                </Button>
                <Button 
                  onClick={handleAccept}
                  disabled={!accepted || isLoading}
                  className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Aceitar e Prosseguir para Pagamento'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContractPremium;
