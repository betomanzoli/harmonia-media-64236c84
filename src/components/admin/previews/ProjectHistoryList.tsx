
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <CardTitle>Histórico de atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <ul className="space-y-4">
            {history.map((item, index) => (
              <li key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <span className="font-medium">{item.action}</span>
                  <span className="text-gray-500 text-sm">{item.timestamp}</span>
                </div>
                {item.data && item.data.message && (
                  <div className="mt-2 text-sm bg-gray-50 p-2 rounded border border-gray-200">
                    {item.data.message}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectHistoryList;
