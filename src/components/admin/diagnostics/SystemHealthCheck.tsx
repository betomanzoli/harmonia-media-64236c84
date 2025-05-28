
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useDataValidation } from '@/hooks/admin/useDataValidation';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheck {
  name: string;
  status: 'success' | 'error' | 'warning' | 'checking';
  message: string;
}

const SystemHealthCheck: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { validateConnection, testCrudOperations } = useDataValidation();

  const runHealthChecks = async () => {
    setIsRunning(true);
    setHealthChecks([]);

    const checks: HealthCheck[] = [];

    // 1. Verificar conexão Supabase
    try {
      const connected = await validateConnection();
      checks.push({
        name: 'Conexão Supabase',
        status: connected ? 'success' : 'error',
        message: connected ? 'Conectado com sucesso' : 'Falha na conexão'
      });
    } catch (error) {
      checks.push({
        name: 'Conexão Supabase',
        status: 'error',
        message: 'Erro de conexão'
      });
    }

    // 2. Verificar tabelas essenciais
    const tables = ['clients', 'projects', 'project_versions', 'feedback'] as const;
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count(*)').limit(1);
        checks.push({
          name: `Tabela ${table}`,
          status: error ? 'error' : 'success',
          message: error ? `Erro: ${error.message}` : 'Acessível'
        });
      } catch (error) {
        checks.push({
          name: `Tabela ${table}`,
          status: 'error',
          message: 'Inacessível'
        });
      }
    }

    // 3. Testar operações CRUD
    try {
      const crudWorking = await testCrudOperations();
      checks.push({
        name: 'Operações CRUD',
        status: crudWorking ? 'success' : 'error',
        message: crudWorking ? 'Funcionando corretamente' : 'Problemas detectados'
      });
    } catch (error) {
      checks.push({
        name: 'Operações CRUD',
        status: 'error',
        message: 'Falha nos testes'
      });
    }

    setHealthChecks(checks);
    setIsRunning(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'checking':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      warning: 'secondary' as const,
      checking: 'outline' as const
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const successCount = healthChecks.filter(check => check.status === 'success').length;
  const totalChecks = healthChecks.length;
  const overallHealth = successCount === totalChecks ? 'success' : 
                       successCount > totalChecks / 2 ? 'warning' : 'error';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {getIcon(overallHealth)}
            <span>Diagnóstico do Sistema</span>
          </CardTitle>
          <Button 
            onClick={runHealthChecks} 
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRunning ? 'Verificando...' : 'Atualizar'}
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {totalChecks > 0 && (
            <span>
              {successCount} de {totalChecks} verificações passaram
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getIcon(check.status)}
                <div>
                  <p className="font-medium">{check.name}</p>
                  <p className="text-sm text-gray-600">{check.message}</p>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
          
          {healthChecks.length === 0 && !isRunning && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma verificação executada ainda</p>
            </div>
          )}
          
          {isRunning && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-gray-600">Executando verificações...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthCheck;
