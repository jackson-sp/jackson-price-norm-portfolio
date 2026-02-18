import content from '../data/content.json';

const Hero = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-norm-700 mb-6">
          {content.profile.headline}
        </h1>

        {/* Credentials */}
        <p className="text-base sm:text-lg text-slate-600 mb-6">
          {content.profile.intro[0]}
        </p>

        {/* Positioning statement */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Bridging strategic communications, product, and analytics to translate complex technical systems into clear strategy, positioning, and execution
        </p>
      </div>
    </section>
  );
};

export default Hero;
