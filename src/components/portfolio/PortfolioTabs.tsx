
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, Sliders, Layers, Calculator, FileCheck } from 'lucide-react';
import ExamplesList, { AudioExampleItem } from './ExamplesList';
import AudioVersions from './AudioVersions';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface ComparisonExample {
  title: string;
  subtitle: string;
  versions: {
    name: string;
    audioSrc: string;
    description: string;
  }[];
  type: "comparison" | "stems";
}

interface PortfolioTabsProps {
  initialExamples: AudioExampleItem[];
  extraExamples: AudioExampleItem[];
  comparisonExamples: ComparisonExample[];
  showAll: boolean;
  onShowMore: () => void;
}

const PortfolioTabs: React.FC<PortfolioTabsProps> = ({ 
  initialExamples,
  extraExamples,
  comparisonExamples,
  showAll,
  onShowMore
}) => {
  return (
    <>
      <Tabs defaultValue="exemplos" className="w-full mb-10">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="exemplos" className="data-[state=active]:bg-harmonia-green">
            <Music className="w-4 h-4 mr-1" /> Exemplos
          </TabsTrigger>
          <TabsTrigger value="comparacoes" className="data-[state=active]:bg-harmonia-green">
            <Sliders className="w-4 h-4 mr-1" /> Comparações
          </TabsTrigger>
          <TabsTrigger value="stems" className="data-[state=active]:bg-harmonia-green">
            <Layers className="w-4 h-4 mr-1" /> Stems
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exemplos" className="mt-6">
          <ExamplesList 
            initialExamples={initialExamples}
            extraExamples={extraExamples}
            showAll={showAll}
            onShowMore={onShowMore}
          />
        </TabsContent>
        
        <TabsContent value="comparacoes" className="mt-6">
          <div className="space-y-10">
            {comparisonExamples.filter(ex => ex.type === "comparison").map((example, index) => (
              <AudioVersions
                key={index}
                title={example.title}
                subtitle={example.subtitle}
                versions={example.versions}
                type="comparison"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stems" className="mt-6">
          <div className="space-y-10">
            {comparisonExamples.filter(ex => ex.type === "stems").map((example, index) => (
              <AudioVersions
                key={index}
                title={example.title}
                subtitle={example.subtitle}
                versions={example.versions}
                type="stems"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Seção CTA para calcular preço e fazer qualificação */}
      <div className="bg-gradient-to-r from-background via-black to-background p-6 rounded-lg border border-border mt-10 mb-16">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Pronto para criar sua música personalizada?</h3>
          <p className="text-gray-400">Calcule o preço ou faça uma qualificação para começar seu projeto musical.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-harmonia-green hover:bg-harmonia-green/90 flex items-center gap-2">
            <Link to="/calculadora">
              <Calculator className="w-4 h-4" />
              Calcular Preço
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/qualificacao">
              <FileCheck className="w-4 h-4" />
              Fazer Qualificação
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default PortfolioTabs;
