
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Step, StepsProvider, StepsNavigation, StepsContent } from '@/components/ui/steps';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectPhasesProps {
  projectId: string;
  projectType: string;
  currentPhase: string;
}

const ProjectPhases: React.FC<ProjectPhasesProps> = ({ 
  projectId, 
  projectType, 
  currentPhase 
}) => {
  const [activeStep, setActiveStep] = useState(
    currentPhase === 'briefing' ? 0 :
    currentPhase === 'composicao' ? 1 :
    currentPhase === 'producao' ? 2 :
    currentPhase === 'aprovacao' ? 3 :
    currentPhase === 'entrega' ? 4 : 0
  );
  const { toast } = useToast();

  const completeStep = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
      toast({
        title: "Fase concluída",
        description: "O projeto avançou para a próxima fase."
      });
    } else {
      toast({
        title: "Projeto finalizado",
        description: "Todas as fases do projeto foram concluídas."
      });
    }
  };

  const moveToPreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      toast({
        title: "Retornando fase",
        description: "O projeto retornou para a fase anterior."
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-medium mb-1">Fases do Projeto</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {projectId} - {projectType}
        </p>
        
        <StepsProvider initialStep={activeStep} onValueChange={setActiveStep}>
          <StepsNavigation>
            <Step value={0} title="Briefing" />
            <Step value={1} title="Composição" />
            <Step value={2} title="Produção" />
            <Step value={3} title="Aprovação" />
            <Step value={4} title="Entrega Final" />
          </StepsNavigation>
          
          <div className="mt-8">
            <StepsContent value={0}>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Fase de Briefing</h4>
                <p className="text-muted-foreground">
                  Nesta fase, coletamos todas as informações do cliente sobre o projeto musical.
                  Entendemos o objetivo, estilo, referências e sentimentos que a música deve transmitir.
                </p>
                <div className="border p-3 rounded-md bg-muted/30">
                  <span className="font-medium block mb-1">Próximas ações:</span>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Revisar formulário de briefing recebido</li>
                    <li>Preparar resumo criativo para a equipe</li>
                    <li>Agendar reunião com o cliente para alinhamento (se necessário)</li>
                  </ul>
                </div>
              </div>
            </StepsContent>
            
            <StepsContent value={1}>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Fase de Composição</h4>
                <p className="text-muted-foreground">
                  Com base no briefing, criamos as primeiras ideias musicais, incluindo melodia, harmonia 
                  e estrutura básica da música.
                </p>
                <div className="border p-3 rounded-md bg-muted/30">
                  <span className="font-medium block mb-1">Próximas ações:</span>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Desenvolver conceitos melódicos iniciais</li>
                    <li>Criar progressões harmônicas</li>
                    <li>Definir a estrutura básica da música</li>
                    <li>Preparar rascunhos para aprovação interna</li>
                  </ul>
                </div>
              </div>
            </StepsContent>
            
            <StepsContent value={2}>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Fase de Produção</h4>
                <p className="text-muted-foreground">
                  Após a aprovação do conceito musical, desenvolvemos a produção completa com arranjos,
                  instrumentação, gravações e mixagem inicial.
                </p>
                <div className="border p-3 rounded-md bg-muted/30">
                  <span className="font-medium block mb-1">Próximas ações:</span>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Gravar instrumentos e vozes</li>
                    <li>Desenvolver arranjos detalhados</li>
                    <li>Realizar a mixagem inicial</li>
                    <li>Preparar versões para avaliação do cliente</li>
                  </ul>
                </div>
              </div>
            </StepsContent>
            
            <StepsContent value={3}>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Fase de Aprovação</h4>
                <p className="text-muted-foreground">
                  As prévias musicais são enviadas ao cliente para avaliação e feedback. Realizamos ajustes
                  conforme solicitado até chegarmos à versão final aprovada.
                </p>
                <div className="border p-3 rounded-md bg-muted/30">
                  <span className="font-medium block mb-1">Próximas ações:</span>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Enviar links de prévia para o cliente</li>
                    <li>Acompanhar feedback recebido</li>
                    <li>Implementar ajustes solicitados</li>
                    <li>Obter aprovação final</li>
                  </ul>
                </div>
              </div>
            </StepsContent>
            
            <StepsContent value={4}>
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Fase de Entrega Final</h4>
                <p className="text-muted-foreground">
                  Com a aprovação do cliente, finalizamos a masterização da música e realizamos a entrega
                  dos arquivos finais no formato acordado no contrato.
                </p>
                <div className="border p-3 rounded-md bg-muted/30">
                  <span className="font-medium block mb-1">Próximas ações:</span>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Realizar masterização final</li>
                    <li>Preparar diferentes formatos de arquivo</li>
                    <li>Gerar versões para diferentes plataformas (se contratado)</li>
                    <li>Enviar pacote final ao cliente</li>
                    <li>Solicitar avaliação do serviço</li>
                  </ul>
                </div>
              </div>
            </StepsContent>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={moveToPreviousStep}
              disabled={activeStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Fase Anterior
            </Button>
            
            <Button 
              onClick={completeStep}
              disabled={activeStep === 4}
              className="bg-harmonia-green hover:bg-harmonia-green/90"
            >
              {activeStep === 4 ? 'Finalizado' : 'Concluir Fase'}
              {activeStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </StepsProvider>
      </div>
    </Card>
  );
};

export default ProjectPhases;
