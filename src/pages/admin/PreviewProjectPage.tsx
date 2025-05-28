
import React from 'react';
import { useParams } from 'react-router-dom';
import NewAdminLayout from '@/components/admin/layout/NewAdminLayout';
import { usePreviewProject } from '@/hooks/usePreviewProject';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Music } from 'lucide-react';

const PreviewProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projectData, isLoading } = usePreviewProject(projectId);

  if (isLoading) {
    return (
      <NewAdminLayout>
        <div className="p-6 flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-harmonia-green" />
          <span className="ml-2">Carregando projeto...</span>
        </div>
      </NewAdminLayout>
    );
  }

  if (!projectData) {
    return (
      <NewAdminLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
              <p className="text-gray-600">O projeto solicitado não foi encontrado.</p>
            </CardContent>
          </Card>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{projectData.projectTitle}</h1>
          <p className="text-gray-600">Cliente: {projectData.clientName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Prévias do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                {projectData.previews.length > 0 ? (
                  <div className="space-y-4">
                    {projectData.previews.map((preview) => (
                      <div key={preview.id} className="border rounded-lg p-4">
                        <h4 className="font-semibold">{preview.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{preview.description}</p>
                        {preview.audioUrl && (
                          <audio controls className="w-full">
                            <source src={preview.audioUrl} type="audio/mpeg" />
                            Seu navegador não suporta o elemento de áudio.
                          </audio>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Nenhuma prévia disponível ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="capitalize">{projectData.status}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Pacote</label>
                  <p className="capitalize">{projectData.packageType || 'Não especificado'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Criado em</label>
                  <p>{projectData.createdAt ? new Date(projectData.createdAt).toLocaleDateString('pt-BR') : 'Não especificado'}</p>
                </div>
                
                {projectData.expiresAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Expira em</label>
                    <p>{new Date(projectData.expiresAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {projectData.feedbackHistory && projectData.feedbackHistory.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Histórico de Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectData.feedbackHistory.map((feedback) => (
                      <div key={feedback.id} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm">{feedback.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(feedback.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </NewAdminLayout>
  );
};

export default PreviewProjectPage;
