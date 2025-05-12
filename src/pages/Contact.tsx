
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site';

const Contact: React.FC = () => {
  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
            <p className="text-gray-500 max-w-3xl mx-auto">
              Estamos prontos para transformar sua história em música. Preencha o formulário abaixo ou utilize um de nossos canais de atendimento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input id="name" placeholder="Seu nome" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" placeholder="(00) 00000-0000" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um assunto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="musica-personalizada">Música Personalizada</SelectItem>
                            <SelectItem value="producao-musical">Produção Musical</SelectItem>
                            <SelectItem value="trilha-sonora">Trilha Sonora</SelectItem>
                            <SelectItem value="registro">Registro de Música</SelectItem>
                            <SelectItem value="parceria">Parceria</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea id="message" placeholder="Como podemos ajudar?" rows={5} />
                    </div>
                    
                    <div>
                      <Button className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white">
                        Enviar Mensagem
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Perguntas Frequentes</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-harmonia-green">Qual o prazo para receber minha música?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      O prazo varia de acordo com o pacote escolhido, mas geralmente entre 5 a 10 dias úteis após a aprovação do briefing.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-harmonia-green">Posso fazer alterações na música?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Sim, todos os pacotes incluem ajustes. A quantidade de revisões varia de acordo com o pacote contratado.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-harmonia-green">Como funciona o processo criativo?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Após o preenchimento do briefing detalhado, nossa equipe criativa desenvolve propostas musicais para sua aprovação, refinando a composição até a versão final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Informações de Contato</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-harmonia-green mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">{siteConfig.contact.email}</p>
                        <p className="text-gray-500 text-sm">Resposta em até 24h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-harmonia-green mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Telefone / WhatsApp</h3>
                        <p className="text-gray-600">{siteConfig.contact.whatsapp}</p>
                        <p className="text-gray-500 text-sm">Seg-Sex, 9h às 18h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-harmonia-green mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Localização</h3>
                        <p className="text-gray-600">Atendimento Online</p>
                        <p className="text-gray-500 text-sm">Todo o Brasil</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-harmonia-green mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium">Horário de Atendimento</h3>
                        <p className="text-gray-600">Segunda a Sexta</p>
                        <p className="text-gray-500 text-sm">Das 9h às 18h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Redes Sociais</h2>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://instagram.com/harmonia.media" target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </Button>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://youtube.com/harmonia.media" target="_blank" rel="noopener noreferrer">
                        YouTube
                      </a>
                    </Button>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://facebook.com/harmonia.media" target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </Button>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://tiktok.com/@harmonia.media" target="_blank" rel="noopener noreferrer">
                        TikTok
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Atendimento Prioritário</h3>
                <p className="text-blue-600 text-sm mb-4">
                  Clientes com projetos em andamento têm canal de atendimento exclusivo e prioritário.
                </p>
                <Button variant="link" className="text-blue-700 p-0 h-auto" asChild>
                  <a href="/cliente">Área do Cliente</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
