
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusIndicatorProps {
  isOnline: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ isOnline }) => {
  return isOnline ? (
    <span className="text-green-600 font-medium flex items-center gap-1.5">
      <Wifi className="h-4 w-4" /> Conectado
    </span>
  ) : (
    <span className="text-red-600 font-medium flex items-center gap-1.5">
      <WifiOff className="h-4 w-4" /> Desconectado
    </span>
  );
};

export default ConnectionStatusIndicator;
