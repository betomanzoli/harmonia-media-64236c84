
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface HistoryItem {
  action: string;
  timestamp: string;
  data?: {
    message?: string;
    status?: string;
    version?: string;
  };
}

interface ProjectHistoryListProps {
  history: HistoryItem[];
}

const ProjectHistoryList: React.FC<ProjectHistoryListProps> = ({ history }) => {
  // Helper function to determine border color based on action
  const getBorderColor = (item: HistoryItem) => {
    if (item.action.includes("aprovou")) return "border-green-500";
    if (item.action.includes("feedback")) return "border-blue-500";
    if (item.action.includes("Prazo estendido")) return "border-amber-500";
    if (item.action.includes("versão")) return "border-purple-500";
    return "border-gray-200";
  };
  
  // Helper function to determine dot color based on action
  const getDotColor = (item: HistoryItem) => {
    if (item.action.includes("aprovou")) return "bg-green-500";
    if (item.action.includes("feedback")) return "bg-blue-500";
    if (item.action.includes("Prazo estendido")) return "bg-amber-500";
    if (item.action.includes("versão")) return "bg-purple-500";
    return "bg-harmonia-green";
  };

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
              <div key={index} className={`border-l-2 ${getBorderColor(item)} pl-4 pb-4`}>
                <div className="flex items-start gap-2">
                  <div className={`h-2 w-2 rounded-full ${getDotColor(item)} mt-2`}></div>
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
                    
                    {item.data?.status && (
                      <div className="mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.data.status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.data.status === 'feedback' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.data.status === 'approved' ? 'Aprovado' :
                           item.data.status === 'feedback' ? 'Feedback' : 'Aguardando'}
                        </span>
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
