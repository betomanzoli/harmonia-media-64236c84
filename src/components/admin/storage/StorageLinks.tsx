
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';

interface StorageLink {
  title: string;
  description: string;
  url: string;
}

interface StorageLinksProps {
  title?: string;
  links: StorageLink[];
}

export const StorageLinks: React.FC<StorageLinksProps> = ({ 
  title = "Armazenamento de Arquivos", 
  links 
}) => {
  return (
    <Card className="shadow-md border-harmonia-green/20">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10">
        <CardTitle className="text-harmonia-green">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border rounded-md hover:bg-harmonia-light-green/10 transition-colors flex flex-col space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-harmonia-green">{link.title}</h4>
                <ExternalLink className="h-4 w-4 text-harmonia-green opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-gray-500">{link.description}</p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageLinks;
