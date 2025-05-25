
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import contractAcceptanceLogger from '@/services/contractAcceptanceLogger';

interface ContractLog {
  id: string;
  client_name: string;
  client_email: string;
  package_type: string;
  accepted_at: string;
  ip_address: string;
  user_agent: string;
  terms_version: string;
}

const ContractAcceptanceLogs: React.FC = () => {
  const [logs, setLogs] = useState<ContractLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const result = await contractAcceptanceLogger.getAllLogs();
        
        if (result.success && Array.isArray(result.data)) {
          const typedLogs: ContractLog[] = result.data.map((item: any) => ({
            id: String(item.id || ''),
            client_name: String(item.client_name || ''),
            client_email: String(item.client_email || ''),
            package_type: String(item.package_type || ''),
            accepted_at: String(item.accepted_at || ''),
            ip_address: String(item.ip_address || ''),
            user_agent: String(item.user_agent || ''),
            terms_version: String(item.terms_version || '1.0')
          }));
          
          setLogs(typedLogs);
        } else {
          console.warn('Failed to load logs or invalid data format');
          setLogs([]);
        }
      } catch (error) {
        console.error('Error loading contract logs:', error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logs de Aceitação de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8">Carregando logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs de Aceitação de Contratos</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{log.client_name}</h3>
                  <p className="text-sm text-gray-500">{log.client_email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(log.accepted_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{log.package_type}</Badge>
                  <p className="text-xs text-gray-400 mt-1">v{log.terms_version}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum log de aceitação encontrado</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractAcceptanceLogs;
