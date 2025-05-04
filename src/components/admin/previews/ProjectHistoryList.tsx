
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryEntry {
  action: string;
  timestamp: string;
  data?: {
    message?: string;
    status?: string;
    version?: string;
    [key: string]: any;
  };
}

interface ProjectHistoryListProps {
  history?: HistoryEntry[];
}

const ProjectHistoryList: React.FC<ProjectHistoryListProps> = ({ history = [] }) => {
  console.log('Histórico recebido em ProjectHistoryList:', history);
  
  // Sort history entries by timestamp in descending order (most recent first)
  const sortedHistory = [...history].sort((a, b) => {
    // Parse timestamps if they're strings
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA; // Descending order
  });
  
  return (
    <Card className="bg-white text-gray-900">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Histórico do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedHistory && sortedHistory.length > 0 ? (
          <ul className="divide-y">
            {sortedHistory.map((entry, index) => (
              <li key={index} className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between mb-1">
                  <span className="font-medium">{entry.action}</span>
                  <span className="text-gray-500 text-sm">{entry.timestamp}</span>
                </div>
                {entry.data?.message && (
                  <p className="text-gray-600 text-sm">{entry.data.message}</p>
                )}
                {entry.data?.status && (
                  <p className="text-gray-600 text-sm">Status: {entry.data.status}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum registro de atividade ainda.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectHistoryList;
