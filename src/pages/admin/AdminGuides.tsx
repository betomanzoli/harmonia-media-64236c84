
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Book, 
  FileQuestion, 
  HelpCircle, 
  Info, 
  ArrowRight,
  ExternalLink,
  Music,
  Package,
  MessageSquare,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface GuideSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const ProjectManagementGuide: React.FC = () => {
  const sections: GuideSection[] = [
    {
      id: 'overview',
      title: 'Visão Geral',
      content: (
        <div className="space-y-4">
          <p>
            O sistema de gerenciamento de projetos da harmonIA foi projetado para guiar a equipe ao longo de todo o ciclo de vida de uma produção musical, desde o briefing inicial até a entrega final. O processo é estruturado em fases claras que garantem organização e transparência.
          </p>
          
          <div className="rounded-md border p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Fases Principais do Projeto</h4>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Briefing e Análise</strong>
                <p className="text-sm text-gray-600">Coleta e análise dos requisitos do cliente</p>
              </li>
              <li>
                <strong>Composição</strong>
                <p className="text-sm text-gray-600">Criação da estrutura musical e harmonia base</p>
              </li>
              <li>
                <strong>Prévias</strong>
                <p className="text-sm text-gray-600">Criação e compartilhamento de versões para aprovação</p>
              </li>
              <li>
                <strong>Avaliação e Feedback</strong>
                <p className="text-sm text-gray-600">Recebimento e implementação de ajustes solicitados</p>
              </li>
              <li>
                <strong>Finalização</strong>
                <p className="text-sm text-gray-600">Mixagem, masterização e finalização do produto</p>
              </li>
              <li>
                <strong>Entrega</strong>
                <p className="text-sm text-gray-600">Entrega dos arquivos finais e conclusão do projeto</p>
              </li>
            </ol>
          </div>
          
          <p>
            Cada fase do projeto tem suas próprias ferramentas e interfaces projetadas para facilitar o trabalho específico daquela etapa. O sistema garante que a equipe siga um fluxo de trabalho consistente, mantendo a qualidade e os prazos estabelecidos.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Fluxo Ideal de Trabalho</p>
                <p className="text-sm text-blue-700 mt-1">
                  Recomendamos fortemente seguir a sequência de fases estabelecida. Cada fase depende da conclusão adequada da fase anterior para garantir resultados de qualidade e evitar retrabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'projects',
      title: 'Gerenciamento de Projetos',
      content: (
        <div className="space-y-4">
          <p>
            A página de gerenciamento de projetos é o hub central para todas as suas atividades. Aqui você pode visualizar todos os projetos em andamento, filtrar por status, buscar por cliente ou ID, e acessar rapidamente as ferramentas para cada fase.
          </p>
          
          <h4 className="font-medium">Acessando a Lista de Projetos</h4>
          <p>
            Acesse a lista completa de projetos em <code>/admin-j28s7d1k/projects</code>. Esta página mostra todos os projetos com seu status atual, cliente, pacote e outras informações relevantes.
          </p>
          
          <div className="bg-gray-50 border rounded-md p-4 mb-4">
            <h4 className="font-medium mb-2">Filtros Disponíveis</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Busca:</strong> Encontre projetos pelo nome do cliente ou ID</li>
              <li><strong>Status:</strong> Filtre por status (Novo, Em Andamento, Aguardando Feedback, etc.)</li>
              <li><strong>Pacote:</strong> Filtre por tipo de pacote (Essencial, Profissional, Premium)</li>
              <li><strong>Abas:</strong> Filtre rapidamente usando as abas predefinidas (Todos, Ativos, Aguardando Ação, etc.)</li>
            </ul>
          </div>
          
          <h4 className="font-medium">Gerenciando um Projeto Específico</h4>
          <p>
            Clique no botão "Gerenciar" em qualquer projeto da lista para acessar a página detalhada de gerenciamento, onde você poderá:
          </p>
          
          <ul className="list-disc pl-6 space-y-1">
            <li>Ver e gerenciar as fases do projeto</li>
            <li>Adicionar notas e documentação</li>
            <li>Ver informações do cliente</li>
            <li>Monitorar prazos e progresso</li>
            <li>Realizar ações específicas para cada fase</li>
          </ul>
          
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 mt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Atenção aos Prazos</p>
                <p className="text-sm mt-1">
                  Projetos com status "Atrasado" devem receber prioridade máxima. O sistema destaca esses projetos na lista e em relatórios.
                </p>
              </div>
            </div>
            
            <Link to="/admin-j28s7d1k/projects?filter=late">
              <Button variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 hover:bg-amber-100 hover:text-amber-700">
                Ver Atrasados
              </Button>
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'previews',
      title: 'Sistema de Prévias',
      content: (
        <div className="space-y-4">
          <p>
            O sistema de prévias é uma parte crucial do fluxo de trabalho, permitindo que você compartilhe versões musicais com o cliente para avaliação e feedback. Esta funcionalidade garante colaboração eficiente e alinhamento com as expectativas do cliente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="w-5 h-5 text-harmonia-green" />
                <h4 className="font-medium">Criando Prévias</h4>
              </div>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Acesse <code>/admin-j28s7d1k/previews</code></li>
                <li>Clique em "Novo Projeto"</li>
                <li>Preencha os dados do cliente</li>
                <li>Adicione 2-5 versões de prévia (30 segundos cada)</li>
                <li>Inclua descrições detalhadas para cada versão</li>
                <li>Defina um prazo para avaliação</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium">Proteção de Conteúdo</h4>
              </div>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>As prévias são limitadas a 30 segundos</li>
                <li>Downloads são bloqueados durante a fase de avaliação</li>
                <li>Links de acesso são exclusivos e temporários</li>
                <li>Conteúdo protegido contra download não autorizado</li>
                <li>Downloads são habilitados apenas na fase final</li>
              </ul>
            </div>
          </div>
          
          <h4 className="font-medium">Fluxo de Avaliação do Cliente</h4>
          <p>
            Quando você cria um projeto de prévias, o sistema:
          </p>
          
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <p>Envia um email ao cliente com um link único para a página de prévias</p>
            </li>
            <li>
              <p>O cliente acessa o link, ouve todas as versões disponíveis e pode:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-1">
                <li><strong>Aprovar diretamente</strong> uma versão se estiver satisfeito</li>
                <li><strong>Enviar feedback</strong> com solicitações de ajustes</li>
              </ul>
            </li>
            <li>
              <p>Você recebe uma notificação do sistema quando o cliente responde</p>
            </li>
            <li>
              <p>Com base na resposta do cliente, você:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm mt-1">
                <li>Segue para a fase de finalização (se aprovado)</li>
                <li>Implementa os ajustes solicitados (se recebeu feedback)</li>
              </ul>
            </li>
          </ol>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Melhores Práticas</p>
                <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                  <li>Envie prévias que verdadeiramente representem o produto final</li>
                  <li>Escolha os 30 segundos mais representativos da música</li>
                  <li>Inclua descrições detalhadas que expliquem cada versão</li>
                  <li>Estabeleça expectativas claras sobre o número de rodadas de ajustes (conforme o pacote)</li>
                  <li>Envie lembretes para clientes que não avaliaram dentro do prazo</li>
                </ul>
              </div>
            </div>
          </div>
          
          <p>
            Para mais detalhes sobre o sistema de prévias, consulte o arquivo <code>PREVIEWS_README.md</code> na documentação.
          </p>
        </div>
      )
    },
    {
      id: 'delivery',
      title: 'Entrega e Finalização',
      content: (
        <div className="space-y-4">
          <p>
            A fase de entrega é o momento culminante do projeto, quando o produto final é disponibilizado ao cliente. Este processo deve ser tratado com cuidado para garantir que o cliente receba todos os materiais conforme especificado no pacote contratado.
          </p>
          
          <h4 className="font-medium">Preparação para Entrega</h4>
          <p>
            Antes de proceder com a entrega, certifique-se de que:
          </p>
          
          <ul className="list-disc pl-6 space-y-1">
            <li>O cliente aprovou a versão final da música</li>
            <li>Todas as fases anteriores foram concluídas</li>
            <li>Todos os arquivos foram preparados nos formatos corretos</li>
            <li>Os materiais correspondem ao pacote contratado</li>
          </ul>
          
          <div className="rounded-md border p-4 bg-gray-50 my-4">
            <h4 className="font-medium mb-2">Arquivos por Tipo de Pacote</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  Essencial
                </h5>
                <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
                  <li>Arquivo WAV mixado e masterizado</li>
                  <li>Arquivo MP3 (320kbps)</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-medium flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                  Profissional
                </h5>
                <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
                  <li>Arquivo WAV mixado e masterizado</li>
                  <li>Arquivo MP3 (320kbps)</li>
                  <li>Versão instrumental</li>
                  <li>2-3 stems básicos</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-medium flex items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                  Premium
                </h5>
                <ul className="list-disc pl-6 text-sm text-gray-600 mt-1">
                  <li>Arquivo WAV mixado e masterizado</li>
                  <li>Arquivo MP3 (320kbps)</li>
                  <li>Versão instrumental</li>
                  <li>Stems completos</li>
                  <li>Arquivos de projeto (sessão DAW)</li>
                  <li>Versões alternativas</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="font-medium">Processo de Entrega</h4>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <p>Na página de gerenciamento do projeto, vá para a fase "Entrega"</p>
            </li>
            <li>
              <p>Clique em "Gerar Links de Download"</p>
            </li>
            <li>
              <p>Faça upload de todos os arquivos necessários</p>
            </li>
            <li>
              <p>Adicione descrições claras para cada arquivo</p>
            </li>
            <li>
              <p>Envie a notificação de entrega ao cliente</p>
            </li>
            <li>
              <p>Marque o projeto como "Concluído" após confirmação do cliente</p>
            </li>
          </ol>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 mt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Considerações Importantes</p>
                <ul className="list-disc pl-6 space-y-1 text-sm mt-2">
                  <li>Verifique duas vezes se todos os arquivos estão corretos antes do envio</li>
                  <li>Certifique-se de que os arquivos são nomeados de forma clara e consistente</li>
                  <li>Garanta que todos os links de download funcionam corretamente</li>
                  <li>Inclua instruções de uso dos arquivos, especialmente para stems e versões alternativas</li>
                  <li>Configure o prazo de expiração dos links conforme a política da empresa</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="font-medium">Pós-Entrega</h4>
          <p>
            Após a entrega, é importante:
          </p>
          
          <ul className="list-disc pl-6 space-y-1">
            <li>Solicitar feedback final do cliente</li>
            <li>Documentar o projeto para referência futura</li>
            <li>Arquivar adequadamente todos os materiais do projeto</li>
            <li>Enviar informações sobre serviços adicionais ou futuras colaborações</li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Perguntas Frequentes',
      content: (
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="font-medium">Como gerenciar múltiplos projetos eficientemente?</h4>
            <p className="text-gray-600">
              Utilize os filtros e abas da página de projetos para focar em projetos específicos. Priorize projetos por prazo e status, dando atenção especial aos atrasados ou com ações pendentes.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">O que fazer quando um cliente não responde dentro do prazo de avaliação?</h4>
            <p className="text-gray-600">
              Envie lembretes automáticos usando o botão "Reenviar Email" na página de prévias. Se o cliente continuar sem resposta, entre em contato diretamente por telefone. Você também pode estender o prazo de avaliação criando um novo projeto de prévias.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">Como lidar com solicitações de ajustes fora do escopo?</h4>
            <p className="text-gray-600">
              Verifique o número de rodadas de ajustes incluídas no pacote contratado. Para solicitações além do escopo, explique educadamente as limitações do pacote e ofereça opções para contratação de serviços adicionais.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">É possível permitir que o cliente baixe as prévias?</h4>
            <p className="text-gray-600">
              Não, por padrão as prévias são protegidas contra download para preservar a propriedade intelectual. O download só é habilitado na fase final, após a aprovação e pagamento completo.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">Como adaptar o fluxo de trabalho para projetos urgentes?</h4>
            <p className="text-gray-600">
              Projetos urgentes podem seguir um fluxo condensado, combinando fases quando possível. Reduza o número de versões de prévia (mas nunca menos que duas) e estabeleça prazos de feedback mais curtos com o cliente.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">O que acontece se um cliente solicitar o cancelamento do projeto?</h4>
            <p className="text-gray-600">
              Consulte os termos do contrato para políticas de cancelamento. Em geral, o trabalho já realizado deve ser documentado e uma decisão sobre reembolso parcial deve ser tomada com base na fase atual do projeto.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">Como lidar com projetos que exigem colaboração entre múltiplos criadores?</h4>
            <p className="text-gray-600">
              Utilize a seção de notas do projeto para coordenar o trabalho. Atribua responsabilidades claras para cada fase e mantenha toda a equipe atualizada sobre o progresso. Considere criar subprojetos para elementos específicos.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">Onde encontrar documentação adicional sobre o sistema?</h4>
            <p className="text-gray-600">
              Consulte os arquivos README específicos para cada área do sistema:
            </p>
            <ul className="list-disc pl-6 text-sm text-gray-600 mt-2">
              <li><code>ADMIN_README.md</code> - Visão geral administrativa</li>
              <li><code>PREVIEWS_README.md</code> - Sistema de prévias em detalhes</li>
              <li><code>AUDIO_README.md</code> - Gerenciamento de arquivos de áudio</li>
            </ul>
          </div>
        </div>
      )
    }
  ];
  
  const [activeSection, setActiveSection] = useState(sections[0].id);
  
  return (
    <div className="flex h-[calc(100vh-220px)]">
      <div className="w-64 border-r pr-4">
        <h3 className="font-medium mb-4">Conteúdo do Guia</h3>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeSection === section.id
                  ? 'bg-harmonia-green/10 text-harmonia-green font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 pl-6">
        <ScrollArea className="h-full pr-4">
          {sections.find(s => s.id === activeSection)?.content}
        </ScrollArea>
      </div>
    </div>
  );
};

const PreviewsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border rounded-md p-6">
        <h3 className="text-lg font-medium mb-4">Sistema de Prévias Musicais</h3>
        <p className="mb-4">
          O sistema de prévias musicais é uma ferramenta essencial que permite compartilhar diferentes versões de uma composição com o cliente para avaliação e feedback.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Upload className="w-4 h-4 text-harmonia-green" />
              Para Administradores
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Criar projetos de prévia</strong>
                <p className="text-gray-600">Envie múltiplas versões para avaliação do cliente</p>
              </li>
              <li>
                <strong>Monitorar feedback</strong>
                <p className="text-gray-600">Receba e implemente sugestões do cliente</p>
              </li>
              <li>
                <strong>Gerenciar versões</strong>
                <p className="text-gray-600">Adicione novas versões baseadas no feedback</p>
              </li>
              <li>
                <strong>Proteger o conteúdo</strong>
                <p className="text-gray-600">Controle o acesso e evite downloads não autorizados</p>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-harmonia-green" />
              Para Clientes
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Fácil avaliação</strong>
                <p className="text-gray-600">Interface intuitiva para ouvir e comparar versões</p>
              </li>
              <li>
                <strong>Feedback detalhado</strong>
                <p className="text-gray-600">Ferramentas para fornecer comentários específicos</p>
              </li>
              <li>
                <strong>Aprovação simplificada</strong>
                <p className="text-gray-600">Processo direto para aprovar a versão escolhida</p>
              </li>
              <li>
                <strong>Acesso seguro</strong>
                <p className="text-gray-600">Link exclusivo e temporário para avaliação</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-harmonia-green/10 border border-harmonia-green/30 rounded-md p-4">
          <h4 className="font-medium text-harmonia-green mb-2">Melhores Práticas</h4>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Crie entre 3-5 versões distintas para oferecer opções variadas</li>
            <li>Inclua descrições detalhadas para cada versão</li>
            <li>Use prévias de 30 segundos que representem bem o conceito completo</li>
            <li>Estabeleça expectativas claras sobre o processo de feedback</li>
            <li>Configure prazos razoáveis para avaliação (geralmente 7 dias)</li>
          </ul>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Fluxo de Trabalho Detalhado</h3>
        
        <div className="relative border-l-2 border-gray-200 ml-3 pl-8 pb-1">
          <div className="absolute w-6 h-6 bg-harmonia-green text-white rounded-full flex items-center justify-center -left-3 -top-1">
            1
          </div>
          <h4 className="font-medium">Criação do Projeto</h4>
          <p className="text-sm text-gray-600 mt-1 mb-2">
            O administrador cria um novo projeto de prévias, definindo o cliente, prazo e carregando as versões musicais.
          </p>
          <div className="bg-gray-50 p-3 rounded text-sm border">
            <code>Acesse: /admin-j28s7d1k/previews → Novo Projeto</code>
          </div>
        </div>
        
        <div className="relative border-l-2 border-gray-200 ml-3 pl-8 pb-1">
          <div className="absolute w-6 h-6 bg-harmonia-green text-white rounded-full flex items-center justify-center -left-3 -top-1">
            2
          </div>
          <h4 className="font-medium">Notificação do Cliente</h4>
          <p className="text-sm text-gray-600 mt-1">
            O sistema envia automaticamente um email ao cliente com um link exclusivo para acessar as prévias.
          </p>
        </div>
        
        <div className="relative border-l-2 border-gray-200 ml-3 pl-8 pb-1">
          <div className="absolute w-6 h-6 bg-harmonia-green text-white rounded-full flex items-center justify-center -left-3 -top-1">
            3
          </div>
          <h4 className="font-medium">Avaliação do Cliente</h4>
          <p className="text-sm text-gray-600 mt-1 mb-2">
            O cliente acessa o link, ouve as diferentes versões, seleciona a preferida e fornece feedback ou aprovação.
          </p>
          <div className="bg-gray-50 p-3 rounded text-sm border">
            <code>URL de acesso: /previews/{'{projectId}'}</code>
          </div>
        </div>
        
        <div className="relative border-l-2 border-gray-200 ml-3 pl-8 pb-1">
          <div className="absolute w-6 h-6 bg-harmonia-green text-white rounded-full flex items-center justify-center -left-3 -top-1">
            4
          </div>
          <h4 className="font-medium">Processamento do Feedback</h4>
          <p className="text-sm text-gray-600 mt-1">
            O administrador recebe o feedback, implementa os ajustes necessários e, se necessário, cria novas versões.
          </p>
        </div>
        
        <div className="relative ml-3 pl-8">
          <div className="absolute w-6 h-6 bg-harmonia-green text-white rounded-full flex items-center justify-center -left-3 -top-1">
            5
          </div>
          <h4 className="font-medium">Finalização</h4>
          <p className="text-sm text-gray-600 mt-1">
            Após a aprovação do cliente, o projeto avança para a fase de finalização e produção completa.
          </p>
        </div>
      </div>
      
      <div className="rounded-md border p-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Limitações e Segurança</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-blue-500" />
              Proteção de Conteúdo
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>As prévias são limitadas a 30 segundos</li>
              <li>Downloads são bloqueados durante a avaliação</li>
              <li>Links de acesso são temporários e expiram após o prazo</li>
              <li>Proteção contra botão direito e outras técnicas anti-cópia</li>
              <li>Streaming seguro dos arquivos de áudio</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Considerações Importantes
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Limite de 5 versões por projeto de prévia</li>
              <li>Tamanho máximo de arquivo: 20MB por versão</li>
              <li>Formatos suportados: MP3 apenas</li>
              <li>Qualidade recomendada: 128kbps (proteção)</li>
              <li>Prazo máximo de avaliação: 15 dias</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-6">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            Documentação Complementar
          </h4>
          <p className="text-sm text-blue-700">
            Para informações mais detalhadas sobre o sistema de prévias, consulte o arquivo <code>PREVIEWS_README.md</code> na raiz do projeto.
            Este documento contém informações técnicas, instruções de solução de problemas e cenários específicos.
          </p>
          
          <div className="mt-4 flex justify-end">
            <Link to="/admin-j28s7d1k/previews">
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90 gap-2">
                Acessar Sistema de Prévias
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-md border p-6">
        <h3 className="text-lg font-medium mb-4">Documentação do Sistema</h3>
        <p className="mb-4">
          O sistema administrativo da harmonIA é documentado através de vários arquivos README que explicam o funcionamento de cada módulo.
          Estes documentos são essenciais para entender o sistema e seguir as melhores práticas.
        </p>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">ADMIN_README.md</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Visão geral das páginas administrativas, incluindo gerenciamento de áudio e portfólio.
                  Explica como acessar e usar as diferentes seções administrativas.
                </p>
                <Button variant="link" className="text-amber-600 p-0 h-auto text-sm mt-1">
                  Ver Documentação Completa
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">PREVIEWS_MANAGEMENT_README.md</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Guia detalhado sobre o sistema de prévias musicais, tanto para administradores quanto para clientes.
                  Explica o fluxo de trabalho, restrições e melhores práticas.
                </p>
                <Button variant="link" className="text-blue-600 p-0 h-auto text-sm mt-1">
                  Ver Documentação Completa
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-harmonia-green flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">PREVIEWS_README.md</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Documentação técnica do sistema de prévias, incluindo detalhes de implementação,
                  configurações e solução de problemas.
                </p>
                <Button variant="link" className="text-harmonia-green p-0 h-auto text-sm mt-1">
                  Ver Documentação Completa
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">AUDIO_README.md</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Guia para gerenciamento de arquivos de áudio no sistema, incluindo organização,
                  formatos suportados e boas práticas.
                </p>
                <Button variant="link" className="text-purple-600 p-0 h-auto text-sm mt-1">
                  Ver Documentação Completa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-medium">Guias de Passos a Passo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Criando um Novo Projeto</CardTitle>
            <CardDescription>Do briefing à entrega final</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>Acesse a página de projetos</li>
              <li>Clique em "Novo Projeto"</li>
              <li>Preencha as informações do cliente</li>
              <li>Selecione o pacote contratado</li>
              <li>Analise o briefing recebido</li>
              <li>Crie as fases do projeto</li>
              <li>Defina prazos para cada fase</li>
            </ol>
            <Button className="w-full mt-4 bg-harmonia-green hover:bg-harmonia-green/90" size="sm">
              Ver Guia Completo
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gerenciando Prévias Musicais</CardTitle>
            <CardDescription>Criação, envio e gestão de feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>Acesse o sistema de prévias</li>
              <li>Crie um novo projeto de prévias</li>
              <li>Adicione versões musicais (2-5)</li>
              <li>Configure o prazo de avaliação</li>
              <li>Notifique o cliente</li>
              <li>Monitore o feedback recebido</li>
              <li>Implemente ajustes solicitados</li>
            </ol>
            <Button className="w-full mt-4 bg-harmonia-green hover:bg-harmonia-green/90" size="sm">
              Ver Guia Completo
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Entrega de Projeto</CardTitle>
            <CardDescription>Finalização e disponibilização de arquivos</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>Finalize a produção musical</li>
              <li>Prepare os arquivos de entrega</li>
              <li>Acesse a fase de entrega do projeto</li>
              <li>Faça upload dos arquivos finais</li>
              <li>Configure permissões de download</li>
              <li>Envie notificação ao cliente</li>
              <li>Confirme o recebimento</li>
            </ol>
            <Button className="w-full mt-4 bg-harmonia-green hover:bg-harmonia-green/90" size="sm">
              Ver Guia Completo
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Solução de Problemas</CardTitle>
            <CardDescription>Resolvendo questões comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Cliente não recebeu email de prévias</li>
              <li>Problemas com uploads de áudio</li>
              <li>Cliente não consegue ouvir as prévias</li>
              <li>Link de prévias expirado</li>
              <li>Problemas com downloads finais</li>
              <li>Erros comuns do sistema</li>
            </ul>
            <Button className="w-full mt-4 bg-harmonia-green hover:bg-harmonia-green/90" size="sm">
              Ver Guia Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminGuides: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Guias e Documentação</h1>
            <p className="text-gray-500">Instruções detalhadas para gerenciar projetos e trabalhar com o sistema</p>
          </div>
          
          <div className="flex gap-2">
            <a href="/ADMIN_README.md" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Book className="w-4 h-4" />
                Ver README Completo
              </Button>
            </a>
            
            <Link to="/admin-j28s7d1k/projects">
              <Button className="bg-harmonia-green hover:bg-harmonia-green/90 gap-2">
                <ArrowRight className="w-4 h-4" />
                Ir para Projetos
              </Button>
            </Link>
          </div>
        </div>
        
        <Card className="min-h-[calc(100vh-220px)]">
          <CardHeader>
            <CardTitle>Documentação harmonIA</CardTitle>
            <CardDescription>
              Consulte os guias abaixo para entender melhor o sistema e seguir as melhores práticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="projects">Gerenciamento de Projetos</TabsTrigger>
                <TabsTrigger value="previews">Sistema de Prévias</TabsTrigger>
                <TabsTrigger value="docs">Documentação Completa</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="mt-6">
                <ProjectManagementGuide />
              </TabsContent>
              
              <TabsContent value="previews" className="mt-6">
                <PreviewsGuide />
              </TabsContent>
              
              <TabsContent value="docs" className="mt-6">
                <DocsGuide />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGuides;
