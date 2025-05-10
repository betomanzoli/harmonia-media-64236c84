
import React from 'react';

interface ContractContentProps {
  packageId?: 'essencial' | 'premium' | 'profissional';
}

export const ContractContent: React.FC<ContractContentProps> = ({ packageId = 'essencial' }) => {
  // Mostrar contratos diferentes baseado no pacote selecionado
  switch(packageId) {
    case 'essencial':
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-bold text-lg">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE ESSENCIAL</h3>
          
          <p>
            Pelo presente instrumento particular, de um lado <strong>harmonIA</strong>, doravante denominada <strong>CONTRATADA</strong>, e do outro lado, o cliente, doravante denominado <strong>CONTRATANTE</strong>, têm entre si justo e contratado o seguinte:
          </p>
          
          <h4 className="font-semibold text-md mt-4">1. OBJETO DO CONTRATO</h4>
          <p>
            O presente contrato tem por objeto a prestação de serviços de composição musical personalizada pela CONTRATADA ao CONTRATANTE, conforme especificações do Pacote Essencial.
          </p>
          
          <h4 className="font-semibold text-md">2. OBRIGAÇÕES DA CONTRATADA</h4>
          <p>
            2.1. Realizar a composição musical conforme as especificações do briefing aprovado pelo CONTRATANTE.<br />
            2.2. Entregar o material dentro do prazo de até 7 dias úteis.<br />
            2.3. Realizar uma revisão incluída no pacote Essencial.<br />
            2.4. Manter o sigilo e a confidencialidade sobre as informações fornecidas pelo CONTRATANTE.
          </p>
          
          <h4 className="font-semibold text-md">3. OBRIGAÇÕES DO CONTRATANTE</h4>
          <p>
            3.1. Pagar o valor acordado de R$ 219,00 conforme o pacote Essencial.<br />
            3.2. Fornecer todas as informações necessárias para a realização do serviço através do briefing.<br />
            3.3. Respeitar os prazos de revisão estabelecidos.<br />
            3.4. Utilizar a música conforme a licença adquirida no pacote (uso exclusivamente pessoal).
          </p>
          
          <h4 className="font-semibold text-md">4. PRAZOS</h4>
          <p>
            4.1. O prazo para entrega da primeira versão será contado a partir da confirmação do pagamento e do recebimento do briefing completo.<br />
            4.2. A revisão será realizada conforme os prazos estabelecidos no pacote contratado.<br />
            4.3. Atrasos decorrentes de informações incompletas ou alterações não previstas no briefing original não serão de responsabilidade da CONTRATADA.
          </p>
          
          <h4 className="font-semibold text-md">5. REVISÕES</h4>
          <p>
            5.1. O Pacote Essencial inclui 1 (uma) revisão gratuita.<br />
            5.2. Mudanças que alterem completamente o conceito original serão consideradas como novo projeto e terão custos adicionais.
          </p>
          
          <h4 className="font-semibold text-md">6. DIREITOS AUTORAIS</h4>
          <p>
            6.1. Os direitos autorais são cedidos conforme o tipo de licença incluída no pacote contratado.<br />
            6.2. Licença para uso pessoal: permite o uso da música apenas para fins pessoais, sem finalidade comercial.<br />
            6.3. A CONTRATADA mantém os direitos autorais da composição para todos os fins legais.
          </p>
          
          <h4 className="font-semibold text-md">7. FORMAS DE PAGAMENTO</h4>
          <p>
            7.1. O pagamento será realizado conforme as opções disponibilizadas no site.<br />
            7.2. Não haverá reembolso após o início da produção da composição musical.
          </p>
          
          <h4 className="font-semibold text-md">8. CONSIDERAÇÕES FINAIS</h4>
          <p>
            8.1. Este contrato representa o acordo integral entre as partes.<br />
            8.2. Qualquer modificação deste contrato deverá ser feita por escrito e aprovada por ambas as partes.<br />
            8.3. As partes elegem o foro da comarca da CONTRATADA para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.
          </p>
        </div>
      );
      
    case 'profissional':
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-bold text-lg">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PROFISSIONAL</h3>
          
          <p>
            Pelo presente instrumento particular, de um lado <strong>harmonIA</strong>, doravante denominada <strong>CONTRATADA</strong>, e do outro lado, o cliente, doravante denominado <strong>CONTRATANTE</strong>, têm entre si justo e contratado o seguinte:
          </p>
          
          <h4 className="font-semibold text-md mt-4">1. OBJETO DO CONTRATO</h4>
          <p>
            O presente contrato tem por objeto a prestação de serviços de composição musical personalizada pela CONTRATADA ao CONTRATANTE, conforme especificações do Pacote Profissional.
          </p>
          
          <h4 className="font-semibold text-md">2. OBRIGAÇÕES DA CONTRATADA</h4>
          <p>
            2.1. Realizar a composição musical conforme as especificações do briefing aprovado pelo CONTRATANTE.<br />
            2.2. Entregar o material dentro do prazo de até 5 dias úteis.<br />
            2.3. Realizar até três revisões incluídas no pacote Profissional.<br />
            2.4. Manter o sigilo e a confidencialidade sobre as informações fornecidas pelo CONTRATANTE.<br />
            2.5. Fornecer três versões para escolha do cliente.<br />
            2.6. Fornecer arquivos separados (stems) de vocais e instrumentação.
          </p>
          
          <h4 className="font-semibold text-md">3. OBRIGAÇÕES DO CONTRATANTE</h4>
          <p>
            3.1. Pagar o valor acordado de R$ 479,00 conforme o pacote Profissional.<br />
            3.2. Fornecer todas as informações necessárias para a realização do serviço através do briefing.<br />
            3.3. Respeitar os prazos de revisão estabelecidos.<br />
            3.4. Utilizar a música conforme a licença adquirida no pacote (uso em conteúdo digital próprio).
          </p>
          
          <h4 className="font-semibold text-md">4. PRAZOS</h4>
          <p>
            4.1. O prazo para entrega da primeira versão será contado a partir da confirmação do pagamento e do recebimento do briefing completo.<br />
            4.2. As revisões serão realizadas conforme os prazos estabelecidos no pacote contratado.<br />
            4.3. Atrasos decorrentes de informações incompletas ou alterações não previstas no briefing original não serão de responsabilidade da CONTRATADA.
          </p>
          
          <h4 className="font-semibold text-md">5. REVISÕES</h4>
          <p>
            5.1. O Pacote Profissional inclui até 3 (três) revisões gratuitas.<br />
            5.2. Mudanças que alterem completamente o conceito original serão consideradas como novo projeto e terão custos adicionais.
          </p>
          
          <h4 className="font-semibold text-md">6. DIREITOS AUTORAIS</h4>
          <p>
            6.1. Os direitos autorais são cedidos conforme o tipo de licença incluída no pacote contratado.<br />
            6.2. Licença para uso comercial limitado: permite o uso da música em conteúdo digital próprio, como redes sociais, podcast e site pessoal.<br />
            6.3. A CONTRATADA mantém os direitos autorais da composição para todos os fins não especificados neste contrato.
          </p>
          
          <h4 className="font-semibold text-md">7. FORMAS DE PAGAMENTO</h4>
          <p>
            7.1. O pagamento será realizado conforme as opções disponibilizadas no site.<br />
            7.2. Não haverá reembolso após o início da produção da composição musical.
          </p>
          
          <h4 className="font-semibold text-md">8. CONSIDERAÇÕES FINAIS</h4>
          <p>
            8.1. Este contrato representa o acordo integral entre as partes.<br />
            8.2. Qualquer modificação deste contrato deverá ser feita por escrito e aprovada por ambas as partes.<br />
            8.3. As partes elegem o foro da comarca da CONTRATADA para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.
          </p>
        </div>
      );
      
    case 'premium':
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-bold text-lg">CONTRATO DE PRESTAÇÃO DE SERVIÇOS - PACOTE PREMIUM</h3>
          
          <p>
            Pelo presente instrumento particular, de um lado <strong>harmonIA</strong>, doravante denominada <strong>CONTRATADA</strong>, e do outro lado, o cliente, doravante denominado <strong>CONTRATANTE</strong>, têm entre si justo e contratado o seguinte:
          </p>
          
          <h4 className="font-semibold text-md mt-4">1. OBJETO DO CONTRATO</h4>
          <p>
            O presente contrato tem por objeto a prestação de serviços de composição musical personalizada pela CONTRATADA ao CONTRATANTE, conforme especificações do Pacote Premium.
          </p>
          
          <h4 className="font-semibold text-md">2. OBRIGAÇÕES DA CONTRATADA</h4>
          <p>
            2.1. Realizar a composição musical conforme as especificações do briefing aprovado pelo CONTRATANTE.<br />
            2.2. Entregar o material dentro do prazo acordado.<br />
            2.3. Realizar revisões ilimitadas até a aprovação final do cliente.<br />
            2.4. Manter o sigilo e a confidencialidade sobre as informações fornecidas pelo CONTRATANTE.<br />
            2.5. Fornecer cinco versões para escolha do cliente.<br />
            2.6. Realizar o registro na Biblioteca Nacional.<br />
            2.7. Fornecer certificado blockchain.<br />
            2.8. Oferecer consultoria de 30 minutos.<br />
            2.9. Fornecer partitura em formato MusicXML.
          </p>
          
          <h4 className="font-semibold text-md">3. OBRIGAÇÕES DO CONTRATANTE</h4>
          <p>
            3.1. Pagar o valor acordado de R$ 969,00 conforme o pacote Premium.<br />
            3.2. Fornecer todas as informações necessárias para a realização do serviço através do briefing.<br />
            3.3. Respeitar os prazos de revisão estabelecidos.<br />
            3.4. Utilizar a música conforme a licença adquirida no pacote (cessão total dos direitos autorais).
          </p>
          
          <h4 className="font-semibold text-md">4. PRAZOS</h4>
          <p>
            4.1. O prazo para entrega da primeira versão será contado a partir da confirmação do pagamento e do recebimento do briefing completo.<br />
            4.2. As revisões serão realizadas conforme os prazos estabelecidos no pacote contratado.<br />
            4.3. Atrasos decorrentes de informações incompletas ou alterações não previstas no briefing original não serão de responsabilidade da CONTRATADA.
          </p>
          
          <h4 className="font-semibold text-md">5. REVISÕES</h4>
          <p>
            5.1. O Pacote Premium inclui revisões ilimitadas até a aprovação final do cliente.<br />
            5.2. Mudanças que alterem completamente o conceito original poderão ser implementadas sem custos adicionais dentro do escopo do pacote.
          </p>
          
          <h4 className="font-semibold text-md">6. DIREITOS AUTORAIS</h4>
          <p>
            6.1. Para o Pacote Premium, a CONTRATADA cede ao CONTRATANTE a totalidade dos direitos autorais patrimoniais sobre a composição musical.<br />
            6.2. O CONTRATANTE poderá utilizar a obra para quaisquer fins, incluindo exploração comercial, sem necessidade de autorização prévia da CONTRATADA.<br />
            6.3. A CONTRATADA se compromete a realizar o registro formal da obra na Biblioteca Nacional em nome do CONTRATANTE.
          </p>
          
          <h4 className="font-semibold text-md">7. FORMAS DE PAGAMENTO</h4>
          <p>
            7.1. O pagamento será realizado conforme as opções disponibilizadas no site.<br />
            7.2. Não haverá reembolso após o início da produção da composição musical.
          </p>
          
          <h4 className="font-semibold text-md">8. CONSIDERAÇÕES FINAIS</h4>
          <p>
            8.1. Este contrato representa o acordo integral entre as partes.<br />
            8.2. Qualquer modificação deste contrato deverá ser feita por escrito e aprovada por ambas as partes.<br />
            8.3. As partes elegem o foro da comarca da CONTRATADA para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.
          </p>
        </div>
      );
      
    default:
      return (
        <div className="space-y-4 text-sm">
          <h3 className="font-bold text-lg">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h3>
          
          <p>
            Pelo presente instrumento particular, de um lado <strong>harmonIA</strong>, doravante denominada <strong>CONTRATADA</strong>, e do outro lado, o cliente, doravante denominado <strong>CONTRATANTE</strong>, têm entre si justo e contratado o seguinte:
          </p>
          
          <h4 className="font-semibold text-md mt-4">1. OBJETO DO CONTRATO</h4>
          <p>
            O presente contrato tem por objeto a prestação de serviços de composição musical personalizada pela CONTRATADA ao CONTRATANTE, conforme especificações do pacote selecionado.
          </p>
          
          <h4 className="font-semibold text-md">2. OBRIGAÇÕES DA CONTRATADA</h4>
          <p>
            2.1. Realizar a composição musical conforme as especificações do briefing aprovado pelo CONTRATANTE.<br />
            2.2. Entregar o material dentro do prazo estipulado no pacote contratado.<br />
            2.3. Realizar as revisões incluídas no pacote selecionado.<br />
            2.4. Manter o sigilo e a confidencialidade sobre as informações fornecidas pelo CONTRATANTE.
          </p>
          
          <h4 className="font-semibold text-md">3. OBRIGAÇÕES DO CONTRATANTE</h4>
          <p>
            3.1. Pagar o valor acordado conforme o pacote escolhido.<br />
            3.2. Fornecer todas as informações necessárias para a realização do serviço através do briefing.<br />
            3.3. Respeitar os prazos de revisão estabelecidos.<br />
            3.4. Utilizar a música conforme a licença adquirida no pacote.
          </p>
          
          <h4 className="font-semibold text-md">4. PRAZOS</h4>
          <p>
            4.1. O prazo para entrega da primeira versão será contado a partir da confirmação do pagamento e do recebimento do briefing completo.<br />
            4.2. As revisões serão realizadas conforme os prazos estabelecidos no pacote contratado.<br />
            4.3. Atrasos decorrentes de informações incompletas ou alterações não previstas no briefing original não serão de responsabilidade da CONTRATADA.
          </p>
          
          <h4 className="font-semibold text-md">5. REVISÕES</h4>
          <p>
            5.1. As revisões incluídas no pacote se limitam a ajustes na composição realizada, conforme a quantidade especificada.<br />
            5.2. Mudanças que alterem completamente o conceito original serão consideradas como novo projeto e terão custos adicionais.
          </p>
          
          <h4 className="font-semibold text-md">6. DIREITOS AUTORAIS</h4>
          <p>
            6.1. Os direitos autorais são cedidos conforme o tipo de licença incluída no pacote contratado.<br />
            6.2. Licença para uso pessoal: permite o uso da música apenas para fins pessoais, sem finalidade comercial.<br />
            6.3. Licença para uso comercial limitado: permite o uso da música em conteúdo digital, com limitações de alcance.<br />
            6.4. Licença comercial global: permite uso irrestrito da composição musical em qualquer meio.
          </p>
          
          <h4 className="font-semibold text-md">7. FORMAS DE PAGAMENTO</h4>
          <p>
            7.1. O pagamento será realizado conforme as opções disponibilizadas no site.<br />
            7.2. Não haverá reembolso após o início da produção da composição musical.
          </p>
          
          <h4 className="font-semibold text-md">8. CONSIDERAÇÕES FINAIS</h4>
          <p>
            8.1. Este contrato representa o acordo integral entre as partes.<br />
            8.2. Qualquer modificação deste contrato deverá ser feita por escrito e aprovada por ambas as partes.<br />
            8.3. As partes elegem o foro da comarca da CONTRATADA para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.
          </p>
        </div>
      );
  }
};
