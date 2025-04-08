
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Lock, Music, MessageSquare, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProjectPhase {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete' | 'locked';
  icon: React.ReactNode;
  actions: {
    primary?: {
      label: string;
      href?: string;
      onClick?: () => void;
      disabled?: boolean;
    };
    secondary?: {
      label: string;
      href?: string;
      onClick?: () => void;
      disabled?: boolean;
    };
  };
  artifacts?: {
    id: string;
    name: string;
    type: 'preview' | 'document' | 'audio';
    uploadDate: string;
    downloadable: boolean;
  }[];
}

interface ProjectPhasesProps {
  projectId: string;
  projectType: 'Essencial' | 'Profissional' | 'Premium';
  currentPhase: number;
  onPhaseAction?: (phaseId: string, action: 'upload' | 'notify' | 'complete') => void;
}

const ProjectPhases: React.FC<ProjectPhasesProps> = ({
  projectId,
  projectType,
  currentPhase,
  onPhaseAction
}) => {
  // Define phases based on project type
  const getPhases = (): ProjectPhase[] => {
    const basePhases: ProjectPhase[] = [
      {
        id: 'briefing',
        title: 'Briefing e Análise',
        description: 'Coleta e análise de requisitos do cliente',
        status: currentPhase >= 1 ? 'complete' : 'active',
        icon: <FileText className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Ver Briefing',
            href: `/admin-j28s7d1k/briefings/${projectId}`
          },
          secondary: {
            label: 'Adicionar Nota',
            onClick: () => console.log('Adding note')
          }
        },
        artifacts: [
          {
            id: 'brief-doc',
            name: 'Documento de Briefing',
            type: 'document',
            uploadDate: '05/04/2025',
            downloadable: true
          }
        ]
      },
      {
        id: 'composition',
        title: 'Composição',
        description: 'Criação da estrutura musical e harmonia base',
        status: currentPhase >= 2 ? 'complete' : currentPhase === 1 ? 'active' : 'locked',
        icon: <Music className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Adicionar Rascunho',
            onClick: () => onPhaseAction?.('composition', 'upload'),
            disabled: currentPhase < 1
          }
        }
      },
      {
        id: 'previews',
        title: 'Prévias',
        description: 'Criação e compartilhamento de versões prévias para aprovação',
        status: currentPhase >= 3 ? 'complete' : currentPhase === 2 ? 'active' : 'locked',
        icon: <Upload className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Gerenciar Prévias',
            href: `/admin-j28s7d1k/previews?project=${projectId}`
          },
          secondary: {
            label: 'Notificar Cliente',
            onClick: () => onPhaseAction?.('previews', 'notify'),
            disabled: currentPhase < 2
          }
        }
      },
      {
        id: 'feedback',
        title: 'Avaliação e Feedback',
        description: 'Recebimento e implementação de ajustes solicitados pelo cliente',
        status: currentPhase >= 4 ? 'complete' : currentPhase === 3 ? 'active' : 'locked',
        icon: <MessageSquare className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Ver Feedback',
            onClick: () => console.log('View feedback'),
            disabled: currentPhase < 3
          }
        }
      },
      {
        id: 'finalization',
        title: 'Finalização',
        description: 'Mixagem, masterização e finalização do produto',
        status: currentPhase >= 5 ? 'complete' : currentPhase === 4 ? 'active' : 'locked',
        icon: <CheckCircle className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Enviar para Aprovação Final',
            onClick: () => onPhaseAction?.('finalization', 'complete'),
            disabled: currentPhase < 4
          }
        }
      },
      {
        id: 'delivery',
        title: 'Entrega',
        description: 'Entrega dos arquivos finais e conclusão do projeto',
        status: currentPhase >= 6 ? 'complete' : currentPhase === 5 ? 'active' : 'locked',
        icon: <Music className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Marcar como Entregue',
            onClick: () => onPhaseAction?.('delivery', 'complete'),
            disabled: currentPhase < 5
          },
          secondary: {
            label: 'Gerar Links de Download',
            onClick: () => console.log('Generate download links'),
            disabled: currentPhase < 5
          }
        },
        artifacts: currentPhase >= 5 ? [
          {
            id: 'final-music',
            name: 'Música Final (WAV)',
            type: 'audio',
            uploadDate: '20/04/2025',
            downloadable: true
          },
          {
            id: 'final-stems',
            name: 'Stems Individuais (ZIP)',
            type: 'audio',
            uploadDate: '20/04/2025',
            downloadable: true
          }
        ] : []
      }
    ];

    // Add professional and premium specific phases
    if (projectType === 'Profissional' || projectType === 'Premium') {
      basePhases.splice(2, 0, {
        id: 'concept-development',
        title: 'Desenvolvimento de Conceito',
        description: 'Definição do conceito sonoro e estilo musical',
        status: currentPhase >= 2 ? 'complete' : currentPhase === 1 ? 'active' : 'locked',
        icon: <FileText className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Adicionar Conceito',
            onClick: () => onPhaseAction?.('concept-development', 'upload'),
            disabled: currentPhase < 1
          }
        }
      });
    }

    // Add premium specific phases
    if (projectType === 'Premium') {
      basePhases.splice(4, 0, {
        id: 'arrangement',
        title: 'Arranjo Musical',
        description: 'Desenvolvimento de arranjos musicais detalhados',
        status: currentPhase >= 4 ? 'complete' : currentPhase === 3 ? 'active' : 'locked',
        icon: <Music className="w-5 h-5" />,
        actions: {
          primary: {
            label: 'Adicionar Arranjo',
            onClick: () => onPhaseAction?.('arrangement', 'upload'),
            disabled: currentPhase < 3
          }
        }
      });
    }

    return basePhases;
  };

  const phases = getPhases();

  const getStatusBadgeProps = (status: ProjectPhase['status']) => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, className: 'bg-harmonia-green' };
      case 'complete':
        return { variant: 'outline' as const, className: 'text-green-700 border-green-200 bg-green-50' };
      case 'locked':
        return { variant: 'outline' as const, className: 'text-gray-500' };
      default:
        return { variant: 'secondary' as const };
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Fases do Projeto</span>
          <Badge variant="outline" className="text-gray-600 bg-gray-100">
            Pacote {projectType}
          </Badge>
        </CardTitle>
        <CardDescription>
          Gerenciamento de fases do projeto #{projectId}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Fases</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="pt-4 space-y-4">
            {phases.map((phase) => (
              <Card key={phase.id} className={`border ${phase.status === 'active' ? 'border-harmonia-green ring-1 ring-harmonia-green/20' : ''}`}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${phase.status === 'active' ? 'bg-harmonia-green text-white' : phase.status === 'complete' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {phase.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium">
                          {phase.title}
                          {phase.status === 'locked' && (
                            <Lock className="inline-block ml-2 w-3 h-3 text-gray-400" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs">{phase.description}</CardDescription>
                      </div>
                    </div>
                    <Badge {...getStatusBadgeProps(phase.status)}>
                      {phase.status === 'active' ? 'Em Andamento' : 
                       phase.status === 'complete' ? 'Concluída' : 
                       phase.status === 'locked' ? 'Bloqueada' : 'Pendente'}
                    </Badge>
                  </div>
                </CardHeader>
                
                {phase.artifacts && phase.artifacts.length > 0 && (
                  <CardContent className="p-4 pt-0">
                    <h4 className="text-sm font-medium mb-2">Arquivos Disponíveis</h4>
                    <div className="space-y-1">
                      {phase.artifacts.map((artifact) => (
                        <div 
                          key={artifact.id} 
                          className="flex items-center justify-between p-2 text-sm rounded bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            {artifact.type === 'audio' ? (
                              <Music className="w-4 h-4 text-harmonia-green" />
                            ) : artifact.type === 'document' ? (
                              <FileText className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Upload className="w-4 h-4 text-amber-500" />
                            )}
                            <span>{artifact.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-3">{artifact.uploadDate}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 px-2"
                                    disabled={!artifact.downloadable}
                                  >
                                    {artifact.downloadable ? (
                                      <Download className="w-4 h-4" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-gray-400" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {artifact.downloadable 
                                    ? 'Fazer download' 
                                    : 'Download disponível apenas na fase final'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
                
                <CardFooter className="p-4 pt-2 flex flex-wrap gap-2">
                  {phase.actions.primary && (
                    phase.actions.primary.href ? (
                      <Link to={phase.actions.primary.href}>
                        <Button 
                          size="sm" 
                          disabled={phase.actions.primary.disabled || phase.status === 'locked'}
                          className={phase.status === 'active' ? 'bg-harmonia-green hover:bg-harmonia-green/90' : ''}
                        >
                          {phase.actions.primary.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={phase.actions.primary.onClick}
                        disabled={phase.actions.primary.disabled || phase.status === 'locked'}
                        className={phase.status === 'active' ? 'bg-harmonia-green hover:bg-harmonia-green/90' : ''}
                      >
                        {phase.actions.primary.label}
                      </Button>
                    )
                  )}
                  
                  {phase.actions.secondary && (
                    phase.actions.secondary.href ? (
                      <Link to={phase.actions.secondary.href}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={phase.actions.secondary.disabled || phase.status === 'locked'}
                        >
                          {phase.actions.secondary.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={phase.actions.secondary.onClick}
                        disabled={phase.actions.secondary.disabled || phase.status === 'locked'}
                      >
                        {phase.actions.secondary.label}
                      </Button>
                    )
                  )}
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="timeline" className="pt-4">
            <div className="space-y-4">
              {phases.map((phase, idx) => (
                <div key={phase.id} className="flex relative">
                  {idx < phases.length - 1 && (
                    <div className={`absolute top-6 left-3 w-0.5 h-full 
                      ${phase.status === 'complete' ? 'bg-green-500' : 'bg-gray-200'}`} 
                    />
                  )}
                  <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full 
                    ${phase.status === 'complete' ? 'bg-green-500 text-white' :
                      phase.status === 'active' ? 'bg-harmonia-green text-white' :
                      'bg-gray-200 text-gray-500'}`}
                  >
                    {idx + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className={`font-medium flex items-center gap-2
                      ${phase.status === 'active' ? 'text-harmonia-green' : 
                        phase.status === 'complete' ? 'text-green-600' : 
                        'text-gray-500'}`}
                    >
                      {phase.title}
                      {phase.status === 'locked' && <Lock className="w-3 h-3" />}
                      {phase.status === 'active' && (
                        <Badge variant="outline" className="ml-2 bg-harmonia-green/10 text-harmonia-green border-harmonia-green/30">
                          Atual
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{phase.description}</p>
                    
                    {phase.status === 'active' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {phase.actions.primary && (
                          phase.actions.primary.href ? (
                            <Link to={phase.actions.primary.href}>
                              <Button 
                                size="sm" 
                                className="bg-harmonia-green hover:bg-harmonia-green/90"
                              >
                                {phase.actions.primary.label}
                              </Button>
                            </Link>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={phase.actions.primary.onClick}
                              className="bg-harmonia-green hover:bg-harmonia-green/90"
                            >
                              {phase.actions.primary.label}
                            </Button>
                          )
                        )}
                        
                        {phase.actions.secondary && (
                          phase.actions.secondary.href ? (
                            <Link to={phase.actions.secondary.href}>
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                {phase.actions.secondary.label}
                              </Button>
                            </Link>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={phase.actions.secondary.onClick}
                            >
                              {phase.actions.secondary.label}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectPhases;

// Missing import fix
function Download(props: any) {
  return <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
}
