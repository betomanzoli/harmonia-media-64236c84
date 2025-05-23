// Função básica para combinar classes CSS
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Função básica para formatação de data
export function formatDate(date: string | Date): string {
  try {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
}

// Função básica para formatação de moeda
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
