
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from 'lucide-react';

const NotificationGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <p>
        O sistema de notificações permite que você mantenha os clientes informados sobre o progresso de seus projetos.
        Aqui está um guia rápido sobre como utilizar essa funcionalidade:
      </p>
      
      <div className="space-y-4 mt-4">
        <h3 className="font-medium text-lg">Tipos de Notificações</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Nova Versão Disponível</h4>
            <p className="text-sm text-gray-600">
              Notifique o cliente quando uma nova versão musical for adicionada para avaliação.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Lembrete</h4>
            <p className="text-sm text-gray-600">
              Envie um lembrete educado para clientes que ainda não avaliaram as versões enviadas.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Extensão de Prazo</h4>
            <p className="text-sm text-gray-600">
              Informe ao cliente que o prazo para avaliação foi estendido.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Confirmação</h4>
            <p className="text-sm text-gray-600">
              Confirme o recebimento de feedback ou a aprovação de uma versão.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <h3 className="font-medium text-lg">Melhores Práticas</h3>
        
        <ul className="space-y-2">
          <li className="flex gap-2">
            <Check className="h-5 w-5 text-harmonia-green shrink-0" />
            <p>Seja claro e conciso nas suas mensagens</p>
          </li>
          <li className="flex gap-2">
            <Check className="h-5 w-5 text-harmonia-green shrink-0" />
            <p>Inclua instruções específicas sobre o que o cliente deve fazer</p>
          </li>
          <li className="flex gap-2">
            <Check className="h-5 w-5 text-harmonia-green shrink-0" />
            <p>Sempre inclua o link para a prévia na mensagem</p>
          </li>
          <li className="flex gap-2">
            <Check className="h-5 w-5 text-harmonia-green shrink-0" />
            <p>Mantenha um tom profissional e amigável</p>
          </li>
        </ul>
      </div>
      
      <Alert>
        <AlertDescription>
          <p className="text-sm">
            <strong>Nota:</strong> As notificações são enviadas automaticamente para o e-mail do cliente. 
            Certifique-se de que o endereço de e-mail está correto nas informações do projeto.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotificationGuide;
