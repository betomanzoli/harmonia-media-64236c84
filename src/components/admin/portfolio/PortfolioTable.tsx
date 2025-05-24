
import React from 'react';
import { Music, Edit, Trash2 } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

interface PortfolioTableProps {
  portfolioItems: PortfolioItem[];
  isLoading: boolean;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (id: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ portfolioItems, isLoading, onEdit, onDelete }) => {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
      setItemToDelete(null);
    }
  };

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
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Carregando...</TableCell>
              </TableRow>
            ) : portfolioItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Nenhum item encontrado</TableCell>
              </TableRow>
            ) : (
              portfolioItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.subtitle || item.category}</TableCell>
                  <TableCell>{item.genre || item.category}</TableCell>
                  <TableCell>{item.type || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <a 
                      href={item.audioSrc || item.audioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-harmonia-green hover:underline"
                    >
                      <Music className="w-4 h-4" />
                      Ouvir
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      )}
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setItemToDelete(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item do portfólio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PortfolioTable;
