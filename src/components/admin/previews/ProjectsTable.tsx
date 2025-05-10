
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Project {
  id: string;
  clientName: string;
  packageType: string;
  projectType: string;
  dateAdded: string;
  status: string;
  expirationDate: string;
  versions: number;
}

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const navigate = useNavigate();

  const handleViewProject = (projectId: string) => {
    navigate(`/admin-j28s7d1k/previews/${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/admin-j28s7d1k/previews/edit/${projectId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-card shadow rounded-md">
        <thead>
          <tr className="bg-muted text-muted-foreground text-xs">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Cliente</th>
            <th className="py-3 px-4 text-left">Tipo</th>
            <th className="py-3 px-4 text-left">Pacote</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Adicionado</th>
            <th className="py-3 px-4 text-left">Expira</th>
            <th className="py-3 px-4 text-left">Versões</th>
            <th className="py-3 px-4 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr 
              key={project.id} 
              className="border-t border-border hover:bg-muted/50 transition-colors"
            >
              <td className="py-2 px-4">{project.id}</td>
              <td className="py-2 px-4">{project.clientName}</td>
              <td className="py-2 px-4">{project.projectType}</td>
              <td className="py-2 px-4">{project.packageType}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' : 
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </td>
              <td className="py-2 px-4">{formatDate(project.dateAdded)}</td>
              <td className="py-2 px-4">{formatDate(project.expirationDate)}</td>
              <td className="py-2 px-4">{project.versions}</td>
              <td className="py-2 px-4 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleViewProject(project.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleEditProject(project.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
