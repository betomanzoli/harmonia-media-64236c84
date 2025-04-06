
# Visão Geral do Chatbot harmonIA

## Introdução

O chatbot harmonIA é uma solução de atendimento automatizado para o site tunealchemy-studio, projetado para ajudar usuários com informações sobre pacotes, amostras de música, preços, e outras consultas comuns.

## Benefícios

- Atendimento 24/7 para clientes
- Qualificação inicial de leads
- Redução da carga de trabalho da equipe de atendimento
- Experiência de usuário aprimorada
- Coleta de informações valiosas sobre as dúvidas mais comuns

## Arquitetura do Sistema

O sistema do chatbot é composto por três componentes principais:

1. **Frontend Widget**: Interface de usuário integrada ao site
2. **Google Dialogflow**: Plataforma de processamento de linguagem natural (NLP)
3. **Servidor Webhook**: Processa solicitações e fornece respostas personalizadas

### Fluxo de Comunicação

```
[Usuário] <-> [Widget Frontend] <-> [Google Dialogflow] <-> [Servidor Webhook] <-> [Sistemas Externos (opcional)]
```

1. O usuário interage com o widget no site
2. O widget envia as mensagens para o Dialogflow
3. O Dialogflow identifica a intenção (intent) do usuário
4. O servidor webhook processa a intent e gera uma resposta adequada
5. A resposta é enviada de volta ao usuário através do widget

## Principais Recursos

- **Respostas Automatizadas**: Para perguntas frequentes
- **Quick Replies**: Sugestões para facilitar a navegação
- **Cards Interativos**: Com botões para ações específicas
- **Integração com Site**: Acesso direto a páginas relevantes
- **Transferência para Atendente**: Opção para contato humano quando necessário

## Próximos Passos

Para implementar o chatbot harmonIA, siga as etapas nas próximas seções da documentação:

1. [Configuração do Dialogflow](./dialogflow-setup.md)
2. [Implementação do Webhook](./webhook-setup.md)
3. [Integração do Widget](./widget-integration.md)

Cada seção fornece instruções detalhadas para a configuração e implementação.
