
import React from 'react';

interface ContractTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

const ContractTermsDialog: React.FC<ContractTermsDialogProps> = ({
  open,
  onOpenChange,
  onAccept
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Termos e Condições</h2>
        <div className="prose prose-sm mb-4">
          <p>Ao aceitar estes termos, você concorda com as condições de serviço da harmonIA.</p>
          {/* Conteúdo completo dos termos seria inserido aqui */}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </button>
          <button 
            className="px-4 py-2 bg-harmonia-green text-white rounded-md"
            onClick={onAccept}
          >
            Aceitar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractTermsDialog;
