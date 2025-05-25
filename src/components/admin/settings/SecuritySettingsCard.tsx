
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { securityConfig } from '@/lib/supabase/securityConfig';

const SecuritySettingsCard: React.FC = () => {
  const [isTestingRLS, setIsTestingRLS] = useState(false);
  const [rlsStatus, setRlsStatus] = useState<'unknown' | 'active' | 'error'>('unknown');
  const { toast } = useToast();

  const testRLS = async () => {
    setIsTestingRLS(true);
    try {
      const result = await securityConfig.testRLS();
      
      if (result.success) {
        setRlsStatus('active');
        toast({
          title: "RLS Ativo",
          description: "Row Level Security está funcionando corretamente"
        });
      } else {
        setRlsStatus('error');
        toast({
          title: "Erro no RLS",
          description: result.error || "Erro ao testar Row Level Security",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing RLS:', error);
      setRlsStatus('error');
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o RLS",
        variant: "destructive"
      });
    } finally {
      setIsTestingRLS(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Configurações de Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Row Level Security (RLS)</h3>
            <p className="text-sm text-gray-500">
              Controle de acesso a nível de linha no banco de dados
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {rlsStatus === 'active' && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="mr-1 h-3 w-3" />
                Ativo
              </Badge>
            )}
            {rlsStatus === 'error' && (
              <Badge variant="destructive">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Erro
              </Badge>
            )}
            {rlsStatus === 'unknown' && (
              <Badge variant="secondary">Desconhecido</Badge>
            )}
          </div>
        </div>

        <Button 
          onClick={testRLS} 
          disabled={isTestingRLS}
          variant="outline"
          className="w-full"
        >
          {isTestingRLS ? 'Testando...' : 'Testar RLS'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsCard;
