
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CodeBlock } from "@/components/ui/code-block";

const N8nWorkflowGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      
      toast({
        title: "Copiado!",
        description: "Código copiado para a área de transferência."
      });
      
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  const downloadJson = (jsonContent: string, fileName: string) => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Download iniciado",
      description: `O arquivo ${fileName} foi baixado.`
    });
  };

  const previewWorkflowJson = `{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "preview",
        "options": {}
      },
      "name": "Preview Notification Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.data.clientEmail }}",
              "operation": "exists"
            }
          ]
        }
      },
      "name": "Validate Input",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        460,
        300
      ]
    },
    {
      "parameters": {
        "fromEmail": "no-reply@harmoniamusic.com",
        "toEmail": "={{ $json.data.clientEmail }}",
        "subject": "=Nova Prévia Musical Disponível: {{ $json.data.projectTitle }}",
        "text": "=Olá {{ $json.data.clientName }},\\n\\nEstamos felizes em compartilhar com você a prévia do seu projeto musical!\\n\\nProjeto: {{ $json.data.projectTitle }}\\nLink de acesso: {{ $json.data.baseUrl }}/preview/{{ $json.data.projectId }}?token={{ $node[\"Generate Access Token\"].json[\"token\"] }}\\n\\nEste link é válido por 7 dias e permite que você ouça as versões, faça comentários e aprove a faixa.\\n\\nAtenciosamente,\\nEquipe harmonIA",
        "options": {}
      },
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [
        900,
        200
      ]
    },
    {
      "parameters": {
        "functionCode": "// Generate a unique token with timestamp and projectId\nconst timestamp = new Date().getTime();\nconst projectId = $input.item.json.data.projectId;\nconst tokenData = projectId + ':' + timestamp;\n\n// Base64 encode the token\nconst token = Buffer.from(tokenData).toString('base64');\n\nreturn {\n  token,\n  projectId,\n  timestamp,\n  expiresAt: new Date(timestamp + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now\n};"
      },
      "name": "Generate Access Token",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        680,
        300
      ]
    },
    {
      "parameters": {
        "url": "=https://harmoniaapi.io/store-preview-token",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "={{ $json.auth_token }}"
            }
          ]
        },
        "sendQuery": false,
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "project_id",
              "value": "={{ $json.data.projectId }}"
            },
            {
              "name": "token",
              "value": "={{ $node[\"Generate Access Token\"].json[\"token\"] }}"
            },
            {
              "name": "expires_at",
              "value": "={{ $node[\"Generate Access Token\"].json[\"expiresAt\"] }}"
            }
          ]
        },
        "options": {}
      },
      "name": "Store Token in Database",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        900,
        400
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "true"
            },
            {
              "name": "message",
              "value": "=Cliente {{ $json.data.clientName }} ({{ $json.data.clientEmail }}) notificado sobre a prévia {{ $json.data.projectTitle }}."
            },
            {
              "name": "previewUrl",
              "value": "={{ $json.data.baseUrl }}/preview/{{ $json.data.projectId }}?token={{ $node[\"Generate Access Token\"].json[\"token\"] }}"
            },
            {
              "name": "token",
              "value": "={{ $node[\"Generate Access Token\"].json[\"token\"] }}"
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Success Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        1120,
        300
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "false"
            },
            {
              "name": "message",
              "value": "Dados inválidos. clientEmail é obrigatório."
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Error Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        680,
        500
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [
        1340,
        300
      ]
    },
    {
      "parameters": {},
      "name": "Log Operation",
      "type": "n8n-nodes-base.noOp",
      "typeVersion": 1,
      "position": [
        1120,
        500
      ]
    }
  ],
  "connections": {
    "Preview Notification Webhook": {
      "main": [
        [
          {
            "node": "Validate Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Input": {
      "main": [
        [
          {
            "node": "Generate Access Token",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create Error Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Email": {
      "main": [
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Access Token": {
      "main": [
        [
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          },
          {
            "node": "Store Token in Database",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Store Token in Database": {
      "main": [
        [
          {
            "node": "Log Operation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Success Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Error Response": {
      "main": [
        [
          {
            "node": "Log Operation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Log Operation": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;

  const paymentWorkflowJson = `{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "payment",
        "options": {}
      },
      "name": "Payment Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.data.payment_id }}",
              "operation": "exists"
            },
            {
              "value1": "={{ $json.data.briefing_id }}",
              "operation": "exists"
            }
          ]
        }
      },
      "name": "Validate Payment Data",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        460,
        300
      ]
    },
    {
      "parameters": {
        "url": "=https://harmoniaapi.io/update-briefing-status",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "={{ $json.auth_token }}"
            }
          ]
        },
        "sendQuery": false,
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "briefing_id",
              "value": "={{ $json.data.briefing_id }}"
            },
            {
              "name": "payment_status",
              "value": "completed"
            },
            {
              "name": "completion_status",
              "value": "ready_for_full"
            },
            {
              "name": "payment_info",
              "value": "={{ {id: $json.data.payment_id, amount: $json.data.amount, date: new Date().toISOString(), status: $json.data.status || \"completed\"} | stringify }}"
            }
          ]
        },
        "options": {}
      },
      "name": "Update Briefing Status",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        680,
        200
      ]
    },
    {
      "parameters": {
        "fromEmail": "pagamentos@harmoniamusic.com",
        "toEmail": "={{ $json.data.client_email }}",
        "subject": "=Pagamento Confirmado - harmonIA Music",
        "text": "=Olá,\\n\\nAgradecemos pelo seu pagamento! Confirmamos o recebimento de R$ {{ $json.data.amount }} referente ao pacote {{ $json.data.package_type }}.\\n\\nNossa equipe já começou a trabalhar no seu projeto e entraremos em contato em breve com mais informações.\\n\\nDetalhes do Pagamento:\\n- ID do Pagamento: {{ $json.data.payment_id }}\\n- Valor: R$ {{ $json.data.amount }}\\n- Data: {{ $node[\"Create Notification\"].json[\"paymentDate\"] }}\\n\\nAtenciosamente,\\nEquipe harmonIA",
        "options": {}
      },
      "name": "Send Payment Confirmation Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [
        900,
        200
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "paymentDate",
              "value": "={{ new Date().toLocaleDateString('pt-BR') }}"
            },
            {
              "name": "subject",
              "value": "=Novo Pagamento: {{ $json.data.client_email }} - {{ $json.data.package_type }}"
            },
            {
              "name": "message",
              "value": "=Um novo pagamento de R$ {{ $json.data.amount }} foi recebido para o briefing {{ $json.data.briefing_id }}. Cliente: {{ $json.data.client_email }}, Pacote: {{ $json.data.package_type }}."
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Notification",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        680,
        400
      ]
    },
    {
      "parameters": {
        "fromEmail": "sistema@harmoniamusic.com",
        "toEmail": "equipe@harmoniamusic.com",
        "subject": "={{ $node[\"Create Notification\"].json[\"subject\"] }}",
        "text": "={{ $node[\"Create Notification\"].json[\"message\"] }}",
        "options": {}
      },
      "name": "Notify Team",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [
        900,
        400
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "true"
            },
            {
              "name": "message",
              "value": "=Pagamento processado com sucesso para o briefing {{ $json.data.briefing_id }}."
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Success Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        1120,
        300
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "false"
            },
            {
              "name": "message",
              "value": "Dados de pagamento inválidos. payment_id e briefing_id são obrigatórios."
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Error Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        680,
        600
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [
        1340,
        300
      ]
    }
  ],
  "connections": {
    "Payment Webhook": {
      "main": [
        [
          {
            "node": "Validate Payment Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Payment Data": {
      "main": [
        [
          {
            "node": "Update Briefing Status",
            "type": "main",
            "index": 0
          },
          {
            "node": "Create Notification",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create Error Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update Briefing Status": {
      "main": [
        [
          {
            "node": "Send Payment Confirmation Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Payment Confirmation Email": {
      "main": [
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Notification": {
      "main": [
        [
          {
            "node": "Notify Team",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Notify Team": {
      "main": [
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Success Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Error Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;

  const chatbotWorkflowJson = `{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "chatbot",
        "options": {}
      },
      "name": "Chatbot Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.data.message }}",
              "operation": "exists"
            }
          ]
        }
      },
      "name": "Validate Input",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        460,
        300
      ]
    },
    {
      "parameters": {
        "functionCode": "// Message classification function\nfunction classifyMessage(message) {\n  message = message.toLowerCase();\n  \n  if (message.includes('preço') || message.includes('pagamento') || message.includes('custo') || message.includes('valor')) {\n    return 'pricing';\n  }\n  if (message.includes('prazo') || message.includes('tempo') || message.includes('quando') || message.includes('entreg')) {\n    return 'timeline';\n  }\n  if (message.includes('acompanhar') || message.includes('status') || message.includes('andamento')) {\n    return 'status';\n  }\n  if (message.includes('briefing') || message.includes('formulário') || message.includes('informações')) {\n    return 'briefing';\n  }\n  if (message.includes('contato') || message.includes('falar') || message.includes('atendimento')) {\n    return 'contact';\n  }\n  \n  return 'general';\n}\n\n// Get the message text\nconst message = $input.item.json.data.message;\nconst messageType = classifyMessage(message);\nconst userData = $input.item.json.data.userData || {};\n\n// Prepare canned responses based on message type\nlet responseText = '';\n\nswitch (messageType) {\n  case 'pricing':\n    responseText = 'Temos diferentes pacotes disponíveis para atender às suas necessidades. Nosso pacote Essencial começa em R$199, o Professional em R$499 e o Premium em R$999. Para mais detalhes sobre o que inclui cada pacote, visite nossa página de serviços.';\n    break;\n  case 'timeline':\n    responseText = 'Nosso prazo de entrega varia conforme o pacote escolhido. Em geral, o pacote Essencial é entregue em 3-5 dias, o Professional em 7-10 dias, e o Premium em 14-21 dias. Prazos personalizados podem ser acordados durante o briefing.';\n    break;\n  case 'status':\n    responseText = 'Para acompanhar o status do seu projeto, acesse sua área de cliente usando o código de acompanhamento enviado ao seu email. Lá você encontrará informações atualizadas sobre o andamento do seu projeto.';\n    break;\n  case 'briefing':\n    responseText = 'O briefing é uma etapa essencial do nosso processo. Você receberá um formulário detalhado para preencher com informações sobre seu projeto. Quanto mais detalhes você fornecer, melhor conseguiremos atender às suas expectativas.';\n    break;\n  case 'contact':\n    responseText = 'Você pode entrar em contato conosco pelo email contato@harmoniamusic.com ou pelo telefone (11) 1234-5678. Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.';\n    break;\n  default:\n    responseText = 'Obrigado pelo seu contato. Para melhor atendê-lo, poderia fornecer mais detalhes sobre sua dúvida ou necessidade? Estamos prontos para ajudar com informações sobre nossos serviços, preços, prazos e processo de trabalho.';\n}\n\nreturn {\n  messageType,\n  response: responseText,\n  timestamp: new Date().toISOString(),\n  userData\n};"
      },
      "name": "Process Message",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        680,
        200
      ]
    },
    {
      "parameters": {
        "url": "=https://harmoniaapi.io/log-chat-message",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "={{ $json.auth_token }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "message",
              "value": "={{ $json.data.message }}"
            },
            {
              "name": "response",
              "value": "={{ $node[\"Process Message\"].json[\"response\"] }}"
            },
            {
              "name": "messageType",
              "value": "={{ $node[\"Process Message\"].json[\"messageType\"] }}"
            },
            {
              "name": "userData",
              "value": "={{ $node[\"Process Message\"].json[\"userData\"] | stringify }}"
            },
            {
              "name": "timestamp",
              "value": "={{ new Date().toISOString() }}"
            }
          ]
        },
        "options": {}
      },
      "name": "Log Chat Interaction",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        900,
        400
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $node[\"Process Message\"].json[\"messageType\"] }}",
              "value2": "contact",
              "operation": "equal"
            }
          ]
        }
      },
      "name": "Is Contact Request",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        900,
        200
      ]
    },
    {
      "parameters": {
        "fromEmail": "chatbot@harmoniamusic.com",
        "toEmail": "atendimento@harmoniamusic.com",
        "subject": "=Nova Solicitação de Contato via Chatbot",
        "text": "=Um cliente solicitou informações de contato através do chatbot.\\n\\nMensagem original: \"{{ $json.data.message }}\"\\n\\nDados do usuário: {{ $node[\"Process Message\"].json[\"userData\"] | stringify }}\\n\\nFavor entrar em contato o mais breve possível.",
        "options": {}
      },
      "name": "Notify Team",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [
        1120,
        100
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "true"
            },
            {
              "name": "response",
              "value": "={{ $node[\"Process Message\"].json[\"response\"] }}"
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Success Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        1120,
        300
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "false"
            },
            {
              "name": "response",
              "value": "Desculpe, não consegui processar sua mensagem. Por favor, tente novamente."
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Error Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        680,
        500
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [
        1340,
        300
      ]
    }
  ],
  "connections": {
    "Chatbot Webhook": {
      "main": [
        [
          {
            "node": "Validate Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Input": {
      "main": [
        [
          {
            "node": "Process Message",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create Error Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Message": {
      "main": [
        [
          {
            "node": "Is Contact Request",
            "type": "main",
            "index": 0
          },
          {
            "node": "Log Chat Interaction",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Log Chat Interaction": {
      "main": [
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Contact Request": {
      "main": [
        [
          {
            "node": "Notify Team",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Notify Team": {
      "main": [
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Success Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Error Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;

  const feedbackWorkflowJson = `{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "feedback",
        "options": {}
      },
      "name": "Feedback Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.data.projectId }}",
              "operation": "exists"
            },
            {
              "value1": "={{ $json.data.feedback }}",
              "operation": "exists"
            }
          ]
        }
      },
      "name": "Validate Input",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        460,
        300
      ]
    },
    {
      "parameters": {
        "url": "=https://harmoniaapi.io/update-project-feedback",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "={{ $json.auth_token }}"
            }
          ]
        },
        "sendQuery": false,
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "project_id",
              "value": "={{ $json.data.projectId }}"
            },
            {
              "name": "feedback",
              "value": "={{ $json.data.feedback }}"
            },
            {
              "name": "status",
              "value": "={{ $json.data.status }}"
            }
          ]
        },
        "options": {}
      },
      "name": "Update Project Feedback",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        680,
        200
      ]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.data.status }}",
              "value2": "approved",
              "operation": "equal"
            }
          ]
        }
      },
      "name": "Is Approved",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        900,
        200
      ]
    },
    {
      "parameters": {
        "fromEmail": "sistema@harmoniamusic.com",
        "toEmail": "equipe@harmoniamusic.com",
        "subject": "=APROVADO: Projeto {{ $json.data.projectId }}",
        "text": "=Ótimas notícias! O cliente aprovou o projeto {{ $json.data.projectId }}.\\n\\nFeedback do cliente:\\n{{ $json.data.feedback }}\\n\\nCliente: {{ $json.data.clientName || 'Não identificado' }} ({{ $json.data.clientEmail || 'Email não disponível' }})\\n\\nÉ hora de preparar os arquivos finais e fazer a entrega.",
        "options": {}
      },
      "name": "Send Approval Notification",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [
        1120,
        100
      ]
    },
    {
      "parameters": {
        "fromEmail": "sistema@harmoniamusic.com",
        "toEmail": "equipe@harmoniamusic.com",
        "subject": "=Novo Feedback: Projeto {{ $json.data.projectId }}",
        "text": "=Um cliente enviou feedback para o projeto {{ $json.data.projectId }}.\\n\\nFeedback:\\n{{ $json.data.feedback }}\\n\\nStatus: {{ $json.data.status }}\\n\\nCliente: {{ $json.data.clientName || 'Não identificado' }} ({{ $json.data.clientEmail || 'Email não disponível' }})",
        "options": {}
      },
      "name": "Send Feedback Notification",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [
        1120,
        300
      ]
    },
    {
      "parameters": {
        "url": "=https://harmoniaapi.io/log-project-history",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "={{ $json.auth_token }}"
            }
          ]
        },
        "sendQuery": false,
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "project_id",
              "value": "={{ $json.data.projectId }}"
            },
            {
              "name": "action",
              "value": "={{ $json.data.status === 'approved' ? 'preview_approved' : 'feedback_received' }}"
            },
            {
              "name": "details",
              "value": "={{ {feedback: $json.data.feedback, status: $json.data.status, timestamp: new Date().toISOString(), clientName: $json.data.clientName, clientEmail: $json.data.clientEmail} | stringify }}"
            }
          ]
        },
        "options": {}
      },
      "name": "Log to Project History",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [
        680,
        400
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "true"
            },
            {
              "name": "message",
              "value": "=Feedback processado com sucesso. Status: {{ $json.data.status }}"
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Success Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        1340,
        200
      ]
    },
    {
      "parameters": {
        "fields": {
          "values": [
            {
              "name": "success",
              "value": "false"
            },
            {
              "name": "message",
              "value": "Dados inválidos. projectId e feedback são obrigatórios."
            }
          ]
        },
        "include": "all",
        "options": {}
      },
      "name": "Create Error Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        680,
        600
      ]
    },
    {
      "parameters": {
        "options": {}
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [
        1560,
        300
      ]
    }
  ],
  "connections": {
    "Feedback Webhook": {
      "main": [
        [
          {
            "node": "Validate Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Input": {
      "main": [
        [
          {
            "node": "Update Project Feedback",
            "type": "main",
            "index": 0
          },
          {
            "node": "Log to Project History",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create Error Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update Project Feedback": {
      "main": [
        [
          {
            "node": "Is Approved",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Approved": {
      "main": [
        [
          {
            "node": "Send Approval Notification",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Send Feedback Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Approval Notification": {
      "main": [
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Feedback Notification": {
      "main": [
        [
          {
            "node": "Create Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Log to Project History": {
      "main": [
        [
          {
            "node": "Send Feedback Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Success Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Error Response": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`;

  const installationGuide = `
# Guia de Instalação de Workflows n8n para harmonIA

Este guia explica como importar e configurar os workflows n8n para integração com a plataforma harmonIA.

## Requisitos Prévios

1. Uma conta no n8n (https://n8n.io)
2. n8n instalado e configurado (local ou na nuvem)
3. Acesso à API da harmonIA (chaves e URLs)

## Passo a Passo para Importação

1. Faça login no seu dashboard n8n
2. Clique em "Workflows" no menu lateral
3. Clique no botão "Create Workflow"
4. No editor de workflow, clique no botão de menu (três pontos) no canto superior direito
5. Selecione "Import from JSON"
6. Cole o JSON do workflow desejado
7. Clique em "Import"

## Configuração após Importação

Para cada workflow importado, você precisará:

1. Verificar e ajustar os endpoints de API
2. Configurar as credenciais de email para notificações
3. Testar o webhook usando o botão "Test" na interface do n8n
4. Ativar o workflow usando o toggle "Active" no canto superior direito

## Integrando com a harmonIA

1. Copie a URL do webhook gerada pelo n8n para cada workflow
2. Acesse o painel de administração da harmonIA
3. Vá para "Integrações" > "n8n Workflows"
4. Cole as URLs correspondentes em cada campo
5. Salve as configurações
6. Teste cada integração usando o botão "Testar Webhook"

## Solução de Problemas

Se encontrar problemas durante a configuração:

1. Verifique os logs de execução no n8n
2. Confirme se as URLs e chaves de API estão corretas
3. Verifique a conectividade entre o n8n e a API da harmonIA
4. Teste cada nó individualmente para localizar falhas específicas
`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guia de Implementação de Workflows n8n</CardTitle>
        <CardDescription>
          Instruções e exemplos para configurar workflows no n8n para integração com a harmonIA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="preview">Prévia</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="installation">Instalação</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="prose max-w-none">
              <h3>Integração de Workflows n8n com harmonIA</h3>
              <p>
                O n8n é uma plataforma de automação que permite criar fluxos de trabalho personalizados 
                para integrar diferentes serviços e APIs. Esta página fornece exemplos de workflows 
                para integrar com a plataforma harmonIA.
              </p>
              <h4>Workflows Disponíveis</h4>
              <ul>
                <li><strong>Notificações de Prévia</strong> - Envia notificações quando novas prévias estão disponíveis</li>
                <li><strong>Processamento de Pagamento</strong> - Processa pagamentos e atualiza o status no sistema</li>
                <li><strong>Chatbot</strong> - Integra um chatbot para responder perguntas comuns</li>
                <li><strong>Feedback</strong> - Processa feedback de clientes sobre prévias</li>
              </ul>
              <h4>Como Usar</h4>
              <p>
                Para cada tipo de workflow, fornecemos um exemplo em JSON que pode ser importado diretamente 
                para o n8n. Depois de importar, você precisará configurar as credenciais e parâmetros específicos 
                para o seu ambiente.
              </p>
              <p>
                Use a aba de cada workflow para ver o exemplo e as instruções de instalação.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="prose max-w-none mb-4">
              <h3>Workflow de Notificações de Prévia</h3>
              <p>
                Este workflow processa solicitações de envio de notificações quando novas prévias 
                estão disponíveis. Ele gera um token de acesso seguro, envia um email para o cliente 
                e registra as informações no banco de dados.
              </p>
              <h4>Funcionalidades:</h4>
              <ul>
                <li>Recebe dados da prévia via webhook</li>
                <li>Gera um token de acesso único com expiração</li>
                <li>Envia email para o cliente com link para acessar a prévia</li>
                <li>Registra o token e informações de acesso no banco de dados</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md relative">
              <div className="absolute right-4 top-4 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(previewWorkflowJson, 'preview')}
                >
                  {copiedStates['preview'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedStates['preview'] ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => downloadJson(previewWorkflowJson, 'preview-notification-workflow.json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
              <CodeBlock 
                code={previewWorkflowJson} 
                language="json" 
              />
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <div className="prose max-w-none mb-4">
              <h3>Workflow de Processamento de Pagamento</h3>
              <p>
                Este workflow processa notificações de pagamento, atualiza o status do briefing no 
                banco de dados e envia emails de confirmação para o cliente e para a equipe.
              </p>
              <h4>Funcionalidades:</h4>
              <ul>
                <li>Recebe confirmações de pagamento via webhook</li>
                <li>Atualiza o status do briefing para "completo"</li>
                <li>Envia email de confirmação para o cliente</li>
                <li>Notifica a equipe sobre o novo pagamento</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md relative">
              <div className="absolute right-4 top-4 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(paymentWorkflowJson, 'payment')}
                >
                  {copiedStates['payment'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedStates['payment'] ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => downloadJson(paymentWorkflowJson, 'payment-workflow.json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
              <CodeBlock 
                code={paymentWorkflowJson} 
                language="json" 
              />
            </div>
          </TabsContent>

          <TabsContent value="chatbot" className="space-y-6">
            <div className="prose max-w-none mb-4">
              <h3>Workflow do Chatbot</h3>
              <p>
                Este workflow processa mensagens recebidas do chatbot, classifica o tipo de pergunta 
                e retorna respostas adequadas automaticamente. Em caso de solicitação de contato, 
                notifica a equipe.
              </p>
              <h4>Funcionalidades:</h4>
              <ul>
                <li>Recebe mensagens do cliente via webhook</li>
                <li>Classifica o tipo de mensagem (preço, prazo, status, etc.)</li>
                <li>Retorna respostas pré-definidas conforme o tipo</li>
                <li>Em caso de solicitação de contato, notifica a equipe</li>
                <li>Registra todas as interações para análise futura</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md relative">
              <div className="absolute right-4 top-4 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(chatbotWorkflowJson, 'chatbot')}
                >
                  {copiedStates['chatbot'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedStates['chatbot'] ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => downloadJson(chatbotWorkflowJson, 'chatbot-workflow.json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
              <CodeBlock 
                code={chatbotWorkflowJson} 
                language="json" 
              />
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="prose max-w-none mb-4">
              <h3>Workflow de Feedback</h3>
              <p>
                Este workflow processa feedback enviado pelos clientes sobre as prévias musicais. 
                Ele atualiza o status do projeto, notifica a equipe e registra o feedback no histórico.
              </p>
              <h4>Funcionalidades:</h4>
              <ul>
                <li>Recebe feedback do cliente via webhook</li>
                <li>Atualiza o status do projeto conforme o feedback</li>
                <li>Envia notificações diferentes para aprovações e revisões</li>
                <li>Registra o feedback no histórico do projeto</li>
              </ul>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md relative">
              <div className="absolute right-4 top-4 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(feedbackWorkflowJson, 'feedback')}
                >
                  {copiedStates['feedback'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedStates['feedback'] ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => downloadJson(feedbackWorkflowJson, 'feedback-workflow.json')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
              <CodeBlock 
                code={feedbackWorkflowJson} 
                language="json" 
              />
            </div>
          </TabsContent>

          <TabsContent value="installation" className="space-y-6">
            <div className="prose max-w-none">
              <h3>Guia de Instalação</h3>
              {installationGuide.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index}>{paragraph.replace('# ', '')}</h2>;
                } else if (paragraph.startsWith('## ')) {
                  return <h3 key={index}>{paragraph.replace('## ', '')}</h3>;
                } else if (paragraph.startsWith('### ')) {
                  return <h4 key={index}>{paragraph.replace('### ', '')}</h4>;
                } else if (paragraph.startsWith('1. ')) {
                  return (
                    <ol key={index}>
                      {paragraph.split('\n').map((line, lineIndex) => (
                        <li key={lineIndex}>
                          {line.replace(/^\d+\. /, '')}
                        </li>
                      ))}
                    </ol>
                  );
                } else {
                  return <p key={index}>{paragraph}</p>;
                }
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default N8nWorkflowGuide;
