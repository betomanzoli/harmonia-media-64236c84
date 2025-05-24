
import React from 'react';
import { Button } from '@/components/ui/button';

const AddPortfolioItemForm: React.FC = () => {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Adicionar Item ao Portfólio</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input 
            type="text" 
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Título do projeto"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Descrição</label>
          <textarea
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            placeholder="Descrição do projeto"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">Adicionar</Button>
        </div>
      </form>
    </div>
  );
};

export default AddPortfolioItemForm;
