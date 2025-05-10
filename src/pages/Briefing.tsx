
import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Briefing: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    musicStyle: '',
    references: '',
    emotion: '',
    tempo: '',
    lyrics: '',
    additionalInfo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.phone)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulação de envio do briefing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Briefing enviado!",
        description: "Recebemos seu briefing e entraremos em contato em breve.",
      });
      
      // Redirecionar para página de agradecimento ou limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderNumber: '',
        musicStyle: '',
        references: '',
        emotion: '',
        tempo: '',
        lyrics: '',
        additionalInfo: ''
      });
      setStep(1);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar seu briefing. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Briefing Musical</h1>
            <p className="text-gray-500">
              Preencha o formulário abaixo para nos ajudar a entender melhor o que você procura em sua música personalizada.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${step >= stepNumber ? 'bg-harmonia-green text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {stepNumber}
                  </div>
                  <span className="text-sm text-gray-500">
                    {stepNumber === 1 ? 'Dados Pessoais' : 
                     stepNumber === 2 ? 'Detalhes Musicais' : 'Informações Adicionais'}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-1 mt-4">
              <div 
                className="bg-harmonia-green h-full transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Nome Completo *</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone *</label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="orderNumber" className="block text-sm font-medium mb-1">Número do Pedido (opcional)</label>
                      <Input
                        id="orderNumber"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        placeholder="Se já fez um pedido, informe o número"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                      >
                        Avançar
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="musicStyle" className="block text-sm font-medium mb-1">Estilo Musical</label>
                      <Select
                        onValueChange={(value) => handleSelectChange('musicStyle', value)}
                        value={formData.musicStyle}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estilo musical" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="mpb">MPB</SelectItem>
                          <SelectItem value="sertanejo">Sertanejo</SelectItem>
                          <SelectItem value="funk">Funk</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="classical">Música Clássica</SelectItem>
                          <SelectItem value="electronic">Eletrônica</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="references" className="block text-sm font-medium mb-1">Referências Musicais</label>
                      <Textarea
                        id="references"
                        name="references"
                        value={formData.references}
                        onChange={handleChange}
                        placeholder="Liste artistas, músicas ou estilos que podem servir de inspiração"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="emotion" className="block text-sm font-medium mb-1">Emoção Desejada</label>
                      <Select
                        onValueChange={(value) => handleSelectChange('emotion', value)}
                        value={formData.emotion}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a emoção principal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alegria">Alegria</SelectItem>
                          <SelectItem value="nostalgia">Nostalgia</SelectItem>
                          <SelectItem value="romance">Romance</SelectItem>
                          <SelectItem value="motivacao">Motivação</SelectItem>
                          <SelectItem value="tranquilidade">Tranquilidade</SelectItem>
                          <SelectItem value="energia">Energia</SelectItem>
                          <SelectItem value="tristeza">Melancolia/Tristeza</SelectItem>
                          <SelectItem value="other">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="tempo" className="block text-sm font-medium mb-1">Andamento (Tempo)</label>
                      <Select
                        onValueChange={(value) => handleSelectChange('tempo', value)}
                        value={formData.tempo}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o andamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lenta">Lenta/Balada</SelectItem>
                          <SelectItem value="media">Média/Moderada</SelectItem>
                          <SelectItem value="rapida">Rápida/Agitada</SelectItem>
                          <SelectItem value="variada">Variada (com mudanças)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between space-x-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleBack}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
                      >
                        Avançar
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="lyrics" className="block text-sm font-medium mb-1">Ideia para a Letra</label>
                      <Textarea
                        id="lyrics"
                        name="lyrics"
                        value={formData.lyrics}
                        onChange={handleChange}
                        placeholder="Descreva a história ou tema que gostaria que a letra abordasse"
                        rows={5}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium mb-1">Informações Adicionais</label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Qualquer outra informação relevante para a composição da música"
                        rows={5}
                      />
                    </div>
                    
                    <div className="flex justify-between space-x-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleBack}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1 bg-harmonia-green hover:bg-harmonia-green/90"
                        disabled={submitting}
                      >
                        {submitting ? "Enviando..." : "Enviar Briefing"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Briefing;
