
// Service to manage external storage
import { useSystemSettings } from '@/hooks/useSystemSettings';

// Default storage URLs for different modules
const defaultStorageUrls = {
  audio: "https://drive.google.com/drive/folders/1zOKfHNA7rAihCmEVKZtL191k8XgUsXMg",
  portfolio: "https://drive.google.com/drive/folders/1MJk2diD6Bmb9Q6lNVDPnLePAznerOU29",
  orders: "https://drive.google.com/drive/folders/1brm0ombzUSBzGOdPuj4e0phlU9nKbvbs",
  customers: "https://drive.google.com/drive/folders/1fQWdtNPx7pHvMwJfhamtdHBJsdpLkIZZ",
  previews: "https://drive.google.com/drive/folders/1lLw3oBgNhlpUiYbo3wevgUvjA0RTV7tN",
  integrations: "https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ",
  invoices: "https://drive.google.com/drive/folders/1uuhCHv0c5eePU9_m-0BdYiuo0-3vUwVJ"
};

// Define module types
export type StorageModuleType = keyof typeof defaultStorageUrls;

// Function to get a storage URL for a specific module
const getStorageUrl = (moduleType: StorageModuleType): string => {
  return defaultStorageUrls[moduleType];
};

// Function to get all storage links for display
const getAllStorageLinks = () => {
  return [
    {
      title: "Banco de Dados de Áudio",
      description: "Amostras de áudio, músicas e efeitos sonoros",
      url: defaultStorageUrls.audio
    },
    {
      title: "Portfólio",
      description: "Trabalhos finalizados e exemplos de projetos",
      url: defaultStorageUrls.portfolio
    },
    {
      title: "Lista de Pedidos",
      description: "Arquivos relacionados a pedidos dos clientes",
      url: defaultStorageUrls.orders
    },
    {
      title: "Lista de Clientes",
      description: "Documentos e informações de clientes",
      url: defaultStorageUrls.customers
    },
    {
      title: "Projetos de Prévias",
      description: "Prévias de projetos em andamento",
      url: defaultStorageUrls.previews
    },
    {
      title: "Integrações e Faturas",
      description: "Documentos de integração e faturas",
      url: defaultStorageUrls.integrations
    }
  ];
};

export default {
  getStorageUrl,
  getAllStorageLinks,
  defaultStorageUrls
};
