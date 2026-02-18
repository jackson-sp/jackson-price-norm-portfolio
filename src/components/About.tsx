import PageContainer from './layout/PageContainer';

export default function About() {
  return (
    <section className="pt-4 pb-16">
      <PageContainer>
        <h2 className="text-2xl font-bold text-norm-700 mb-4 pb-2 border-b border-norm-200">
          About Me
        </h2>

        <div className="max-w-3x1 text-base sm:text-lg text-slate-700 leading-relaxed space-y-6">
          <p>
            I turned a liberal arts degree from Penn into a career leading strategic communications across GenAI, autonomous vehicles, logistics, Web3, and VC. Today, I'm a 2nd year MBA at MIT Sloan concentrating in Business Analytics and Product Management, and President of the MIT AI Club.
          </p>

          <p>
            I specialize in translating complex innovation into clear, compelling, and actionable strategies. My experience spans technical narrative, product development, analytics, AI, and GTM—always in highly cross-functional environments.
          </p>

          <p>
            Pre-MBA, I also had a side career as a professional drummer.
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
