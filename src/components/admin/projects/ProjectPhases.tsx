
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Music, 
  Headphones, 
  ThumbsUp, 
  Package, 
  Check, 
  Upload, 
  MessageSquare
} from 'lucide-react';

export interface ProjectPhasesProps {
  projectId: string;
  projectType: string;
  currentPhase: string;
  onPhaseAction?: (phaseId: string, action: 'upload' | 'notify' | 'complete') => void;
}

const ProjectPhases: React.FC<ProjectPhasesProps> = ({ 
  projectId, 
  projectType, 
  currentPhase,
  onPhaseAction
}) => {
  // Define as fases do projeto
  const phases = [
    { id: 'briefing', name: 'Briefing', icon: ClipboardList },
    { id: 'composicao', name: 'Composição', icon: Music },
    { id: 'producao', name: 'Produção', icon: Headphones },
    { id: 'aprovacao', name: 'Aprovação', icon: ThumbsUp },
    { id: 'entrega', name: 'Entrega Final', icon: Package }
  ];

  // Encontrar o índice da fase atual
  const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);

  // Função para determinar o status da fase
  const getPhaseStatus = (index: number) => {
    if (index < currentPhaseIndex) return 'completed';
    if (index === currentPhaseIndex) return 'current';
    return 'upcoming';
  };

  const handleAction = (phaseId: string, action: 'upload' | 'notify' | 'complete') => {
    if (onPhaseAction) {
      onPhaseAction(phaseId, action);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fases do Projeto: {projectType}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Linha de progresso conectando as fases */}
          <div className="absolute left-7 top-8 h-full w-0.5 bg-gray-200 -z-10" />
          
          {/* Lista de fases */}
          <div className="space-y-8">
            {phases.map((phase, index) => {
              const status = getPhaseStatus(index);
              const Icon = phase.icon;
              
              return (
                <div key={phase.id} className="relative">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-14 w-14 rounded-full flex items-center justify-center mr-4 
                      ${status === 'completed' ? 'bg-green-100 text-green-600' : 
                        status === 'current' ? 'bg-harmonia-green text-white' : 
                        'bg-gray-100 text-gray-400'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        status === 'completed' ? 'text-green-600' : 
                        status === 'current' ? 'text-harmonia-green' : 
                        'text-gray-400'
                      }`}>
                        {phase.name}
                        {status === 'completed' && <Check className="inline ml-2 h-4 w-4" />}
                      </h3>
                      
                      {status === 'current' && (
                        <div className="mt-2 space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => handleAction(phase.id, 'upload')}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => handleAction(phase.id, 'notify')}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Notificar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs bg-green-50 text-green-600 hover:bg-green-100"
                            onClick={() => handleAction(phase.id, 'complete')}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Completar
                          </Button>
                        </div>
                      )}
                      
                      {status === 'completed' && (
                        <p className="text-sm text-green-600">Fase concluída</p>
                      )}
                      
                      {status === 'upcoming' && (
                        <p className="text-sm text-gray-400">Aguardando fases anteriores</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectPhases;
