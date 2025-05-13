
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Video, BookOpen, ExternalLink, Download, PlusCircle, CheckCircle } from 'lucide-react';

const AdminGuides: React.FC = () => {
  const [activeTab, setActiveTab] = useState("docs");
  
  return (
    <AdminLayout>
      <div className="p-6 bg-background">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Documentação e Guias</h1>
          <Button variant="outline" asChild>
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="mb-6">
          <Tabs defaultValue="docs" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="docs">
                <FileText className="mr-2 h-4 w-4" />
                Documentação
              </TabsTrigger>
              <TabsTrigger value="tutorials">
                <Video className="mr-2 h-4 w-4" />
                Tutoriais
              </TabsTrigger>
              <TabsTrigger value="faq">
                <BookOpen className="mr-2 h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="docs" className={activeTab === "docs" ? "" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Guia de Administração
                </CardTitle>
                <CardDescription>Aprenda a gerenciar o painel administrativo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Este guia cobre todas as funcionalidades do painel administrativo, incluindo gestão de projetos, clientes e configurações do sistema.
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Documentação
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Manual de Briefs
                </CardTitle>
                <CardDescription>Como analisar e gerenciar briefs de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Aprenda a interpretar os requisitos dos clientes, extrair informações importantes e preparar o projeto musical.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Manual (PDF)
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Guia de Prévias
                </CardTitle>
                <CardDescription>Como gerenciar o sistema de prévias musicais</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Este documento explica como criar, gerenciar e compartilhar prévias musicais com os clientes através do sistema.
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Documentação
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Documentação da API
                </CardTitle>
                <CardDescription>Referência técnica para integração</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Documentação completa da API para desenvolvedores que desejam integrar suas aplicações com o sistema.
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir Documentação Técnica
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Guia de Faturamento
                </CardTitle>
                <CardDescription>Como gerenciar faturas e pagamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Aprenda a emitir faturas, gerenciar pagamentos e entender os relatórios financeiros do sistema.
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Guia
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="flex items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Solicitar Nova Documentação
                  </CardTitle>
                  <CardDescription>Não encontrou o que procura?</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Solicite documentação específica para suas necessidades administrativas.
                </p>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Solicitar Documentação
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tutorials" className={activeTab === "tutorials" ? "" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Introdução ao Sistema</CardTitle>
                <CardDescription>Tutorial básico para iniciantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Este vídeo ensina os primeiros passos para usar o painel administrativo da harmonIA.
                </p>
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Assistir Tutorial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Gerenciamento de Prévias</CardTitle>
                <CardDescription>Como criar e compartilhar prévias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Aprenda a criar novas prévias musicais e compartilhá-las com os clientes.
                </p>
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Assistir Tutorial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>Como gerenciar a base de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-700 rounded-md mb-4 flex items-center justify-center">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Tutorial completo sobre cadastro, gerenciamento e acompanhamento de clientes.
                </p>
                <Button variant="outline" className="w-full">
                  <Video className="mr-2 h-4 w-4" />
                  Assistir Tutorial
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq" className={activeTab === "faq" ? "" : "hidden"}>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>Respostas rápidas para suas dúvidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Como posso adicionar um novo cliente no sistema?
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 pl-6">
                    Você pode adicionar um novo cliente acessando a seção "Clientes" no menu lateral e clicando no botão "Novo Cliente". Preencha as informações necessárias no formulário e clique em "Salvar".
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Como verificar o status de um projeto?
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 pl-6">
                    Acesse a seção "Projetos" no menu lateral, localize o projeto desejado na lista e verifique a coluna "Status". Você também pode clicar no projeto para ver informações mais detalhadas.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Como enviar uma prévia para um cliente?
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 pl-6">
                    Na seção "Prévias", selecione o projeto desejado, adicione os arquivos de áudio e clique em "Gerar Link". Você pode então copiar o link gerado e enviá-lo ao cliente por e-mail ou WhatsApp.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Como acompanhar os pagamentos recebidos?
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 pl-6">
                    Na seção "Faturas", você encontrará uma lista de todos os pagamentos. Os status "Pago", "Pendente" e "Vencido" indicam a situação de cada fatura.
                  </p>
                </div>
                
                <div className="border-b border-border pb-4">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Como adicionar músicas ao portfólio?
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 pl-6">
                    Acesse a seção "Portfólio" e clique em "Adicionar ao Portfólio". Preencha os detalhes da música, faça upload dos arquivos de áudio e imagem, e clique em "Adicionar".
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Como configurar integrações com serviços externos?
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 pl-6">
                    Acesse a seção "Integrações" no menu lateral. Lá você encontrará opções para configurar conexões com Google Drive, serviços de e-mail e outras plataformas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
