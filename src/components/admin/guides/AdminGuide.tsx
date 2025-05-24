
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, BookOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Section {
  title: string;
  content: string;
}

export interface AdminGuideProps {
  title: string;
  sections: Section[];
  storageUrl?: string;
}

const AdminGuide: React.FC<AdminGuideProps> = ({ title, sections, storageUrl }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <BookOpen className="h-6 w-6 text-harmonia-green mt-1" />
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Este guia contém informações detalhadas sobre as funcionalidades do sistema.
              </p>
            </div>
          </div>
          {storageUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-harmonia-green border-harmonia-green hover:bg-harmonia-green/10"
              onClick={() => window.open(storageUrl, '_blank')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documentos relacionados
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-sm max-w-none">
                  <p>{section.content}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-500 mb-2">
            Para mais informações, consulte nossa documentação completa ou entre em contato com o suporte.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Acessar documentação completa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGuide;
