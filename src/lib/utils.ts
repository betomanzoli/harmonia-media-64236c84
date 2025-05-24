// ✅ FUNÇÃO BÁSICA PARA COMBINAR CLASSES CSS (SEM clsx/twMerge)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ✅ FUNÇÃO BÁSICA PARA FORMATAÇÃO DE DATA
export function formatDate(date: string | Date): string {
  try {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
}

// ✅ FUNÇÃO BÁSICA PARA FORMATAÇÃO DE DATA E HORA
export function formatDateTime(date: string | Date): string {
  try {
    const d = new Date(date);
    return d.toLocaleString('pt-BR');
  } catch {
    return 'Data inválida';
  }
}

// ✅ FUNÇÃO BÁSICA PARA FORMATAÇÃO DE MOEDA
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// ✅ FUNÇÃO BÁSICA PARA FORMATAÇÃO DE TELEFONE
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

// ✅ FUNÇÃO BÁSICA PARA FORMATAÇÃO DE CPF
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// ✅ FUNÇÃO BÁSICA PARA TRUNCAR TEXTO
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// ✅ FUNÇÃO BÁSICA PARA GERAR ID ÚNICO
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ✅ FUNÇÃO BÁSICA PARA VALIDAÇÃO DE EMAIL
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ FUNÇÃO BÁSICA PARA VALIDAÇÃO DE CPF
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
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

// ✅ FUNÇÃO PARA SLUGIFY
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

// ✅ FUNÇÃO PARA DEBOUNCE
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
