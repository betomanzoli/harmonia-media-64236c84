
import React from 'react';
import { Card } from "@/components/ui/card";
import { Mail, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

const Contact: React.FC = () => {
  // Get contact data from site config
  const email = siteConfig.contact.email;
  const whatsapp = "(11) 92058-5072";

  return (
    <section id="contato" className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Estamos à disposição para tirar suas dúvidas ou discutir seu projeto musical personalizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-harmonia-green/10 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-harmonia-green" />
              </div>
              <div>
                <h4 className="font-medium mb-1">WhatsApp</h4>
                <p className="text-gray-500">{whatsapp}</p>
                <a 
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-harmonia-green hover:underline"
                >
                  Iniciar conversa
                </a>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-harmonia-green/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-harmonia-green" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Email</h4>
                <p className="text-gray-500">{email}</p>
                <a 
                  href={`mailto:${email}`} 
                  className="text-harmonia-green hover:underline"
                >
                  Enviar email
                </a>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="mt-12 text-center text-gray-500">
          <p>Horário de Atendimento: Segunda a Sexta: 9h às 18h</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
