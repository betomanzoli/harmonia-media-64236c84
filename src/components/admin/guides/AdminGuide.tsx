
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface Section {
  title: string;
  content: React.ReactNode;
}

interface AdminGuideProps {
  title: string;
  sections: Section[];
  storageUrl?: string;
}

const AdminGuide: React.FC<AdminGuideProps> = ({ title, sections, storageUrl }) => {
  return (
    <Card className="shadow-md border-harmonia-green/20">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-harmonia-green">{title}</CardTitle>
        {storageUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-harmonia-green/30 text-harmonia-green hover:bg-harmonia-light-green/20"
            onClick={() => window.open(storageUrl, '_blank')}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Pasta de Documentos
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-harmonia-green hover:text-harmonia-green/80">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AdminGuide;
