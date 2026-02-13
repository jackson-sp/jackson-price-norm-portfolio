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
    <section className="py-12">
      <PageContainer>
        <h2 className="text-2xl font-bold text-norm-500 mb-6 pb-2 border-b-2 border-norm-100">
          Document Templates
        </h2>
        <ResponsiveGrid>
          {generators.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-center gap-2 w-full min-h-[56px] px-6 py-5 bg-norm-500 text-white text-lg font-bold rounded-lg hover:bg-norm-600 transition-colors shadow-sm text-center"
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
