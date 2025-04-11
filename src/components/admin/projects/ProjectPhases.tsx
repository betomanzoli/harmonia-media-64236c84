
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clipboard, Music, Send, CheckCircle2, Settings } from 'lucide-react';

export interface ProjectPhasesProps {
  projectId?: string;
  projectType?: string;
  currentPhase?: string;
}

const ProjectPhases: React.FC<ProjectPhasesProps> = ({ 
  projectId = 'exemplo',
  projectType = 'Música Personalizada',
  currentPhase = 'Produção'
}) => {
  const phases = [
    { id: "briefing", name: "Briefing", icon: <Clipboard />, color: "bg-blue-500" },
    { id: "composicao", name: "Composição", icon: <Music />, color: "bg-purple-500" },
    { id: "producao", name: "Produção", icon: <Settings />, color: "bg-amber-500" },
    { id: "entrega", name: "Entrega", icon: <Send />, color: "bg-green-500" },
    { id: "aprovacao", name: "Aprovação", icon: <CheckCircle2 />, color: "bg-emerald-500" }
  ];

  // Encontrar a fase atual no array
  const currentIndex = phases.findIndex(phase => phase.id === currentPhase.toLowerCase());
  
  return (
    <Card className="border-harmonia-green/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Fases do Projeto</span>
          <span className="text-sm text-muted-foreground">ID: {projectId}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">{projectType}</p>
        
        <div className="relative">
          {/* Linha de conexão */}
          <div className="absolute top-6 left-6 w-[calc(100%-48px)] h-0.5 bg-muted z-0"></div>
          
          {/* Fases do projeto */}
          <div className="flex justify-between relative z-10">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex flex-col items-center">
                <motion.div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 
                    ${index <= currentIndex ? phase.color : 'bg-muted'}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: index === currentIndex ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {phase.icon}
                </motion.div>
                <span className={`text-xs font-medium ${index === currentIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {phase.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectPhases;
