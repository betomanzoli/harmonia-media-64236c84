
import React from 'react';
import { Card } from "@/components/ui/card";
import { FolderOpen, Shield, Bell, Clock, CheckCircle, FileText, MousePointer, AudioLines } from 'lucide-react';

const AdminPreviewGuide: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <section>
        <h2 className="text-xl font-bold mb-3">Sistema de Prévias Musicais - harmonIA</h2>
        <p className="text-gray-600 mb-6">
          Este guia explica como gerenciar o sistema de prévias musicais para os clientes 
          da harmonIA.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-harmonia-green">
            <div className="flex items-start mb-4">
              <FolderOpen className="h-6 w-6 text-harmonia-green mr-3" />
              <div>
                <h3 className="font-semibold mb-1">Visão Geral</h3>
                <p className="text-sm text-gray-600">
                  O sistema permite enviar prévias musicais para aprovação do cliente, 
                  receber feedback e gerenciar o processo de aprovação.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-l-4 border-harmonia-green">
            <div className="flex items-start mb-4">
              <Shield className="h-6 w-6 text-harmonia-green mr-3" />
              <div>
                <h3 className="font-semibold mb-1">Proteção de Conteúdo</h3>
                <p className="text-sm text-gray-600">
                  As prévias são protegidas contra download direto e disponibilizadas 
                  em versões limitadas de 30 segundos.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      <section>
        <h3 className="text-lg font-bold mb-4">Fluxo de Trabalho</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-harmonia-green/20 flex items-center justify-center">
              <span className="text-harmonia-green font-bold">1</span>
            </div>
            <div className="ml-4 mt-1">
              <h4 className="font-medium">Criação do Projeto</h4>
              <p className="text-sm text-gray-600 mt-1">
                Crie um novo projeto com as informações do cliente e faça upload 
                das versões musicais do Google Drive.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-harmonia-green/20 flex items-center justify-center">
              <span className="text-harmonia-green font-bold">2</span>
            </div>
            <div className="ml-4 mt-1">
              <h4 className="font-medium">Notificação do Cliente</h4>
              <p className="text-sm text-gray-600 mt-1">
                O cliente recebe uma notificação por email com o link para acessar 
                as prévias musicais.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-harmonia-green/20 flex items-center justify-center">
              <span className="text-harmonia-green font-bold">3</span>
            </div>
            <div className="ml-4 mt-1">
              <h4 className="font-medium">Avaliação pelo Cliente</h4>
              <p className="text-sm text-gray-600 mt-1">
                O cliente ouve as prévias, seleciona uma versão preferida e envia feedback 
                ou aprova diretamente.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-harmonia-green/20 flex items-center justify-center">
              <span className="text-harmonia-green font-bold">4</span>
            </div>
            <div className="ml-4 mt-1">
              <h4 className="font-medium">Gerenciamento de Feedback</h4>
              <p className="text-sm text-gray-600 mt-1">
                Acompanhe e responda ao feedback do cliente, enviando novas versões 
                quando necessário.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-harmonia-green/20 flex items-center justify-center">
              <span className="text-harmonia-green font-bold">5</span>
            </div>
            <div className="ml-4 mt-1">
              <h4 className="font-medium">Finalização</h4>
              <p className="text-sm text-gray-600 mt-1">
                Após a aprovação, o projeto avança para a fase de produção final.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="border-t pt-6 mt-6">
        <h3 className="text-lg font-bold mb-4">Principais Recursos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Bell className="h-5 w-5 text-harmonia-green mr-3" />
            <div>
              <h4 className="font-medium text-sm">Notificações Automáticas</h4>
              <p className="text-sm text-gray-600 mt-1">
                Sistema envia notificações para clientes e para a equipe.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-harmonia-green mr-3" />
            <div>
              <h4 className="font-medium text-sm">Prazos de Avaliação</h4>
              <p className="text-sm text-gray-600 mt-1">
                Configure prazos para o cliente avaliar as prévias.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-harmonia-green mr-3" />
            <div>
              <h4 className="font-medium text-sm">Processo de Aprovação</h4>
              <p className="text-sm text-gray-600 mt-1">
                Fluxo intuitivo para aprovação ou solicitação de ajustes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-harmonia-green mr-3" />
            <div>
              <h4 className="font-medium text-sm">Histórico de Versões</h4>
              <p className="text-sm text-gray-600 mt-1">
                Mantenha histórico de todas as versões e feedback.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MousePointer className="h-5 w-5 text-harmonia-green mr-3" />
            <div>
              <h4 className="font-medium text-sm">Interface Intuitiva</h4>
              <p className="text-sm text-gray-600 mt-1">
                Fácil para o cliente navegar e fornecer feedback.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <AudioLines className="h-5 w-5 text-harmonia-green mr-3" />
            <div>
              <h4 className="font-medium text-sm">Prévias Limitadas</h4>
              <p className="text-sm text-gray-600 mt-1">
                Prévias de 30 segundos protegem o conteúdo musical.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="border-t pt-6 mt-6">
        <h3 className="text-lg font-bold mb-4">Boas Práticas</h3>
        <ul className="space-y-2 list-disc list-inside text-sm text-gray-600">
          <li>Forneça descrições claras para cada versão musical</li>
          <li>Configure prazos razoáveis (7 dias é o recomendado)</li>
          <li>Envie prévias em qualidade média (128kbps) para proteção</li>
          <li>Monitore projetos próximos da expiração e envie lembretes</li>
          <li>Responda rapidamente ao feedback recebido</li>
          <li>Integre as pastas do Google Drive para gerenciamento centralizado</li>
          <li>Informe aos clientes sobre a limitação de 30 segundos das prévias</li>
        </ul>
      </section>
    </div>
  );
};

export default AdminPreviewGuide;
