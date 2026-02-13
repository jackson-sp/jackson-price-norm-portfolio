import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Plus } from 'lucide-react';
import type { PersonaData } from '../types/persona';
import { initialPersonaData } from '../types/persona';
import { generatePersonaPdf } from '../lib/personaPdf';

const HELPER = {
  name: 'Assign a descriptive name or a functional title for the persona (e.g., "Skeptic Sam" or "CFO Persona").',
  bio: 'Summarize the persona\'s professional mindset. Focus on their primary motivations, the internal pressures they face, and their general attitude toward new purchases or change.',
  roleInBuyingProcess: 'Define their level of authority. Are they a researcher, an influencer, a gatekeeper, or the final economic decision-maker?',
  background: 'List the specific job title, who they report to, and any relevant professional history or team size.',
  demographics: 'Identify key traits such as age range, gender identity (if relevant to the market), and geographic location.',
  industry: 'Define the specific sector or niche this persona operates within.',
  companySize: 'Note the employee count range to determine the complexity of the organization.',
  revenue: 'Specify the annual revenue brackets to understand their purchasing power and budget scale.',
  personality: 'Describe their temperament, communication style (e.g., introverted vs. extroverted), and how they process information (e.g., analytical vs. emotional).',
  responsibilities: 'List the core KPIs and daily tasks this person is held accountable for by their organization.',
  goals: 'Identify what this person is trying to achieve personally and professionally. What does "success" look like for them?',
  challenges: 'Detail the "pain points" or friction they encounter. What is preventing them from reaching their goals?',
  motivators: 'Rank the factors that drive their decision-making, such as price, prestige, efficiency, or data-backed proof.',
  validators: 'List the external sources or internal stakeholders they trust to verify a product\'s worth (e.g., industry reports, peer reviews, or executive buy-in).',
  objections: 'Identify the primary "deal-breakers." What specific risks or lack of information would cause them to reject a proposal?',
  triggers: 'Define the "must-have" evidence or value proposition that flips them from a "No" to a "Yes."',
  communicationPreferences: 'Describe how they prefer to receive information. Include the "when" (at what stage of the funnel) and the "how" (e.g., one-pagers, webinars, or direct sales calls).',
  mostValuedFeatures: 'List the specific product capabilities that solve their primary challenges.',
  leastValuedFeatures: 'Identify features they find redundant, distracting, or irrelevant to their core goals.',
  willingnessToPay: 'The expected monthly or annual investment this persona is willing to make.',
  cac: 'The target cost to convert this persona (Customer Acquisition Cost).',
  ltv: 'The projected total revenue this persona represents over time (Lifetime Value).',
};

function PersonaSection({
  title,
  helperText,
  children,
}: {
  title: string;
  helperText: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-slate-800 font-semibold text-lg mb-1">{title}</h2>
      <p className="text-sm text-slate-600 mb-4">{helperText}</p>
      <div>{children}</div>
    </section>
  );
}

export default function PersonaCardGenerator() {
  const [data, setData] = useState<PersonaData>(() => initialPersonaData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = <K extends keyof PersonaData>(key: K, value: PersonaData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateList = (key: 'validators' | 'objections' | 'triggers' | 'mostValuedFeatures' | 'leastValuedFeatures', index: number, value: string) => {
    setData((prev) => {
      const next = [...prev[key]];
      next[index] = value;
      return { ...prev, [key]: next };
    });
  };

  const addToList = (key: 'validators' | 'objections' | 'triggers' | 'mostValuedFeatures' | 'leastValuedFeatures') => {
    setData((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">Persona Card Generator</h1>
          <button
            type="button"
            onClick={() => generatePersonaPdf(data)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <h2 className="text-slate-700 font-semibold text-base border-b border-slate-200 pb-2">Identity & Background</h2>
        <PersonaSection title="Name" helperText={HELPER.name}>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PersonaSection>
        <PersonaSection title="Bio" helperText={HELPER.bio}>
          <textarea value={data.bio} onChange={(e) => update('bio', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Role in the Buying Process" helperText={HELPER.roleInBuyingProcess}>
          <textarea
            value={data.roleInBuyingProcess}
            onChange={(e) => update('roleInBuyingProcess', e.target.value)}
            rows={3}
            className="w-full min-h-[4rem] resize-y px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PersonaSection>
        <PersonaSection title="Background" helperText={HELPER.background}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" value={data.backgroundTitle ?? data.background} onChange={(e) => update('backgroundTitle', e.target.value)} placeholder="Job title" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reports to</label>
              <input type="text" value={data.reportsTo ?? ''} onChange={(e) => update('reportsTo', e.target.value)} placeholder="Who they report to" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of reports</label>
              <input type="text" value={data.numberOfReports ?? ''} onChange={(e) => update('numberOfReports', e.target.value)} placeholder="Team size" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchasing Role</label>
              <input type="text" value={data.purchasingRole ?? ''} onChange={(e) => update('purchasingRole', e.target.value)} placeholder="e.g. Decision maker, Influencer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          </div>
        </PersonaSection>
        <PersonaSection title="Demographics" helperText={HELPER.demographics}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input type="text" value={data.age ?? ''} onChange={(e) => update('age', e.target.value)} placeholder="e.g. 35–44" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <input type="text" value={data.gender ?? ''} onChange={(e) => update('gender', e.target.value)} placeholder="If relevant to the market" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" value={data.location ?? data.demographics} onChange={(e) => update('location', e.target.value)} placeholder="Geographic location" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          </div>
        </PersonaSection>

        <h2 className="text-slate-700 font-semibold text-base border-b border-slate-200 pb-2 mt-10">Company Profile</h2>
        <PersonaSection title="Industry" helperText={HELPER.industry}>
          <input type="text" value={data.industry} onChange={(e) => update('industry', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Size" helperText={HELPER.companySize}>
          <input type="text" value={data.companySize} onChange={(e) => update('companySize', e.target.value)} placeholder="e.g. 50–200 employees" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Revenue" helperText={HELPER.revenue}>
          <input type="text" value={data.revenue} onChange={(e) => update('revenue', e.target.value)} placeholder="e.g. $10M–$50M annual" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>

        <h2 className="text-slate-700 font-semibold text-base border-b border-slate-200 pb-2 mt-10">Psychographics & Drivers</h2>
        <PersonaSection title="Personality" helperText={HELPER.personality}>
          <textarea value={data.personality} onChange={(e) => update('personality', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Responsibilities" helperText={HELPER.responsibilities}>
          <textarea value={data.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Goals" helperText={HELPER.goals}>
          <textarea value={data.goals} onChange={(e) => update('goals', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Challenges" helperText={HELPER.challenges}>
          <textarea value={data.challenges} onChange={(e) => update('challenges', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Motivators" helperText={HELPER.motivators}>
          <textarea value={data.motivators} onChange={(e) => update('motivators', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>

        <h2 className="text-slate-700 font-semibold text-base border-b border-slate-200 pb-2 mt-10">The Decision Path</h2>
        <PersonaSection title="Validators" helperText={HELPER.validators}>
          {data.validators.map((item, i) => (
            <div key={i} className="mb-2">
              <input type="text" value={item} onChange={(e) => updateList('validators', i, e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          ))}
          <button type="button" onClick={() => addToList('validators')} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="w-4 h-4" /> Add another
          </button>
        </PersonaSection>
        <PersonaSection title="Why won't they buy? (Objections)" helperText={HELPER.objections}>
          {data.objections.map((item, i) => (
            <div key={i} className="mb-2">
              <input type="text" value={item} onChange={(e) => updateList('objections', i, e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          ))}
          <button type="button" onClick={() => addToList('objections')} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="w-4 h-4" /> Add another
          </button>
        </PersonaSection>
        <PersonaSection title="What closes the deal? (Triggers)" helperText={HELPER.triggers}>
          {data.triggers.map((item, i) => (
            <div key={i} className="mb-2">
              <input type="text" value={item} onChange={(e) => updateList('triggers', i, e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          ))}
          <button type="button" onClick={() => addToList('triggers')} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="w-4 h-4" /> Add another
          </button>
        </PersonaSection>

        <h2 className="text-slate-700 font-semibold text-base border-b border-slate-200 pb-2 mt-10">Engagement & Product Fit</h2>
        <PersonaSection title="Communication Preferences" helperText={HELPER.communicationPreferences}>
          <textarea value={data.communicationPreferences} onChange={(e) => update('communicationPreferences', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
        </PersonaSection>
        <PersonaSection title="Most Valued Features" helperText={HELPER.mostValuedFeatures}>
          {data.mostValuedFeatures.map((item, i) => (
            <div key={i} className="mb-2">
              <input type="text" value={item} onChange={(e) => updateList('mostValuedFeatures', i, e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          ))}
          <button type="button" onClick={() => addToList('mostValuedFeatures')} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="w-4 h-4" /> Add another
          </button>
        </PersonaSection>
        <PersonaSection title="Least Valued Features" helperText={HELPER.leastValuedFeatures}>
          {data.leastValuedFeatures.map((item, i) => (
            <div key={i} className="mb-2">
              <input type="text" value={item} onChange={(e) => updateList('leastValuedFeatures', i, e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          ))}
          <button type="button" onClick={() => addToList('leastValuedFeatures')} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="w-4 h-4" /> Add another
          </button>
        </PersonaSection>

        <h2 className="text-slate-700 font-semibold text-base border-b border-slate-200 pb-2 mt-10">Economic Indicators</h2>
        <PersonaSection title="Price Point" helperText="Willingness to pay, target CAC, and projected LTV for this persona.">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Willingness to Pay</label>
              <input type="text" value={data.willingnessToPay} onChange={(e) => update('willingnessToPay', e.target.value)} placeholder="e.g. $X/month or $Y/year" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Acquisition Cost (CAC)</label>
              <input type="text" value={data.cac} onChange={(e) => update('cac', e.target.value)} placeholder="Target cost to convert" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lifetime Value (LTV)</label>
              <input type="text" value={data.ltv} onChange={(e) => update('ltv', e.target.value)} placeholder="Projected total revenue" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800" />
            </div>
          </div>
        </PersonaSection>
      </main>
    </div>
  );
}
