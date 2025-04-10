
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Info, ArrowDownCircle, PlayCircle, FileCheck, Send, RefreshCw,
  MessageSquare, CheckCircle, Clock, CalendarDays, Upload, Settings
} from 'lucide-react';

const AdminPreviewGuide: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Guia Administrativo do Sistema de Prévias</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Este guia explica passo a passo como utilizar o sistema administrativo de prévias musicais da harmonIA.
        </p>
      </div>
      
      <Accordion type="single" collapsible defaultValue="overview" className="w-full">
        <AccordionItem value="overview">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-harmonia-green" />
              Visão Geral do Sistema
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <p>
              O sistema de prévias musicais permite que você crie, gerencie e monitore projetos de avaliação musical para seus clientes.
              O fluxo de trabalho típico inclui:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border rounded-md p-3 bg-yellow-50 border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <ArrowDownCircle className="h-4 w-4" />
                  1. Criação e Envio
                </h4>
                <ul className="text-sm space-y-2 text-yellow-700 list-disc pl-5">
                  <li>Criar projeto com dados do cliente</li>
                  <li>Fazer upload das versões musicais</li>
                  <li>Enviar link de avaliação para o cliente</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  2. Feedback do Cliente
                </h4>
                <ul className="text-sm space-y-2 text-blue-700 list-disc pl-5">
                  <li>Cliente ouve as versões</li>
                  <li>Seleciona uma versão preferida</li>
                  <li>Envia feedback ou aprova diretamente</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-green-50 border-green-200">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  3. Finalização
                </h4>
                <ul className="text-sm space-y-2 text-green-700 list-disc pl-5">
                  <li>Implementar ajustes (se necessário)</li>
                  <li>Receber aprovação final do cliente</li>
                  <li>Finalizar produção e entregar</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="dashboard">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-harmonia-green" />
              Como acessar o Painel de Prévias
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <p className="mb-2">Para acessar o painel administrativo de prévias musicais:</p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>Faça login na área administrativa com suas credenciais</li>
              <li>No Dashboard administrativo, clique em <span className="font-medium">"Gerenciar Prévias"</span> ou <span className="font-medium">"Sistema de Prévias"</span></li>
              <li>Alternativamente, acesse diretamente a URL: <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">/admin-j28s7d1k/previews</code></li>
            </ol>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
              <h5 className="text-blue-800 font-medium mb-1 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Acesso Rápido
              </h5>
              <p className="text-blue-700 text-sm">
                Você também pode acessar diretamente qualquer projeto de prévia incluindo seu ID na URL: 
                <code className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded text-sm ml-1">/admin-j28s7d1k/previews/[ID_DO_PROJETO]</code>
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="create">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-harmonia-green" />
              Como criar um Novo Projeto de Prévias
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <p>Para criar um novo projeto de prévias musicais:</p>
            
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <span className="font-medium">Acesse o painel de prévias</span>
                <p className="text-sm mt-1">Navegue até <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">/admin-j28s7d1k/previews</code></p>
              </li>
              <li>
                <span className="font-medium">Clique no botão "Novo Projeto"</span>
                <p className="text-sm mt-1">Localizado no cabeçalho ou role até o final da página onde está o formulário completo</p>
              </li>
              <li>
                <span className="font-medium">Preencha as informações do cliente</span>
                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                  <li>Nome completo do cliente</li>
                  <li>Email para notificações</li>
                  <li>Tipo de pacote contratado</li>
                  <li>Prazo para avaliação (3, 7, 10 ou 15 dias)</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Adicione as versões musicais</span>
                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                  <li>Clique em "Adicionar Versão" para cada nova versão (máx. 5 recomendado)</li>
                  <li>Dê um título descritivo (ex: "Versão Acústica", "Versão Orquestrada")</li>
                  <li>Adicione descrição detalhada para cada versão</li>
                  <li>Faça upload do arquivo de áudio em formato MP3 (recomendado: 128-192kbps)</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Clique em "Criar Projeto e Notificar Cliente"</span>
                <p className="text-sm mt-1">O sistema criará o projeto e enviará automaticamente um e-mail com o link para o cliente</p>
              </li>
            </ol>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
              <h5 className="text-yellow-800 font-medium mb-1 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Dicas importantes
              </h5>
              <ul className="text-yellow-700 text-sm list-disc pl-5 space-y-1">
                <li>Use títulos claros e descritivos para cada versão</li>
                <li>Inclua detalhes técnicos relevantes nas descrições (instrumentação, estilo)</li>
                <li>Verifique a qualidade do áudio antes do envio</li>
                <li>Configure um prazo adequado (7 dias é o recomendado)</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="manage">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-harmonia-green" />
              Como gerenciar Projetos Existentes
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <p>A tabela de projetos mostra todos os projetos de prévias com informações importantes e status:</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm mt-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Coluna</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">ID do Projeto</td>
                    <td className="border border-gray-200 px-4 py-2">Identificador único do projeto</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Cliente</td>
                    <td className="border border-gray-200 px-4 py-2">Nome e email do cliente</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Status</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <span className="text-yellow-500 font-medium">Aguardando</span>,
                      <span className="text-blue-500 font-medium ml-1">Feedback Recebido</span> ou
                      <span className="text-green-500 font-medium ml-1">Aprovado</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Criado / Expira</td>
                    <td className="border border-gray-200 px-4 py-2">Data de criação e data de expiração</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">Ações</td>
                    <td className="border border-gray-200 px-4 py-2">Botões para gerenciar o projeto</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h4 className="font-medium text-gray-800 mt-4 mb-2">Ações disponíveis para cada projeto:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium flex items-center gap-2 mb-2">
                  <PlayCircle className="h-4 w-4 text-harmonia-green" />
                  Visualizar projeto
                </h5>
                <p className="text-sm">
                  Clique em "Visualizar" ou no ID do projeto para acessar a página detalhada com todas as informações, versões e histórico.
                </p>
              </div>
              
              <div>
                <h5 className="font-medium flex items-center gap-2 mb-2">
                  <Send className="h-4 w-4 text-harmonia-green" />
                  Reenviar notificação
                </h5>
                <p className="text-sm">
                  Clique em "Reenviar" para enviar novamente o email com o link de prévias para o cliente.
                </p>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-800 mt-4 mb-2">Página detalhada do projeto:</h4>
            
            <p>Na página detalhada de um projeto, você pode:</p>
            
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <span className="font-medium">Ver informações detalhadas do cliente e projeto</span>
                <p className="text-sm mt-1">Nome, email, tipo de pacote, datas</p>
              </li>
              <li>
                <span className="font-medium">Gerenciar versões musicais</span>
                <p className="text-sm mt-1">Adicionar novas versões, ouvir as versões existentes</p>
              </li>
              <li>
                <span className="font-medium">Ver feedback do cliente</span>
                <p className="text-sm mt-1">Acessar os comentários detalhados enviados pelo cliente</p>
              </li>
              <li>
                <span className="font-medium">Verificar histórico de interações</span>
                <p className="text-sm mt-1">Acompanhar todas as ações realizadas no projeto com datas</p>
              </li>
              <li>
                <span className="font-medium">Estender prazo de avaliação</span>
                <p className="text-sm mt-1">Adicionar mais dias para a avaliação do cliente</p>
              </li>
              <li>
                <span className="font-medium">Enviar notificações personalizadas</span>
                <p className="text-sm mt-1">Notificar o cliente sobre qualquer atualização no projeto</p>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="status">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-harmonia-green" />
              Como interpretar os Status de Projetos
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <p>Os projetos podem ter três status diferentes, cada um indicando uma fase do processo:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="border rounded-md p-3 bg-yellow-50 border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Aguardando Avaliação
                </h4>
                <p className="text-sm text-yellow-700">
                  O cliente ainda não enviou feedback ou aprovação. Ele pode estar avaliando as versões ou ainda não ter acessado o link.
                </p>
                <h5 className="font-medium text-yellow-800 mt-3 mb-1">Ações recomendadas:</h5>
                <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                  <li>Enviar lembrete se estiver próximo da expiração</li>
                  <li>Verificar se o cliente acessou o link</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Feedback Recebido
                </h4>
                <p className="text-sm text-blue-700">
                  O cliente enviou comentários sobre alguma versão, solicitando ajustes ou melhorias específicas.
                </p>
                <h5 className="font-medium text-blue-800 mt-3 mb-1">Ações recomendadas:</h5>
                <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Analisar o feedback detalhadamente</li>
                  <li>Implementar os ajustes solicitados</li>
                  <li>Adicionar nova versão revisada</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-3 bg-green-50 border-green-200">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Música Aprovada
                </h4>
                <p className="text-sm text-green-700">
                  O cliente aprovou uma das versões. O projeto está pronto para finalização e entrega.
                </p>
                <h5 className="font-medium text-green-800 mt-3 mb-1">Ações recomendadas:</h5>
                <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
                  <li>Finalizar a produção da versão aprovada</li>
                  <li>Preparar entrega dos arquivos finais</li>
                  <li>Atualizar status no sistema de gestão de projetos</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="expiring">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-harmonia-green" />
              Como lidar com Projetos a Expirar
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <p>
              Projetos próximos da data de expiração (3 dias ou menos) são destacados na tabela. 
              É importante monitorá-los e tomar ações para evitar que expirem sem resposta do cliente.
            </p>
            
            <h4 className="font-medium text-gray-800 mt-3 mb-2">Passo a passo para lidar com projetos a expirar:</h4>
            
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <span className="font-medium">Identificar projetos próximos da expiração</span>
                <p className="text-sm mt-1">
                  Os projetos com menos de 3 dias para expirar aparecem destacados na tabela com um indicador visual amarelo ou laranja.
                </p>
              </li>
              <li>
                <span className="font-medium">Enviar lembrete ao cliente</span>
                <p className="text-sm mt-1">
                  Clique no botão "Reenviar" na tabela ou acesse o projeto e utilize a função "Enviar Notificação" para um lembrete personalizado.
                </p>
              </li>
              <li>
                <span className="font-medium">Estender o prazo (se necessário)</span>
                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                  <li>Acesse a página detalhada do projeto</li>
                  <li>Clique no botão "Estender Prazo"</li>
                  <li>Selecione o número de dias adicionais (3, 5, 7, 10 ou 15)</li>
                  <li>Confirme a extensão</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Documentar as ações tomadas</span>
                <p className="text-sm mt-1">
                  O sistema registra automaticamente todas as ações na aba "Histórico" do projeto, incluindo extensões de prazo e notificações enviadas.
                </p>
              </li>
            </ol>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
              <h5 className="text-red-800 font-medium mb-1 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Importante
              </h5>
              <p className="text-red-700 text-sm">
                Se um projeto expirar sem resposta do cliente, o link ainda funcionará, mas ao criar uma extensão de prazo, 
                o cliente receberá uma notificação informando que o link foi reativado.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="integration">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-harmonia-green" />
              Como usar a Integração com Google Drive
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <p>
              O sistema de prévias integra-se com o Google Drive para armazenamento e gerenciamento dos arquivos de áudio.
              Esta integração facilita o upload e a sincronização dos arquivos.
            </p>
            
            <h4 className="font-medium text-gray-800 mt-3 mb-2">Configuração da integração:</h4>
            
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <span className="font-medium">Verificar status da integração</span>
                <p className="text-sm mt-1">
                  No painel de prévias, localize o card "Integração de Prévias" que mostra o status atual da conexão com Google Drive.
                </p>
              </li>
              <li>
                <span className="font-medium">Configurar webhook de notificação</span>
                <p className="text-sm mt-1">
                  O campo URL de Webhook permite configurar para onde serão enviadas as notificações quando um cliente interagir com as prévias.
                </p>
              </li>
              <li>
                <span className="font-medium">Sincronizar arquivos</span>
                <p className="text-sm mt-1">
                  Use o botão "Sincronizar com Drive" no cabeçalho para atualizar a lista de arquivos disponíveis no sistema.
                </p>
              </li>
            </ol>
            
            <h4 className="font-medium text-gray-800 mt-4 mb-2">Estrutura de pastas no Google Drive:</h4>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Pasta principal: "harmonIA - Prévias Musicais"</span>
                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                  <li>Subpasta para cada projeto com o formato: "PROJETO-[ID]"</li>
                  <li>Dentro de cada pasta de projeto, arquivos de áudio para cada versão</li>
                </ul>
              </li>
            </ul>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
              <h5 className="text-blue-800 font-medium mb-1 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Dica
              </h5>
              <p className="text-blue-700 text-sm">
                Para evitar problemas de sincronização, não altere a estrutura de pastas manualmente no Google Drive.
                Sempre utilize o sistema administrativo para fazer upload, renomear ou remover arquivos.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="troubleshoot">
          <AccordionTrigger className="font-medium">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-harmonia-green" />
              Solução de Problemas Comuns
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-gray-600">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Cliente não recebeu o link por email</h4>
                <ol className="list-decimal pl-5 text-sm mt-1 space-y-1">
                  <li>Verifique se o endereço de email está correto na página do projeto</li>
                  <li>Use o botão "Reenviar" na tabela de projetos</li>
                  <li>Verifique se o email não foi para a pasta de spam do cliente</li>
                  <li>Como alternativa, copie o link e envie por WhatsApp ou outro canal</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Cliente relata problemas para ouvir as prévias</h4>
                <ol className="list-decimal pl-5 text-sm mt-1 space-y-1">
                  <li>Verifique se o cliente está usando um navegador compatível e atualizado</li>
                  <li>Confirme se os arquivos foram corretamente carregados no sistema</li>
                  <li>Teste o link de prévias em um dispositivo diferente</li>
                  <li>Verifique se a integração com Google Drive está funcionando corretamente</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Erro ao fazer upload de arquivos</h4>
                <ol className="list-decimal pl-5 text-sm mt-1 space-y-1">
                  <li>Verifique se o arquivo está em formato MP3</li>
                  <li>Confirme que o tamanho não excede 20MB</li>
                  <li>Tente renomear o arquivo removendo caracteres especiais</li>
                  <li>Verifique a conexão com Google Drive clicando em "Sincronizar com Drive"</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Link de prévia expirado</h4>
                <ol className="list-decimal pl-5 text-sm mt-1 space-y-1">
                  <li>Acesse a página do projeto</li>
                  <li>Clique em "Estender Prazo"</li>
                  <li>Escolha um novo período de validade</li>
                  <li>Clique em "Enviar Notificação" para informar o cliente sobre a extensão</li>
                </ol>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
              <h5 className="text-blue-800 font-medium mb-1 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Suporte Técnico
              </h5>
              <p className="text-blue-700 text-sm">
                Para problemas técnicos mais complexos, entre em contato com o suporte pelo email suporte@harmonia.media
                ou pelo WhatsApp (11) 99999-9999, de segunda a sexta, das 9h às 18h.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a 
          href="/PREVIEWS_MANAGEMENT_README.md" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-harmonia-green hover:underline text-sm inline-flex items-center"
        >
          <ArrowDownCircle className="h-4 w-4 mr-1" />
          Ver documentação completa em PDF
        </a>
      </div>
    </Card>
  );
};

export default AdminPreviewGuide;
