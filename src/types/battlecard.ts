export interface BattlecardData {
  yourName: string;
  overview: {
    companyDescription: string;
    audience: string;
    topFeatures: [string, string, string];
  };
  differentiators: {
    competitor1: string;
    competitor2: string;
    ratings: {
      price: { you: number; comp1: number; comp2: number };
      speed: { you: number; comp1: number; comp2: number };
      support: { you: number; comp1: number; comp2: number };
      security: { you: number; comp1: number; comp2: number };
      apps: { you: number; comp1: number; comp2: number };
    };
  };
  whyWeWin: [string, string, string];
  painPoints: string[];
  objections: { objection: string; response: string }[];
  keyFeatures: [{ name: string; description: string }, { name: string; description: string }, { name: string; description: string }];
  questionsToAsk: [string, string, string];
  pricing: {
    you: { monthly: string; annual: string };
    comp1: { monthly: string; annual: string };
    comp2: { monthly: string; annual: string };
  };
  quickTips: string;
  thirdPartyValidation: string;
  relevantCustomers: string;
  additionalResources: {
    content: string;
  };
}

export const initialBattlecardData: BattlecardData = {
  yourName: '',
  overview: {
    companyDescription: '',
    audience: '',
    topFeatures: ['', '', ''],
  },
  differentiators: {
    competitor1: '',
    competitor2: '',
    ratings: {
      price: { you: 0, comp1: 0, comp2: 0 },
      speed: { you: 0, comp1: 0, comp2: 0 },
      support: { you: 0, comp1: 0, comp2: 0 },
      security: { you: 0, comp1: 0, comp2: 0 },
      apps: { you: 0, comp1: 0, comp2: 0 },
    },
  },
  whyWeWin: ['', '', ''],
  painPoints: ['', '', ''],
  objections: [
    { objection: '', response: '' },
    { objection: '', response: '' },
    { objection: '', response: '' },
  ],
  keyFeatures: [
    { name: '', description: '' },
    { name: '', description: '' },
    { name: '', description: '' },
  ],
  questionsToAsk: ['', '', ''],
  pricing: {
    you: { monthly: '', annual: '' },
    comp1: { monthly: '', annual: '' },
    comp2: { monthly: '', annual: '' },
  },
  quickTips: '',
  thirdPartyValidation: '',
  relevantCustomers: '',
  additionalResources: {
    content: '',
  },
};

const STORAGE_KEY = 'battlecard-draft';

function deepMerge<T extends object>(initial: T, saved: Partial<T>): T {
  const out = { ...initial };
  for (const key of Object.keys(saved) as (keyof T)[]) {
    const savedVal = saved[key];
    if (savedVal === undefined) continue;
    const initialVal = initial[key];
    if (
      initialVal !== null &&
      typeof initialVal === 'object' &&
      !Array.isArray(initialVal) &&
      savedVal !== null &&
      typeof savedVal === 'object' &&
      !Array.isArray(savedVal)
    ) {
      (out as Record<string, unknown>)[key as string] = deepMerge(
        initialVal as object,
        savedVal as object
      ) as T[keyof T];
    } else {
      (out as Record<string, unknown>)[key as string] = savedVal;
    }
  }
  return out;
}

function normalizeDraft(merged: BattlecardData): BattlecardData {
  const res = merged.additionalResources as
    | { content?: string }
    | { personaTemplates?: string | string[]; useCases?: string | string[]; faqs?: string | string[] };
  const toArr = (v: string | string[] | undefined): string[] =>
    Array.isArray(v) ? v : [typeof v === 'string' ? v : ''];
  const hasNewShape = res && 'content' in res && typeof (res as { content?: string }).content === 'string';
  const additionalContent = hasNewShape
    ? (res as { content: string }).content
    : [
        ...toArr((res as { personaTemplates?: string | string[] }).personaTemplates),
        ...toArr((res as { useCases?: string | string[] }).useCases),
        ...toArr((res as { faqs?: string | string[] }).faqs),
      ]
        .filter(Boolean)
        .join('\n\n');

  const rawPain = (merged as { painPoints?: string | string[] }).painPoints;
  const painPoints = Array.isArray(rawPain)
    ? rawPain.length
      ? rawPain
      : ['', '', '']
    : typeof rawPain === 'string'
      ? rawPain.split(/\n|,/).map((s: string) => s.trim()).filter(Boolean).length
        ? rawPain.split(/\n|,/).map((s: string) => s.trim())
        : ['', '', '']
      : ['', '', ''];
  const rawObj = (merged as { objections?: { objection: string; response: string }[] }).objections;
  const objections = Array.isArray(rawObj)
    ? rawObj.length
      ? rawObj
      : [
          { objection: '', response: '' },
          { objection: '', response: '' },
          { objection: '', response: '' },
        ]
    : [
        { objection: '', response: '' },
        { objection: '', response: '' },
        { objection: '', response: '' },
      ];
  return {
    ...merged,
    painPoints,
    objections,
    additionalResources: {
      content: additionalContent,
    },
  };
}

export function loadDraft(): BattlecardData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BattlecardData>;
    return normalizeDraft(deepMerge(initialBattlecardData, parsed));
  } catch {
    return null;
  }
}

export function saveDraft(data: BattlecardData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}
