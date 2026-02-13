import { useState, useEffect, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Plus } from 'lucide-react';
import {
  type BattlecardData,
  initialBattlecardData,
  saveDraft,
  clearDraft,
} from '../types/battlecard';
import { StarRating } from '../components/battlecard/StarRating';
import { generateBattlecardPdf } from '../lib/battlecardPdf';

const AUTO_SAVE_INTERVAL_MS = 30_000;

function BattlecardSection({
  number,
  title,
  instruction,
  children,
}: {
  number: number;
  title: string;
  instruction?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 h-full flex flex-col overflow-hidden">
      <h2 className="text-slate-800 font-semibold text-lg mb-1 flex items-center gap-2">
        {number > 0 && (
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white text-sm font-bold shrink-0">
            {number}
          </span>
        )}
        {title}
      </h2>
      {instruction && (
        <p className="text-sm text-slate-600 mb-4 mt-0">{instruction}</p>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}

export default function BattlecardGenerator() {
  const [data, setData] = useState<BattlecardData>(() => initialBattlecardData);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Scroll to top and reset form on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    setData(initialBattlecardData);
    clearDraft();
  }, []);

  const persist = useCallback(() => {
    saveDraft(data);
  }, [data]);

  useEffect(() => {
    const id = setInterval(persist, AUTO_SAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [persist]);

  const update = useCallback(<K extends keyof BattlecardData>(section: K, updates: Partial<BattlecardData[K]>) => {
    setData((prev) => {
      const current = prev[section];
      const next =
        current !== null && typeof current === 'object' && !Array.isArray(current)
          ? { ...current, ...updates }
          : updates;
      return { ...prev, [section]: next };
    });
  }, []);

  const updateOverview = (updates: Partial<BattlecardData['overview']>) => update('overview', updates);
  const updateTopFeature = (index: 0 | 1 | 2, value: string) => {
    setData((prev) => {
      const next = [...prev.overview.topFeatures];
      next[index] = value;
      return { ...prev, overview: { ...prev.overview, topFeatures: next as [string, string, string] } };
    });
  };

  const updateDifferentiators = (updates: Partial<BattlecardData['differentiators']>) =>
    update('differentiators', updates);
  const updateRating = (
    metric: keyof BattlecardData['differentiators']['ratings'],
    column: 'you' | 'comp1' | 'comp2',
    value: number
  ) => {
    setData((prev) => ({
      ...prev,
      differentiators: {
        ...prev.differentiators,
        ratings: {
          ...prev.differentiators.ratings,
          [metric]: { ...prev.differentiators.ratings[metric], [column]: value },
        },
      },
    }));
  };

  const updateWhyWeWin = (index: 0 | 1 | 2, value: string) => {
    setData((prev) => {
      const next = [...prev.whyWeWin];
      next[index] = value;
      return { ...prev, whyWeWin: next as [string, string, string] };
    });
  };

  const updateObjection = (index: number, field: 'objection' | 'response', value: string) => {
    setData((prev) => ({
      ...prev,
      objections: prev.objections.map((o, i) =>
        i === index ? { ...o, [field]: value } : o
      ),
    }));
  };

  const addObjection = () => {
    setData((prev) => ({
      ...prev,
      objections: [...prev.objections, { objection: '', response: '' }],
    }));
  };

  const updatePainPoint = (index: number, value: string) => {
    setData((prev) => {
      const next = [...prev.painPoints];
      next[index] = value;
      return { ...prev, painPoints: next };
    });
  };

  const addPainPoint = () => {
    setData((prev) => ({
      ...prev,
      painPoints: [...prev.painPoints, ''],
    }));
  };

  const updateKeyFeature = (
    index: 0 | 1 | 2,
    field: 'name' | 'description',
    value: string
  ) => {
    setData((prev) => {
      const next = prev.keyFeatures.map((f, i) =>
        i === index ? { ...f, [field]: value } : f
      ) as BattlecardData['keyFeatures'];
      return { ...prev, keyFeatures: next };
    });
  };

  const updateQuestion = (index: 0 | 1 | 2, value: string) => {
    setData((prev) => {
      const next = [...prev.questionsToAsk];
      next[index] = value;
      return { ...prev, questionsToAsk: next as [string, string, string] };
    });
  };

  const updatePricing = (
    who: 'you' | 'comp1' | 'comp2',
    period: 'monthly' | 'annual',
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [who]: { ...prev.pricing[who], [period]: value },
      },
    }));
  };

  const handleClear = () => {
    if (window.confirm('Clear the entire form and start over? This cannot be undone.')) {
      setData(initialBattlecardData);
      clearDraft();
      setValidationErrors([]);
    }
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!data.overview.companyDescription.trim()) errs.push('Overview: Company/product description is required.');
    if (!data.overview.audience.trim()) errs.push('Overview: Audience is required.');
    setValidationErrors(errs);
    return errs.length === 0;
  };

  const handleExportPdf = () => {
    if (!validate()) return;
    generateBattlecardPdf(data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold text-slate-800">Sales Battlecard Generator</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Clear Form
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
        {validationErrors.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 pb-3">
            <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3">
              <p className="font-medium mb-1">Please fix the following:</p>
              <ul className="list-disc list-inside">
                {validationErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Your Name (numberless) */}
        <div className="mb-6">
          <BattlecardSection number={0} title="Your Name">
            <input
              type="text"
              value={data.yourName}
              onChange={(e) => setData((prev) => ({ ...prev, yourName: e.target.value }))}
              className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </BattlecardSection>
        </div>

        {/* Row 1: Overview | Key Differentiators | Why We Win */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <BattlecardSection
            number={1}
            title="Overview"
            instruction="Brief description of your company, product (incl. very top-level overview of 1-3 features) and audience."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company / product description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={data.overview.companyDescription}
                  onChange={(e) => updateOverview({ companyDescription: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Brief description of your company or product..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Audience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.overview.audience}
                  onChange={(e) => updateOverview({ audience: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. SMB sales leaders, enterprise procurement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Top 1–3 features</label>
                {([0, 1, 2] as const).map((i) => (
                  <input
                    key={i}
                    type="text"
                    value={data.overview.topFeatures[i]}
                    onChange={(e) => updateTopFeature(i, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mt-2 first:mt-0"
                    placeholder={`Feature ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </BattlecardSection>

          <BattlecardSection
            number={2}
            title="Key Differentiators"
            instruction="How do you fare against the competition? Why should people choose you over them?"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Competitor 1 name</label>
                  <input
                    type="text"
                    value={data.differentiators.competitor1}
                    onChange={(e) => updateDifferentiators({ competitor1: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Competitor 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Competitor 2 name</label>
                  <input
                    type="text"
                    value={data.differentiators.competitor2}
                    onChange={(e) => updateDifferentiators({ competitor2: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Competitor 2"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
              <div className="grid grid-cols-[minmax(80px,1fr)_repeat(3,minmax(100px,1fr))] gap-x-5 gap-y-0 text-sm">
                <div className="py-2 font-medium text-slate-700 border-b border-slate-200">Metric</div>
                <div className="py-2 font-medium text-slate-700 border-b border-slate-200 flex justify-center">You</div>
                <div className="py-2 font-medium text-slate-700 border-b border-slate-200 flex justify-center">
                  {data.differentiators.competitor1 || 'Comp #1'}
                </div>
                <div className="py-2 font-medium text-slate-700 border-b border-slate-200 flex justify-center">
                  {data.differentiators.competitor2 || 'Comp #2'}
                </div>
                {(
                  [
                    ['price', 'Price'],
                    ['speed', 'Speed'],
                    ['support', 'Support'],
                    ['security', 'Security'],
                    ['apps', 'Apps'],
                  ] as const
                ).map(([key, label]) => (
                  <Fragment key={key}>
                    <div className="py-3 text-slate-600 border-b border-slate-100">{label}</div>
                    <div className="py-3 border-b border-slate-100 flex justify-center">
                      <StarRating
                        value={data.differentiators.ratings[key].you}
                        onChange={(v) => updateRating(key, 'you', v)}
                        size="sm"
                      />
                    </div>
                    <div className="py-3 border-b border-slate-100 flex justify-center">
                      <StarRating
                        value={data.differentiators.ratings[key].comp1}
                        onChange={(v) => updateRating(key, 'comp1', v)}
                        size="sm"
                      />
                    </div>
                    <div className="py-3 border-b border-slate-100 flex justify-center">
                      <StarRating
                        value={data.differentiators.ratings[key].comp2}
                        onChange={(v) => updateRating(key, 'comp2', v)}
                        size="sm"
                      />
                    </div>
                  </Fragment>
                ))}
              </div>
              </div>
            </div>
          </BattlecardSection>

          <BattlecardSection
            number={3}
            title="Why We Win"
            instruction="How does your product benefit others? And where have you won in the past? Back each benefit up with proof."
          >
            {([0, 1, 2] as const).map((i) => (
              <input
                key={i}
                type="text"
                value={data.whyWeWin[i]}
                onChange={(e) => updateWhyWeWin(i, e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mt-2 first:mt-0"
                placeholder={`Benefit ${i + 1} with proof`}
              />
            ))}
          </BattlecardSection>
        </div>

        {/* Row 2: Customer Pain Points | Handling Objections (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BattlecardSection
            number={4}
            title="Customer Pain Points"
            instruction="Why do people buy your product? Example: vulnerable to data breaches, outdated email marketing solutions, unable to self-sufficiently conduct market research, etc."
          >
            {data.painPoints.map((point, i) => (
              <div key={i} className="mb-3">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updatePainPoint(i, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Example: vulnerable to data breaches, outdated email marketing solutions, unable to self-sufficiently conduct market research, etc."
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addPainPoint}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" /> Add another
            </button>
          </BattlecardSection>

          <BattlecardSection
            number={5}
            title="Handling Objections"
            instruction="What common objections do you face? And how can a sales rep constructively respond to these in a way that keeps the pitch on track?"
          >
            {data.objections.map((o, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 mt-4 first:mt-0 space-y-2">
                <input
                  type="text"
                  value={o.objection}
                  onChange={(e) => updateObjection(i, 'objection', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 text-sm"
                  placeholder="Objection"
                />
                <input
                  type="text"
                  value={o.response}
                  onChange={(e) => updateObjection(i, 'response', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 text-sm"
                  placeholder="Response"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addObjection}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
            >
              <Plus className="w-4 h-4" /> Add another
            </button>
          </BattlecardSection>
        </div>

        {/* Row 3: Key Features | Questions to Ask | Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <BattlecardSection
            number={6}
            title="Key Features"
            instruction="How does your product address all of the customer's pain points?"
          >
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="mt-4 first:mt-0 space-y-2">
                <input
                  type="text"
                  value={data.keyFeatures[i].name}
                  onChange={(e) => updateKeyFeature(i, 'name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-medium"
                  placeholder="Feature name"
                />
                <input
                  type="text"
                  value={data.keyFeatures[i].description}
                  onChange={(e) => updateKeyFeature(i, 'description', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 text-sm"
                  placeholder="Description / benefit"
                />
              </div>
            ))}
          </BattlecardSection>

          <BattlecardSection
            number={7}
            title="Questions to Ask"
            instruction="List two or three questions your reps can ask to best position your product."
          >
            {([0, 1, 2] as const).map((i) => (
              <input
                key={i}
                type="text"
                value={data.questionsToAsk[i]}
                onChange={(e) => updateQuestion(i, e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mt-2 first:mt-0"
                placeholder={`Strategic question ${i + 1}`}
              />
            ))}
          </BattlecardSection>

          <BattlecardSection
            number={8}
            title="Pricing"
            instruction="An overview of your pricing, plus how it compares to your competitors'."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-medium text-slate-700"></th>
                    <th className="text-left py-2 pr-4 font-medium text-slate-700">Monthly</th>
                    <th className="text-left py-2 font-medium text-slate-700">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-700">You</td>
                    <td className="py-2 pr-4">
                      <input
                        type="text"
                        value={data.pricing.you.monthly}
                        onChange={(e) => updatePricing('you', 'monthly', e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                        placeholder="—"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={data.pricing.you.annual}
                        onChange={(e) => updatePricing('you', 'annual', e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                        placeholder="—"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-700">{data.differentiators.competitor1 || 'Comp #1'}</td>
                    <td className="py-2 pr-4">
                      <input
                        type="text"
                        value={data.pricing.comp1.monthly}
                        onChange={(e) => updatePricing('comp1', 'monthly', e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={data.pricing.comp1.annual}
                        onChange={(e) => updatePricing('comp1', 'annual', e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-700">{data.differentiators.competitor2 || 'Comp #2'}</td>
                    <td className="py-2 pr-4">
                      <input
                        type="text"
                        value={data.pricing.comp2.monthly}
                        onChange={(e) => updatePricing('comp2', 'monthly', e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={data.pricing.comp2.annual}
                        onChange={(e) => updatePricing('comp2', 'annual', e.target.value)}
                        className="w-full rounded border border-slate-300 px-2 py-1.5 text-slate-800"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </BattlecardSection>
        </div>

        {/* Row 4: Quick Tips | Third-Party Validation | Relevant Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <BattlecardSection
            number={9}
            title="Quick Tips"
            instruction="How can your sales reps get the most out of the opportunity? Example: Find out what their current solution is early on, ask how many contacts they have, discover what their goals are, etc."
          >
            <textarea
              value={data.quickTips}
              onChange={(e) => setData((prev) => ({ ...prev, quickTips: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Sales tips and reminders..."
            />
          </BattlecardSection>

          <BattlecardSection
            number={10}
            title="Third-Party Validation"
            instruction={"Do you have any reputable accreditations or endorsements? What do existing customers say about you? Example: \"We're a Gartner-recommended company\", \"Customer X took out our service and saw Y return in Z months\", etc."}
          >
            <textarea
              value={data.thirdPartyValidation}
              onChange={(e) => setData((prev) => ({ ...prev, thirdPartyValidation: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Accreditations, endorsements, certifications..."
            />
          </BattlecardSection>

          <BattlecardSection
            number={11}
            title="Relevant Customers"
            instruction={"Which customers do you already have that they're likely to relate to? Well-known brands are great for this but remember, if you're targeting an SME they're more likely to relate to other SMEs over Fortune 500 companies."}
          >
            <textarea
              value={data.relevantCustomers}
              onChange={(e) => setData((prev) => ({ ...prev, relevantCustomers: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Customer names, segments, or use case types..."
            />
          </BattlecardSection>
        </div>

        {/* Row 5: Additional Resources (full width) - single text block */}
        <div className="mb-6">
          <BattlecardSection
            number={12}
            title="Additional Resources"
            instruction="Refer people to relevant documents (personas, use cases, FAQs)."
          >
            <textarea
              value={data.additionalResources.content}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  additionalResources: { ...prev.additionalResources, content: e.target.value },
                }))
              }
              placeholder="URL or text"
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[8rem] resize-y"
            />
          </BattlecardSection>
        </div>
      </main>
    </div>
  );
}
