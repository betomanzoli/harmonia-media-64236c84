
import React from 'react';

const PortfolioSummary: React.FC = () => {
  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 bg-card border border-border rounded-lg p-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Comparações de Resultados</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Exemplos com e sem Masterização</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Stems Separados vs. Faixas Completas</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Comparação entre os Pacotes</span>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Gêneros Disponíveis</h3>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Pop</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Rock</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">MPB</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Eletrônico</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Clássico</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Instrumental</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Jazz</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Samba</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Bossa Nova</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Country</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Gospel</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Metal</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Funk</span>
          <span className="text-xs bg-harmonia-green/20 text-harmonia-green px-2 py-1 rounded-full">Pagode</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Tipos de Projeto</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Presentes Personalizados</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Jingles Comerciais</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Trilhas para Vídeos</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Música para Eventos</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-harmonia-green"></span>
            <span>Podcasts e Streaming</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PortfolioSummary;
