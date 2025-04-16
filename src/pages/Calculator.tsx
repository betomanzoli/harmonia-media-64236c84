import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Calculator, Clock, Clock3, Headphones, Music, ShieldCheck, Check, InfoIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NavLink from '@/components/NavLink';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Base price configurations
  const basePrices = {
    essencial: 997,
    profissional: 1997,
    premium: 2997
  };
  
  // State
  const [basePackage, setBasePackage] = useState<'essencial' | 'profissional' | 'premium'>('profissional');
  const [duration, setDuration] = useState<number>(3);
  const [versions, setVersions] = useState<number>(3);
  const [instruments, setInstruments] = useState<number>(5);
  const [urgencyDays, setUrgencyDays] = useState<number>(7);
  const [vocals, setVocals] = useState<boolean>(false);
  const [lyrics, setLyrics] = useState<boolean>(false);
  const [stems, setStems] = useState<boolean>(false);
  const [commercial, setCommercial] = useState<boolean>(false);
  
  // Price calculation
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [extras, setExtras] = useState<number>(0);
  
  // Calculate prices when options change
  useEffect(() => {
    let basePrice = basePrices[basePackage];
    let extrasPrice = 0;
    
    // Duration extras (base is 3 minutes)
    if (duration > 3) {
      extrasPrice += (duration - 3) * 200;
    }
    
    // Versions extras (base depends on package)
    const baseVersions = basePackage === 'essencial' ? 3 : basePackage === 'profissional' ? 5 : 7;
    if (versions > baseVersions) {
      extrasPrice += (versions - baseVersions) * 150;
    }
    
    // Instruments extras (base depends on package)
    const baseInstruments = basePackage === 'essencial' ? 5 : basePackage === 'profissional' ? 12 : 20;
    if (instruments > baseInstruments) {
      extrasPrice += (instruments - baseInstruments) * 100;
    }
    
    // Urgency extras (base is 7 days)
    if (urgencyDays < 7) {
      extrasPrice += (7 - urgencyDays) * 300;
    }
    
    // Other extras
    if (vocals) extrasPrice += 500;
    if (lyrics) extrasPrice += 300;
    if (stems) extrasPrice += 200;
    if (commercial) extrasPrice += 1000;
    
    setExtras(extrasPrice);
    setTotalPrice(basePrice + extrasPrice);
  }, [basePackage, duration, versions, instruments, urgencyDays, vocals, lyrics, stems, commercial]);
  
  const handleSubmit = () => {
    // Salvar os dados do cálculo para uso no fluxo de pagamento
    localStorage.setItem('calculatorData', JSON.stringify({
      basePackage,
      duration,
      versions,
      instruments,
      urgencyDays,
      vocals,
      lyrics,
      stems,
      commercial,
      totalPrice,
      extras
    }));
    
    toast({
      title: "Cálculo concluído!",
      description: "Prosseguindo para a página de pagamento."
    });
    
    navigate(`/pagamento/${basePackage}`);
  };

  return (
    <div className="pt-24 pb-20 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1 text-gray-400 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
          </Button>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Calculadora de Preço</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Configure as opções abaixo para calcular o preço da sua música personalizada.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="text-harmonia-green h-5 w-5" />
                  Pacote Base
                </CardTitle>
                <CardDescription>
                  Escolha o pacote que melhor se adapta às suas necessidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={basePackage}
                  onValueChange={(value: 'essencial' | 'profissional' | 'premium') => setBasePackage(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essencial">Essencial (R$ 997)</SelectItem>
                    <SelectItem value="profissional">Profissional (R$ 1.997)</SelectItem>
                    <SelectItem value="premium">Premium (R$ 2.997)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={`border-2 ${basePackage === 'essencial' ? 'border-harmonia-green' : 'border-transparent'} hover:border-harmonia-green`}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Essencial</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-2xl font-bold mb-2">R$ 997</p>
                      <ul className="text-sm space-y-1 text-gray-400">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 3 minutos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 3 versões</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 5 instrumentos</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        variant={basePackage === 'essencial' ? 'default' : 'outline'} 
                        className={basePackage === 'essencial' ? 'bg-harmonia-green hover:bg-harmonia-green/90 w-full' : 'w-full'} 
                        onClick={() => setBasePackage('essencial')}
                      >
                        {basePackage === 'essencial' ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className={`border-2 ${basePackage === 'profissional' ? 'border-harmonia-green' : 'border-transparent'} hover:border-harmonia-green`}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Profissional</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-2xl font-bold mb-2">R$ 1.997</p>
                      <ul className="text-sm space-y-1 text-gray-400">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 4 minutos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 5 versões</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 12 instrumentos</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        variant={basePackage === 'profissional' ? 'default' : 'outline'} 
                        className={basePackage === 'profissional' ? 'bg-harmonia-green hover:bg-harmonia-green/90 w-full' : 'w-full'} 
                        onClick={() => setBasePackage('profissional')}
                      >
                        {basePackage === 'profissional' ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className={`border-2 ${basePackage === 'premium' ? 'border-harmonia-green' : 'border-transparent'} hover:border-harmonia-green`}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Premium</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-2xl font-bold mb-2">R$ 2.997</p>
                      <ul className="text-sm space-y-1 text-gray-400">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 5 minutos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Até 7 versões</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-harmonia-green mt-0.5" />
                          <span>Instrumentos ilimitados</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        variant={basePackage === 'premium' ? 'default' : 'outline'} 
                        className={basePackage === 'premium' ? 'bg-harmonia-green hover:bg-harmonia-green/90 w-full' : 'w-full'} 
                        onClick={() => setBasePackage('premium')}
                      >
                        {basePackage === 'premium' ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="text-harmonia-green h-5 w-5" />
                  Personalize sua música
                </CardTitle>
                <CardDescription>
                  Ajuste as características da sua composição
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Duração (minutos)</label>
                    <span className="bg-harmonia-green/20 text-harmonia-green text-xs px-2 py-1 rounded-full">
                      {duration} minutos
                    </span>
                  </div>
                  <Slider
                    value={[duration]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setDuration(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Número de versões diferentes</label>
                    <span className="bg-harmonia-green/20 text-harmonia-green text-xs px-2 py-1 rounded-full">
                      {versions} versões
                    </span>
                  </div>
                  <Slider
                    value={[versions]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setVersions(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Número de instrumentos</label>
                    <span className="bg-harmonia-green/20 text-harmonia-green text-xs px-2 py-1 rounded-full">
                      {instruments} {instruments > 20 ? '(ilimitado)' : ''}
                    </span>
                  </div>
                  <Slider
                    value={[instruments]}
                    min={1}
                    max={25}
                    step={1}
                    onValueChange={(value) => setInstruments(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1">
                      <label className="text-sm font-medium">Urgência (dias para entrega)</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Quanto menor o prazo, maior o custo adicional</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="bg-harmonia-green/20 text-harmonia-green text-xs px-2 py-1 rounded-full">
                      {urgencyDays} dias
                    </span>
                  </div>
                  <Slider
                    value={[urgencyDays]}
                    min={1}
                    max={15}
                    step={1}
                    onValueChange={(value) => setUrgencyDays(value[0])}
                  />
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="font-semibold">Extras</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Incluir vocais</label>
                      <p className="text-xs text-gray-500">Adicionamos uma voz profissional à sua composição (+R$ 500)</p>
                    </div>
                    <Switch checked={vocals} onCheckedChange={setVocals} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Incluir letra</label>
                      <p className="text-xs text-gray-500">Nossa equipe escreve a letra para sua música (+R$ 300)</p>
                    </div>
                    <Switch checked={lyrics} onCheckedChange={setLyrics} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Stems separados</label>
                      <p className="text-xs text-gray-500">Receba cada faixa de instrumento separadamente (+R$ 200)</p>
                    </div>
                    <Switch checked={stems} onCheckedChange={setStems} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Licença comercial</label>
                      <p className="text-xs text-gray-500">Use a música para fins comerciais (+R$ 1.000)</p>
                    </div>
                    <Switch checked={commercial} onCheckedChange={setCommercial} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="text-harmonia-green h-5 w-5" />
                    Resumo do Orçamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Pacote Base:</span>
                    <span className="font-semibold">
                      {Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(basePrices[basePackage])}
                    </span>
                  </div>
                  
                  {extras > 0 && (
                    <div className="flex justify-between">
                      <span>Extras:</span>
                      <span className="font-semibold">
                        {Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(extras)}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-xl text-harmonia-green">
                      {Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(totalPrice)}
                    </span>
                  </div>
                  
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-start gap-2 mb-4">
                      <Clock3 className="h-5 w-5 text-harmonia-green shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Prazo de Entrega</p>
                        <p className="text-sm text-gray-400">
                          {urgencyDays} dias úteis a partir da aprovação do briefing
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="h-5 w-5 text-harmonia-green shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Garantia de Satisfação</p>
                        <p className="text-sm text-gray-400">
                          Revisões incluídas até sua aprovação final
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button
                    className="w-full bg-harmonia-green hover:bg-harmonia-green/90 mb-2"
                    onClick={handleSubmit}
                  >
                    Prosseguir para Pagamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="text-xs text-center text-gray-500 mt-2">
                    Ao prosseguir, você será redirecionado para a página de pagamento.
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
