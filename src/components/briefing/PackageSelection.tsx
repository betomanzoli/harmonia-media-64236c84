
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from 'lucide-react';

interface PackageSelectionProps {
  onSelectPackage: (packageType: 'essencial' | 'profissional' | 'premium') => void;
  isSubmitting: boolean;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({ 
  onSelectPackage,
  isSubmitting 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border hover:border-harmonia-green/50 cursor-pointer transition-colors">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Pacote Essencial</h3>
            <p className="text-sm text-gray-500 mb-4">Ideal para presentes emocionais rápidos.</p>
            <div className="text-harmonia-green font-bold mb-4">R$ 219</div>
            <div className="flex flex-col space-y-2">
              <Button 
                className="w-full"
                onClick={() => onSelectPackage('essencial')}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : "Escolher Essencial"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open("/servicos#essencial", "_blank")}
              >
                Ver detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-harmonia-green bg-gradient-to-b from-harmonia-green/10 to-transparent shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Pacote Profissional</h3>
            <p className="text-sm text-gray-500 mb-4">Perfeito para criadores de conteúdo.</p>
            <div className="text-harmonia-green font-bold mb-4">R$ 479</div>
            <div className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-harmonia-green hover:bg-harmonia-green/90"
                onClick={() => onSelectPackage('profissional')}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : "Escolher Profissional"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-harmonia-green/50 text-harmonia-green"
                onClick={() => window.open("/servicos#profissional", "_blank")}
              >
                Ver detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border hover:border-harmonia-green/50 cursor-pointer transition-colors">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Pacote Premium</h3>
            <p className="text-sm text-gray-500 mb-4">Melhor opção para empresas.</p>
            <div className="text-harmonia-green font-bold mb-4">R$ 969</div>
            <div className="flex flex-col space-y-2">
              <Button 
                className="w-full"
                onClick={() => onSelectPackage('premium')}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : "Escolher Premium"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open("/servicos#premium", "_blank")}
              >
                Ver detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="pt-4 text-center">
        <Link to="/servicos">
          <Button variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Ver todos os pacotes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PackageSelection;
