
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileAudio, FileText, Mail, CheckCircle, HelpCircle } from 'lucide-react';

const AdminPreviewGuide: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Guia de Prévias</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Esta área permite gerenciar as prévias enviadas aos clientes e acompanhar o processo de aprovação.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <FileAudio className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Envio de Prévias</h3>
                <p className="text-xs text-gray-500">
                  Crie um novo projeto para enviar prévias de músicas para aprovação dos clientes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Coleta de Feedback</h3>
                <p className="text-xs text-gray-500">
                  Os clientes podem ouvir e fornecer feedback diretamente na plataforma.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mail className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Notificações</h3>
                <p className="text-xs text-gray-500">
                  Envie lembretes para clientes que ainda não enviaram feedback.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium">Aprovação</h3>
                <p className="text-xs text-gray-500">
                  Acompanhe o status de aprovação e finalize os projetos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Precisa de ajuda?</h3>
                <p className="text-xs text-blue-600">
                  Consulte a documentação completa sobre o processo de prévias e aprovação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPreviewGuide;
