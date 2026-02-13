export interface PersonaData {
  // Identity & Background
  name: string;
  bio: string;
  roleInBuyingProcess: string;
  background: string;
  /** Structured background (PDF uses these when set) */
  backgroundTitle?: string;
  reportsTo?: string;
  numberOfReports?: string;
  purchasingRole?: string;
  demographics: string;
  /** Structured demographics (PDF uses these when set) */
  age?: string;
  gender?: string;
  location?: string;
  // Company Profile
  industry: string;
  companySize: string;
  revenue: string;
  // Psychographics & Drivers
  personality: string;
  responsibilities: string;
  goals: string;
  challenges: string;
  motivators: string;
  // The Decision Path
  validators: string[];
  objections: string[];
  triggers: string[];
  // Engagement & Product Fit
  communicationPreferences: string;
  mostValuedFeatures: string[];
  leastValuedFeatures: string[];
  // Economic Indicators
  willingnessToPay: string;
  cac: string;
  ltv: string;
}

export const initialPersonaData: PersonaData = {
  name: '',
  bio: '',
  roleInBuyingProcess: '',
  background: '',
  backgroundTitle: '',
  reportsTo: '',
  numberOfReports: '',
  purchasingRole: '',
  demographics: '',
  age: '',
  gender: '',
  location: '',
  industry: '',
  companySize: '',
  revenue: '',
  personality: '',
  responsibilities: '',
  goals: '',
  challenges: '',
  motivators: '',
  validators: [''],
  objections: [''],
  triggers: [''],
  communicationPreferences: '',
  mostValuedFeatures: [''],
  leastValuedFeatures: [''],
  willingnessToPay: '',
  cac: '',
  ltv: '',
};
