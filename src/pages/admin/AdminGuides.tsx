
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Book, Bookmark, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminGuide } from '@/components/admin/guides/AdminGuide';
import { PreviewsGuide } from '@/components/admin/guides/PreviewsGuide';
import { InvoicesGuide } from '@/components/admin/guides/InvoicesGuide';

const AdminGuides: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">Guias</h1>
            <p className="text-muted-foreground">
              Documentação e manuais do sistema administrativo
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
          <TabsList className="mb-6">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="previews">Prévias</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <AdminGuide />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Book className="mr-2 h-5 w-5 text-harmonia-green" />
                    Manual do Administrador
                  </CardTitle>
                  <CardDescription>Guia completo para operações administrativas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Abrir Manual
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Bookmark className="mr-2 h-5 w-5 text-amber-500" />
                    Referência Rápida
                  </CardTitle>
                  <CardDescription>Comandos e operações frequentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Referência
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <ExternalLink className="mr-2 h-5 w-5 text-blue-500" />
                    Recursos Externos
                  </CardTitle>
                  <CardDescription>Links úteis e ferramentas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Acessar Recursos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="previews">
            <PreviewsGuide />
          </TabsContent>
          
          <TabsContent value="invoices">
            <InvoicesGuide />
          </TabsContent>
          
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Guia de Gerenciamento de Portfólio</CardTitle>
                <CardDescription>Como adicionar, editar e organizar itens do portfólio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Este guia ajudará você a gerenciar o portfólio de músicas e projetos da harmonIA.
                </p>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-muted/50">
                    <h3 className="text-lg font-medium mb-2">Adicionando novos itens ao portfólio</h3>
                    <p className="text-sm">
                      Para adicionar um novo item ao portfólio, acesse a página de Portfólio no 
                      painel administrativo e utilize o formulário "Adicionar Novo Item".
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-muted/50">
                    <h3 className="text-lg font-medium mb-2">Organizando por categorias</h3>
                    <p className="text-sm">
                      Você pode organizar os itens do portfólio por gênero musical, tipo de 
                      projeto ou finalidade. Isso facilita para os visitantes encontrarem 
                      exemplos relevantes.
                    </p>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-muted/50">
                    <h3 className="text-lg font-medium mb-2">Destacando projetos</h3>
                    <p className="text-sm">
                      Para destacar projetos especiais na página principal do portfólio, 
                      marque a opção "Destacado" ao criar ou editar um item.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
