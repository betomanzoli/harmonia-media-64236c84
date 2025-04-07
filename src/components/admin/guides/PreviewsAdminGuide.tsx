
import React from 'react';
import { Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const PreviewsAdminGuide: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="w-4 h-4" />
          Guia de Uso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Guia do Sistema de Prévias</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="create">Criar Projetos</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar</TabsTrigger>
            <TabsTrigger value="troubleshoot">Solução de Problemas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <p>
              O sistema de prévias musicais permite que você crie projetos para avaliação dos clientes,
              faça upload de diferentes versões e acompanhe feedback e aprovações.
            </p>
            
            <h3 className="text-lg font-medium mt-4">Fluxo de Trabalho:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Crie um novo projeto com os dados do cliente</li>
              <li>Faça upload das versões musicais com títulos e descrições</li>
              <li>O sistema envia um link de avaliação para o cliente</li>
              <li>O cliente avalia as versões e envia feedback ou aprova</li>
              <li>Você recebe notificações de feedback ou aprovação</li>
            </ol>
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <h3 className="text-lg font-medium">Criando um Projeto:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Role até o fim da página ou clique em "Novo Projeto" no topo</li>
              <li>Preencha os dados obrigatórios do cliente e projeto</li>
              <li>Adicione pelo menos uma versão musical (até 5 versões recomendado)</li>
              <li>Para cada versão, forneça um título descritivo e detalhes</li>
              <li>Faça upload de arquivos MP3 (recomendado 128-192kbps para prévias)</li>
              <li>Clique em "Criar Projeto e Notificar Cliente"</li>
            </ol>
            
            <Card className="p-4 bg-blue-50 border-blue-200 text-blue-800">
              <h4 className="font-medium">Dicas:</h4>
              <ul className="list-disc pl-5 mt-2">
                <li>Use títulos claros para as versões (ex: "Versão Acústica", "Versão Orquestrada")</li>
                <li>Inclua detalhes sobre instrumentação e estilo na descrição</li>
                <li>Limite cada arquivo de áudio a no máximo 20MB</li>
              </ul>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage" className="space-y-4">
            <h3 className="text-lg font-medium">Gerenciando Projetos:</h3>
            <p>
              A tabela de projetos mostra todos os projetos de prévias ativos, 
              com status, informações do cliente e datas relevantes.
            </p>
            
            <h4 className="font-medium mt-4">Status dos projetos:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium text-yellow-500">Aguardando Avaliação</span> - Cliente ainda não respondeu</li>
              <li><span className="font-medium text-blue-500">Feedback Recebido</span> - Cliente enviou comentários</li>
              <li><span className="font-medium text-green-500">Música Aprovada</span> - Cliente aprovou uma versão</li>
            </ul>
            
            <h4 className="font-medium mt-4">Ações disponíveis:</h4>
            <ul className="list-disc pl-5">
              <li><span className="font-medium">Visualizar</span> - Abre a página de prévias como o cliente vê</li>
              <li><span className="font-medium">Reenviar</span> - Reenvia o email com o link para o cliente</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="troubleshoot" className="space-y-4">
            <h3 className="text-lg font-medium">Soluções de Problemas Comuns:</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Cliente não recebeu o link:</h4>
                <p>Verifique o email cadastrado e use o botão de reenvio na tabela de projetos.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Link expirado:</h4>
                <p>Atualmente, é necessário criar um novo projeto. Em breve será possível estender o prazo.</p>
              </div>
              
              <div>
                <h4 className="font-medium">Erro no upload de arquivos:</h4>
                <p>Certifique-se que o arquivo:</p>
                <ul className="list-disc pl-5">
                  <li>Está no formato MP3</li>
                  <li>Não excede 20MB</li>
                  <li>Tem um nome sem caracteres especiais</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Cliente reclama de problemas na reprodução:</h4>
                <p>Sugira ao cliente:</p>
                <ul className="list-disc pl-5">
                  <li>Usar um navegador atualizado (Chrome, Firefox, Safari)</li>
                  <li>Verificar a conexão com a internet</li>
                  <li>Tentar em um dispositivo diferente</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between mt-6">
          <a 
            href="/PREVIEWS_README.md" 
            target="_blank" 
            className="text-blue-500 hover:underline text-sm"
          >
            Ver documentação completa
          </a>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Fechar Guia
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewsAdminGuide;
