
import React, { useState } from 'react';
import { AudioSample } from '@/types/audio';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Trash2, Play, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AudioTableProps {
  audioSamples: AudioSample[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
}

const AudioTable: React.FC<AudioTableProps> = ({ 
  audioSamples, 
  isLoading,
  onDelete 
}) => {
  const [sampleToDelete, setSampleToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSampleToDelete(id);
  };

  const confirmDelete = () => {
    if (sampleToDelete && onDelete) {
      onDelete(sampleToDelete);
      setSampleToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-6 shadow-md border-harmonia-green/20">
        <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10">
          <CardTitle className="text-harmonia-green">Amostras de Áudio</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 shadow-md border-harmonia-green/20">
      <CardHeader className="bg-gradient-to-r from-harmonia-light-green to-harmonia-green/10">
        <CardTitle className="text-harmonia-green">Amostras de Áudio</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {audioSamples.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estilo</TableHead>
                <TableHead>Humor</TableHead>
                <TableHead>Ocasião</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audioSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-medium">{sample.title}</TableCell>
                  <TableCell>{sample.style}</TableCell>
                  <TableCell>{sample.mood}</TableCell>
                  <TableCell>{sample.occasion}</TableCell>
                  <TableCell>{formatDate(sample.created_at || '')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" title="Reproduzir">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline" 
                        size="icon"
                        title="Abrir URL"
                        onClick={() => window.open(sample.audio_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {onDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Excluir amostra"
                              onClick={() => handleDeleteClick(sample.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a amostra "{sample.title}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={confirmDelete}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma amostra de áudio cadastrada. Adicione algumas usando o formulário abaixo.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioTable;
