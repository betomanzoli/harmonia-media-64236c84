
import React from 'react';
import { 
  BarChart3, 
  Users, 
  Music, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  // Mock data
  const stats = [
    { title: 'Total de Clientes', value: '124', icon: Users, color: 'bg-blue-500' },
    { title: 'Projetos Ativos', value: '36', icon: Music, color: 'bg-green-500' },
    { title: 'Projetos Concluídos', value: '87', icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'Tempo Médio', value: '5.2 dias', icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-gray-400">{stat.title}</h3>
          </div>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Atividade Recente
        </h2>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b border-gray-700 pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {['Novo briefing recebido', 'Pagamento confirmado', 'Projeto aprovado', 'Feedback recebido', 'Nova versão enviada'][index]}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {['João Silva', 'Maria Oliveira', 'Carlos Eduardo', 'Ana Beatriz', 'Roberto Almeida'][index]}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {['há 2 horas', 'há 4 horas', 'ontem', 'ontem', '2 dias atrás'][index]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
