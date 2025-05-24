
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Contact: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Entre em contato</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Seu nome completo" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu.email@exemplo.com" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input id="subject" placeholder="Assunto da mensagem" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea id="message" placeholder="Digite sua mensagem aqui..." rows={5} />
        </div>
        
        <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white">
          Enviar mensagem
        </Button>
      </form>
    </div>
  );
};

export default Contact;
