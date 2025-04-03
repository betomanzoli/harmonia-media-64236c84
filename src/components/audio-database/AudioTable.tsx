
import React from 'react';
import { FileAudio } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AudioSample } from '@/types/audio';

interface AudioTableProps {
  audioSamples: AudioSample[];
  isLoading: boolean;
}

const AudioTable: React.FC<AudioTableProps> = ({ audioSamples, isLoading }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Amostras de Áudio</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de exemplos de áudio para integrações</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Estilo</TableHead>
              <TableHead>Emoção</TableHead>
              <TableHead>Ocasião</TableHead>
              <TableHead className="text-right">Prévia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
              </TableRow>
            ) : audioSamples.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Nenhuma amostra de áudio encontrada</TableCell>
              </TableRow>
            ) : (
              audioSamples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-medium">{sample.id}</TableCell>
                  <TableCell>{sample.title}</TableCell>
                  <TableCell>{sample.style}</TableCell>
                  <TableCell>{sample.mood}</TableCell>
                  <TableCell>{sample.occasion}</TableCell>
                  <TableCell className="text-right">
                    <a 
                      href={sample.audio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-harmonia-green hover:underline"
                    >
                      <FileAudio className="w-4 h-4" />
                      Ouvir
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AudioTable;
