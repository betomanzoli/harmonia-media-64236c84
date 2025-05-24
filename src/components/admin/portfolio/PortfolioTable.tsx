
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  imageUrl?: string;
}

interface PortfolioTableProps {
  portfolioItems: PortfolioItem[];
  isLoading?: boolean;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (id: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ 
  portfolioItems, 
  isLoading = false,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return <div className="text-center text-gray-300 py-8">Carregando itens do portfólio...</div>;
  }
  
  if (portfolioItems.length === 0) {
    return (
      <div className="text-center text-gray-300 p-8 border border-gray-700 rounded-md">
        <p>Nenhum item no portfólio</p>
        <p className="text-sm mt-2">Adicione novos itens para exibição no site</p>
      </div>
    );
  }
  
  return (
    <Table className="text-white">
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data de Criação</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {portfolioItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              {item.published ? (
                <Badge className="bg-green-600">Publicado</Badge>
              ) : (
                <Badge variant="outline" className="text-gray-400 border-gray-600">Rascunho</Badge>
              )}
              {item.featured && (
                <Badge className="ml-2 bg-blue-600">Destaque</Badge>
              )}
            </TableCell>
            <TableCell>{item.createdAt}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Ver</span>
                </Button>
                
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                )}
                
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-600"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PortfolioTable;
