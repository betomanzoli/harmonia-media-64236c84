
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Music, Heart, Award, Users, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <div className="px-6 md:px-10 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Nossos Serviços</h1>
            <p className="text-xl text-gray-500 mb-8">
              Transformamos suas histórias e emoções em músicas personalizadas que tocam o coração.
            </p>
            <Button 
              size="lg" 
              className="bg-harmonia-green hover:bg-harmonia-green/90"
              onClick={() => navigate('/pacotes')}
            >
              Ver Nossos Pacotes
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="px-6 md:px-10 mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">O que oferecemos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                    <Music className="h-6 w-6 text-harmonia-green" />
                  </div>
                  <CardTitle>Músicas Personalizadas</CardTitle>
                  <CardDescription>Composições únicas criadas especialmente para você</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Composição original baseada na sua história</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Letra personalizada com suas memórias</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Diferentes estilos musicais disponíveis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-harmonia-green" />
                  </div>
                  <CardTitle>Músicas para Momentos Especiais</CardTitle>
                  <CardDescription>Presentes musicais para ocasiões únicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Músicas para casamentos e aniversários</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Declarações de amor em forma de canção</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Músicas para homenagear pessoas queridas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-harmonia-green" />
                  </div>
                  <CardTitle>Produções Profissionais</CardTitle>
                  <CardDescription>Qualidade de estúdio em cada projeto</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Gravação com músicos profissionais</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Mixagem e masterização de alta qualidade</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Entrega em formato digital de alta resolução</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-harmonia-green" />
                  </div>
                  <CardTitle>Atendimento Personalizado</CardTitle>
                  <CardDescription>Acompanhamento durante todo o processo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Reuniões para entender sua história</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Sistema de feedback para ajustes nas prévias</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Suporte durante todas as etapas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-harmonia-green/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-harmonia-green" />
                  </div>
                  <CardTitle>Experiências Musicais</CardTitle>
                  <CardDescription>Momentos únicos através da música</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Apresentações ao vivo da sua música</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Vídeos musicais personalizados</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Surpresas musicais em eventos especiais</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-harmonia-green text-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      onClick={() => navigate('/briefing')}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardTitle>Comece Agora</CardTitle>
                  <CardDescription className="text-white/80">
                    Transforme sua história em música
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Estamos prontos para criar algo único e inesquecível para você.
                    O primeiro passo é preencher nosso briefing.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => navigate('/briefing')}
                  >
                    Preencher Briefing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="px-6 md:px-10">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Pronto para transformar sua história em música?</h2>
            <p className="text-gray-500 mb-6">
              Escolha um dos nossos pacotes e comece a criar sua música personalizada hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="default"
                size="lg"
                className="bg-harmonia-green hover:bg-harmonia-green/90"
                onClick={() => navigate('/pacotes')}
              >
                Ver Pacotes
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/contato')}
              >
                Fale Conosco
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
