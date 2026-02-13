export interface OutcomePillar {
  painPoints: string;
  productBenefits: string;
  productDetails: string;
  proofPoints: string;
}

export interface PlaybookData {
  yourName: string;
  valueProposition: string;
  audience: string;
  elevatorPitch: string;
  longDescription: string;
  toneOfVoice: string;
  outcomes: string[];
  customerRequirements: string[];
  pillars: [OutcomePillar, OutcomePillar, OutcomePillar];
}

export const initialPlaybookData: PlaybookData = {
  yourName: '',
  valueProposition: '',
  audience: '',
  elevatorPitch: '',
  longDescription: '',
  toneOfVoice: '',
  outcomes: [''],
  customerRequirements: [''],
  pillars: [
    { painPoints: '', productBenefits: '', productDetails: '', proofPoints: '' },
    { painPoints: '', productBenefits: '', productDetails: '', proofPoints: '' },
    { painPoints: '', productBenefits: '', productDetails: '', proofPoints: '' },
  ],
};
