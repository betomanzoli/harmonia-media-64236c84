
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Check, Calculator, Info } from 'lucide-react';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Valores base dos pacotes
  const PACKAGE_PRICES = {
    essential: 219,
    professional: 479,
    premium: 969
  };
  
  // Valores dos extras
  const EXTRA_PRICES = {
    revision: 99,
    bnRegistration: 199,
    masteringPremium: 149,
    stems: 129,
    expressDelivery: 199,
    musicXml: 149,
    storage: 49
  };
  
  const [selectedPackage, setSelectedPackage] = useState('essential');
  const [extras, setExtras] = useState({
    revision: false,
    bnRegistration: false,
    masteringPremium: false,
    stems: false,
    expressDelivery: false,
    musicXml: false,
    storage: false
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [basePrice, setBasePrice] = useState(PACKAGE_PRICES.essential);
  const [extrasPrice, setExtrasPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(PACKAGE_PRICES.essential);
  const [showCouponInput, setShowCouponInput] = useState(false);
  
  // Função para verificar se alguns extras estão inclusos em pacotes específicos
  const isExtraIncluded = (extra: string): boolean => {
    if (extra === 'stems' && selectedPackage !== 'essential') return true;
    if (extra === 'masteringPremium' && selectedPackage === 'premium') return true;
    if (extra === 'bnRegistration' && selectedPackage === 'premium') return true;
    if (extra === 'musicXml' && selectedPackage === 'premium') return true;
    return false;
  };
  
  // Função para verificar se um extra está disponível para o pacote selecionado
  const isExtraAvailable = (extra: string): boolean => {
    if (extra === 'bnRegistration' && selectedPackage === 'essential') return false;
    return true;
  };
  
  // Função para validar o cupom e aplicar desconto
  const applyCoupon = () => {
    // Simulação de validação de cupom
    const validCoupons = {
      'PROMO10': 10,
      'HARMON15': 15,
      'SPECIAL5': 5
    };
    
    type CouponKey = keyof typeof validCoupons;
    
    if (couponCode in validCoupons) {
      const discountValue = validCoupons[couponCode as CouponKey];
      setDiscount(discountValue);
      toast({
        title: "Cupom aplicado!",
        description: `Desconto de ${discountValue}% aplicado ao seu pedido.`,
      });
    } else {
      setDiscount(0);
      toast({
        title: "Cupom inválido",
        description: "O código inserido não é válido ou já expirou.",
        variant: "destructive"
      });
    }
  };
  
  // Calcular preço total quando houver mudanças
  useEffect(() => {
    // Preço base do pacote
    const packagePrice = PACKAGE_PRICES[selectedPackage as keyof typeof PACKAGE_PRICES];
    setBasePrice(packagePrice);
    
    // Calcular extras
    let extrasTotal = 0;
    Object.entries(extras).forEach(([key, isSelected]) => {
      if (isSelected && !isExtraIncluded(key)) {
        extrasTotal += EXTRA_PRICES[key as keyof typeof EXTRA_PRICES];
      }
    });
    setExtrasPrice(extrasTotal);
    
    // Calcular preço final com desconto
    const total = packagePrice + extrasTotal;
    const discountAmount = (total * discount) / 100;
    setFinalPrice(total - discountAmount);
  }, [selectedPackage, extras, discount]);
  
  // Função para prosseguir para o briefing
  const proceedToBriefing = () => {
    // Aqui poderia salvar o pacote selecionado e extras em um estado global ou localStorage
    toast({
      title: "Configuração salva!",
      description: "Você será redirecionado para preencher o briefing.",
    });
    
    // Redirecionar para a página inicial e rolar até o formulário de briefing
    navigate('/');
    setTimeout(() => {
      const briefingSection = document.getElementById('briefing');
      if (briefingSection) {
        briefingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Calculadora de Preço</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Seleção de Pacote */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Escolha o Pacote</h2>
              <RadioGroup 
                value={selectedPackage} 
                onValueChange={setSelectedPackage}
                className="grid gap-4"
              >
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <RadioGroupItem value="essential" id="essential" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="essential" className="font-medium">Pacote Essencial - R${PACKAGE_PRICES.essential}</Label>
                    <p className="text-sm text-gray-400">
                      Ideal para presentes emocionais rápidos. Inclui música gerada por IA com revisão humana, certificado digital e uma revisão gratuita.
                    </p>
                  </div>
                </div>
                
                <div className="relative flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors bg-gradient-to-b from-harmonia-green/10 to-transparent">
                  <div className="absolute -top-2 -right-2 bg-harmonia-green text-black text-xs font-semibold py-1 px-2 rounded-full">
                    POPULAR
                  </div>
                  <RadioGroupItem value="professional" id="professional" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="professional" className="font-medium">Pacote Profissional - R${PACKAGE_PRICES.professional}</Label>
                    <p className="text-sm text-gray-400">
                      Perfeito para criadores de conteúdo e pequenos negócios. Inclui 3 variações, stems separados, registro blockchain CBL e 3 revisões gratuitas.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <RadioGroupItem value="premium" id="premium" className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="premium" className="font-medium">Pacote Premium - R${PACKAGE_PRICES.premium}</Label>
                    <p className="text-sm text-gray-400">
                      Melhor opção para empresas e projetos corporativos. Inclui 5 variações, registro BN, partituras MusicXML, suporte pós-venda e revisões ilimitadas.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {/* Serviços Extras */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Serviços Extras</h2>
              <div className="grid gap-4">
                {/* Revisão Extra */}
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <Checkbox 
                    id="revision" 
                    checked={extras.revision}
                    onCheckedChange={(checked) => setExtras({...extras, revision: checked === true})}
                  />
                  <div className="grid gap-1.5 w-full">
                    <div className="flex justify-between">
                      <Label htmlFor="revision" className="font-medium">Revisão Extra</Label>
                      <span className="text-harmonia-green font-semibold">+R${EXTRA_PRICES.revision}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Peça uma revisão adicional para ajustar a letra ou melodia da sua música.
                    </p>
                  </div>
                </div>
                
                {/* Registro BN */}
                <div className={`flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors ${!isExtraAvailable('bnRegistration') ? 'opacity-50' : ''} ${isExtraIncluded('bnRegistration') ? 'bg-harmonia-green/10' : ''}`}>
                  <Checkbox 
                    id="bnRegistration" 
                    checked={extras.bnRegistration || isExtraIncluded('bnRegistration')}
                    onCheckedChange={(checked) => setExtras({...extras, bnRegistration: checked === true})}
                    disabled={!isExtraAvailable('bnRegistration') || isExtraIncluded('bnRegistration')}
                  />
                  <div className="grid gap-1.5 w-full">
                    <div className="flex justify-between">
                      <Label htmlFor="bnRegistration" className="font-medium">Registro na Biblioteca Nacional</Label>
                      {isExtraIncluded('bnRegistration') ? (
                        <span className="text-harmonia-green font-semibold flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Incluso
                        </span>
                      ) : (
                        <span className="text-harmonia-green font-semibold">+R${EXTRA_PRICES.bnRegistration}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Garanta proteção legal com o registro tradicional na BN, além do blockchain CBL.
                      {!isExtraAvailable('bnRegistration') && (
                        <span className="block mt-1 text-amber-400">* Disponível apenas para pacotes Profissional e Premium</span>
                      )}
                      {isExtraIncluded('bnRegistration') && (
                        <span className="block mt-1 text-harmonia-green">* Já incluído no pacote Premium</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Masterização Premium */}
                <div className={`flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors ${isExtraIncluded('masteringPremium') ? 'bg-harmonia-green/10' : ''}`}>
                  <Checkbox 
                    id="masteringPremium" 
                    checked={extras.masteringPremium || isExtraIncluded('masteringPremium')}
                    onCheckedChange={(checked) => setExtras({...extras, masteringPremium: checked === true})}
                    disabled={isExtraIncluded('masteringPremium')}
                  />
                  <div className="grid gap-1.5 w-full">
                    <div className="flex justify-between">
                      <Label htmlFor="masteringPremium" className="font-medium">Masterização Premium</Label>
                      {isExtraIncluded('masteringPremium') ? (
                        <span className="text-harmonia-green font-semibold flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Incluso
                        </span>
                      ) : (
                        <span className="text-harmonia-green font-semibold">+R${EXTRA_PRICES.masteringPremium}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Melhore a qualidade sonora com masterização avançada em formato WAV 24-bit.
                      {isExtraIncluded('masteringPremium') && (
                        <span className="block mt-1 text-harmonia-green">* Já incluído no pacote Premium</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Stems Separados */}
                <div className={`flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors ${isExtraIncluded('stems') ? 'bg-harmonia-green/10' : ''}`}>
                  <Checkbox 
                    id="stems" 
                    checked={extras.stems || isExtraIncluded('stems')}
                    onCheckedChange={(checked) => setExtras({...extras, stems: checked === true})}
                    disabled={isExtraIncluded('stems')}
                  />
                  <div className="grid gap-1.5 w-full">
                    <div className="flex justify-between">
                      <Label htmlFor="stems" className="font-medium">Stems Separados</Label>
                      {isExtraIncluded('stems') ? (
                        <span className="text-harmonia-green font-semibold flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Incluso
                        </span>
                      ) : (
                        <span className="text-harmonia-green font-semibold">+R${EXTRA_PRICES.stems}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Receba faixas separadas (vocais, instrumentos, etc.) para maior flexibilidade em edições futuras.
                      {isExtraIncluded('stems') && (
                        <span className="block mt-1 text-harmonia-green">* Já incluído nos pacotes Profissional e Premium</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Entrega Expressa */}
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <Checkbox 
                    id="expressDelivery" 
                    checked={extras.expressDelivery}
                    onCheckedChange={(checked) => setExtras({...extras, expressDelivery: checked === true})}
                  />
                  <div className="grid gap-1.5 w-full">
                    <div className="flex justify-between">
                      <Label htmlFor="expressDelivery" className="font-medium">Entrega Expressa (48h)</Label>
                      <span className="text-harmonia-green font-semibold">+R${EXTRA_PRICES.expressDelivery}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Priorize seu projeto e receba sua música finalizada em até 48 horas.
                    </p>
                  </div>
                </div>
                
                {/* Partituras MusicXML/PDF */}
                <div className={`flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors ${isExtraIncluded('musicXml') ? 'bg-harmonia-green/10' : ''}`}>
                  <Checkbox 
                    id="musicXml" 
                    checked={extras.musicXml || isExtraIncluded('musicXml')}
                    onCheckedChange={(checked) => setExtras({...extras, musicXml: checked === true})}
                    disabled={isExtraIncluded('musicXml')}
                  />
                  <div className="grid gap-1.5 w-full">
                    <div className="flex justify-between">
                      <Label htmlFor="musicXml" className="font-medium">Partituras MusicXML/PDF</Label>
                      {isExtraIncluded('musicXml') ? (
                        <span className="text-harmonia-green font-semibold flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Incluso
                        </span>
                      ) : (
                        <span className="text-harmonia-green font-semibold">+R${EXTRA_PRICES.musicXml}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Receba a partitura completa da sua música em formato MusicXML ou PDF, ideal para músicos e bandas.
                      {isExtraIncluded('musicXml') && (
                        <span className="block mt-1 text-harmonia-green">* Já incluído no pacote Premium</span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Armazenamento Premium */}
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <Checkbox 
                    id="storage" 
                    checked={extras.storage}
                    onCheckedChange={(checked) => setExtras({...extras, storage: checked === true})}
                  />
                  <div className="grid gap-1.5 w-full">
                    <div className="flex justify-between">
                      <Label htmlFor="storage" className="font-medium">Armazenamento Premium (12 meses)</Label>
                      <span className="text-harmonia-green font-semibold">+R${EXTRA_PRICES.storage}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Mantenha seus arquivos seguros por mais tempo. Por padrão, os arquivos do projeto ficam disponíveis por até 7 dias após a entrega final.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cupom de Desconto */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cupom de Desconto</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCouponInput(!showCouponInput)}
                >
                  {showCouponInput ? "Cancelar" : "Adicionar Cupom"}
                </Button>
              </div>
              
              {showCouponInput && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Digite seu cupom"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button onClick={applyCoupon}>Aplicar</Button>
                </div>
              )}
              
              {discount > 0 && (
                <div className="mt-4 p-3 bg-harmonia-green/10 border border-harmonia-green/30 rounded-md flex items-center gap-2">
                  <Check className="h-5 w-5 text-harmonia-green flex-shrink-0" />
                  <span>Cupom aplicado! Desconto de {discount}% no valor total.</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Resumo */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pacote {selectedPackage === 'essential' ? 'Essencial' : selectedPackage === 'professional' ? 'Profissional' : 'Premium'}</span>
                  <span>R${basePrice.toFixed(2)}</span>
                </div>
                
                {extrasPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Extras</span>
                    <span>+R${extrasPrice.toFixed(2)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-harmonia-green">
                    <span>Desconto ({discount}%)</span>
                    <span>-R${((basePrice + extrasPrice) * discount / 100).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-border flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R${finalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-harmonia-green hover:bg-harmonia-green/90 text-white h-12"
                  onClick={proceedToBriefing}
                >
                  Prosseguir para Briefing
                </Button>
                
                <div className="flex items-start gap-2 text-sm text-gray-400 p-3 bg-background rounded-md">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>Os preços são em reais (BRL) e incluem todos os impostos aplicáveis.</p>
                    <p className="mt-1">O pagamento será solicitado após a aprovação do briefing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculator;
