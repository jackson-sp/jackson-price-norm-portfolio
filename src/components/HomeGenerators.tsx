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
        <h2 className="text-2xl font-bold text-norm-700 mb-6 pb-2 border-b-2 border-norm-100">
          Product Marketing & GTM Templates
        </h2>
        <ResponsiveGrid>
          {generators.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative overflow-hidden flex items-center justify-center gap-2 w-full min-h-[56px] px-6 py-5 bg-gradient-to-br from-norm-600 to-norm-800 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-[1px] transition-all duration-200 text-center ring-1 ring-white/10 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-t before:from-white/10 before:to-transparent before:pointer-events-none"
              >
              <span className="truncate">{label}</span>
              <ChevronRight className="w-5 h-5 shrink-0" />
            </Link>
          ))}
        </ResponsiveGrid>
        <div className="border-t border-slate-200 w-full mt-6" />
      </PageContainer>
    </section>
  );
}
