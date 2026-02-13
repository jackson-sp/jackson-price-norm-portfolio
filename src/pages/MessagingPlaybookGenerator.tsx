import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Plus } from 'lucide-react';
import type { PlaybookData, OutcomePillar } from '../types/playbook';
import { initialPlaybookData } from '../types/playbook';
import { generatePlaybookPdf } from '../lib/playbookPdf';

const HELPER_TEXT = {
  valueProposition:
    "Your core value prop is what often shows up on homepage headlines and is a clear, succinct statement of the unique value you offer customers. This should be closely tied to your positioning and have one, clear focal point. Length-wise, you're looking at around 10-15 words.",
  audience:
    "A brief background on the profile of the persona you're targeting - note the emphasis on brief. Think about things like their personality, responsibilities, title, and role in the buying process.",
  elevatorPitch:
    "1 - 2 sentences that incorporate your value proposition. What do you bring to the table that others don't? captures emotions and the top 1-2 value points. Squeeze in a word or two about target market.",
  longDescription:
    "100-200 words. Include value points, product/feature details, headline benefits, target market, and proof points (awards/stats). Tip: KISS, stay away from jargon, use Hemingway app for readability.",
  toneOfVoice:
    "3-4 adjectives that describe your ideal voice (Formal? Conversational? Punchy?). Include before/after examples.",
  outcomes:
    'What outcomes are possible because of your product/solution? List as simple, concise bullet points.',
  customerRequirements:
    'What 1-2 things are crucial to your persona to convert? Keep this short and specific.',
  pillar: {
    painPoints: 'What problem(s) does this value pillar solve?',
    productBenefits:
      'How well does your product resolve those pain points? (3-5 bullet points).',
    productDetails:
      'Which parts of your product are responsible for those benefits? How do they make you unique?',
    proofPoints:
      "Back-up with a snapshot of a real-life case study (e.g., 'Within 8 weeks...').",
  },
};

const PILLAR_ROW_LABELS = [
  'Pain points',
  'Product/feature benefits',
  'Product/feature details',
  'Proof points',
] as const;
const PILLAR_ROW_KEYS: (keyof OutcomePillar)[] = [
  'painPoints',
  'productBenefits',
  'productDetails',
  'proofPoints',
];

function PlaybookSection({
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

export default function MessagingPlaybookGenerator() {
  const [data, setData] = useState<PlaybookData>(() => initialPlaybookData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const update = <K extends keyof PlaybookData>(key: K, value: PlaybookData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateOutcome = (index: number, value: string) => {
    setData((prev) => {
      const next = [...prev.outcomes];
      next[index] = value;
      return { ...prev, outcomes: next };
    });
  };

  const addOutcome = () => {
    setData((prev) => ({ ...prev, outcomes: [...prev.outcomes, ''] }));
  };

  const updateCustomerRequirement = (index: number, value: string) => {
    setData((prev) => {
      const next = [...prev.customerRequirements];
      next[index] = value;
      return { ...prev, customerRequirements: next };
    });
  };

  const addCustomerRequirement = () => {
    if (data.customerRequirements.length >= 2) return;
    setData((prev) => ({
      ...prev,
      customerRequirements: [...prev.customerRequirements, ''],
    }));
  };

  const updatePillar = (colIndex: 0 | 1 | 2, field: keyof OutcomePillar, value: string) => {
    setData((prev) => {
      const next = [...prev.pillars] as [OutcomePillar, OutcomePillar, OutcomePillar];
      next[colIndex] = { ...next[colIndex], [field]: value };
      return { ...prev, pillars: next };
    });
  };

  const handleExportPdf = () => {
    generatePlaybookPdf(data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">Messaging Playbook Generator</h1>
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <PlaybookSection title="Your Company Name" helperText="Name for the document title.">
          <input
            type="text"
            value={data.yourName}
            onChange={(e) => update('yourName', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PlaybookSection>

        <PlaybookSection title="Value Proposition" helperText={HELPER_TEXT.valueProposition}>
          <textarea
            value={data.valueProposition}
            onChange={(e) => update('valueProposition', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PlaybookSection>

        <PlaybookSection title="Audience" helperText={HELPER_TEXT.audience}>
          <textarea
            value={data.audience}
            onChange={(e) => update('audience', e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PlaybookSection>

        <PlaybookSection title="Elevator Pitch" helperText={HELPER_TEXT.elevatorPitch}>
          <textarea
            value={data.elevatorPitch}
            onChange={(e) => update('elevatorPitch', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PlaybookSection>

        <PlaybookSection title="Long Description" helperText={HELPER_TEXT.longDescription}>
          <textarea
            value={data.longDescription}
            onChange={(e) => update('longDescription', e.target.value)}
            rows={8}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PlaybookSection>

        <PlaybookSection title="Tone of Voice" helperText={HELPER_TEXT.toneOfVoice}>
          <textarea
            value={data.toneOfVoice}
            onChange={(e) => update('toneOfVoice', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
          />
        </PlaybookSection>

        <PlaybookSection title="Outcomes" helperText={HELPER_TEXT.outcomes}>
          {data.outcomes.map((item, i) => (
            <div key={i} className="mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateOutcome(i, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addOutcome}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Add another
          </button>
        </PlaybookSection>

        <PlaybookSection title="Customer Requirements" helperText={HELPER_TEXT.customerRequirements}>
          {data.customerRequirements.map((item, i) => (
            <div key={i} className="mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateCustomerRequirement(i, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
              />
            </div>
          ))}
          {data.customerRequirements.length < 2 && (
            <button
              type="button"
              onClick={addCustomerRequirement}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" /> Add another
            </button>
          )}
        </PlaybookSection>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 overflow-x-auto min-h-[420px]">
          <h2 className="text-slate-800 font-semibold text-lg mb-2">Outcome Pillars</h2>
          <p className="text-sm text-slate-600 mb-4">
            Complete each row for Pillar 1, 2, and 3.
          </p>
          <table className="w-full border-collapse border border-slate-300 text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-sm font-semibold text-slate-700 w-48">
                  {' '}
                </th>
                <th className="border border-slate-300 p-2 text-sm font-semibold text-slate-700">
                  Pillar 1
                </th>
                <th className="border border-slate-300 p-2 text-sm font-semibold text-slate-700">
                  Pillar 2
                </th>
                <th className="border border-slate-300 p-2 text-sm font-semibold text-slate-700">
                  Pillar 3
                </th>
              </tr>
            </thead>
            <tbody>
              {PILLAR_ROW_LABELS.map((label, rowIndex) => (
                <tr key={label}>
                  <td className="border border-slate-300 p-2 text-sm font-medium text-slate-700 align-top bg-slate-50">
                    <span className="block">{label}</span>
                    <p className="text-xs text-slate-500 mt-1 font-normal">
                      {HELPER_TEXT.pillar[PILLAR_ROW_KEYS[rowIndex]]}
                    </p>
                  </td>
                  {([0, 1, 2] as const).map((colIndex) => (
                    <td key={colIndex} className="border border-slate-300 p-2 align-top">
                      <textarea
                        value={data.pillars[colIndex][PILLAR_ROW_KEYS[rowIndex]]}
                        onChange={(e) =>
                          updatePillar(colIndex, PILLAR_ROW_KEYS[rowIndex], e.target.value)
                        }
                        rows={rowIndex === 0 || rowIndex === 3 ? 3 : 6}
                        className="w-full min-w-[140px] min-h-[4.5rem] px-2 py-1.5 rounded border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
