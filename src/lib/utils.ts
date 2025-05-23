import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

// ✅ UTILITY PARA CLASSES TAILWIND
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ UTILITY PARA FORMATAÇÃO DE DATAS
export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Tentar diferentes formatos de string
      dateObj = date.includes('T') ? parseISO(date) : new Date(date);
    } else {
      dateObj = date;
    }
    
    if (!isValid(dateObj)) {
      return 'Data inválida';
    }
    
    return format(dateObj, formatStr, { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

// ✅ UTILITY PARA FORMATAÇÃO DE DATA E HORA
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

// ✅ UTILITY PARA FORMATAÇÃO RELATIVA
export function formatRelativeDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;
    
    return `${Math.floor(diffInDays / 365)} anos atrás`;
  } catch (error) {
    return formatDate(date);
  }
}

// ✅ UTILITY PARA FORMATAÇÃO DE MOEDA
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// ✅ UTILITY PARA FORMATAÇÃO DE NÚMEROS
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

// ✅ UTILITY PARA VALIDAÇÃO DE EMAIL
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ UTILITY PARA VALIDAÇÃO DE CPF
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false; // Evita CPFs com todos os dígitos iguais
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF[i]) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (parseInt(cleanCPF[9]) !== digit) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF[i]) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (parseInt(cleanCPF[10]) !== digit) return false;
  
  return true;
}

// ✅ UTILITY PARA FORMATAÇÃO DE CPF
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// ✅ UTILITY PARA FORMATAÇÃO DE TELEFONE
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

// ✅ UTILITY PARA FORMATAÇÃO DE CEP
export function formatCEP(cep: string): string {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// ✅ UTILITY PARA SLUGIFY
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ✅ UTILITY PARA TRUNCAR TEXTO
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// ✅ UTILITY PARA GERAR ID ÚNICO
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ✅ UTILITY PARA DEBOUNCE
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ✅ UTILITY PARA STATUS DO PROJETO
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'active': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'waiting': 'bg-gray-100 text-gray-800',
    'feedback': 'bg-orange-100 text-orange-800',
    'approved': 'bg-green-100 text-green-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

// ✅ UTILITY PARA STATUS TRADUZIDO
export function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    'pending': 'Pendente',
    'active': 'Ativo',
    'completed': 'Concluído',
    'cancelled': 'Cancelado',
    'waiting': 'Aguardando',
    'feedback': 'Feedback',
    'approved': 'Aprovado'
  };
  return statusLabels[status] || status;
}
