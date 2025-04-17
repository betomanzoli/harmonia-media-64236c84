
import React from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from "@/components/ui/button";  // Changed from card to button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Lightbulb, HelpCircle, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminGuide from '@/components/admin/guides/AdminGuide';

interface Section {
  title: string;
  content: string;
}

interface GuideProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  sections: Section[];
}

const AdminGuides: React.FC = () => {
  const guides: GuideProps[] = [
    {
      id: 'previews',
      title: 'Guia do Sistema de Prévias',
      description: 'Como gerenciar as prévias de músicas para seus clientes',
      icon: BookOpen,
      sections: [
        {
          title: 'Como adicionar novas prévias',
          content: 'Para adicionar uma nova prévia, vá para a página do projeto e clique no botão "Adicionar versão". Selecione o arquivo de áudio e preencha os detalhes necessários.'
        },
        {
          title: 'Como notificar clientes',
          content: 'Quando uma nova versão for adicionada, você pode enviar um e-mail ao cliente clicando no botão "Enviar notificação". Preencha a mensagem personalizada e envie.'
        },
        {
          title: 'Como gerenciar o prazo',
          content: 'Para estender o prazo de avaliação de um projeto, clique em "Estender prazo" e selecione o número de dias adicionais.'
        }
      ]
    },
    {
      id: 'projects',
      title: 'Guia de Gerenciamento de Projetos',
      description: 'Como organizar e acompanhar seus projetos de produção musical',
      icon: Lightbulb,
      sections: [
        {
          title: 'Como criar um novo projeto',
          content: 'Para criar um novo projeto, vá para a página de projetos e clique em "Novo Projeto". Preencha todas as informações necessárias, incluindo os dados do cliente.'
        },
        {
          title: 'Como definir o status de um projeto',
          content: 'Os projetos podem ter diferentes status: Em andamento, Aguardando aprovação, Aprovado, etc. Para mudar o status, vá para a página do projeto e utilize o seletor de status.'
        },
        {
          title: 'Como registrar pagamentos',
          content: 'Para registrar pagamentos, vá para a aba financeira do projeto e clique em "Registrar pagamento". Preencha o valor, a data e o método de pagamento.'
        }
      ]
    },
    {
      id: 'customers',
      title: 'Guia de Gerenciamento de Clientes',
      description: 'Como gerenciar seus clientes e suas informações',
      icon: HelpCircle,
      sections: [
        {
          title: 'Como adicionar um novo cliente',
          content: 'Para adicionar um novo cliente, vá para a página de clientes e clique em "Novo Cliente". Preencha todos os dados necessários.'
        },
        {
          title: 'Como gerenciar informações de contato',
          content: 'Para atualizar as informações de contato de um cliente, vá para a página do cliente e clique em "Editar". Atualize os dados necessários e salve.'
        },
        {
          title: 'Como visualizar o histórico de projetos',
          content: 'Para ver o histórico de projetos de um cliente, vá para a página do cliente e clique na aba "Projetos". Lá você encontrará todos os projetos associados a esse cliente.'
        }
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-harmonia-green">
              Guias e Documentação
            </h1>
            <p className="text-muted-foreground">
              Consulte os guias abaixo para aprender a usar todas as funcionalidades do sistema.
            </p>
          </div>
          <Button variant="outline" asChild className="border-harmonia-green text-harmonia-green">
            <Link to="/admin-j28s7d1k/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {guides.map((guide) => (
            <Card key={guide.id}>
              <CardHeader className="flex flex-row items-start space-x-4 pb-2">
                <guide.icon className="h-6 w-6 text-harmonia-green mt-1" />
                <div>
                  <CardTitle>{guide.title}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{guide.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`/admin-j28s7d1k/guides/${guide.id}`} 
                  className="text-harmonia-green hover:underline text-sm flex items-center"
                >
                  Ver guia completo
                  <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 border rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-4">
            <Video className="h-8 w-8 text-harmonia-green mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Vídeos Tutoriais</h2>
              <p className="text-gray-600 mb-4">
                Assista aos vídeos tutoriais para aprender a utilizar todas as funcionalidades do sistema de forma visual e prática.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">Como gerenciar projetos</h3>
                    <p className="text-sm text-gray-500 mb-2">Duração: 5:32</p>
                    <Button variant="outline" className="w-full">Assistir</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1">Como enviar prévias</h3>
                    <p className="text-sm text-gray-500 mb-2">Duração: 3:47</p>
                    <Button variant="outline" className="w-full">Assistir</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <AdminGuide 
          title="Guia Completo do Sistema de Prévias"
          sections={[
            {
              title: 'Como adicionar novas prévias',
              content: 'Para adicionar uma nova prévia, vá para a página do projeto e clique no botão "Adicionar versão". Selecione o arquivo de áudio e preencha os detalhes necessários.'
            },
            {
              title: 'Como notificar clientes',
              content: 'Quando uma nova versão for adicionada, você pode enviar um e-mail ao cliente clicando no botão "Enviar notificação". Preencha a mensagem personalizada e envie.'
            },
            {
              title: 'Como gerenciar o prazo',
              content: 'Para estender o prazo de avaliação de um projeto, clique em "Estender prazo" e selecione o número de dias adicionais.'
            }
          ]}
          storageUrl="https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
