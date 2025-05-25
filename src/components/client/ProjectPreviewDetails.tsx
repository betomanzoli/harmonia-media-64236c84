
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, FileText, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PreviewVersion {
  id: string;
  name: string;
  description?: string;
  audioUrl?: string;
  fileId?: string;
  recommended?: boolean;
  dateAdded?: string;
}

interface ProjectPreviewDetailsProps {
  projectId: string;
  clientEmail: string;
}

const ProjectPreviewDetails: React.FC<ProjectPreviewDetailsProps> = ({ 
  projectId, 
  clientEmail 
}) => {
  const [versions, setVersions] = useState<PreviewVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setIsLoading(true);

        // Load project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        setProject(projectData);

        // Load project versions with type safety
        const { data: versionsData, error: versionsError } = await supabase
          .from('project_versions')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (versionsError) throw versionsError;

        // Type-safe mapping
        const typedVersions: PreviewVersion[] = (versionsData || []).map((item: any) => ({
          id: item.id as string,
          name: item.name as string,
          description: item.description as string,
          audioUrl: item.audio_url as string,
          fileId: item.file_id as string,
          recommended: Boolean(item.recommended),
          dateAdded: item.created_at as string
        }));

        setVersions(typedVersions);
        
        // Log access
        await supabase
          .from('preview_access_logs')
          .insert([{
            email: clientEmail,
            project_id: projectId,
            accessed_at: new Date().toISOString()
          }]);

      } catch (error: any) {
        console.error('Error loading project details:', error);
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os detalhes do projeto",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectDetails();
  }, [projectId, clientEmail, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green"></div>
      </div>
    );
  }

  const recommendedVersion = versions.find(v => v.recommended);
  const otherVersions = versions.filter(v => !v.recommended);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-harmonia-green">
              {project?.title || 'Projeto Musical'}
            </h2>
            <Badge variant="outline" className="border-harmonia-green text-harmonia-green">
              {versions.length} {versions.length === 1 ? 'versão' : 'versões'}
            </Badge>
          </div>

          {project?.description && (
            <p className="text-gray-600 mb-4">{project.description}</p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Criado em {new Date(project?.created_at).toLocaleDateString('pt-BR')}
            </div>
            {project?.expires_at && (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Expira em {new Date(project.expires_at).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {recommendedVersion && (
        <Card className="border-harmonia-green/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-harmonia-green">
                Versão Recomendada
              </h3>
              <Badge className="bg-harmonia-green text-white">
                Recomendada
              </Badge>
            </div>
            <h4 className="font-medium mb-2">{recommendedVersion.name}</h4>
            {recommendedVersion.description && (
              <p className="text-gray-600 text-sm mb-4">{recommendedVersion.description}</p>
            )}
            {recommendedVersion.audioUrl && (
              <div className="flex items-center space-x-2">
                <Button size="sm" className="bg-harmonia-green hover:bg-harmonia-green/90">
                  <Music className="h-4 w-4 mr-2" />
                  Reproduzir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {otherVersions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Outras Versões</h3>
            <div className="space-y-4">
              {otherVersions.map((version) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{version.name}</h4>
                  {version.description && (
                    <p className="text-gray-600 text-sm mb-3">{version.description}</p>
                  )}
                  {version.audioUrl && (
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Music className="h-4 w-4 mr-2" />
                        Reproduzir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {versions.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma versão disponível
            </h3>
            <p className="text-gray-500">
              As versões do seu projeto estarão disponíveis aqui em breve.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectPreviewDetails;
