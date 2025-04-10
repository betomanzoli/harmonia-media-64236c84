
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const PreviewLoadingState: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pt-10">
      <Card>
        <CardHeader>
          <CardTitle>Carregando Prévia...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewLoadingState;
