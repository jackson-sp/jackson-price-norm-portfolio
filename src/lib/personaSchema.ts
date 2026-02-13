import type { PersonaData } from '../types/persona';

export type PersonaFieldType = 'text' | 'list' | 'subheader';

export interface PersonaFieldDef {
  key: keyof PersonaData | null;
  label: string;
  type: PersonaFieldType;
}

export interface PersonaSectionDef {
  title: string;
  fields: PersonaFieldDef[];
}

/** Single ordered schema for Persona Card. Used by PDF and can drive UI to prevent drift. */
export const PERSONA_SECTIONS: PersonaSectionDef[] = [
  {
    title: 'Identity & Background',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'text' },
      { key: 'roleInBuyingProcess', label: 'Role in the Buying Process', type: 'text' },
      { key: 'background', label: 'Background', type: 'text' },
      { key: 'demographics', label: 'Demographics', type: 'text' },
    ],
  },
  {
    title: 'Company Profile',
    fields: [
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'companySize', label: 'Size', type: 'text' },
      { key: 'revenue', label: 'Revenue', type: 'text' },
    ],
  },
  {
    title: 'Psychographics',
    fields: [
      { key: 'personality', label: 'Personality', type: 'text' },
      { key: 'responsibilities', label: 'Responsibilities', type: 'text' },
      { key: 'goals', label: 'Goals', type: 'text' },
      { key: 'challenges', label: 'Challenges', type: 'text' },
      { key: 'motivators', label: 'Motivators', type: 'text' },
    ],
  },
  {
    title: 'Decision Path',
    fields: [
      { key: 'validators', label: 'Validators', type: 'list' },
      { key: 'objections', label: 'Why won\'t they buy? (Objections)', type: 'list' },
      { key: 'triggers', label: 'What closes the deal? (Triggers)', type: 'list' },
    ],
  },
  {
    title: 'Engagement & Product Fit',
    fields: [
      { key: 'communicationPreferences', label: 'Communication Preferences', type: 'text' },
      { key: 'mostValuedFeatures', label: 'Most Valued Features', type: 'list' },
      { key: 'leastValuedFeatures', label: 'Least Valued Features', type: 'list' },
    ],
  },
  {
    title: 'Economic Indicators',
    fields: [
      { key: null, label: 'Price Point', type: 'subheader' },
      { key: 'willingnessToPay', label: 'Willingness to Pay', type: 'text' },
      { key: 'cac', label: 'Customer Acquisition Cost (CAC)', type: 'text' },
      { key: 'ltv', label: 'Lifetime Value (LTV)', type: 'text' },
    ],
  },
];
