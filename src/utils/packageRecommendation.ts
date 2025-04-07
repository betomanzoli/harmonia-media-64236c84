
import { QualificationData } from '@/types/qualification';

// Function to determine recommended package based on form data
export const getRecommendedPackage = (data: QualificationData): 'essencial' | 'profissional' | 'premium' => {
  // Logic to determine the recommended package
  
  // If user selected premium features
  if (
    data.features.includes('legal-registration') || 
    data.features.includes('full-rights') ||
    data.budget === 'above-500'
  ) {
    return 'premium';
  }
  
  // If user selected professional features
  if (
    data.features.includes('commercial-use') ||
    data.purpose.includes('professional-use') ||
    data.purpose.includes('corporate-use') ||
    data.budget === '200-500'
  ) {
    return 'profissional';
  }
  
  // Default to essencial
  return 'essencial';
};
