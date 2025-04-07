
export interface QualificationData {
  name: string;
  email: string;
  phone: string;
  referralSource: string;
  purpose: string[];
  otherPurpose?: string;
  timeline: string;
  description: string;
  budget: string;
  features: string[];
  termsAccepted: boolean;
}

export interface QualificationFormData extends QualificationData {
  termsAccepted: boolean;
}
