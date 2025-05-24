
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const MusicSubmissionPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Música enviada com sucesso",
      description: "Obrigado pelo seu envio. Nossa equipe irá analisar e entrar em contato em breve.",
    });
    
    // Redirect to home page after submission
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Envio de Música</h1>
            <p className="text-gray-500 mb-8 text-center">
              Preencha o formulário abaixo para enviar sua música para nossa análise
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Seu Nome</label>
                <Input id="name" placeholder="Digite seu nome completo" required />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Título da Música</label>
                <Input id="title" placeholder="Digite o título da sua música" required />
              </div>
              
              <div>
                <label htmlFor="genre" className="block text-sm font-medium mb-1">Gênero</label>
                <Input id="genre" placeholder="Ex: Pop, Rock, MPB, etc." required />
              </div>
              
              <div>
                <label htmlFor="link" className="block text-sm font-medium mb-1">Link da Música</label>
                <Input id="link" placeholder="YouTube, SoundCloud, Google Drive, etc." required />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
                <Textarea 
                  id="description" 
                  placeholder="Conte-nos um pouco sobre sua música, inspirações, processo de criação, etc." 
                  rows={5}
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full bg-harmonia-green hover:bg-harmonia-green/90">
                  Enviar Música
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicSubmissionPage;
