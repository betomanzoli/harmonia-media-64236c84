
/**
 * Format a date string or Date object into a localized date string
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatDate:', date);
    return 'Data inválida';
  }
  
  return dateObj.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate days remaining until a date
 * @param targetDate - The future date
 * @returns Number of days remaining
 */
export function daysRemaining(targetDate: string | Date): number {
  if (!targetDate) return 0;
  
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const today = new Date();
  
  // Reset time portion for accurate day calculation
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Check if a date has passed
 * @param date - The date to check
 * @returns Boolean indicating if date has passed
 */
export function isDatePassed(date: string | Date): boolean {
  if (!date) return false;
  
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return checkDate < today;
}
