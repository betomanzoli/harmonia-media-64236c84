
import React from 'react';
import { siteConfig } from '@/config/site';

const RevisionPolicy: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <h2>POLÍTICA DE REEMBOLSO E REVISÕES</h2>
      
      <h3>1. REVISÕES INCLUÍDAS</h3>
      <p>1.1. Cada pacote inclui um número específico de revisões:</p>
      <ul>
        <li>Pacote Essencial: 1 (uma) revisão</li>
        <li>Pacote Profissional: 2 (duas) revisões</li>
        <li>Pacote Premium: 3 (três) revisões</li>
      </ul>
      
      <p>1.2. Entende-se por "revisão" alterações de até 30% do conteúdo da obra, incluindo:</p>
      <ul>
        <li>Ajustes de letra</li>
        <li>Modificações de melodia</li>
        <li>Alterações de andamento ou tonalidade</li>
        <li>Ajustes de mixagem</li>
      </ul>
      
      <h3>2. PROCESSO DE SOLICITAÇÃO</h3>
      <p>2.1. Para solicitar uma revisão, o cliente deve:</p>
      <ul>
        <li>Utilizar o formulário específico disponível na área do cliente</li>
        <li>Detalhar claramente as alterações desejadas</li>
        <li>Respeitar os prazos estabelecidos para solicitação</li>
      </ul>
      
      <h3>3. LIMITES E PRAZOS</h3>
      <p>3.1. As revisões incluídas devem ser solicitadas dentro dos seguintes prazos:</p>
      <ul>
        <li>Pacote Essencial: 7 dias após a entrega</li>
        <li>Pacote Profissional: 10 dias após a entrega</li>
        <li>Pacote Premium: 15 dias após a entrega</li>
      </ul>
      
      <p>3.2. Revisões adicionais além das incluídas no pacote terão custo adicional, sujeitas à disponibilidade técnica.</p>
      
      <p>3.3. Os arquivos e projetos da OBRA MUSICAL ficarão disponíveis para revisões por até 90 (noventa) dias após a entrega final, após o qual serão arquivados, impossibilitando revisões futuras.</p>
      
      <p>3.4. A harmonIA não garante a possibilidade de revisões solicitadas após o período de 90 dias, mesmo mediante pagamento adicional.</p>
      
      <h3>4. POLÍTICA DE REEMBOLSO</h3>
      <p>4.1. A harmonIA oferece reembolso conforme as seguintes condições:</p>
      <ul>
        <li>100% - Cancelamento antes do início da produção</li>
        <li>50% - Cancelamento após início da produção, antes da primeira entrega</li>
        <li>0% - Após a entrega da primeira versão da obra</li>
      </ul>
      
      <p>4.2. Em caso de comprovada similaridade significativa com obras preexistentes, identificada por ferramentas automáticas de verificação ou reclamação formal, a harmonIA oferece:</p>
      <ul>
        <li>Para o Pacote Essencial: Desconto de 50% em nova composição ou crédito equivalente para futuros serviços</li>
        <li>Para o Pacote Profissional: Recomposição (nova criação musical) sem custos adicionais</li>
        <li>Para o Pacote Premium: Recomposição gratuita e assistência básica para eventuais notificações recebidas</li>
      </ul>
      
      <p>4.3. As medidas previstas na cláusula 4.2 estão disponíveis por até 90 dias após a entrega final e aplicam-se exclusivamente a casos onde a similaridade é identificada por método técnico verificável ou notificação formal por terceiros detentores de direitos.</p>
      
      <p>4.4. A política prevista na cláusula 4.2 aplica-se apenas para o uso da OBRA MUSICAL dentro dos limites estabelecidos no contrato específico do pacote contratado. Em caso de uso indevido pelo CLIENTE, a harmonIA não oferecerá qualquer compensação ou suporte.</p>
    </div>
  );
};

export default RevisionPolicy;
