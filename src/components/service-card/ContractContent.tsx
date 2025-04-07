
import React from 'react';

interface ContractContentProps {
  title: string;
}

const ContractContent: React.FC<ContractContentProps> = ({ title }) => {
  switch(title) {
    case "Pacote Essencial":
      return (
        <div className="max-h-96 overflow-y-auto text-sm">
          <h3 className="font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE ESSENCIAL</h3>
          <p className="mb-2">CONTRATADA: harmonIA, CNPJ XX.XXX.XXX/0001-XX<br />
          CONTRATANTE: [NOME COMPLETO], CPF [XXX.XXX.XXX-XX]</p>
          <h4 className="font-bold mt-4">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
          <p>1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Essencial.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO</h4>
          <p>2.1. O serviço inclui:<br />
             a) 1 (uma) composição musical (letra + melodia) via IA com supervisão humana;<br />
             b) 1 (uma) revisão de letra/estrutura musical;<br />
             c) Arquivo digital em alta qualidade (MP3/WAV);<br />
             d) Entrega em até 72 horas úteis;<br />
             e) Certificado digital de autoria.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS</h4>
          <p>3.1. O CONTRATANTE recebe uma licença não-exclusiva, intransferível, para uso EXCLUSIVAMENTE PESSOAL E NÃO-COMERCIAL da OBRA MUSICAL.<br />
             3.2. É expressamente VEDADA a reprodução pública, comercialização, adaptação, sincronização com imagens, ou cessão a terceiros da OBRA MUSICAL.<br />
             3.3. O uso da OBRA MUSICAL exige a atribuição de crédito: "Música criada por harmonIA para [Nome do CONTRATANTE]".</p>
          
          {/* ... Additional clauses */}
          <h4 className="font-bold mt-4">CLÁUSULA QUARTA - DA PROPRIEDADE INTELECTUAL</h4>
          <p>4.1. O CONTRATANTE detém direitos sobre o conteúdo fornecido para criação.<br />
             4.2. A CONTRATADA mantém direitos sobre melodia, harmonia e arranjos.<br />
             4.3. A OBRA MUSICAL é protegida por certificado digital de autoria emitido pela CONTRATADA.<br />
             4.4. Qualquer registro adicional da OBRA MUSICAL em órgãos como UBC, ECAD ou similares é de responsabilidade exclusiva do CONTRATANTE.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA QUINTA - DA RESPONSABILIDADE POR USO INDEVIDO</h4>
          <p>5.1. O CONTRATANTE assume integral e exclusiva responsabilidade por qualquer uso da OBRA MUSICAL que exceda os limites estabelecidos na CLÁUSULA TERCEIRA.<br />
             5.2. A CONTRATADA não responderá, em nenhuma hipótese, por disputas ou reivindicações de terceiros decorrentes de uso indevido da OBRA MUSICAL pelo CONTRATANTE.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SEXTA - DO VALOR E PAGAMENTO</h4>
          <p>6.1. O pagamento deverá ser realizado integralmente no ato da contratação.<br />
             6.2. O início da produção ocorrerá apenas após a confirmação do pagamento.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SÉTIMA - DA ENTREGA E ACEITAÇÃO</h4>
          <p>7.1. A OBRA MUSICAL será entregue em formato digital através de link seguro.<br />
             7.2. O CONTRATANTE terá 7 (sete) dias para solicitar a revisão incluída.<br />
             7.3. Os arquivos do projeto ficarão disponíveis para revisões pelo período de 90 (noventa) dias após a entrega final, após o qual serão arquivados, impossibilitando revisões futuras.</p>
        </div>
      );
    case "Pacote Profissional":
      return (
        <div className="max-h-96 overflow-y-auto text-sm">
          <h3 className="font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PROFISSIONAL</h3>
          <p className="mb-2">CONTRATADA: harmonIA, CNPJ XX.XXX.XXX/0001-XX<br />
          CONTRATANTE: [NOME COMPLETO], CPF [XXX.XXX.XXX-XX]</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
          <p>1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Profissional.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO</h4>
          <p>2.1. O serviço inclui:<br />
             a) 3 (três) propostas de composição em estilos diferentes;<br />
             b) 2 (duas) revisões incluídas;<br />
             c) Masterização básica;<br />
             d) Stems básicos separados (voz + instrumentação);<br />
             e) Entrega em até 5 dias úteis;<br />
             f) Certificado digital de autoria com verificação via hash criptográfico.</p>
          
          {/* ... Additional clauses */}
          <h4 className="font-bold mt-4">CLÁUSULA TERCEIRA - DOS DIREITOS CONCEDIDOS</h4>
          <p>3.1. O CONTRATANTE recebe uma licença limitada para:<br />
             a) Uso em conteúdo digital próprio (canais pessoais de redes sociais, podcast, site);<br />
             b) Monetização em plataformas digitais onde o CONTRATANTE seja o titular da conta;<br />
             c) Execução em eventos particulares ou corporativos do CONTRATANTE.<br />
             3.2. É expressamente VEDADO:<br />
             a) Sublicenciar ou revender a OBRA MUSICAL;<br />
             b) Ceder a terceiros para uso em conteúdo não vinculado diretamente ao CONTRATANTE;<br />
             c) Sincronização comercial com produções audiovisuais para distribuição em cinema ou TV.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA QUARTA - DA PROPRIEDADE INTELECTUAL</h4>
          <p>4.1. O CONTRATANTE detém direitos sobre o conteúdo fornecido para criação.<br />
             4.2. A CONTRATADA mantém direitos parciais sobre a OBRA MUSICAL, conforme limitações da CLÁUSULA TERCEIRA.<br />
             4.3. Qualquer registro adicional da OBRA MUSICAL em órgãos como Biblioteca Nacional, UBC, ECAD ou similares é de responsabilidade exclusiva do CONTRATANTE.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA QUINTA - DAS VERIFICAÇÕES DE SIMILARIDADE</h4>
          <p>5.1. A CONTRATADA realizará verificações básicas de similaridade utilizando algoritmos automatizados.<br />
             5.2. A CONTRATADA fornecerá documentação do processo de verificação como parte da entrega.<br />
             5.3. O CONTRATANTE reconhece que tais verificações representam o melhor esforço técnico disponível, não constituindo garantia absoluta contra reivindicações de terceiros.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SEXTA - DA RESPONSABILIDADE POR USO INDEVIDO</h4>
          <p>6.1. O CONTRATANTE assume integral e exclusiva responsabilidade por qualquer uso da OBRA MUSICAL que exceda os limites estabelecidos na CLÁUSULA TERCEIRA.<br />
             6.2. A CONTRATADA não responderá, em nenhuma hipótese, por disputas ou reivindicações de terceiros decorrentes de uso indevido da OBRA MUSICAL pelo CONTRATANTE.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SÉTIMA - DO VALOR E PAGAMENTO</h4>
          <p>7.1. O pagamento deverá ser realizado integralmente no ato da contratação.<br />
             7.2. O início da produção ocorrerá apenas após a confirmação do pagamento.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA OITAVA - DA ENTREGA E ACEITAÇÃO</h4>
          <p>8.1. A OBRA MUSICAL será entregue em formato digital através de link seguro.<br />
             8.2. O CONTRATANTE terá 10 (dez) dias para solicitar as revisões incluídas.<br />
             8.3. Os arquivos do projeto ficarão disponíveis para revisões pelo período de 90 (noventa) dias após a entrega final, após o qual serão arquivados, impossibilitando revisões futuras.</p>
        </div>
      );
    case "Pacote Premium":
      return (
        <div className="max-h-96 overflow-y-auto text-sm">
          <h3 className="font-bold mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PREMIUM</h3>
          <p className="mb-2">CONTRATADA: harmonIA, CNPJ XX.XXX.XXX/0001-XX<br />
          CONTRATANTE: [NOME COMPLETO], CPF [XXX.XXX.XXX-XX]</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
          <p>1.1. Prestação de serviços de composição musical assistida por inteligência artificial com intervenção humana, conforme especificações do Pacote Premium.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO</h4>
          <p>2.1. O serviço inclui:<br />
             a) 5 (cinco) propostas de conceito/estilo;<br />
             b) 3 (três) revisões completas;<br />
             c) Registro da letra na Biblioteca Nacional;<br />
             d) Masterização profissional com ajustes manuais;<br />
             e) Stems completos separados;<br />
             f) Entrega em até 7 dias úteis;<br />
             g) Certificado digital de autoria com registro em blockchain e documentação completa.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA TERCEIRA - DA CESSÃO DE DIREITOS AUTORAIS</h4>
          <p>3.1. A CONTRATADA transfere ao CONTRATANTE a titularidade dos direitos patrimoniais sobre a OBRA MUSICAL, nos termos do Termo de Cessão de Direitos Autorais anexo a este contrato.</p>
          
          {/* ... Additional clauses */}
          <h4 className="font-bold mt-4">CLÁUSULA QUARTA - DOS REGISTROS LEGAIS</h4>
          <p>4.1. A CONTRATADA providenciará o registro da LETRA da OBRA MUSICAL na Biblioteca Nacional em nome do CONTRATANTE.<br />
             4.2. A CONTRATADA realizará registro em blockchain como evidência de precedência temporal, não substituindo registros oficiais completos.<br />
             4.3. Quaisquer registros adicionais de melodia, arranjo ou fonograma em órgãos como UBC, ECAD ou similares são de responsabilidade exclusiva do CONTRATANTE.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA QUINTA - DAS VERIFICAÇÕES DE SIMILARIDADE</h4>
          <p>5.1. A CONTRATADA realizará verificações avançadas de similaridade, incluindo:<br />
             a) Análise algorítmica utilizando múltiplas ferramentas;<br />
             b) Verificação por hash criptográfico;<br />
             c) Documentação detalhada do processo criativo.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SEXTA - DA RESPONSABILIDADE POR USO INDEVIDO</h4>
          <p>6.1. Mesmo com a cessão total dos direitos patrimoniais, o CONTRATANTE assume integral e exclusiva responsabilidade por qualquer uso da OBRA MUSICAL que viole direitos de terceiros.<br />
             6.2. A CONTRATADA não responderá, em nenhuma hipótese, por disputas ou reivindicações de terceiros decorrentes do uso da OBRA MUSICAL pelo CONTRATANTE, mesmo tendo realizado verificações de similaridade.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA SÉTIMA - DO VALOR E PAGAMENTO</h4>
          <p>7.1. O pagamento deverá ser realizado integralmente no ato da contratação.<br />
             7.2. O início da produção ocorrerá apenas após a confirmação do pagamento.</p>
          
          <h4 className="font-bold mt-4">CLÁUSULA OITAVA - DA ENTREGA E ACEITAÇÃO</h4>
          <p>8.1. A OBRA MUSICAL será entregue em formato digital através de link seguro.<br />
             8.2. O CONTRATANTE terá 15 (quinze) dias para solicitar as revisões incluídas.<br />
             8.3. Os arquivos do projeto ficarão disponíveis para revisões pelo período de 90 (noventa) dias após a entrega final, após o qual serão arquivados, impossibilitando revisões futuras.</p>
        </div>
      );
    default:
      return <p>Contrato não disponível.</p>;
  }
};

export default ContractContent;
