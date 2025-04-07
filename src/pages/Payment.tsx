
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, CreditCard, ArrowLeft, FileText, HelpCircle } from 'lucide-react';
import { QualificationData } from '@/types/qualification';
import { getRecommendedPackage } from '@/utils/packageRecommendation';

enum PaymentStep {
  REVIEW_ORDER = 'review',
  CUSTOMER_INFO = 'customer',
  PAYMENT_METHOD = 'payment',
  INVOICE_INFO = 'invoice',
  CONFIRMATION = 'confirmation'
}

enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal'
}

interface PaymentState {
  packageType: 'essencial' | 'profissional' | 'premium';
  extras: string[];
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    cpfCnpj: string;
  };
  paymentMethod: PaymentMethod;
  invoiceType: 'cpf' | 'cnpj';
  needsInvoice: boolean;
  termsAccepted: boolean;
  invoiceInfo: {
    name: string;
    cpfCnpj: string;
    email: string;
    address: string;
    additionalInfo: string;
  };
  total: number;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { packageId } = useParams<{ packageId: string }>();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.REVIEW_ORDER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<QualificationData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentState>({
    packageType: 'essencial',
    extras: [],
    customerInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      cpfCnpj: '',
    },
    paymentMethod: PaymentMethod.CREDIT_CARD,
    invoiceType: 'cpf',
    needsInvoice: true,
    termsAccepted: false,
    invoiceInfo: {
      name: '',
      cpfCnpj: '',
      email: '',
      address: '',
      additionalInfo: '',
    },
    total: 0
  });
  
  // Funções para obter preços
  const getPackagePrice = (packageType: 'essencial' | 'profissional' | 'premium'): number => {
    switch (packageType) {
      case 'essencial': return 219;
      case 'profissional': return 479;
      case 'premium': return 969;
      default: return 0;
    }
  };
  
  const getExtraPrice = (extraName: string): number => {
    const prices: Record<string, number> = {
      'Revisão Extra': 79,
      'Registro na BN (Letra)': 99,
      'Registro UBC': 249,
      'Masterização Premium': 149,
      'Stems Separados': 129,
      'Entrega Expressa': 149,
      'Partituras MusicXML/PDF': 149,
      'Composição sem IA (letra)': 499,
      'Composição sem IA (letra + melodia com partitura)': 1499
    };
    
    return prices[extraName] || 0;
  };
  
  const calculateTotal = (packageType: 'essencial' | 'profissional' | 'premium', extras: string[]): number => {
    const basePrice = getPackagePrice(packageType);
    const extrasTotal = extras.reduce((sum, extra) => sum + getExtraPrice(extra), 0);
    return basePrice + extrasTotal;
  };
  
  // Carregar dados da qualificação
  useEffect(() => {
    const savedData = localStorage.getItem('qualificationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData) as QualificationData;
      setUserData(parsedData);
      
      // Determinar pacote recomendado se não especificado na URL
      const recommendedPkg = packageId || getRecommendedPackage(parsedData);
      
      // Preencher informações do cliente com dados da qualificação
      setPaymentData(prev => ({
        ...prev,
        packageType: recommendedPkg as 'essencial' | 'profissional' | 'premium',
        customerInfo: {
          ...prev.customerInfo,
          fullName: parsedData.name || '',
          email: parsedData.email || '',
          phone: parsedData.phone || '',
        },
        invoiceInfo: {
          ...prev.invoiceInfo,
          name: parsedData.name || '',
          email: parsedData.email || '',
        }
      }));
    } else {
      // Se não houver dados, redirecionar para qualificação
      navigate('/qualificacao');
    }
  }, [packageId, navigate]);
  
  // Atualizar total quando pacote ou extras mudam
  useEffect(() => {
    const total = calculateTotal(paymentData.packageType, paymentData.extras);
    setPaymentData(prev => ({ ...prev, total }));
  }, [paymentData.packageType, paymentData.extras]);
  
  const handleNext = () => {
    // Validar dados do passo atual
    if (currentStep === PaymentStep.REVIEW_ORDER) {
      setCurrentStep(PaymentStep.CUSTOMER_INFO);
    } else if (currentStep === PaymentStep.CUSTOMER_INFO) {
      // Validar informações do cliente
      if (!paymentData.customerInfo.fullName || !paymentData.customerInfo.email || !paymentData.customerInfo.phone) {
        toast({
          title: "Informações incompletas",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return;
      }
      setCurrentStep(PaymentStep.PAYMENT_METHOD);
    } else if (currentStep === PaymentStep.PAYMENT_METHOD) {
      if (!paymentData.termsAccepted) {
        toast({
          title: "Termos não aceitos",
          description: "Você precisa aceitar os termos de serviço para continuar.",
          variant: "destructive"
        });
        return;
      }
      if (paymentData.needsInvoice) {
        setCurrentStep(PaymentStep.INVOICE_INFO);
      } else {
        processPayment();
      }
    } else if (currentStep === PaymentStep.INVOICE_INFO) {
      // Validar informações para nota fiscal
      if (!paymentData.invoiceInfo.name || !paymentData.invoiceInfo.cpfCnpj || !paymentData.invoiceInfo.email) {
        toast({
          title: "Informações incompletas",
          description: "Por favor, preencha todos os campos obrigatórios para a nota fiscal.",
          variant: "destructive"
        });
        return;
      }
      processPayment();
    }
  };
  
  const handleBack = () => {
    if (currentStep === PaymentStep.CUSTOMER_INFO) {
      setCurrentStep(PaymentStep.REVIEW_ORDER);
    } else if (currentStep === PaymentStep.PAYMENT_METHOD) {
      setCurrentStep(PaymentStep.CUSTOMER_INFO);
    } else if (currentStep === PaymentStep.INVOICE_INFO) {
      setCurrentStep(PaymentStep.PAYMENT_METHOD);
    } else if (currentStep === PaymentStep.CONFIRMATION) {
      // No back from confirmation
    }
  };
  
  const processPayment = () => {
    setIsSubmitting(true);
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(PaymentStep.CONFIRMATION);
      
      // Registrar os dados de pagamento no localStorage para uso posterior
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      toast({
        title: "Pagamento processado com sucesso!",
        description: "Seu pedido foi confirmado e você receberá um email com os detalhes.",
      });
    }, 2000);
  };
  
  const handleToggleExtra = (extraName: string) => {
    setPaymentData(prev => {
      if (prev.extras.includes(extraName)) {
        return { ...prev, extras: prev.extras.filter(e => e !== extraName) };
      } else {
        return { ...prev, extras: [...prev.extras, extraName] };
      }
    });
  };
  
  // Renderização condicional com base no passo atual
  const renderStep = () => {
    switch (currentStep) {
      case PaymentStep.REVIEW_ORDER:
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Detalhes do Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start p-4 bg-background/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Pacote {paymentData.packageType === 'essencial' ? 'Essencial' : paymentData.packageType === 'profissional' ? 'Profissional' : 'Premium'}</h3>
                    <p className="text-sm text-gray-400">Música personalizada com processo harmonIA</p>
                  </div>
                  <span className="font-semibold">R${getPackagePrice(paymentData.packageType)}</span>
                </div>
                
                <div className="py-4">
                  <h3 className="font-medium mb-3">Serviços Extras Recomendados</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="extra-revision" 
                        checked={paymentData.extras.includes('Revisão Extra')}
                        onCheckedChange={() => handleToggleExtra('Revisão Extra')}
                      />
                      <div className="grid gap-1.5 w-full">
                        <div className="flex justify-between">
                          <Label htmlFor="extra-revision" className="font-medium">Revisão Extra</Label>
                          <span className="text-harmonia-green font-semibold">+R$79</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Peça uma revisão adicional para ajustar a letra ou melodia da sua música.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="extra-ubc" 
                        checked={paymentData.extras.includes('Registro UBC')}
                        onCheckedChange={() => handleToggleExtra('Registro UBC')}
                      />
                      <div className="grid gap-1.5 w-full">
                        <div className="flex justify-between">
                          <Label htmlFor="extra-ubc" className="font-medium">Registro UBC</Label>
                          <span className="text-harmonia-green font-semibold">+R$249</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Registro completo na UBC (letra, melodia, arranjo) com código ISWC para direitos de execução pública.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="extra-express" 
                        checked={paymentData.extras.includes('Entrega Expressa')}
                        onCheckedChange={() => handleToggleExtra('Entrega Expressa')}
                      />
                      <div className="grid gap-1.5 w-full">
                        <div className="flex justify-between">
                          <Label htmlFor="extra-express" className="font-medium">Entrega Expressa (48h)</Label>
                          <span className="text-harmonia-green font-semibold">+R$149</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Priorize seu projeto e receba sua música finalizada em até 48 horas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R${paymentData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-harmonia-green/10 border border-harmonia-green/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-harmonia-green h-5 w-5 mt-1" />
                <div>
                  <h3 className="font-medium text-harmonia-green">Satisfação garantida</h3>
                  <p className="text-sm text-gray-300">Se você não ficar satisfeito, oferecemos até 3 revisões gratuitas. Nosso objetivo é entregar exatamente o que você imagina.</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case PaymentStep.CUSTOMER_INFO:
        return (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nome Completo*</Label>
                <Input 
                  id="fullName" 
                  value={paymentData.customerInfo.fullName}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    customerInfo: { ...paymentData.customerInfo, fullName: e.target.value }
                  })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={paymentData.customerInfo.email}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    customerInfo: { ...paymentData.customerInfo, email: e.target.value }
                  })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone*</Label>
                <Input 
                  id="phone" 
                  value={paymentData.customerInfo.phone}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    customerInfo: { ...paymentData.customerInfo, phone: e.target.value }
                  })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input 
                  id="address" 
                  value={paymentData.customerInfo.address}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    customerInfo: { ...paymentData.customerInfo, address: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input 
                  id="cpfCnpj" 
                  value={paymentData.customerInfo.cpfCnpj}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    customerInfo: { ...paymentData.customerInfo, cpfCnpj: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        );
        
      case PaymentStep.PAYMENT_METHOD:
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
              
              <RadioGroup 
                value={paymentData.paymentMethod} 
                onValueChange={(value) => setPaymentData({
                  ...paymentData,
                  paymentMethod: value as PaymentMethod
                })}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <RadioGroupItem value={PaymentMethod.CREDIT_CARD} id="credit-card" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="credit-card" className="font-medium">Cartão de Crédito</Label>
                    <p className="text-sm text-gray-400">
                      Pagamento seguro processado pela Stripe. Parcelamento em até 12x.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <RadioGroupItem value={PaymentMethod.PIX} id="pix" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="pix" className="font-medium">PIX</Label>
                    <p className="text-sm text-gray-400">
                      Pagamento instantâneo com PIX. 5% de desconto para pagamento à vista.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <RadioGroupItem value={PaymentMethod.BANK_TRANSFER} id="bank-transfer" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="bank-transfer" className="font-medium">Transferência Bancária</Label>
                    <p className="text-sm text-gray-400">
                      Transferência para conta bancária. 3% de desconto para pagamento à vista.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
                  <RadioGroupItem value={PaymentMethod.PAYPAL} id="paypal" />
                  <div className="grid gap-1.5 w-full">
                    <Label htmlFor="paypal" className="font-medium">PayPal</Label>
                    <p className="text-sm text-gray-400">
                      Pagamento seguro via PayPal.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Nota Fiscal</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="needsInvoice" 
                    checked={paymentData.needsInvoice}
                    onCheckedChange={(checked) => setPaymentData({
                      ...paymentData,
                      needsInvoice: checked === true
                    })}
                  />
                  <div>
                    <Label htmlFor="needsInvoice" className="font-medium">Desejo receber nota fiscal</Label>
                    <p className="text-sm text-gray-400">
                      Você poderá fornecer os dados para emissão da nota fiscal no próximo passo.
                    </p>
                  </div>
                </div>
                
                {paymentData.needsInvoice && (
                  <div className="pl-6 border-l-2 border-harmonia-green/20 mt-2">
                    <RadioGroup 
                      value={paymentData.invoiceType} 
                      onValueChange={(value) => setPaymentData({
                        ...paymentData,
                        invoiceType: value as 'cpf' | 'cnpj'
                      })}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cpf" id="cpf" />
                        <Label htmlFor="cpf">Pessoa Física (CPF)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cnpj" id="cnpj" />
                        <Label htmlFor="cnpj">Pessoa Jurídica (CNPJ)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-2 p-4 border border-border rounded-lg">
              <Checkbox 
                id="termsAccepted" 
                checked={paymentData.termsAccepted}
                onCheckedChange={(checked) => setPaymentData({
                  ...paymentData,
                  termsAccepted: checked === true
                })}
              />
              <div>
                <Label htmlFor="termsAccepted" className="font-medium">Aceito os termos de serviço</Label>
                <p className="text-sm text-gray-400">
                  Li e concordo com os <a href="/termos" target="_blank" className="text-harmonia-green hover:underline">Termos de Serviço</a> e <a href="/privacidade" target="_blank" className="text-harmonia-green hover:underline">Política de Privacidade</a> da harmonIA.
                </p>
              </div>
            </div>
          </div>
        );
        
      case PaymentStep.INVOICE_INFO:
        return (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-harmonia-green h-5 w-5" />
              <h2 className="text-xl font-semibold">Informações para Nota Fiscal</h2>
            </div>
            
            <div className="bg-harmonia-green/10 border border-harmonia-green/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="text-harmonia-green h-5 w-5 mt-1" />
                <div>
                  <h3 className="font-medium text-harmonia-green">Sobre a emissão de notas fiscais</h3>
                  <p className="text-sm text-gray-300">
                    A nota fiscal será emitida em até 3 dias úteis após a confirmação do pagamento e enviada para o email informado abaixo.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="invoiceName">Nome/Razão Social*</Label>
                <Input 
                  id="invoiceName" 
                  value={paymentData.invoiceInfo.name}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    invoiceInfo: { ...paymentData.invoiceInfo, name: e.target.value }
                  })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="invoiceCpfCnpj">{paymentData.invoiceType === 'cpf' ? 'CPF' : 'CNPJ'}*</Label>
                <Input 
                  id="invoiceCpfCnpj" 
                  value={paymentData.invoiceInfo.cpfCnpj}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    invoiceInfo: { ...paymentData.invoiceInfo, cpfCnpj: e.target.value }
                  })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="invoiceEmail">Email para envio da NF*</Label>
                <Input 
                  id="invoiceEmail" 
                  type="email"
                  value={paymentData.invoiceInfo.email}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    invoiceInfo: { ...paymentData.invoiceInfo, email: e.target.value }
                  })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="invoiceAddress">Endereço Completo</Label>
                <Input 
                  id="invoiceAddress" 
                  value={paymentData.invoiceInfo.address}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    invoiceInfo: { ...paymentData.invoiceInfo, address: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="invoiceAdditionalInfo">Informações Adicionais (opcional)</Label>
                <Input 
                  id="invoiceAdditionalInfo" 
                  value={paymentData.invoiceInfo.additionalInfo}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    invoiceInfo: { ...paymentData.invoiceInfo, additionalInfo: e.target.value }
                  })}
                  placeholder="Informações adicionais para a nota fiscal"
                />
              </div>
            </div>
          </div>
        );
        
      case PaymentStep.CONFIRMATION:
        return (
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-harmonia-green/20 mb-6">
              <CheckCircle className="w-10 h-10 text-harmonia-green" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Recebemos seu pagamento com sucesso. Em breve você receberá um email com as instruções para preencher o briefing detalhado da sua música personalizada.
              </p>
            </div>
            
            <Card className="p-6 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="text-gray-400">Número do Pedido:</span>
                  <span className="font-medium">#HAR{Math.floor(Math.random() * 10000).toString().padStart(5, '0')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Pacote:</span>
                  <span className="font-medium">
                    {paymentData.packageType === 'essencial' ? 'Essencial' : 
                     paymentData.packageType === 'profissional' ? 'Profissional' : 'Premium'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-bold">R${paymentData.total.toFixed(2)}</span>
                </div>
                
                {paymentData.needsInvoice && (
                  <div className="flex items-center pt-2 border-t border-border">
                    <FileText className="w-4 h-4 text-harmonia-green mr-2" />
                    <span className="text-sm">
                      Nota fiscal será emitida em até 3 dias úteis
                    </span>
                  </div>
                )}
              </div>
            </Card>
            
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="font-semibold">Próximos Passos:</h3>
              <ol className="space-y-3 text-left">
                <li className="flex gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium">Preencher o Briefing</p>
                    <p className="text-sm text-gray-400">Você receberá um email com o link para preencher o briefing detalhado da sua música.</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium">Aguardar a Criação</p>
                    <p className="text-sm text-gray-400">Nossa equipe irá trabalhar na sua música conforme as especificações do briefing.</p>
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="bg-harmonia-green/20 text-harmonia-green w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium">Avaliar a Prévia</p>
                    <p className="text-sm text-gray-400">Você receberá a prévia para avaliação e poderá solicitar ajustes conforme seu pacote.</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={() => navigate('/briefing')}
                className="bg-harmonia-green hover:bg-harmonia-green/90"
              >
                Preencher Briefing Agora
              </Button>
            </div>
          </div>
        );
    }
  };
  
  const renderProgressBar = () => {
    const steps = [
      { label: 'Revisar Pedido', value: PaymentStep.REVIEW_ORDER },
      { label: 'Seus Dados', value: PaymentStep.CUSTOMER_INFO },
      { label: 'Pagamento', value: PaymentStep.PAYMENT_METHOD },
      { label: 'Nota Fiscal', value: PaymentStep.INVOICE_INFO, conditional: paymentData.needsInvoice },
      { label: 'Confirmação', value: PaymentStep.CONFIRMATION }
    ].filter(step => !step.conditional || step.conditional === true);
    
    const currentIndex = steps.findIndex(step => step.value === currentStep);
    
    return (
      <div className="mb-8">
        <div className="hidden md:flex justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={step.value}
              className={`flex-1 text-center ${
                index === currentIndex
                  ? 'text-harmonia-green font-medium'
                  : index < currentIndex
                    ? 'text-gray-300'
                    : 'text-gray-500'
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
        
        <div className="relative">
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-gray-700 rounded-full" />
          <div 
            className="absolute top-1/2 h-1 -translate-y-1/2 bg-harmonia-green rounded-full transition-all duration-300"
            style={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`
            }}
          />
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div 
                key={step.value}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-harmonia-green text-black'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {index < currentIndex ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:hidden mt-2 text-center">
          <span className="text-harmonia-green font-medium">{steps[currentIndex]?.label}</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          {currentStep !== PaymentStep.CONFIRMATION && (
            <>
              <div className="mb-8 flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <h1 className="text-3xl font-bold">Finalizar Pedido</h1>
              </div>
              
              {renderProgressBar()}
            </>
          )}
          
          {renderStep()}
          
          {currentStep !== PaymentStep.CONFIRMATION && (
            <div className="flex justify-between mt-8">
              {currentStep !== PaymentStep.REVIEW_ORDER && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Voltar
                </Button>
              )}
              
              <Button
                className="bg-harmonia-green hover:bg-harmonia-green/90 ml-auto"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Processando...
                  </>
                ) : currentStep === PaymentStep.INVOICE_INFO ? 'Finalizar Pagamento' : 
                   currentStep === PaymentStep.PAYMENT_METHOD && !paymentData.needsInvoice ? 'Finalizar Pagamento' : 
                   'Continuar'}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
