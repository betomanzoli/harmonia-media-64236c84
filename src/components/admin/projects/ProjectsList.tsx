
import React from 'react';

interface ProjectsListProps {
  onEditProject?: (projectId: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ onEditProject }) => {
  // Mock projects for demonstration
  const mockProjects = [
    { id: 'proj001', name: 'Música para Casamento', client: 'João Silva', status: 'Em andamento' },
    { id: 'proj002', name: 'Trilha para Vídeo', client: 'Maria Santos', status: 'Concluído' }
  ];

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Lista de Projetos</h2>
      <div className="space-y-2">
        {mockProjects.map(project => (
          <div key={project.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-gray-500">Cliente: {project.client}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.status}</span>
              <button 
                className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded"
                onClick={() => onEditProject && onEditProject(project.id)}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
