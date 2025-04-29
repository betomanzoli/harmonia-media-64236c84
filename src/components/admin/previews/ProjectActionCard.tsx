
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Calendar, Eye, Send, Mail, Phone } from 'lucide-react';
import AddVersionDialog from './AddVersionDialog';
import { VersionItem } from '@/hooks/admin/usePreviewProjects';

export interface ProjectActionCardProps {
  projectId: string;
  onAddVersion: (version: VersionItem) => void;
  onExtendDeadline: () => void;
  previewUrl: string;
  clientPhone?: string;
  clientEmail?: string;
}

const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  projectId,
  onAddVersion,
  onExtendDeadline,
  previewUrl,
  clientPhone,
  clientEmail
}) => {
  const openWhatsApp = () => {
    const phone = clientPhone || '';
    const message = encodeURIComponent("Olá! Sua prévia musical da harmonIA está disponível para avaliação no link: " + window.location.origin + previewUrl);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const openEmail = () => {
    const email = clientEmail || 'contato@harmonia.media';
    const subject = encodeURIComponent("Sua prévia musical da harmonIA está disponível");
    const body = encodeURIComponent(`Olá!\n\nSua prévia musical está disponível para avaliação no link abaixo:\n${window.location.origin}${previewUrl}\n\nFicamos à disposição para qualquer dúvida.\n\nAtenciosamente,\nEquipe harmonIA`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AddVersionDialog 
          projectId={projectId}
          onAddVersion={onAddVersion}
        />
        
        <Button
          variant="outline"
          className="w-full flex justify-start"
          onClick={onExtendDeadline}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Estender Prazo (+7 dias)
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex justify-start"
          asChild
        >
          <Link to={previewUrl} target="_blank">
            <Eye className="h-4 w-4 mr-2" />
            Ver Página do Cliente
          </Link>
        </Button>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 flex justify-center items-center"
            onClick={openWhatsApp}
          >
            <Phone className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 flex justify-center items-center"
            onClick={openEmail}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActionCard;
