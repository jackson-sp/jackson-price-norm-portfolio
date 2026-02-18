import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import PageContainer from './layout/PageContainer';

type CaseStudy = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  result: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: 'amazon',
    title: "Expanding Amazon's retail operations in North America",
    problem:
      'Amazon Canada faced unsustainable tariff volatility with both the US and China. It needed a way to source retail inventory without passing on massive costs to Canadian consumers.',
    solution:
      'I worked with 10 cross-functional teams to launch a pilot of direct retail imports from Mexico to Canada.',
    result:
      'This new route is projected to move $250M of inventory, bypass US reciprocal tariffs, and deliver 10% landed cost savings.',
  },
  {
    id: 'waabi',
    title:
      'Launching a self-driving startup from industry newcomer to top-3 player',
    problem:
      "Waabi, a Canadian self-driving startup founded by AI icon Raquel Urtasun, emerged out of stealth amidst high public mistrust of AV. Headlines of incumbents' failures put the industry under a microscope. Waabi was a no-name newcomer that needed airtight storytelling to elevate into a trusted partner.",
    solution:
      "I owned the launch and positioning strategy for Waabi's $83.5M Series A fundraise and first several major product and partnership announcements.",
    result:
      'My storytelling brought Waabi to the industry forefront. It has since landed partnerships with NVIDIA and Volvo, and ultimately raised an additional $200M in 2024 and $750M in 2026.',
  },
  {
    id: 'firmly',
    title: "Defining an ecommerce startup's path to entering a new market",
    problem:
      'Firmly.ai, an ecommerce startup with Fortune 500 customers, had enterprise momentum but wanted to expand into higher-ed. The company approached MIT Sloan looking for student help to bring their technology into university ecosystems.',
    solution:
      "I conducted customer interviews and sourced potential retail partners to evaluate product-market fit. I also designed wireframes (using Figma) and delivered a PRD to Firmly's engineering team to create an MVP of a bespoke MIT-centric shopping hub.",
    result:
      'Firmly now has a clear GTM strategy to enter higher-ed and later expand beyond MIT.',
  },
  {
    id: 'mobility',
    title:
      'Turning a class project idea into a commercially-viable, patent pending product',
    problem:
      'I was the only MBA student in a team of engineers, designers, and data analysts. Our assignment was vague: solve a pain point related to moving heavy objects.',
    solution:
      'I led the team through 30+ customer interviews, product ideation and iteration, and user prototype testing until we converged on a single solution. I also built a thorough GTM/partnership strategy and pricing model.',
    result:
      'Our product won the class competition and we are working with IP attorneys to patent the invention.',
  },
];

export default function CaseStudies() {
  const [active, setActive] = useState<CaseStudy | null>(null);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  return (
    <section className="pt-10 pb-16">
      <PageContainer>
      <h2 className="text-2xl font-bold text-norm-700 mb-3 pb-2 border-b border-norm-200">
        Case Studies
      </h2>

      <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed max-w-5xl">
        Work samples include a global cross-functional launch, deep tech storytelling, GTM strategy, and end-to-end product development.
      </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {caseStudies.map((cs) => (
            <button
              key={cs.id}
              onClick={() => setActive(cs)}
              className="relative overflow-hidden flex items-center justify-center w-full min-h-[76px] px-6 py-3 bg-gradient-to-br from-norm-600 to-norm-800 text-white text-base font-medium rounded-xl shadow-md hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200 text-center ring-1 ring-white/10 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-t before:from-white/10 before:to-transparent before:pointer-events-none"
              >
              {cs.title}
            </button>
          ))}
        </div>
      </PageContainer>

      {active && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full rounded-xl shadow-xl">
            <div className="flex justify-between items-start px-6 py-4 border-b">
              <div className="pr-4">
                <h3 className="text-lg font-bold">{active.title}</h3>
              </div>
              <button onClick={() => setActive(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 text-sm text-gray-700 leading-relaxed">
              <p className="mb-4">
                <strong>Problem:</strong> {active.problem}
              </p>

              <p className="mb-4">
                <strong>Solution:</strong>{' '}
                {active.id === 'firmly' ? (
                  <>
                    {"I conducted customer interviews and sourced potential retail partners to evaluate product-market fit. I also designed wireframes (using Figma) and delivered a PRD to Firmly's engineering team to create an "}
                    <a
                      href="https://mit-marketplace.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-norm-600"
                    >
                      MVP of a bespoke MIT-centric shopping hub
                    </a>
                    {'.'}
                  </>
                ) : (
                  active.solution
                )}
              </p>

              <p className="mb-2">
                <strong>Result:</strong>{' '}
                {active.id === 'waabi' ? (
                  <>
                    {'My storytelling brought Waabi to the industry forefront. It has since landed partnerships with NVIDIA and Volvo, and ultimately raised an additional $200M in 2024 and '}
                    <a
                      href="https://waabi.ai/insights/waabi-secures-1-billion-in-new-funding-to-lead-physical-ai-revolution"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold text-norm-600"
                    >
                      $750M in 2026
                    </a>
                    {'.'}
                  </>
                ) : (
                  active.result
                )}
              </p>

              {active.id === 'firmly' && (
                <p className="text-xs text-gray-500 mt-4">
                  <span className="font-semibold">MVP username:</span> mituser
                  {' // '}
                  <span className="font-semibold">MVP password:</span> mit123
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
