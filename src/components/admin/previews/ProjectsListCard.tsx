
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import ProjectsTable from './ProjectsTable';
import { ProjectItem } from '@/hooks/admin/usePreviewProjects';
import { AlertCircle } from 'lucide-react';

interface ProjectsListCardProps {
  projects: ProjectItem[];
}

const ProjectsListCard: React.FC<ProjectsListCardProps> = ({ projects }) => {
  // Calcular estatísticas básicas
  const waitingCount = projects.filter(p => p.status === 'waiting').length;
  const feedbackCount = projects.filter(p => p.status === 'feedback').length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;
  
  // Verificar se há projetos próximos da expiração (menos de 2 dias)
  const today = new Date();
  const nearExpiration = projects.filter(p => {
    if (p.status !== 'waiting') return false;
    const expParts = p.expirationDate.split('/');
    const expDate = new Date(
      parseInt(expParts[2]), 
      parseInt(expParts[1]) - 1, 
      parseInt(expParts[0])
    );
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  });

  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle>Projetos de Prévias</CardTitle>
        <CardDescription>
          Lista de projetos ativos para avaliação dos clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum projeto de prévia criado ainda.</p>
            <p className="text-sm mt-2">Clique em "Novo Projeto" para começar.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <h3 className="text-lg font-medium text-yellow-800">Aguardando</h3>
                <p className="text-3xl font-bold text-yellow-700">{waitingCount}</p>
                <p className="text-sm text-yellow-600 mt-1">Projetos aguardando avaliação</p>
              </Card>
              
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-medium text-blue-800">Com Feedback</h3>
                <p className="text-3xl font-bold text-blue-700">{feedbackCount}</p>
                <p className="text-sm text-blue-600 mt-1">Projetos com feedback para revisar</p>
              </Card>
              
              <Card className="p-4 bg-green-50 border-green-200">
                <h3 className="text-lg font-medium text-green-800">Aprovados</h3>
                <p className="text-3xl font-bold text-green-700">{approvedCount}</p>
                <p className="text-sm text-green-600 mt-1">Projetos aprovados pelos clientes</p>
              </Card>
            </div>
            
            {nearExpiration.length > 0 && (
              <div className="flex items-start gap-3 p-4 mb-6 border border-amber-300 bg-amber-50 rounded-lg">
                <AlertCircle className="text-amber-500 w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800">Atenção aos prazos</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    {nearExpiration.length === 1 ? 
                      `1 projeto está próximo da expiração (${nearExpiration[0].id} - ${nearExpiration[0].clientName}).` :
                      `${nearExpiration.length} projetos estão próximos da expiração.`
                    }
                  </p>
                  <p className="text-sm text-amber-600 mt-1">
                    Considere enviar um lembrete ao(s) cliente(s).
                  </p>
                </div>
              </div>
            )}
            
            <ProjectsTable projects={projects} />
          </>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500 border-t pt-4">
        <p>
          Os projetos ficam disponíveis para avaliação até a data de expiração.
          Após esse prazo, os links não funcionarão mais.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProjectsListCard;
