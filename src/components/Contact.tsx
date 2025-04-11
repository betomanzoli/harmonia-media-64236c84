
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to a server
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
  };

  // Corrigindo para usar propriedades que existem no objeto
  const email = siteConfig.contact.email;
  const address = siteConfig.contact.address;
  const phone = siteConfig.contact.phone;
  const whatsapp = siteConfig.contact.whatsapp;

  return (
    <section id="contato" className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Estamos à disposição para tirar suas dúvidas, receber sugestões ou discutir seu projeto musical personalizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Envie uma Mensagem</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                  <Input id="name" placeholder="Seu nome" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="seu.email@exemplo.com" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">Assunto</label>
                <Input id="subject" placeholder="Assunto da mensagem" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">Mensagem</label>
                <Textarea 
                  id="message" 
                  placeholder="Escreva sua mensagem aqui..." 
                  className="min-h-[120px]" 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Informações de Contato</h3>
            
            <div className="space-y-8">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-harmonia-green/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-harmonia-green" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Telefone</h4>
                    <p className="text-gray-500">{phone}</p>
                    <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-harmonia-green hover:underline">
                      Ligar agora
                    </a>
                  </div>
                </div>
              </Card>
              
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
              
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-harmonia-green/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-harmonia-green" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Endereço</h4>
                    <p className="text-gray-500">{address}</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-8">
              <h4 className="font-medium mb-4">Horário de Atendimento</h4>
              <p className="text-gray-500">Segunda a Sexta: 9h às 18h</p>
              <p className="text-gray-500">Sábado: 9h às 13h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
