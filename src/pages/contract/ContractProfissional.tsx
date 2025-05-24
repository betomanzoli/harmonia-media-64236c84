
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

const ContractProfissional: React.FC = () => {
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

      navigate(`/pagamento/profissional?briefing=${briefingId}`);
      
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
              Pacote Profissional
            </h2>
            <p className="text-gray-600 mt-2">
              Por favor, leia atentamente os termos antes de prosseguir
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-harmonia-green" />
                Resumo do Pacote Profissional
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
                    <li>• 1 música personalizada (até 5 minutos)</li>
                    <li>• 3 revisões incluídas</li>
                    <li>• Entrega em MP3, WAV e STEMS</li>
                    <li>• Prazo de 5-7 dias úteis</li>
                    <li>• Licença para uso comercial básico</li>
                    <li>• Consultoria musical incluída</li>
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
                    do briefing fornecido pelo contratante, incluindo os serviços descritos no Pacote Profissional.
                  </p>

                  <h4 className="font-semibold">2. PRAZO DE ENTREGA</h4>
                  <p>
                    O prazo para entrega da música personalizada é de 5 a 7 dias úteis, contados a partir 
                    da confirmação do pagamento e aprovação final do briefing detalhado.
                  </p>

                  <h4 className="font-semibold">3. REVISÕES</h4>
                  <p>
                    Estão incluídas até 3 (três) revisões no valor do pacote. Revisões adicionais podem 
                    ser solicitadas mediante pagamento de taxa adicional.
                  </p>

                  <h4 className="font-semibold">4. DIREITOS AUTORAIS E LICENCIAMENTO</h4>
                  <p>
                    A música criada será de propriedade intelectual da HarmonIA, sendo concedida licença 
                    de uso comercial básico ao contratante, incluindo uso em mídias sociais, apresentações 
                    e eventos de pequeno porte.
                  </p>

                  <h4 className="font-semibold">5. PAGAMENTO</h4>
                  <p>
                    O pagamento deve ser realizado integralmente antes do início da produção. 
                    Valor: R$ 497,00 (quatrocentos e noventa e sete reais).
                  </p>

                  <h4 className="font-semibold">6. STEMS E ARQUIVOS</h4>
                  <p>
                    Serão fornecidos os stems (faixas separadas) da música, permitindo maior flexibilidade 
                    na utilização e possíveis adaptações futuras.
                  </p>

                  <h4 className="font-semibold">7. CONSULTORIA MUSICAL</h4>
                  <p>
                    Inclui sessão de consultoria para alinhamento musical antes da produção e 
                    acompanhamento durante o processo criativo.
                  </p>

                  <h4 className="font-semibold">8. POLÍTICA DE CANCELAMENTO</h4>
                  <p>
                    Cancelamentos podem ser solicitados em até 24 horas após o pagamento, com reembolso integral. 
                    Após o início da produção, não há reembolso.
                  </p>

                  <h4 className="font-semibold">9. GARANTIA</h4>
                  <p>
                    Garantimos a qualidade técnica da produção e satisfação do cliente. Em caso de 
                    insatisfação fundamentada, nos comprometemos a realizar ajustes necessários.
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

export default ContractProfissional;
