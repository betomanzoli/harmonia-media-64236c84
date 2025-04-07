
# Sistema de Pagamento e Notas Fiscais - harmonIA

Este documento descreve o funcionamento do sistema de pagamento e emissão de notas fiscais da plataforma harmonIA.

## Fluxo de Pagamento

### 1. Qualificação do Cliente
- O cliente preenche o formulário de qualificação em `/qualificacao`
- O sistema recomenda um pacote com base nas respostas

### 2. Escolha do Pacote
- O cliente avalia a recomendação na página de agradecimento
- Opções disponíveis:
  - Ver todos os pacotes
  - Prosseguir para pagamento com o pacote recomendado

### 3. Página de Pagamento
- Cliente revisa detalhes do pedido e serviços extras recomendados
- Preenche informações pessoais
- Escolhe método de pagamento (Cartão, PIX, Transferência, PayPal)
- Decide sobre emissão de nota fiscal
- Fornece informações para nota fiscal (se solicitado)

### 4. Processamento do Pagamento
- Confirmação em tempo real
- Redirecionamento para página de agradecimento com os próximos passos
- Os dados são armazenados para gestão administrativa

### 5. Pós-Pagamento
- Cliente é direcionado para preencher o briefing detalhado
- Acesso ao sistema de acompanhamento de pedido
- Emissão automática de nota fiscal (se solicitado)

## Sistema de Notas Fiscais

### Painel Administrativo
- Acesso em: `/admin-j28s7d1k/invoices`
- Funcionalidades:
  - Visualização de todas as notas pendentes, geradas, enviadas e canceladas
  - Busca e filtros por status, cliente, pedido ou número da NF
  - Geração manual ou em lote de notas fiscais
  - Envio de notas fiscais por email para clientes
  - Cancelamento de notas (quando necessário)

### Fluxo de Emissão de Notas Fiscais
1. **Pagamento Confirmado**: O sistema registra a necessidade de emissão de nota fiscal
2. **Geração da NF**: O administrador acessa o painel e gera a nota fiscal
3. **Envio ao Cliente**: Notas geradas são enviadas por email
4. **Arquivamento**: Todas as notas são arquivadas digitalmente

### Integrações Possíveis
O sistema está preparado para integração com:
- NFe.io
- Nuvem Fiscal
- Sistemas governamentais de NFe

## Preços Atualizados dos Serviços Extras

| Serviço | Preço |
|---------|-------|
| Revisão Extra | R$79 |
| Registro na BN (Letra) | R$99 |
| Registro UBC | R$249 |
| Masterização Premium | R$149 |
| Stems Separados | R$129 |
| Entrega Expressa (48h) | R$149 |
| Partituras MusicXML/PDF | R$149 |
| Composição sem IA (letra) | R$499 |
| Composição sem IA (letra + melodia) | R$1.499 |
| Composição sem IA (completa) | Valor sob consulta |

## Requisitos de Implementação

Para implementar em ambiente de produção, será necessário:
1. Integração com gateway de pagamento (Stripe recomendado)
2. Integração com sistema emissor de notas fiscais
3. Configuração de emails transacionais
4. Configuração de webhook para processamento de pagamentos

## Manutenção e Suporte

- As tabelas de preços podem ser atualizadas no arquivo `src/pages/Calculator.tsx`
- Os preços dos serviços extras podem ser editados em `src/components/ServiceExtras.tsx`
- A integração com sistemas de NF-e deve ser configurada conforme documentação específica do provedor escolhido
