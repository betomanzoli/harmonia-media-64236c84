
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, CheckCircle, Download } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VersionItemProps {
  id: string;
  name: string;
  description?: string;
  audioUrl: string;
  createdAt: string;
  recommended?: boolean;
  final?: boolean;
  finalVersionUrl?: string;
  stemsUrl?: string;
  onDelete?: (id: string) => void;
}

const ProjectVersionItem: React.FC<VersionItemProps> = ({
  id,
  name,
  description,
  audioUrl,
  createdAt,
  recommended,
  final,
  finalVersionUrl,
  stemsUrl,
  onDelete
}) => {
  const handlePlay = () => {
    window.open(audioUrl, '_blank');
  };
  
  const handleDownloadFinal = () => {
    if (finalVersionUrl) {
      window.open(finalVersionUrl, '_blank');
    }
  };
  
  const handleDownloadStems = () => {
    if (stemsUrl) {
      window.open(stemsUrl, '_blank');
    }
  };
  
  const getRelativeTime = (date: string) => {
    try {
      // Parse the date string and get relative time
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
    } catch (e) {
      return 'Data desconhecida';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-base">{name}</h3>
            {recommended && (
              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                Recomendada
              </Badge>
            )}
            {final && (
              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
                Final
              </Badge>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 mb-2">{description}</p>
          )}
          
          <div className="text-xs text-gray-500 flex items-center">
            <span>{getRelativeTime(createdAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handlePlay}
          >
            <Play className="w-4 h-4 mr-1" /> Ouvir
          </Button>
          
          {finalVersionUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
              onClick={handleDownloadFinal}
            >
              <Download className="w-4 h-4 mr-1" /> Final
            </Button>
          )}
          
          {stemsUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
              onClick={handleDownloadStems}
            >
              <Download className="w-4 h-4 mr-1" /> Stems
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectVersionItem;
