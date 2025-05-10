
import React from 'react';
import { Card } from "@/components/ui/card";
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

const Contact: React.FC = () => {
  // Get contact data from site config
  const email = siteConfig.contact.email;
  const whatsapp = siteConfig.contact.whatsapp;
  const phone = siteConfig.contact.phone;
  
  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };
  
  const handlePhoneClick = () => {
    window.location.href = `tel:+${phone}`;
  };

  return (
    <section id="contato" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Estamos prontos para transformar sua história em música. Entre em contato hoje mesmo.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Mail className="mx-auto h-10 w-10 text-harmonia-green mb-4" />
            <h3 className="font-bold text-xl mb-2">Email</h3>
            <p className="text-gray-400 mb-4">Resposta em até 24h</p>
            <p 
              className="text-harmonia-green cursor-pointer hover:underline"
              onClick={handleEmailClick}
            >
              {email}
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Phone className="mx-auto h-10 w-10 text-harmonia-green mb-4" />
            <h3 className="font-bold text-xl mb-2">Telefone</h3>
            <p className="text-gray-400 mb-4">Seg-Sex: 9h às 18h</p>
            <p 
              className="text-harmonia-green cursor-pointer hover:underline"
              onClick={handlePhoneClick}
            >
              +55 11 92058-5072
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="mx-auto h-10 w-10 text-harmonia-green mb-4" />
            <h3 className="font-bold text-xl mb-2">WhatsApp</h3>
            <p className="text-gray-400 mb-4">Resposta rápida</p>
            <p 
              className="text-harmonia-green cursor-pointer hover:underline"
              onClick={handleWhatsAppClick}
            >
              +55 11 92058-5072
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
