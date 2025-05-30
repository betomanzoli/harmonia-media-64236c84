import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import ProjectPhases from '@/components/admin/projects/ProjectPhases';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  RefreshCw, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Copy, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client'; // ✅ SUPABASE REAL
import { useProjects, Project } from '@/hooks/admin/useProjects'; // ✅ HOOKS REAIS

const ProjectGuideDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          Guia de Gerenciamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Guia de Gerenciamento de Projetos</DialogTitle>
          <DialogDescription>
            Um guia passo a passo para gerenciar projetos musicais no sistema harmonIA
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Visão Geral do Processo</h3>
            <p className="text-sm text-gray-600">
              O processo de criação musical na harmonIA segue as seguintes fases principais:
            </p>
            <ol className="list-decimal pl-6 text-sm text-gray-600 space-y-1">
              <li><strong>Briefing e Análise:</strong> Coleta e análise de requisitos do cliente</li>
              <li><strong>Composição:</strong> Criação da estrutura musical e harmonia base</li>
              <li><strong>Prévias:</strong> Criação e compartilhamento de versões para aprovação</li>
              <li><strong>Avaliação e Feedback:</strong> Recebimento e implementação de ajustes</li>
              <li><strong>Finalização:</strong> Mixagem, masterização e finalização do produto</li>
              <li><strong>Entrega:</strong> Entrega dos arquivos finais e conclusão do projeto</li>
            </ol>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Como Gerenciar as Fases do Projeto</h3>
            <div className="bg-gray-50 p-4 rounded border space-y-2">
              <h4 className="font-medium">1. Fase de Briefing</h4>
              <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                <li>Analise o briefing recebido do cliente</li>
                <li>Adicione notas relevantes para a equipe de produção</li>
                <li>Agende uma chamada com o cliente se necessário (pacotes Premium e Profissional)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border space-y-2 mt-3">
              <h4 className="font-medium">2. Fase de Composição</h4>
              <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                <li>Desenvolva a estrutura musical base conforme o briefing</li>
                <li>Adicione rascunhos e documentos de referência</li>
                <li>Prepare-se para a criação de prévias para o cliente</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border space-y-2 mt-3">
              <h4 className="font-medium">3. Fase de Prévias</h4>
              <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                <li>Crie de 2 a 5 versões distintas baseadas no briefing</li>
                <li>Adicione descrições detalhadas para cada versão</li>
                <li>Envie as prévias para aprovação do cliente</li>
                <li><strong>Importante:</strong> As prévias são limitadas a 30 segundos e não podem ser baixadas pelo cliente</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border space-y-2 mt-3">
              <h4 className="font-medium">4. Avaliação e Feedback</h4>
              <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                <li>Analise o feedback recebido do cliente</li>
                <li>Implemente os ajustes solicitados</li>
                <li>Crie novas versões se necessário (conforme limitações do pacote)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border space-y-2 mt-3">
              <h4 className="font-medium">5. Finalização</h4>
              <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                <li>Realize a mixagem e masterização final</li>
                <li>Prepare os arquivos em diferentes formatos conforme o pacote</li>
                <li>Faça uma verificação final de qualidade</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded border space-y-2 mt-3">
              <h4 className="font-medium">6. Entrega</h4>
              <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                <li>Envie os arquivos finais para o cliente</li>
                <li>Habilite os links de download para todos os arquivos</li>
                <li>Solicite a aprovação final e encerre o projeto</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Dicas e Melhores Práticas</h3>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              <li><strong>Mantenha a comunicação clara:</strong> Informe o cliente sobre cada avanço importante no projeto</li>
              <li><strong>Documente tudo:</strong> Mantenha notas detalhadas sobre decisões e alterações</li>
              <li><strong>Respeite os prazos:</strong> Cada fase tem um prazo recomendado para conclusão</li>
              <li><strong>Prévias de qualidade:</strong> Envie prévias que representem bem o produto final</li>
              <li><strong>Segurança do conteúdo:</strong> Lembre-se que os downloads só são liberados na fase final</li>
              <li><strong>Expectativas claras:</strong> Comunique claramente o que é possível dentro do pacote contratado</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AdminProjectManagement: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
  // ✅ USAR DADOS REAIS DO SUPABASE
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);

  // ✅ CARREGAR PROJETO REAL DO SUPABASE
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔍 Loading project for management:', projectId);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) {
          console.error('❌ Error loading project:', error);
          toast({
            title: "Erro ao carregar projeto",
            description: "Não foi possível carregar os dados do projeto.",
            variant: "destructive"
          });
          return;
        }

        if (!data) {
          console.log('⚠️ Project not found');
          return;
        }

        console.log('✅ Project loaded for management:', data);
        setProject(data);
        
        // Carregar notas do projeto (se houver tabela de notas)
        // Por enquanto, usar notas mockadas baseadas no projeto real
        setNotes([
          { 
            id: '1', 
            date: new Date(data.created_at).toLocaleDateString('pt-BR'), 
            author: 'Sistema', 
            content: `Projeto criado para ${data.client_name}. Pacote: ${data.package_type}.` 
          }
        ]);
        
      } catch (error) {
        console.error('💥 Error loading project:', error);
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao carregar o projeto.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);
  
  const handlePhaseAction = (phaseId: string, action: 'upload' | 'notify' | 'complete') => {
    setIsUpdateLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdateLoading(false);
      
      toast({
        title: action === 'upload' 
          ? 'Upload concluído' 
          : action === 'notify'
          ? 'Cliente notificado'
          : 'Fase concluída',
        description: `A ação foi realizada com sucesso para a fase "${phaseId}".`,
      });
    }, 1500);
  };
  
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;
    
    const newNoteObj = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      author: 'Administrador', // Em produção, viria do usuário logado
      content: newNote
    };
    
    setNotes([...notes, newNoteObj]);
    setNewNote('');
    
    toast({
      title: 'Nota adicionada',
      description: 'A nota foi adicionada ao projeto com sucesso.',
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-harmonia-green mx-auto mb-4"></div>
              <p>Carregando projeto...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="flex-1 p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-4">O projeto solicitado não foi encontrado.</p>
            <Link to="/admin/projects">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Projetos
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/projects">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            
            <div>
              <h1 className="text-2xl font-bold">Gerenciamento de Projeto #{project.id}</h1> {/* ✅ DADOS REAIS */}
              <p className="text-gray-500">Cliente: {project.client_name} • Pacote: {project.package_type}</p> {/* ✅ DADOS REAIS */}
            </div>
          </div>
          
          <div className="flex gap-2">
            <ProjectGuideDialog />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => {
                setIsUpdateLoading(true);
                setTimeout(() => {
                  setIsUpdateLoading(false);
                  toast({
                    title: 'Projeto atualizado',
                    description: 'Os dados do projeto foram atualizados com sucesso.',
                  });
                }, 1000);
              }}
              disabled={isUpdateLoading}
            >
              {isUpdateLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Atualizar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProjectPhases 
              projectId={project.id}
              projectType={project.package_type || 'essencial'}
              currentPhase={project.status === 'waiting' ? 'previas' : project.status === 'feedback' ? 'avaliacao' : 'finalizacao'}
              onPhaseAction={handlePhaseAction}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-harmonia-green"></div>
                      <p className="font-medium">{project.status === 'waiting' ? 'Aguardando' : project.status === 'feedback' ? 'Feedback' : 'Aprovado'}</p> {/* ✅ DADOS REAIS */}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">ID do Projeto</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{project.id}</p> {/* ✅ DADOS REAIS */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText(project.id);
                                toast({ title: "ID copiado!" });
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copiar ID</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Cliente</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{project.client_name}</p> {/* ✅ DADOS REAIS */}
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Contatar
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">{project.client_email}</p> {/* ✅ DADOS REAIS */}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Data de Início</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <p className="font-medium">{new Date(project.created_at).toLocaleDateString('pt-BR')}</p> {/* ✅ DADOS REAIS */}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Prazo de Entrega</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-amber-500" />
                      <p className="font-medium text-amber-600">
                        {project.expires_at ? new Date(project.expires_at).toLocaleDateString('pt-BR') : 'Não definido'} {/* ✅ DADOS REAIS */}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    Ver Contrato
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notas do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    className="w-full p-2 border rounded-md text-sm min-h-[80px]"
                    placeholder="Adicione uma nota para a equipe..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                  />
                  <Button type="submit" className="bg-harmonia-green hover:bg-harmonia-green/90" size="sm">
                    Adicionar Nota
                  </Button>
                </form>
                
                <Separator />
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{note.author}</p>
                        <p className="text-xs text-gray-500">{note.date}</p>
                      </div>
                      <p className="text-sm text-gray-600">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Ações Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start bg-harmonia-green hover:bg-harmonia-green/90 gap-2" size="sm">
                  <MessageSquare className="h-4 w-4" />
                  Enviar Email ao Cliente
                </Button>
                
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Adicionar Documentação
                </Button>
                
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ajustar Prazo de Entrega
                </Button>
                
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md flex items-start gap-2 mt-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Lembre-se de atualizar o status do projeto após cada fase concluída para manter o cliente informado.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjectManagement;
