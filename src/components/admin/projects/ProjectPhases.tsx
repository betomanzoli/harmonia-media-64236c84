
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProjectPhasesProps {
  projectId: string;
  projectType: string;
  currentPhase: string;
  onPhaseAction: (phaseId: string, action: 'upload' | 'notify' | 'complete') => void;
}

const ProjectPhases: React.FC<ProjectPhasesProps> = ({
  projectId,
  projectType,
  currentPhase,
  onPhaseAction
}) => {
  // Mock phases data based on project type
  const phases = [
    { id: 'briefing', name: 'Briefing', status: 'completed' },
    { id: 'composition', name: 'Composição', status: currentPhase === 'composition' ? 'current' : 'pending' },
    { id: 'production', name: 'Produção', status: currentPhase === 'production' ? 'current' : 'pending' },
    { id: 'delivery', name: 'Entrega', status: currentPhase === 'delivery' ? 'current' : 'pending' }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Fases do Projeto</h3>
      
      <div className="space-y-2">
        {phases.map(phase => (
          <div 
            key={phase.id}
            className={`p-4 border rounded-md ${
              phase.status === 'current' ? 'border-blue-500 bg-blue-50' :
              phase.status === 'completed' ? 'border-green-500 bg-green-50' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{phase.name}</h4>
                <p className="text-sm text-gray-500">
                  {phase.status === 'current' ? 'Em andamento' : 
                   phase.status === 'completed' ? 'Concluído' : 'Pendente'}
                </p>
              </div>
              
              {phase.status === 'current' && (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onPhaseAction(phase.id, 'upload')}
                  >
                    Upload
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onPhaseAction(phase.id, 'notify')}
                  >
                    Notificar Cliente
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onPhaseAction(phase.id, 'complete')}
                  >
                    Concluir Fase
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPhases;
