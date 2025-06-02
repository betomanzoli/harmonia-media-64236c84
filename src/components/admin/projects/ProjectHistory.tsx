
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface HistoryEntry {
  id: number;
  created_at: string;
  action_type: string;
  details: any;
}

interface ProjectHistoryProps {
  projectId: string;
}

const ProjectHistory: React.FC<ProjectHistoryProps> = ({ projectId }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!projectId) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('project_history')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    const historySubscription = supabase
      .channel(`project_history_${projectId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_history', filter: `project_id=eq.${projectId}` },
        (payload) => {
          console.log('History change received!', payload);
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(historySubscription);
    };
  }, [projectId]);

  if (isLoading) {
    return <div className="text-center py-4 text-sm text-muted-foreground">Carregando histórico...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico do Projeto</CardTitle>
        <CardDescription>Eventos registrados para este projeto.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum histórico encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((entry) => (
              <li key={entry.id} className="text-sm border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800 capitalize">
                    {entry.action_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                {entry.details && Object.keys(entry.details).length > 0 && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                    {Object.entries(entry.details).map(([key, value]) => (
                      <div key={key}><span className="font-semibold">{key}:</span> {JSON.stringify(value)}</div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectHistory;
