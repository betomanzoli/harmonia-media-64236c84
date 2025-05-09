
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

interface EditVersionItemProps {
  version: VersionItem;
  onDelete: (versionId: string) => void;
}

const EditVersionItem: React.FC<EditVersionItemProps> = ({ version, onDelete }) => {
  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{version.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{version.description || 'Sem descrição'}</p>
          <p className="text-xs text-gray-500 mt-2">Adicionado em: {version.dateAdded}</p>
          {version.recommended && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded inline-block mt-2 mr-2">Recomendada</span>}
          {version.final && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded inline-block mt-2">Versão Final</span>}
        </div>
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(version.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditVersionItem;
