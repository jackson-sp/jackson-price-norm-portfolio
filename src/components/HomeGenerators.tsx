import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageContainer from './layout/PageContainer';
import ResponsiveGrid from './layout/ResponsiveGrid';

const generators = [
  { to: '/battlecard', label: 'Sales Battlecard Generator' },
  { to: '/playbook', label: 'Messaging Playbook Generator' },
  { to: '/persona', label: 'Persona Card Generator' },
] as const;

export default function HomeGenerators() {
  return (
    <section className="pt-4 pb-12">
      <PageContainer>
        <h2 className="text-2xl font-bold text-norm-700 mb-3 pb-2 border-b border-norm-200">
          Product Marketing & GTM Templates
        </h2>

        <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed max-w-5xl">
        AI-enhanced tools to accelerate Sales, Marketing, and GTM asset creation.
        </p>
        <ResponsiveGrid>
          {generators.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative overflow-hidden flex items-center justify-center w-full min-h-[76px] px-6 py-3 bg-gradient-to-br from-norm-600 to-norm-800 text-white text-base font-medium rounded-xl shadow-md hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200 text-center ring-1 ring-white/10 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-t before:from-white/10 before:to-transparent before:pointer-events-none"
              >
              <span className="truncate">{label}</span>
              <ChevronRight className="w-5 h-5 shrink-0" />
            </Link>
          ))}
        </ResponsiveGrid>
      </PageContainer>
    </section>
  );
}
