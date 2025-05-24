
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ExtraServiceItem from './ExtraServiceItem';

interface ExtrasState {
  revision: boolean;
  bnRegistration: boolean;
  ubcRegistration: boolean;
  masteringPremium: boolean;
  stems: boolean;
  expressDelivery: boolean;
  musicXml: boolean;
  storage: boolean;
  humanCompositionLyrics: boolean;
  humanCompositionMelody: boolean;
  humanCompositionComplete: boolean;
}

interface ExtraPrices {
  revision: number;
  bnRegistration: number;
  ubcRegistration: number;
  masteringPremium: number;
  stems: number;
  expressDelivery: number;
  musicXml: number;
  storage: number;
  humanCompositionLyrics: number;
  humanCompositionMelody: number;
  humanCompositionComplete: number;
}

interface ExtraServicesProps {
  extras: ExtrasState;
  setExtras: React.Dispatch<React.SetStateAction<ExtrasState>>;
  extraPrices: ExtraPrices;
  selectedPackage: string;
}

const ExtraServices: React.FC<ExtraServicesProps> = ({ 
  extras, 
  setExtras, 
  extraPrices, 
  selectedPackage 
}) => {
  
  const isExtraIncluded = (extra: string): boolean => {
    if (extra === 'stems' && selectedPackage !== 'essential') return true;
    if (extra === 'masteringPremium' && selectedPackage === 'premium') return true;
    if (extra === 'bnRegistration' && selectedPackage === 'premium') return true;
    if (extra === 'musicXml' && selectedPackage === 'premium') return true;
    return false;
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Serviços Extras</h2>
      <div className="grid gap-4">
        <ExtraServiceItem 
          id="revision"
          title="Revisão Extra"
          price={extraPrices.revision}
          description="Peça uma revisão adicional para ajustar a letra ou melodia da sua música."
          isChecked={extras.revision}
          onCheckedChange={(checked) => setExtras({...extras, revision: checked})}
          isIncluded={isExtraIncluded('revision')}
        />
        
        <ExtraServiceItem 
          id="bnRegistration"
          title="Registro na BN (Letra)"
          price={extraPrices.bnRegistration}
          description="Proteja legalmente a letra da sua música com registro na Biblioteca Nacional."
          isChecked={extras.bnRegistration}
          onCheckedChange={(checked) => setExtras({...extras, bnRegistration: checked})}
          isIncluded={isExtraIncluded('bnRegistration')}
          notes={[
            "• Não protege melodia, arranjos ou gravações.", 
            "• Não gera royalties."
          ]}
          includedNote="* Já incluído no pacote Premium"
        />
        
        <ExtraServiceItem 
          id="ubcRegistration"
          title="Registro UBC"
          price={extraPrices.ubcRegistration}
          description="Registro completo na UBC (letra, melodia, arranjo) com código ISWC para direitos de execução pública."
          isChecked={extras.ubcRegistration}
          onCheckedChange={(checked) => setExtras({...extras, ubcRegistration: checked})}
          isIncluded={isExtraIncluded('ubcRegistration')}
          notes={["• Ideal para receber royalties e uso comercial."]}
        />
        
        <ExtraServiceItem 
          id="masteringPremium"
          title="Masterização Premium"
          price={extraPrices.masteringPremium}
          description="Melhore a qualidade sonora com masterização avançada em formato WAV 24-bit."
          isChecked={extras.masteringPremium}
          onCheckedChange={(checked) => setExtras({...extras, masteringPremium: checked})}
          isIncluded={isExtraIncluded('masteringPremium')}
          includedNote="* Já incluído no pacote Premium"
        />
        
        <ExtraServiceItem 
          id="stems"
          title="Stems Separados"
          price={extraPrices.stems}
          description="Receba faixas separadas (vocais, instrumentos, etc.) para maior flexibilidade em edições futuras."
          isChecked={extras.stems}
          onCheckedChange={(checked) => setExtras({...extras, stems: checked})}
          isIncluded={isExtraIncluded('stems')}
          includedNote="* Já incluído nos pacotes Profissional e Premium"
        />
        
        <ExtraServiceItem 
          id="expressDelivery"
          title="Entrega Expressa (48h)"
          price={extraPrices.expressDelivery}
          description="Priorize seu projeto e receba sua música finalizada em até 48 horas."
          isChecked={extras.expressDelivery}
          onCheckedChange={(checked) => setExtras({...extras, expressDelivery: checked})}
          isIncluded={isExtraIncluded('expressDelivery')}
        />
        
        <ExtraServiceItem 
          id="musicXml"
          title="Partituras MusicXML/PDF"
          price={extraPrices.musicXml}
          description="Receba a partitura completa da sua música em formato MusicXML ou PDF, ideal para músicos e bandas."
          isChecked={extras.musicXml}
          onCheckedChange={(checked) => setExtras({...extras, musicXml: checked})}
          isIncluded={isExtraIncluded('musicXml')}
          includedNote="* Já incluído no pacote Premium"
        />
        
        <ExtraServiceItem 
          id="storage"
          title="Armazenamento Premium (12 meses)"
          price={extraPrices.storage}
          description="Mantenha seus arquivos seguros por mais tempo. Por padrão, os arquivos do projeto ficam disponíveis por até 7 dias após a entrega final."
          isChecked={extras.storage}
          onCheckedChange={(checked) => setExtras({...extras, storage: checked})}
          isIncluded={isExtraIncluded('storage')}
        />
        
        <ExtraServiceItem 
          id="humanCompositionLyrics"
          title="Composição sem IA (letra)"
          price={extraPrices.humanCompositionLyrics}
          description="Composição 100% humana da letra da sua música, criada por um de nossos letristas profissionais."
          isChecked={extras.humanCompositionLyrics}
          onCheckedChange={(checked) => setExtras({...extras, humanCompositionLyrics: checked})}
          isIncluded={isExtraIncluded('humanCompositionLyrics')}
        />
        
        <ExtraServiceItem 
          id="humanCompositionMelody"
          title="Composição sem IA (letra + melodia)"
          price={extraPrices.humanCompositionMelody}
          description="Composição 100% humana da letra e melodia da sua música, incluindo partitura completa (sem gravação)."
          isChecked={extras.humanCompositionMelody}
          onCheckedChange={(checked) => setExtras({...extras, humanCompositionMelody: checked})}
          isIncluded={isExtraIncluded('humanCompositionMelody')}
        />
        
        <div className="flex items-start space-x-2 border border-border rounded-lg p-4 hover:border-harmonia-green/50 transition-colors">
          <Checkbox 
            id="humanCompositionComplete" 
            checked={extras.humanCompositionComplete}
            onCheckedChange={(checked) => setExtras({...extras, humanCompositionComplete: checked === true})}
            disabled={true}
          />
          <div className="grid gap-1.5 w-full">
            <div className="flex justify-between">
              <Label htmlFor="humanCompositionComplete" className="font-medium">Composição sem IA (completa)</Label>
              <span className="text-amber-400 font-semibold">Consultar</span>
            </div>
            <p className="text-sm text-gray-400">
              Composição 100% humana com letra, melodia e gravação profissional da sua música.
              <span className="block mt-1 text-amber-400">• Entre em contato para um orçamento personalizado</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraServices;
