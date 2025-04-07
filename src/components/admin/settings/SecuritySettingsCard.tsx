
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { securityService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import applyAllSecurityConfigurations from '@/lib/supabase/applySecurityConfig';

const SecuritySettingsCard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  
  const handleCheckSecurity = async () => {
    setIsLoading(true);
    try {
      const result = await securityService.validateSecurity();
      setSecurityStatus(result);
      
      toast({
        title: result.success ? "Verificação completa" : "Verificação falhou",
        description: result.success 
          ? "A configuração de segurança foi verificada com sucesso." 
          : `Erro: ${result.error}`,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Falha ao verificar segurança: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApplySecurity = async () => {
    setIsLoading(true);
    try {
      const result = await applyAllSecurityConfigurations();
      
      if (result.success) {
        toast({
          title: "Segurança configurada",
          description: "As configurações de segurança foram aplicadas com sucesso.",
        });
        
        // Atualizar status após aplicar configurações
        await handleCheckSecurity();
      } else {
        toast({
          title: "Erro",
          description: `Falha ao aplicar configurações: ${result.error}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Falha ao aplicar configurações: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="mr-2 h-5 w-5" />
          Configurações de Segurança
        </CardTitle>
        <CardDescription>
          Gerencie as configurações de segurança do Supabase
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {securityStatus && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-card border rounded p-3">
                <h3 className="text-sm font-medium mb-1">Políticas RLS</h3>
                <Badge variant={securityStatus.rlsPolicies?.length > 0 ? "default" : "destructive"}>
                  {securityStatus.rlsPolicies?.length > 0 ? 
                    `${securityStatus.rlsPolicies.length} políticas configuradas` : 
                    "Sem políticas"}
                </Badge>
              </div>
              
              <div className="bg-card border rounded p-3">
                <h3 className="text-sm font-medium mb-1">MFA</h3>
                <Badge variant={securityStatus.mfaEnabled ? "default" : "destructive"}>
                  {securityStatus.mfaEnabled ? "Ativado" : "Desativado"}
                </Badge>
              </div>
              
              <div className="bg-card border rounded p-3">
                <h3 className="text-sm font-medium mb-1">Segurança de Senha</h3>
                <Badge 
                  variant={
                    securityStatus.passwordSecurityLevel === 'high' ? "default" : 
                    securityStatus.passwordSecurityLevel === 'medium' ? "secondary" : 
                    "destructive"
                  }
                >
                  {securityStatus.passwordSecurityLevel === 'high' ? "Alta" : 
                   securityStatus.passwordSecurityLevel === 'medium' ? "Média" : 
                   "Baixa"}
                </Badge>
              </div>
              
              <div className="bg-card border rounded p-3">
                <h3 className="text-sm font-medium mb-1">Status Geral</h3>
                <Badge 
                  variant={securityStatus.success ? "default" : "destructive"}
                >
                  {securityStatus.success ? "Configurado" : "Problemas Detectados"}
                </Badge>
              </div>
            </div>
            
            {!securityStatus.success && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Problemas de segurança detectados</AlertTitle>
                <AlertDescription>
                  {securityStatus.error || "Há questões de segurança que precisam ser resolvidas."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        {!securityStatus && (
          <Alert>
            <AlertTitle>Verificação não realizada</AlertTitle>
            <AlertDescription>
              Clique em "Verificar Segurança" para avaliar as configurações atuais.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleCheckSecurity}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>Verificar Segurança</>
          )}
        </Button>
        <Button
          onClick={handleApplySecurity}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Configurando...
            </>
          ) : (
            <>Aplicar Configurações de Segurança</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SecuritySettingsCard;
