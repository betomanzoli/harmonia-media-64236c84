
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusIndicatorProps {
  isOnline: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ isOnline }) => {
  return isOnline ? (
    <span className="text-green-600 font-medium flex items-center">
      <Wifi className="h-3 w-3 mr-1" /> Conectado
    </span>
  ) : (
    <span className="text-red-600 font-medium flex items-center">
      <WifiOff className="h-3 w-3 mr-1" /> Desconectado
    </span>
  );
};

export default ConnectionStatusIndicator;
