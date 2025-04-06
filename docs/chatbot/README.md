
# Documentação do Chatbot harmonIA

Esta é a documentação principal do chatbot harmonIA para o site tunealchemy-studio.

## Índice da Documentação

1. [Visão Geral](./overview.md) - Introdução e estrutura do projeto
2. [Configuração do Dialogflow](./dialogflow-setup.md) - Como configurar o agente no Google Dialogflow
3. [Implementação do Webhook](./webhook-setup.md) - Como configurar e hospedar o servidor webhook
4. [Widget Frontend](./widget-integration.md) - Como integrar o widget no site
5. [Configurações Avançadas](./advanced-config.md) - Personalização e integrações externas
6. [Testes e Validação](./testing.md) - Como testar e validar o chatbot
7. [Manutenção](./maintenance.md) - Monitoramento e melhorias contínuas
8. [Troubleshooting](./troubleshooting.md) - Resolução de problemas comuns

## Estrutura de Arquivos

```
/
├── public/
│   └── widget/
│       └── chatbot.js     # Script do widget frontend
├── webhook/
│   ├── server.js          # Servidor Node.js para webhook do Dialogflow
│   └── chatbot-service.js # Serviço de processamento de mensagens do chatbot
└── docs/chatbot/          # Documentação completa
    ├── README.md          # Este arquivo (índice principal)
    ├── overview.md        # Visão geral do chatbot
    ├── dialogflow-setup.md # Configuração do Dialogflow
    └── ...                # Outros arquivos de documentação
```

Para começar a implementação, veja primeiro a [Visão Geral](./overview.md) e depois siga para a [Configuração do Dialogflow](./dialogflow-setup.md).
