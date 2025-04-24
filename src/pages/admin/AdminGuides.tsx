
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, HelpCircle, Video, BookOpen, Lightbulb, ExternalLink } from 'lucide-react';

const AdminGuides: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documentação e Guias</h1>
          <p className="text-muted-foreground">
            Recursos para ajudar você a aproveitar ao máximo a plataforma HarmonIA
          </p>
        </div>
        
        <Tabs defaultValue="getting-started" className="space-y-4">
          <TabsList>
            <TabsTrigger value="getting-started">Primeiros Passos</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
            <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo à HarmonIA</CardTitle>
                <CardDescription>
                  Guia básico para começar a usar a plataforma de prévias musicais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-start space-x-4">
                    <div className="bg-harmonia-green/20 p-2 rounded-lg">
                      <Lightbulb className="h-8 w-8 text-harmonia-green" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Visão Geral da Plataforma</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        O sistema HarmonIA é uma plataforma completa para compartilhar prévias musicais 
                        com seus clientes e receber feedback. Essa seção irá guiá-lo pelos recursos 
                        básicos disponíveis.
                      </p>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-medium mb-1">1. Criando um projeto</h4>
                          <p className="text-gray-600">
                            Inicie criando um novo projeto na seção "Prévias". Preencha as informações
                            do cliente e detalhes do projeto. Um link único será gerado para compartilhamento.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">2. Adicionando versões musicais</h4>
                          <p className="text-gray-600">
                            Dentro do projeto, você pode adicionar diversas versões musicais. Faça upload
                            dos arquivos de áudio e adicione descrições detalhadas para cada versão.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">3. Compartilhando com o cliente</h4>
                          <p className="text-gray-600">
                            Compartilhe o link do projeto com seu cliente. Eles poderão ouvir as versões,
                            deixar feedback específico e selecionar uma versão preferida.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">4. Gerenciamento de feedback</h4>
                          <p className="text-gray-600">
                            Receba notificações quando seu cliente deixar um feedback. Você pode 
                            acompanhar todas as interações e manter um histórico do desenvolvimento.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Baixar Guia Completo (PDF)
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="tutorials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tutoriais em Vídeo</CardTitle>
                <CardDescription>
                  Aprenda a utilizar todos os recursos da plataforma com esses tutoriais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Criando seu primeiro projeto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                        <Video className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Duração: 3:45 • Publicado em 12/03/2025
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Assistir Tutorial
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Gerenciando feedback de clientes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                        <Video className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Duração: 5:12 • Publicado em 15/03/2025
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Assistir Tutorial
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Respostas para as dúvidas mais comuns sobre a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium flex items-center mb-2">
                      <HelpCircle className="h-4 w-4 mr-2 text-harmonia-green" />
                      Como faço para adicionar mais versões a um projeto existente?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Acesse a página do projeto, clique no botão "Adicionar versão" no topo da página.
                      Preencha o formulário com o nome, descrição e faça o upload do arquivo de áudio.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium flex items-center mb-2">
                      <HelpCircle className="h-4 w-4 mr-2 text-harmonia-green" />
                      Os clientes precisam de uma conta para acessar as prévias?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Não, os clientes não precisam de uma conta. Eles recebem um link único que permite 
                      acessar as prévias e deixar feedback sem necessidade de login.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium flex items-center mb-2">
                      <HelpCircle className="h-4 w-4 mr-2 text-harmonia-green" />
                      Como sou notificado quando um cliente deixa feedback?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Você receberá uma notificação por email e também dentro da plataforma sempre que 
                      um cliente deixar um feedback ou aprovar uma versão musical.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h3 className="font-medium flex items-center mb-2">
                      <HelpCircle className="h-4 w-4 mr-2 text-harmonia-green" />
                      É possível limitar o tempo que o cliente tem para avaliar as prévias?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sim, cada projeto tem uma data de expiração definida. Você pode estender esse prazo
                      a qualquer momento na página de detalhes do projeto.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  FAQ Completo
                </Button>
                <Button variant="default">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Suporte
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
