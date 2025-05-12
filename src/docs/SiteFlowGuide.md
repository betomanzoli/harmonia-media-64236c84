
# harmonIA - Guia de Fluxos e Funcionalidades do Sistema

Este documento descreve os principais fluxos e funcionalidades do sistema harmonIA, incluindo a parte pública e administrativa.

## Visão Geral do Sistema

A harmonIA é uma plataforma que permite aos clientes solicitar composições musicais personalizadas, desde o briefing inicial até a entrega do produto final. O sistema é dividido em duas partes principais:

1. **Área Pública**: Onde os clientes conhecem os serviços, calculam preços, fazem pedidos e acompanham o progresso.
2. **Área Administrativa**: Onde a equipe gerencia projetos, prévias, briefings, clientes e pagamentos.

## Fluxo Principal

### 1. Jornada do Cliente

```
Conhecimento → Calculadora → Pagamento → Briefing → Avaliação de Prévias → Aprovação → Entrega
```

#### a. Conhecimento
O cliente conhece os serviços através da página inicial, página "Como Funciona", "Serviços" e "Portfólio".

#### b. Calculadora
O cliente utiliza a calculadora para obter um orçamento personalizado, ajustando os parâmetros como duração, número de versões, instrumentos, etc.

#### c. Pagamento
Após calcular o preço, o cliente é direcionado para a página de pagamento onde escolhe um dos pacotes (Essencial, Profissional ou Premium) e finaliza a compra.

#### d. Briefing
Com o pagamento confirmado, o cliente preenche o briefing detalhado sobre a música que deseja.

#### e. Avaliação de Prévias
A equipe cria versões musicais iniciais e o cliente recebe acesso à página de prévias para ouvir, selecionar e enviar feedback.

#### f. Aprovação
O cliente aprova uma das versões propostas ou solicita ajustes.

#### g. Entrega
A versão final da música é finalizada e entregue ao cliente.

### 2. Fluxo Administrativo

```
Briefing Recebido → Criação do Projeto → Produção das Prévias → Envio ao Cliente → Feedback/Aprovação → Finalização → Entrega
```

#### a. Briefing Recebido
A equipe recebe o briefing preenchido pelo cliente após o pagamento.

#### b. Criação do Projeto
Um novo projeto é criado no sistema administrativo, associado ao cliente e seu briefing.

#### c. Produção das Prévias
A equipe produz as versões musicais iniciais de acordo com o briefing.

#### d. Envio ao Cliente
As prévias são enviadas ao cliente através da plataforma.

#### e. Feedback/Aprovação
A equipe recebe o feedback do cliente e faz ajustes, ou recebe a aprovação e segue para finalização.

#### f. Finalização
Versão final da música é produzida com qualidade profissional.

#### g. Entrega
O cliente recebe a versão final em alta qualidade.

## Módulos do Sistema

### Área Pública

1. **Página Inicial**
   - Apresentação da harmonIA
   - Seção "Como Funciona"
   - Call-to-actions para calculadora e serviços

2. **Portfólio**
   - Exemplos de trabalhos anteriores
   - Prévias limitadas (30 segundos)
   - Opção de contato para escutar versões completas

3. **Serviços**
   - Descrição dos pacotes disponíveis
   - Comparação de recursos
   - Call-to-action para a calculadora

4. **Calculadora**
   - Interface para personalização de projeto
   - Ajustes de duração, instrumentos, versões, etc.
   - Cálculo em tempo real do preço
   - Redirecionamento para pagamento

5. **Pagamento**
   - Seleção de pacote
   - Opções de pagamento
   - Confirmação e redirecionamento para briefing

6. **Briefing**
   - Formulário detalhado sobre o projeto
   - Opções para upload de referências
   - Confirmação e envio

7. **Página de Prévias**
   - Acesso via link único
   - Player de áudio com limitação de 30 segundos
   - Opções para seleção e feedback
   - Aprovação final

### Área Administrativa

1. **Dashboard**
   - Visão geral de projetos, clientes, receita
   - Gráficos de desempenho
   - Acesso rápido a projetos recentes

2. **Projetos**
   - Lista de todos os projetos
   - Filtros por status, cliente, data
   - Detalhes do projeto e histórico

3. **Prévias**
   - Gerenciamento de versões por projeto
   - Upload de novas prévias
   - Acompanhamento de feedback

4. **Briefings**
   - Lista de briefings recebidos
   - Detalhes completos de cada briefing
   - Conversão em projetos

5. **Clientes**
   - Cadastro de clientes
   - Histórico de projetos por cliente
   - Informações de contato e preferências

6. **Faturas**
   - Geração de faturas
   - Status de pagamentos
   - Download e impressão

7. **Portfólio**
   - Gerenciamento de exemplos públicos
   - Upload de novos trabalhos
   - Organização por categorias

8. **Configurações**
   - Ajustes do sistema
   - Integrações
   - Emails e notificações
   - Personalização

## Integrações e Armazenamento

O sistema utiliza pastas do Google Drive para armazenamento de arquivos:

1. **Portfólio**: Armazena exemplos públicos
   - Link: https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29

2. **Prévias**: Armazena versões para cliente avaliar
   - Link: https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN

3. **Projetos Finais**: Armazena versões finais entregues
   - Link: [A ser configurado]

## Notas Importantes

1. **Proteção de Conteúdo**: As prévias são limitadas a 30 segundos para proteger o conteúdo antes da aprovação final.

2. **Fidelidade de Clientes**: O sistema rastreia clientes recorrentes para identificação e potenciais vantagens.

3. **Fluxo Unificado**: Cada projeto mantém um único número identificador do início ao fim, mesmo que passe por diferentes fases.

4. **Comunicação**: Toda comunicação entre cliente e equipe deve ser registrada no sistema para garantir histórico completo.

5. **Armazenamento**: Os arquivos de áudio são armazenados no Google Drive com organização por projeto para fácil acesso.

## Pontos de Melhoria Futura

1. Sistema de notificações automáticas para clientes e equipe.
2. Integração de chat em tempo real para comunicação mais fluida.
3. Área de entregas finais para clientes.
4. Sistema de avaliação e feedback após entrega final.
5. Estatísticas avançadas de desempenho e satisfação.

---

Este documento será atualizado conforme novas funcionalidades forem implementadas ou fluxos existentes forem modificados.
