
/**
 * Format a date string to a relative date format like "2 days ago"
 */
export function formatRelativeDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Handle invalid date
      return dateString;
    }
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'hoje';
    } else if (diffDays === 1) {
      return 'ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`;
    } else {
      // Format as date
      return date.toLocaleDateString('pt-BR');
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a date to DD/MM/YYYY format
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}
