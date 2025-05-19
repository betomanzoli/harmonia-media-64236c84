
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Steps, Step } from "@/components/ui/steps";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkflowExample {
  title: string;
  description: string;
  content: string;
  template: any;
}

const N8nWorkflowGuide: React.FC = () => {
  const { toast } = useToast();
  const [activeWorkflow, setActiveWorkflow] = useState<string>('preview');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const downloadJson = (jsonObject: any, fileName: string) => {
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: `O arquivo ${fileName} está sendo baixado.`,
    });
  };

  const workflowExamples: Record<string, WorkflowExample> = {
    preview: {
      title: "Workflow de Notificações de Prévia",
      description: "Envia emails de notificação quando novas prévias estão disponíveis, com links mágicos seguros",
      content: `Este workflow recebe notificações de novas prévias disponíveis, gera um token de acesso seguro e envia um email para o cliente com um link que permite acessar as prévias sem necessidade de login.`,
      template: {
        "nodes": [
          {
            "parameters": {
              "path": "preview-notification",
              "responseMode": "responseNode",
              "options": {}
            },
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [
              250,
              300
            ],
            "webhookId": "16ae1112-2469-420d-8fcc-c9569152bd8f"
          },
          {
            "parameters": {
              "mode": "runOnceForEachItem",
              "jsCode": "// Process the incoming data\nconst projectId = $input.item.json.data.projectId;\nconst clientName = $input.item.json.data.clientName;\nconst clientEmail = $input.item.json.data.clientEmail;\nconst projectTitle = $input.item.json.data.projectTitle;\nconst baseUrl = $input.item.json.data.baseUrl || 'https://harmonia.media';\nconst versions = $input.item.json.data.versions || [];\n\n// Generate a magic token\nconst timestamp = Date.now().toString();\nconst tokenData = `${projectId}:${timestamp}`;\nconst magicToken = Buffer.from(tokenData).toString('base64');\n\n// Create the magic link\nconst previewUrl = `${baseUrl}/preview/${projectId}?token=${magicToken}`;\n\nreturn {\n  projectId,\n  clientName,\n  clientEmail,\n  projectTitle,\n  previewUrl,\n  magicToken,\n  timestamp,\n  versions\n};"
            },
            "name": "Generate Magic Link",
            "type": "n8n-nodes-base.code",
            "typeVersion": 1,
            "position": [
              450,
              300
            ]
          },
          {
            "parameters": {
              "operation": "send",
              "fromEmail": "studio@harmonia.media",
              "fromName": "Estúdio HarmoniA",
              "to": "={{ $json.clientEmail }}",
              "subject": "=Prévias disponíveis - {{ $json.projectTitle }}",
              "text": "",
              "html": "=<h1>Olá {{ $json.clientName }}!</h1>\n<p>Estamos felizes em informar que uma prévia do seu projeto \"{{ $json.projectTitle }}\" está disponível para sua avaliação.</p>\n<p>Clique no link abaixo para acessar sua prévia:</p>\n<p><a href=\"{{ $json.previewUrl }}\" style=\"background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;\">Ver Prévia</a></p>\n<p>Ou copie e cole este link no seu navegador:</p>\n<p>{{ $json.previewUrl }}</p>\n<p>Este link é válido por 7 dias. Aguardamos seu feedback!</p>\n<p>Atenciosamente,<br>Equipe HarmoniA</p>",
              "additionalFields": {}
            },
            "name": "Send Email",
            "type": "n8n-nodes-base.emailSend",
            "typeVersion": 1,
            "position": [
              650,
              300
            ],
            "credentials": {
              "smtp": "SMTP Account"
            }
          },
          {
            "parameters": {
              "respondWith": "json",
              "responseBody": "={ \"success\": true, \"message\": \"Email sent successfully to \" + $json.clientEmail, \"previewUrl\": $json.previewUrl }",
              "options": {}
            },
            "name": "Respond to Webhook",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [
              850,
              300
            ]
          }
        ],
        "connections": {
          "Webhook": {
            "main": [
              [
                {
                  "node": "Generate Magic Link",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Generate Magic Link": {
            "main": [
              [
                {
                  "node": "Send Email",
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
                  "node": "Respond to Webhook",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          }
        }
      }
    },
    payment: {
      title: "Workflow de Processamento de Pagamento",
      description: "Processa pagamentos do MercadoPago e atualiza o status no Supabase",
      content: "Este workflow recebe notificações de pagamento do MercadoPago, verifica o status do pagamento, atualiza os dados no Supabase e envia um email de confirmação ao cliente.",
      template: {
        "nodes": [
          {
            "parameters": {
              "path": "payment-webhook",
              "responseMode": "responseNode",
              "options": {}
            },
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [
              250,
              300
            ],
            "webhookId": "2469-420d-8fcc-c9569152bd8f"
          },
          {
            "parameters": {
              "mode": "runOnceForEachItem",
              "jsCode": "// Process the payment data\nconst { payment_id, briefing_id, client_name, client_email, package_type, amount, status } = $input.item.json.data;\n\n// Validate required fields\nif (!payment_id || !briefing_id) {\n  throw new Error('Missing required payment information');\n}\n\nreturn {\n  payment_id,\n  briefing_id,\n  client_name,\n  client_email,\n  package_type,\n  amount,\n  status: status || 'approved',\n  timestamp: new Date().toISOString()\n};"
            },
            "name": "Process Payment Data",
            "type": "n8n-nodes-base.code",
            "typeVersion": 1,
            "position": [
              450,
              300
            ]
          },
          {
            "parameters": {
              "operation": "executeQuery",
              "query": "=UPDATE \"briefings\" \nSET \"payment_status\" = 'completed',\n    \"completion_status\" = 'ready_for_full',\n    \"data\" = jsonb_set(\n        COALESCE(\"data\", '{}'::jsonb),\n        '{paymentInfo}',\n        jsonb_build_object(\n            'id', '{{ $json.payment_id }}',\n            'amount', {{ $json.amount }},\n            'date', '{{ $json.timestamp }}',\n            'status', '{{ $json.status }}'\n        )\n    )\nWHERE \"id\" = '{{ $json.briefing_id }}';"
            },
            "name": "Update Briefing",
            "type": "n8n-nodes-base.postgres",
            "typeVersion": 1,
            "position": [
              650,
              300
            ],
            "credentials": {
              "postgres": "Supabase Postgres"
            }
          },
          {
            "parameters": {
              "operation": "send",
              "fromEmail": "pagamentos@harmonia.media",
              "fromName": "HarmoniA Pagamentos",
              "to": "={{ $json.client_email }}",
              "subject": "=Pagamento confirmado - {{ $json.package_type }}",
              "text": "",
              "html": "=<h1>Olá {{ $json.client_name }}!</h1>\n<p>Seu pagamento para o pacote \"{{ $json.package_type }}\" no valor de R$ {{ $json.amount }} foi confirmado com sucesso!</p>\n<p>ID do pagamento: {{ $json.payment_id }}</p>\n<p>O próximo passo é preencher o briefing detalhado para que possamos iniciar a produção da sua música personalizada.</p>\n<p>Acesse o link abaixo para preencher o briefing:</p>\n<p><a href=\"https://harmonia.media/briefing/{{ $json.briefing_id }}\" style=\"background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;\">Preencher Briefing</a></p>\n<p>Atenciosamente,<br>Equipe HarmoniA</p>",
              "additionalFields": {}
            },
            "name": "Send Confirmation Email",
            "type": "n8n-nodes-base.emailSend",
            "typeVersion": 1,
            "position": [
              850,
              300
            ],
            "credentials": {
              "smtp": "SMTP Account"
            }
          },
          {
            "parameters": {
              "respondWith": "json",
              "responseBody": "={ \"success\": true, \"message\": \"Payment processed successfully\", \"briefing_id\": $json.briefing_id }",
              "options": {}
            },
            "name": "Respond to Webhook",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [
              1050,
              300
            ]
          }
        ],
        "connections": {
          "Webhook": {
            "main": [
              [
                {
                  "node": "Process Payment Data",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Process Payment Data": {
            "main": [
              [
                {
                  "node": "Update Briefing",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Update Briefing": {
            "main": [
              [
                {
                  "node": "Send Confirmation Email",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Send Confirmation Email": {
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
      }
    },
    briefing: {
      title: "Workflow de Processamento de Briefing",
      description: "Processa novos briefings submetidos pelos clientes",
      content: "Este workflow recebe dados de briefing, processa as informações, salva no Supabase e notifica a equipe sobre o novo briefing.",
      template: {
        "nodes": [
          {
            "parameters": {
              "path": "briefing-webhook",
              "responseMode": "responseNode",
              "options": {}
            },
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [
              250,
              300
            ],
            "webhookId": "3698-5247-931a-dc5478af2c1b"
          },
          {
            "parameters": {
              "mode": "runOnceForEachItem",
              "jsCode": "// Process the briefing data\nconst { briefingId, clientName, clientEmail, packageType, briefingData } = $input.item.json.data;\n\nreturn {\n  briefingId,\n  clientName,\n  clientEmail,\n  packageType,\n  briefingData: JSON.stringify(briefingData),\n  timestamp: new Date().toISOString(),\n  summaryItems: Object.entries(briefingData)\n    .filter(([key, value]) => typeof value === 'string' && value.length < 50)\n    .map(([key, value]) => `${key}: ${value}`)\n    .join('\\n')\n};"
            },
            "name": "Process Briefing",
            "type": "n8n-nodes-base.code",
            "typeVersion": 1,
            "position": [
              450,
              300
            ]
          },
          {
            "parameters": {
              "method": "POST",
              "url": "https://api.slack.com/hooks/your-slack-webhook",
              "sendHeaders": true,
              "headerParameters": {
                "parameters": [
                  {
                    "name": "Content-Type",
                    "value": "application/json"
                  }
                ]
              },
              "sendBody": true,
              "bodyParameters": {
                "parameters": [
                  {
                    "name": "text",
                    "value": "=Novo briefing recebido!\n\nCliente: {{ $json.clientName }} ({{ $json.clientEmail }})\nPacote: {{ $json.packageType }}\nData: {{ $json.timestamp }}\n\nResumo:\n{{ $json.summaryItems }}"
                  }
                ]
              },
              "options": {}
            },
            "name": "Notify Team",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 3,
            "position": [
              650,
              300
            ]
          },
          {
            "parameters": {
              "operation": "send",
              "fromEmail": "studio@harmonia.media",
              "fromName": "Estúdio HarmoniA",
              "to": "={{ $json.clientEmail }}",
              "subject": "=Recebemos seu briefing - HarmoniA",
              "text": "",
              "html": "=<h1>Olá {{ $json.clientName }}!</h1>\n<p>Recebemos seu briefing para o pacote \"{{ $json.packageType }}\" com sucesso!</p>\n<p>Nossa equipe já está analisando suas informações e entraremos em contato em breve para discutir os próximos passos de seu projeto.</p>\n<p>Atenciosamente,<br>Equipe HarmoniA</p>",
              "additionalFields": {}
            },
            "name": "Send Receipt Email",
            "type": "n8n-nodes-base.emailSend",
            "typeVersion": 1,
            "position": [
              850,
              300
            ],
            "credentials": {
              "smtp": "SMTP Account"
            }
          },
          {
            "parameters": {
              "respondWith": "json",
              "responseBody": "={ \"success\": true, \"message\": \"Briefing processed successfully\", \"briefingId\": $json.briefingId }",
              "options": {}
            },
            "name": "Respond to Webhook",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [
              1050,
              300
            ]
          }
        ],
        "connections": {
          "Webhook": {
            "main": [
              [
                {
                  "node": "Process Briefing",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Process Briefing": {
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
                  "node": "Send Receipt Email",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Send Receipt Email": {
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
      }
    },
    feedback: {
      title: "Workflow de Processamento de Feedback",
      description: "Processa feedback sobre prévias enviado pelos clientes",
      content: "Este workflow recebe feedback de clientes sobre prévias, atualiza o status no Supabase e notifica a equipe.",
      template: {
        "nodes": [
          {
            "parameters": {
              "path": "feedback-webhook",
              "responseMode": "responseNode",
              "options": {}
            },
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [
              250,
              300
            ],
            "webhookId": "7241-f932-8e41-bd674a239c6f"
          },
          {
            "parameters": {
              "mode": "runOnceForEachItem",
              "jsCode": "// Process the feedback data\nconst { projectId, clientName, clientEmail, feedback, status } = $input.item.json.data;\n\n// Color code based on status\nconst statusColor = status === 'approved' ? '#4CAF50' : \n                  status === 'revision' ? '#FF9800' : '#2196F3';\n\n// Emoji based on status\nconst statusEmoji = status === 'approved' ? '✅' : \n                  status === 'revision' ? '🔄' : '💬';\n\n// Status text\nconst statusText = status === 'approved' ? 'APROVADO' : \n                  status === 'revision' ? 'REVISÃO SOLICITADA' : 'FEEDBACK';\n\nreturn {\n  projectId,\n  clientName,\n  clientEmail,\n  feedback,\n  status,\n  statusText,\n  statusColor,\n  statusEmoji,\n  timestamp: new Date().toISOString(),\n  notificationSubject: `${statusEmoji} ${statusText}: Feedback sobre prévia`\n};"
            },
            "name": "Process Feedback",
            "type": "n8n-nodes-base.code",
            "typeVersion": 1,
            "position": [
              450,
              300
            ]
          },
          {
            "parameters": {
              "operation": "executeQuery",
              "query": "=UPDATE \"preview_projects\" \nSET \n    \"feedback\" = '{{ $json.feedback }}',\n    \"status\" = '{{ $json.status === 'approved' ? 'approved' : 'feedback' }}',\n    \"last_activity_date\" = '{{ $json.timestamp }}'\nWHERE \"id\" = '{{ $json.projectId }}';"
            },
            "name": "Update Preview Status",
            "type": "n8n-nodes-base.postgres",
            "typeVersion": 1,
            "position": [
              650,
              300
            ],
            "credentials": {
              "postgres": "Supabase Postgres"
            }
          },
          {
            "parameters": {
              "method": "POST",
              "url": "https://api.slack.com/hooks/your-slack-webhook",
              "sendHeaders": true,
              "headerParameters": {
                "parameters": [
                  {
                    "name": "Content-Type",
                    "value": "application/json"
                  }
                ]
              },
              "sendBody": true,
              "bodyParameters": {
                "parameters": [
                  {
                    "name": "text",
                    "value": "={{ $json.statusEmoji }} {{ $json.statusText }}: Feedback recebido para o projeto {{ $json.projectId }}\n\nCliente: {{ $json.clientName }} ({{ $json.clientEmail }})\nStatus: {{ $json.statusText }}\nData: {{ $json.timestamp }}\n\nFeedback:\n{{ $json.feedback }}"
                  }
                ]
              },
              "options": {}
            },
            "name": "Notify Team",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 3,
            "position": [
              850,
              300
            ]
          },
          {
            "parameters": {
              "respondWith": "json",
              "responseBody": "={ \"success\": true, \"message\": \"Feedback processed successfully\", \"projectId\": $json.projectId, \"status\": $json.status }",
              "options": {}
            },
            "name": "Respond to Webhook",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [
              1050,
              300
            ]
          }
        ],
        "connections": {
          "Webhook": {
            "main": [
              [
                {
                  "node": "Process Feedback",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Process Feedback": {
            "main": [
              [
                {
                  "node": "Update Preview Status",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Update Preview Status": {
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
                  "node": "Respond to Webhook",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          }
        }
      }
    },
    chatbot: {
      title: "Workflow de Integração com Chatbot",
      description: "Processa mensagens do chatbot e envia respostas personalizadas",
      content: "Este workflow recebe mensagens do chatbot, classifica o conteúdo e envia respostas personalizadas baseadas no tipo de mensagem.",
      template: {
        "nodes": [
          {
            "parameters": {
              "path": "chatbot-webhook",
              "responseMode": "responseNode",
              "options": {}
            },
            "name": "Webhook",
            "type": "n8n-nodes-base.webhook",
            "typeVersion": 1,
            "position": [
              250,
              300
            ],
            "webhookId": "16ae1112-2469-420d-8fcc-c9569152bd8f"
          },
          {
            "parameters": {
              "mode": "runOnceForEachItem",
              "jsCode": "// Process the chatbot message\nconst { message, userData } = $input.item.json.data;\n\n// Simple message classification\nlet messageType = 'general';\nlet priority = 'normal';\n\nif (message.includes('preço') || message.includes('valor') || message.includes('custo')) {\n  messageType = 'pricing';\n}\nelse if (message.includes('ajuda') || message.includes('suporte')) {\n  messageType = 'support';\n  priority = 'high';\n}\nelse if (message.includes('briefing') || message.includes('projeto')) {\n  messageType = 'project';\n}\nelse if (message.includes('pagamento') || message.includes('pagar')) {\n  messageType = 'payment';\n}\n\nreturn {\n  message,\n  userData,\n  messageType,\n  priority,\n  timestamp: new Date().toISOString(),\n  formattedTimestamp: new Date().toLocaleString('pt-BR')\n};"
            },
            "name": "Process Message",
            "type": "n8n-nodes-base.code",
            "typeVersion": 1,
            "position": [
              450,
              300
            ]
          },
          {
            "parameters": {
              "method": "POST",
              "url": "https://api.slack.com/hooks/your-slack-webhook",
              "sendHeaders": true,
              "headerParameters": {
                "parameters": [
                  {
                    "name": "Content-Type",
                    "value": "application/json"
                  }
                ]
              },
              "sendBody": true,
              "bodyParameters": {
                "parameters": [
                  {
                    "name": "text",
                    "value": "=Nova mensagem do chatbot\n\nTipo: {{ $json.messageType }}\nPrioridade: {{ $json.priority }}\nData: {{ $json.formattedTimestamp }}\n\nMensagem:\n{{ $json.message }}"
                  }
                ]
              },
              "options": {}
            },
            "name": "Notify Team",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 3,
            "position": [
              650,
              300
            ]
          },
          {
            "parameters": {
              "content": "={{ \n  $json.messageType === 'pricing' ? \n    \"Obrigado por seu interesse em nossos preços! Nossos pacotes variam de R$199 a R$799, dependendo do tipo de composição e serviços adicionais. Você pode ver todos os detalhes em nossa página de preços: https://harmonia.media/precos ou falar diretamente com um de nossos atendentes.\" :\n  $json.messageType === 'support' ?\n    \"Estamos aqui para ajudar! Por favor, nos conte mais detalhes sobre o que você precisa e um de nossos especialistas irá atendê-lo o mais breve possível. Você também pode nos contatar pelo WhatsApp: (11) 98765-4321.\" :\n  $json.messageType === 'project' ?\n    \"Que bom que você está interessado em iniciar um projeto conosco! Para começarmos, precisaremos que você preencha nosso briefing. É um processo simples que nos ajuda a entender melhor suas necessidades. Você gostaria de começar agora?\" :\n  $json.messageType === 'payment' ?\n    \"Oferecemos várias opções de pagamento, incluindo cartão de crédito, PIX e transferência bancária. Todas as transações são processadas de forma segura. Se você já tem um projeto em andamento e deseja efetuar o pagamento, posso te direcionar para nossa página de pagamento.\" :\n    \"Obrigado por entrar em contato com a HarmoniA! Como posso ajudar você hoje? Estou aqui para responder suas dúvidas sobre nossos serviços de composição musical personalizada.\"\n})",
              "options": {}
            },
            "name": "Generate Response",
            "type": "n8n-nodes-base.set",
            "typeVersion": 1,
            "position": [
              850,
              300
            ]
          },
          {
            "parameters": {
              "respondWith": "json",
              "responseBody": "={ \"success\": true, \"response\": $json.content, \"messageType\": $json.messageType }",
              "options": {}
            },
            "name": "Respond to Webhook",
            "type": "n8n-nodes-base.respondToWebhook",
            "typeVersion": 1,
            "position": [
              1050,
              300
            ]
          }
        ],
        "connections": {
          "Webhook": {
            "main": [
              [
                {
                  "node": "Process Message",
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
                  "node": "Generate Response",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "Generate Response": {
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
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guia de Configuração de Workflows n8n</CardTitle>
        <CardDescription>
          Siga este guia para configurar os workflows n8n para integrações com harmonIA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          Este guia mostra como configurar workflows no n8n para automatizar processos de notificação, pagamento, feedback e mais para a plataforma harmonIA.
        </p>

        <Tabs value={activeWorkflow} onValueChange={setActiveWorkflow}>
          <TabsList>
            <TabsTrigger value="preview">Prévias</TabsTrigger>
            <TabsTrigger value="payment">Pagamentos</TabsTrigger>
            <TabsTrigger value="briefing">Briefing</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeWorkflow} className="mt-4 pt-4 border-t">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{workflowExamples[activeWorkflow].title}</h3>
                  <p className="text-sm text-gray-600">{workflowExamples[activeWorkflow].description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadJson(workflowExamples[activeWorkflow].template, `harmonia-${activeWorkflow}-workflow.json`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href="https://humbrock.app.n8n.cloud/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir n8n
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border">
                <p className="mb-2">{workflowExamples[activeWorkflow].content}</p>
                
                <CodeBlock
                  code={JSON.stringify(workflowExamples[activeWorkflow].template, null, 2)}
                  language="json"
                  className="max-h-80 overflow-y-auto text-xs"
                />
              </div>
              
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="instructions">
                  <AccordionTrigger>Instruções de Importação</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <Steps>
                      <Step title="Baixe o arquivo JSON do workflow">
                        <p>Clique no botão "Download JSON" acima para baixar o arquivo do workflow.</p>
                      </Step>
                      
                      <Step title="Acesse o n8n">
                        <p>Entre na plataforma n8n em <a href="https://humbrock.app.n8n.cloud/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://humbrock.app.n8n.cloud/</a></p>
                      </Step>
                      
                      <Step title="Crie um novo workflow">
                        <p>Clique no botão "New Workflow" no painel do n8n.</p>
                      </Step>
                      
                      <Step title="Importe o arquivo JSON">
                        <p>No n8n, clique em "Actions" → "Import from file" e selecione o arquivo JSON baixado.</p>
                      </Step>
                      
                      <Step title="Configure credenciais">
                        <p>Você precisará configurar as credenciais para cada nó que requer autenticação (como nós de email ou banco de dados).</p>
                      </Step>
                      
                      <Step title="Ative o workflow">
                        <p>Depois de configurar tudo, clique em "Activate" para ativar o webhook e deixar o workflow pronto para uso.</p>
                      </Step>
                      
                      <Step title="Copie a URL do webhook">
                        <p>Copie a URL do webhook que será mostrada no nó "Webhook" e salve-a na seção de configuração de Webhooks da harmonIA.</p>
                      </Step>
                    </Steps>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="configuration">
                  <AccordionTrigger>Configurações Adicionais</AccordionTrigger>
                  <AccordionContent className="space-y-2 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Configuração de Email</h4>
                        <p>Para os workflows que enviam emails, você precisará configurar um serviço de email no n8n:</p>
                        <ol className="list-decimal ml-5 mt-2 space-y-1">
                          <li>No n8n, vá para "Settings" → "Credentials"</li>
                          <li>Adicione credenciais para o serviço de email (SMTP, SendGrid etc.)</li>
                          <li>Configure o nó "Send Email" para usar essas credenciais</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Configuração do Banco de Dados</h4>
                        <p>Para workflows que se conectam ao Supabase, configure as credenciais PostgreSQL:</p>
                        <ol className="list-decimal ml-5 mt-2 space-y-1">
                          <li>No n8n, adicione credenciais do tipo "PostgreSQL"</li>
                          <li>Use os dados de conexão do Supabase (disponíveis no painel do Supabase)</li>
                          <li>Teste a conexão antes de ativar o workflow</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Notificações para Slack/Discord</h4>
                        <p>Para receber notificações no Slack ou Discord:</p>
                        <ol className="list-decimal ml-5 mt-2 space-y-1">
                          <li>Crie um webhook no seu workspace Slack/servidor Discord</li>
                          <li>Substitua a URL "https://api.slack.com/hooks/your-slack-webhook" nos nós HTTP Request</li>
                          <li>Personalize o formato das mensagens conforme necessário</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Visão Geral de Integração</h3>
          <p className="text-sm text-blue-700 mb-2">Para o funcionamento completo da plataforma, configure os seguintes workflows no n8n:</p>
          <ol className="list-decimal ml-5 space-y-1 text-sm text-blue-700">
            <li><strong>Notificações de Prévia</strong> - Envia emails com links mágicos para clientes acessarem prévias</li>
            <li><strong>Processamento de Pagamento</strong> - Processa notificações de pagamento e atualiza status no sistema</li>
            <li><strong>Feedback de Cliente</strong> - Processa feedback sobre prévias e notifica a equipe</li>
            <li><strong>Processamento de Briefing</strong> - Gerencia novos briefings e envia confirmações</li>
            <li><strong>Integração de Chatbot</strong> - Processa mensagens do chatbot e gera respostas personalizadas</li>
          </ol>
          <p className="text-sm text-blue-700 mt-4">Após configurar todos os workflows, atualize as URLs dos webhooks na seção de Integrações do painel administrativo.</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => openExternalLink('https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.webhook/')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Documentação do n8n Webhook
        </Button>
        <Button
          size="sm"
          className="bg-harmonia-green hover:bg-harmonia-green/90"
          onClick={() => openExternalLink('/admin-j28s7d1k/integrations')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Configurar Webhooks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default N8nWorkflowGuide;
