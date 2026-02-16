import content from '../data/content.json';

const Hero = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-norm-700 mb-6">
          {content.profile.headline}
        </h1>
        {content.profile.intro.map((line, index) => (
          <p
            key={index}
            className={`text-base sm:text-lg text-gray-600 ${
              index === 0 ? 'mb-2' : ''
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
};

export default Hero;
