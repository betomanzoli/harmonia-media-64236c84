
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from 'lucide-react';

interface AdminGuideProps {
  title: string;
  sections: {
    title: string;
    content: string | React.ReactNode;
  }[];
  storageUrl?: string;
}

const AdminGuide: React.FC<AdminGuideProps> = ({ title, sections, storageUrl }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-harmonia-green hover:bg-harmonia-green/10 p-1 rounded-full">
          <HelpCircle className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-harmonia-green">{title}</h3>
          
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-harmonia-green mb-1">{section.title}</h4>
              {typeof section.content === 'string' ? (
                <p className="text-sm text-gray-400">{section.content}</p>
              ) : (
                section.content
              )}
            </div>
          ))}
          
          {storageUrl && (
            <div>
              <h4 className="font-semibold text-harmonia-green mb-1">Armazenamento</h4>
              <p className="text-sm text-gray-400">
                Acesse os arquivos relacionados a {title.toLowerCase()} no armazenamento compartilhado:
              </p>
              <a 
                href={storageUrl} 
                target="_blank" 
                className="text-sm text-harmonia-green hover:underline mt-1 block truncate"
              >
                Acessar Pasta Compartilhada
              </a>
            </div>
          )}
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-gray-500">
              Para mais informações, consulte a documentação completa no manual administrativo.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminGuide;
