
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getProjectIdFromPreviewLink, isValidEncodedPreviewLink } from '@/utils/previewLinkUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePreviewData } from '@/hooks/usePreviewData';

const PreviewDebugPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [decodedId, setDecodedId] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState<boolean>(false);
  const [localStorageProjects, setLocalStorageProjects] = useState<any[]>([]);
  const [supabaseProjects, setSupabaseProjects] = useState<any[]>([]);
  const [supabaseFiles, setSupabaseFiles] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Use our hook to test both data sources
  const { projectData, isLoading, actualProjectId, getDataSourceInfo } = usePreviewData(projectId);
  
  useEffect(() => {
    addLog(`🔍 Página de depuração iniciada para projectId: ${projectId}`);
    
    // Check admin status
    const adminStatus = localStorage.getItem('admin_preview_access') === 'true';
    setIsAdmin(adminStatus);
    addLog(`👑 Status de administrador: ${adminStatus ? 'Ativo' : 'Inativo'}`);
    
    // If not admin, set admin status for debugging
    if (!adminStatus) {
      localStorage.setItem('admin_preview_access', 'true');
      addLog('👑 Status de administrador ativado para depuração');
    }
    
    // Check if encoded link
    const isEncoded = isValidEncodedPreviewLink(projectId || '');
    setIsValidLink(isEncoded);
    addLog(`🔒 Link codificado válido: ${isEncoded ? 'Sim' : 'Não'}`);
    
    if (isEncoded && projectId) {
      const decoded = getProjectIdFromPreviewLink(projectId);
      setDecodedId(decoded);
      addLog(`🔓 ID decodificado: ${decoded}`);
    } else {
      addLog('❌ Não foi possível decodificar o ID do projeto');
    }
    
    // Load localStorage projects
    const storedProjects = localStorage.getItem('harmonIA_preview_projects');
    if (storedProjects) {
      try {
        const projects = JSON.parse(storedProjects);
        setLocalStorageProjects(projects);
        addLog(`📦 Projetos no localStorage: ${projects.length}`);
        
        if (decodedId) {
          const matchingProject = projects.find((p: any) => p.id === decodedId);
          if (matchingProject) {
            addLog(`✅ Projeto encontrado no localStorage: ${matchingProject.projectTitle || 'Sem título'}`);
          } else {
            addLog(`❌ Projeto não encontrado no localStorage`);
          }
        }
      } catch (error) {
        addLog(`❌ Erro ao analisar projetos do localStorage: ${error}`);
      }
    } else {
      addLog('❌ Nenhum projeto encontrado no localStorage');
    }
    
    // Load Supabase projects and files
    fetchSupabaseData();
  }, [projectId, decodedId]);
  
  const fetchSupabaseData = async () => {
    try {
      addLog('🔄 Buscando dados do Supabase...');
      
      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .limit(50);
        
      if (projectsError) {
        addLog(`❌ Erro ao buscar projetos do Supabase: ${projectsError.message}`);
      } else {
        setSupabaseProjects(projects || []);
        addLog(`📊 Projetos no Supabase: ${projects?.length || 0}`);
        
        if (decodedId && projects) {
          const matchingProject = projects.find(p => p.id === decodedId);
          if (matchingProject) {
            addLog(`✅ Projeto encontrado no Supabase: ${matchingProject.title || 'Sem título'}`);
          } else {
            addLog(`❌ Projeto não encontrado no Supabase`);
          }
        }
      }
      
      // Fetch files if we have a decoded ID
      if (decodedId) {
        const { data: files, error: filesError } = await supabase
          .from('project_files')
          .select('*')
          .eq('project_id', decodedId);
          
        if (filesError) {
          addLog(`❌ Erro ao buscar arquivos do Supabase: ${filesError.message}`);
        } else {
          setSupabaseFiles(files || []);
          addLog(`📎 Arquivos encontrados no Supabase para este projeto: ${files?.length || 0}`);
        }
      }
    } catch (error) {
      addLog(`❌ Erro ao buscar dados do Supabase: ${error}`);
    }
  };
  
  const addLog = (message: string) => {
    setLogs(prev => [
      `[${new Date().toISOString().split('T')[1].split('.')[0]}] ${message}`, 
      ...prev
    ]);
  };
  
  const clearLocalStorage = () => {
    localStorage.removeItem('harmonIA_preview_projects');
    if (projectId) {
      localStorage.removeItem(`preview_auth_${projectId}`);
    }
    addLog('🧹 localStorage limpo');
    window.location.reload();
  };
  
  const copyDecodeId = () => {
    if (decodedId) {
      navigator.clipboard.writeText(decodedId);
      addLog('📋 ID decodificado copiado para a área de transferência');
    }
  };
  
  const forceAuthorization = () => {
    if (projectId) {
      localStorage.setItem(`preview_auth_${projectId}`, 'authorized');
      addLog('🔑 Autorização forçada para este link');
    }
  };
  
  const resetAuthorization = () => {
    if (projectId) {
      localStorage.removeItem(`preview_auth_${projectId}`);
      addLog('🔒 Autorização removida para este link');
    }
  };
  
  const goToPreview = () => {
    const url = `/preview/${projectId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>🔍 Painel de Depuração de Prévias</div>
              <Badge variant={isAdmin ? "default" : "outline"}>
                {isAdmin ? "Admin" : "Visitante"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Ferramentas para diagnosticar problemas com links de prévia e acesso a dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Link codificado:</div>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 overflow-auto">
                      {projectId || 'Nenhum'}
                    </code>
                    <Badge variant={isValidLink ? "success" : "destructive"}>
                      {isValidLink ? "Válido" : "Inválido"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">ID decodificado:</div>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 overflow-auto">
                      {decodedId || 'Não disponível'}
                    </code>
                    <Button size="sm" variant="outline" onClick={copyDecodeId} disabled={!decodedId}>
                      Copiar
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Status do usePreviewData:</div>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                        <span>Carregando dados...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">ID atual:</span> {actualProjectId || 'Nenhum'}
                        </div>
                        <div>
                          <span className="font-medium">Fonte de dados:</span> {getDataSourceInfo().source}
                        </div>
                        <div>
                          <span className="font-medium">Dados encontrados:</span> {getDataSourceInfo().hasData ? '✅ Sim' : '❌ Não'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Ações para diagnóstico:</div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={goToPreview}>
                    Ver Prévia
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Recarregar Página
                  </Button>
                  <Button variant="outline" onClick={forceAuthorization}>
                    Forçar Autorização
                  </Button>
                  <Button variant="outline" onClick={resetAuthorization}>
                    Resetar Autorização
                  </Button>
                  <Button variant="destructive" onClick={clearLocalStorage} className="col-span-2">
                    Limpar LocalStorage
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-sm font-medium mb-2">Links de acesso:</div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm" onClick={() => window.open(`/preview/${projectId}`, '_blank')}>
                      Prévia Normal
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => window.open(`/preview/${projectId}?debug=true`, '_blank')}>
                      Prévia com Debug
                    </Button>
                  </div>
                  {decodedId && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary" size="sm" onClick={() => window.open(`/preview-project/${decodedId}`, '_blank')}>
                        Prévia Admin (ID)
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => window.open(`/admin-j28s7d1k/previews/${decodedId}`, '_blank')}>
                        Painel Admin
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dados Disponíveis</CardTitle>
              <CardDescription>
                Comparação entre dados no localStorage e Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="supabase">
                <TabsList className="mb-4">
                  <TabsTrigger value="supabase">
                    Supabase ({supabaseProjects.length})
                  </TabsTrigger>
                  <TabsTrigger value="localStorage">
                    LocalStorage ({localStorageProjects.length})
                  </TabsTrigger>
                  {decodedId && (
                    <TabsTrigger value="files">
                      Arquivos ({supabaseFiles.length})
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="supabase">
                  <ScrollArea className="h-[400px]">
                    {supabaseProjects.length > 0 ? (
                      <div className="space-y-4">
                        {supabaseProjects.map((project) => (
                          <div key={project.id} className={`p-4 border rounded-md ${project.id === decodedId ? 'border-blue-500 bg-blue-50' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{project.title || 'Sem título'}</div>
                              <Badge>{project.status || 'desconhecido'}</Badge>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">ID: {project.id}</div>
                            <div className="text-sm mt-2">
                              <div><span className="font-medium">Cliente:</span> {project.client_id || 'Desconhecido'}</div>
                              <div><span className="font-medium">Criado:</span> {new Date(project.created_at).toLocaleString()}</div>
                              <div><span className="font-medium">Código:</span> {project.preview_code || 'Nenhum'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        Nenhum projeto encontrado no Supabase
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="localStorage">
                  <ScrollArea className="h-[400px]">
                    {localStorageProjects.length > 0 ? (
                      <div className="space-y-4">
                        {localStorageProjects.map((project) => (
                          <div key={project.id} className={`p-4 border rounded-md ${project.id === decodedId ? 'border-blue-500 bg-blue-50' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{project.projectTitle || 'Sem título'}</div>
                              <Badge>{project.status || 'desconhecido'}</Badge>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">ID: {project.id}</div>
                            <div className="text-sm mt-2">
                              <div><span className="font-medium">Cliente:</span> {project.clientName || 'Desconhecido'}</div>
                              <div><span className="font-medium">Criado:</span> {project.createdAt ? new Date(project.createdAt).toLocaleString() : 'Desconhecido'}</div>
                              <div><span className="font-medium">Versões:</span> {project.versionsList?.length || project.versions || 0}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        Nenhum projeto encontrado no localStorage
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                {decodedId && (
                  <TabsContent value="files">
                    <ScrollArea className="h-[400px]">
                      {supabaseFiles.length > 0 ? (
                        <div className="space-y-4">
                          {supabaseFiles.map((file) => (
                            <div key={file.id} className="p-4 border rounded-md">
                              <div className="font-medium">{file.file_name || `Arquivo ${file.version || ''}`}</div>
                              <div className="text-sm text-gray-500 mt-1">ID: {file.id}</div>
                              <div className="text-sm mt-2">
                                <div><span className="font-medium">Tipo:</span> {file.file_type}</div>
                                <div><span className="font-medium">Versão:</span> {file.version}</div>
                                <div><span className="font-medium">URL:</span> <span className="truncate block max-w-md">{file.file_url || 'Nenhuma'}</span></div>
                              </div>
                              {file.file_url && (
                                <div className="mt-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(file.file_url, '_blank')}
                                  >
                                    Testar áudio
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          Nenhum arquivo encontrado para este projeto
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Logs de Diagnóstico</CardTitle>
              <CardDescription>
                Registros de operações e erros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 text-xs font-mono">
                  {logs.map((log, index) => (
                    <div key={index} className="border-l-4 border-gray-300 pl-2 py-1">
                      {log}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PreviewDebugPage;
