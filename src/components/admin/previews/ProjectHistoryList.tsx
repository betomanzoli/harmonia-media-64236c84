
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface HistoryItem {
  action: string;
  timestamp: string;
  data?: any;
}

interface ProjectHistoryListProps {
  history: HistoryItem[];
}

const ProjectHistoryList: React.FC<ProjectHistoryListProps> = ({ history }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico do Projeto</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            Nenhuma atividade registrada.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-harmonia-green mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">{item.action}</p>
                    <div className="flex items-center text-gray-500 text-xs mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.timestamp}
                    </div>
                    
                    {item.data?.message && (
                      <div className="mt-2 bg-gray-50 p-2 text-sm rounded border border-gray-100">
                        {item.data.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectHistoryList;
