
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Book, Video, FileText, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminGuides: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Documentação e Guias</h1>
            <p className="text-muted-foreground">
              Recursos para ajudar você a utilizar o sistema da harmonIA
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
        
        <Tabs defaultValue="guides">
          <TabsList className="mb-6 w-full max-w-md">
            <TabsTrigger value="guides" className="flex-1">
              <Book className="w-4 h-4 mr-2" />
              Guias
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-1">
              <Video className="w-4 h-4 mr-2" />
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Documentação
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <span className="bg-harmonia-green/10 p-2 rounded-full mr-2">
                      <Book className="h-5 w-5 text-harmonia-green" />
                    </span>
                    Primeiros passos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Um guia completo de introdução para os novos membros da equipe, com todas as informações essenciais.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Acessar guia
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <span className="bg-harmonia-green/10 p-2 rounded-full mr-2">
                      <Book className="h-5 w-5 text-harmonia-green" />
                    </span>
                    Sistema de prévias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Como gerenciar as prévias musicais, adicionar versões e acompanhar o feedback dos clientes.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Acessar guia
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <span className="bg-harmonia-green/10 p-2 rounded-full mr-2">
                      <Book className="h-5 w-5 text-harmonia-green" />
                    </span>
                    Boas práticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Recomendações e boas práticas para garantir a qualidade no atendimento aos clientes.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Acessar guia
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tutorial - Gerenciando Prévias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-4">
                    <Video className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Vídeo tutorial</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Este vídeo mostra como gerenciar prévias musicais e interagir com os clientes através da plataforma.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tutorial - Fechando Projetos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-4">
                    <Video className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Vídeo tutorial</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Aprenda o processo completo de finalização de projetos após a aprovação do cliente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="docs">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Documentação Técnica</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-harmonia-green mr-3" />
                      <div>
                        <h4 className="font-medium">Manual do Admin</h4>
                        <p className="text-sm text-gray-500">Documentação detalhada do painel administrativo</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Ver
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-harmonia-green mr-3" />
                      <div>
                        <h4 className="font-medium">Integrações</h4>
                        <p className="text-sm text-gray-500">Como integrar com outros sistemas e APIs</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Ver
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-harmonia-green mr-3" />
                      <div>
                        <h4 className="font-medium">Guia de Marcas</h4>
                        <p className="text-sm text-gray-500">Padrões visuais e guias de marca harmonIA</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        Ver
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-harmonia-green/5 border border-harmonia-green/20 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium text-harmonia-green mb-2">Precisa de ajuda adicional?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Entre em contato com o suporte técnico caso tenha dúvidas específicas ou precise de assistência personalizada.
          </p>
          <Button asChild>
            <a href="mailto:suporte@harmonia.media" className="bg-harmonia-green hover:bg-harmonia-green/90">
              Contatar suporte técnico
            </a>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
