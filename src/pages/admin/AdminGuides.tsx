
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, FileText, HelpCircle, VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminGuide from '@/components/admin/guides/AdminGuide';
import PreviewsGuide from '@/components/admin/guides/PreviewsGuide';
import NotificationGuide from '@/components/admin/guides/NotificationGuide';

const AdminGuides: React.FC = () => {
  // Define general guide sections for the default AdminGuide component
  const generalGuideSections = [
    {
      title: "Visão Geral do Sistema Admin",
      content: (
        <div className="space-y-2">
          <p>O painel administrativo da harmonIA é projetado para gerenciar todos os aspectos do negócio, incluindo:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestão de projetos musicais</li>
            <li>Comunicação com clientes</li>
            <li>Gerenciamento de prévias</li>
            <li>Emissão de notas fiscais</li>
            <li>Estatísticas de vendas</li>
          </ul>
        </div>
      )
    },
    {
      title: "Acessando Funcionalidades",
      content: (
        <div className="space-y-2">
          <p>Use o menu lateral para acessar as principais funcionalidades do sistema:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Dashboard:</strong> Visão geral e estatísticas</li>
            <li><strong>Projetos:</strong> Gerenciamento de projetos musicais</li>
            <li><strong>Prévias:</strong> Sistema de envio e feedback</li>
            <li><strong>Briefings:</strong> Consulta de briefings recebidos</li>
            <li><strong>Clientes:</strong> Banco de dados de clientes</li>
          </ul>
        </div>
      )
    },
    {
      title: "Permissões de Usuário",
      content: (
        <div className="space-y-2">
          <p>O sistema possui diferentes níveis de acesso:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Administrador:</strong> Acesso total</li>
            <li><strong>Gerente:</strong> Acesso a projetos e comunicação</li>
            <li><strong>Compositor:</strong> Acesso apenas a projetos designados</li>
            <li><strong>Suporte:</strong> Acesso a comunicações de clientes</li>
          </ul>
          <p className="text-amber-500 mt-2">Nota: Entre em contato com o administrador do sistema para alterações de permissões.</p>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Guias e Documentação</h1>
            <p className="text-muted-foreground">
              Documentação detalhada para uso do sistema administrativo
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-harmonia-green text-harmonia-green hover:bg-harmonia-green/10"
          >
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="previews">Prévias</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Guia de Administração</CardTitle>
                <CardDescription>Informações gerais sobre o uso do painel administrativo</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminGuide 
                  title="Guia de Administração Geral"
                  sections={generalGuideSections}
                  storageUrl="https://drive.google.com/drive/folders/admin-docs"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Guia de Gerenciamento de Projetos</CardTitle>
                <CardDescription>Como criar e gerenciar projetos no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-gray-300" />
                  <p className="mt-4 text-center text-gray-400">
                    O guia detalhado de projetos estará disponível em breve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="previews">
            <Card>
              <CardHeader>
                <CardTitle>Guia do Sistema de Prévias</CardTitle>
                <CardDescription>Como utilizar o sistema de prévias musicais</CardDescription>
              </CardHeader>
              <CardContent>
                <PreviewsGuide />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Guia de Integrações</CardTitle>
                <CardDescription>Como configurar webhooks e serviços de notificação</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationGuide />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <VideoIcon className="h-5 w-5 mr-2" />
                Vídeos tutoriais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Assista a tutoriais em vídeo sobre como utilizar o sistema administrativo
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>Em breve</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Documentação técnica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Acesse documentação técnica detalhada sobre APIs e funcionamento do sistema
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>Em breve</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Entre em contato com o suporte para tirar dúvidas ou reportar problemas
              </p>
            </CardContent>
            <CardFooter>
              <Button>Contatar suporte</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
