
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { securityService } from '@/lib/supabase/securityConfig';
import { toast } from '@/hooks/use-toast';
import { applySecurityConfig, generateDefaultPolicies } from '@/lib/supabase/applySecurityConfig';

const SecuritySettingsCard = () => {
  const [tableName, setTableName] = useState('briefings');
  const [rlsEnabled, setRlsEnabled] = useState(true);
  const [policies, setPolicies] = useState<{ name: string; definition: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplySecurity = async () => {
    if (!tableName) {
      toast({
        title: "Error",
        description: "Please enter a table name",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await applySecurityConfig(
        tableName,
        rlsEnabled,
        policies.length > 0 ? policies : undefined
      );

      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply security settings",
        variant: "destructive"
      });
      console.error("Security application error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePolicies = () => {
    if (!tableName) {
      toast({
        title: "Error",
        description: "Please enter a table name to generate policies",
        variant: "destructive"
      });
      return;
    }

    const defaultPolicies = generateDefaultPolicies(tableName);
    setPolicies(defaultPolicies);
  };

  return (
    <Card className="p-6 bg-white mb-6">
      <h2 className="text-xl font-bold mb-4">Configurações de Segurança</h2>
      <p className="text-gray-600 mb-4">Configure as políticas de segurança para suas tabelas no Supabase.</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nome da Tabela</label>
        <Input 
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="mb-2"
          placeholder="Ex: users, projects, etc."
        />
      </div>
      
      <div className="flex items-center mb-6">
        <Checkbox 
          id="rls-enabled"
          checked={rlsEnabled}
          onCheckedChange={(checked) => setRlsEnabled(checked === true)}
        />
        <label 
          htmlFor="rls-enabled"
          className="ml-2 text-sm font-medium cursor-pointer"
        >
          Habilitar RLS (Row Level Security)
        </label>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Políticas</label>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generatePolicies}
          >
            Gerar Políticas Padrão
          </Button>
        </div>
        
        {policies.map((policy, index) => (
          <div key={index} className="mb-4 border p-3 rounded-md">
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1">Nome da Política</label>
              <Input 
                value={policy.name}
                onChange={(e) => {
                  const newPolicies = [...policies];
                  newPolicies[index].name = e.target.value;
                  setPolicies(newPolicies);
                }}
                className="mb-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Definição</label>
              <Textarea 
                value={policy.definition}
                onChange={(e) => {
                  const newPolicies = [...policies];
                  newPolicies[index].definition = e.target.value;
                  setPolicies(newPolicies);
                }}
                className="text-sm h-20"
                placeholder="Ex: auth.uid() = owner_id"
              />
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setPolicies([...policies, { name: '', definition: '' }])}
          className="w-full mt-2"
        >
          Adicionar Política
        </Button>
      </div>
      
      <Button 
        onClick={handleApplySecurity}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? "Aplicando..." : "Aplicar Configurações"}
      </Button>
    </Card>
  );
};

export default SecuritySettingsCard;
