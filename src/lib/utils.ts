// ✅ FUNÇÃO BÁSICA PARA COMBINAR CLASSES CSS (SEM clsx)
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

// ✅ FUNÇÃO BÁSICA PARA TRUNCAR TEXTO
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// ✅ FUNÇÃO BÁSICA PARA GERAR ID ÚNICO
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
