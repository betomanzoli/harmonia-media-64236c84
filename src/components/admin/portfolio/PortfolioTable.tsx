
import React from 'react';
import { Music } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PortfolioItem } from '@/hooks/usePortfolioItems';

interface PortfolioTableProps {
  portfolioItems: PortfolioItem[];
  isLoading: boolean;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ portfolioItems, isLoading }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Itens do Portfólio</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de exemplos do portfólio</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Subtítulo</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Prévia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
              </TableRow>
            ) : portfolioItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Nenhum item encontrado</TableCell>
              </TableRow>
            ) : (
              portfolioItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.subtitle}</TableCell>
                  <TableCell>{item.genre}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">
                    <a 
                      href={item.audioSrc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-harmonia-green hover:underline"
                    >
                      <Music className="w-4 h-4" />
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

export default PortfolioTable;
