
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Check, X, RefreshCw, ExternalLink } from "lucide-react";
import { StorageType, STORAGE_FOLDER_MAP } from '@/services/adminStorageService';
import { useFileUpload } from '@/hooks/admin/useFileUpload';

interface StorageStatusCardProps {
  title: string;
  storageType: StorageType;
  description: string;
  lastSync?: string | null;
}

const StorageStatusCard: React.FC<StorageStatusCardProps> = ({
  title,
  storageType,
  description,
  lastSync
}) => {
  const { openStorageFolder, getFolderUrl } = useFileUpload(storageType);
  
  // Format the last sync date if available
  const formattedLastSync = lastSync 
    ? new Date(lastSync).toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : null;
  
  // Get connection status based on last sync
  const isConnected = !!lastSync && new Date(lastSync).getTime() > Date.now() - (24 * 60 * 60 * 1000);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green/20 to-harmonia-green/5 flex flex-row items-center justify-between">
        <CardTitle className="text-harmonia-green">{title}</CardTitle>
        <Badge variant={isConnected ? "default" : "outline"} className={isConnected ? "bg-green-500" : ""}>
          {isConnected ? (
            <><Check className="w-3 h-3 mr-1" /> Conectado</>
          ) : (
            <><X className="w-3 h-3 mr-1" /> Não conectado</>
          )}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        {formattedLastSync && (
          <div className="text-xs text-muted-foreground mb-4">
            Última sincronização: {formattedLastSync}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="text-harmonia-green border-harmonia-green/30 hover:bg-harmonia-light-green/20"
            onClick={openStorageFolder}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Abrir pasta
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-500 hover:text-harmonia-green"
            onClick={() => window.open(getFolderUrl(), '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageStatusCard;
