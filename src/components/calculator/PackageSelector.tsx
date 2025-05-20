
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PackageSelectorProps {
  selectedPackage: string;
  setSelectedPackage: (value: string) => void;
  packagePrices?: {
    essential: number;
    professional: number;
    premium: number;
  };
}

const PackageSelector: React.FC<PackageSelectorProps> = ({ 
  selectedPackage, 
  setSelectedPackage,
  packagePrices = {
    essential: 219,
    professional: 479,
    premium: 969
  }
}) => {
  return (
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
            <Label htmlFor="essential" className="font-medium">Pacote Essencial - R${packagePrices.essential}</Label>
            <p className="text-sm text-gray-400">
              Ideal para presentes emocionais rápidos. Inclui composição musical única, uma revisão gratuita, uso exclusivamente pessoal, entrega digital em até 7 dias, suporte por e-mail, arquivo digital em alta qualidade (MP3/WAV), certificado digital de autoria.
            </p>
          </div>
        </div>
        
        <div className="relative flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors bg-gradient-to-b from-harmonia-green/10 to-transparent">
          <div className="absolute -top-2 -right-2 bg-harmonia-green text-black text-xs font-semibold py-1 px-2 rounded-full">
            POPULAR
          </div>
          <RadioGroupItem value="professional" id="professional" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="professional" className="font-medium">Pacote Profissional - R${packagePrices.professional}</Label>
            <p className="text-sm text-gray-400">
              Perfeito para criadores de conteúdo e pequenos negócios. Inclui composição musical personalizada, até três revisões gratuitas, licença para uso em conteúdo digital próprio, três versões para escolha, entrega em até 5 dias, suporte prioritário, masterização básica IA, stems separados (vocais + instrumentação).
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
          <RadioGroupItem value="premium" id="premium" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="premium" className="font-medium">Pacote Premium - R${packagePrices.premium}</Label>
            <p className="text-sm text-gray-400">
              Melhor opção para empresas e projetos corporativos. Inclui composição totalmente personalizada, revisões ilimitadas (até aprovação), cessão total dos direitos autorais, cinco versões para escolha, registro na Biblioteca Nacional, certificado blockchain, consultoria de 30 minutos, entrega prioritária, suporte VIP por WhatsApp, partitura em formato MusicXML.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PackageSelector;
