import content from '../data/content.json';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
      <div className="text-sm text-gray-500 space-y-1">
      <p className="font-semibold text-norm-700">
        {content.profile.name}
      </p>
        <p>
          <a
            href={content.profile.email}
            className="text-norm-600 hover:text-norm-800 transition-colors"
          >
            jprice26@mit.edu
          </a>{' '}
          •{' '}
          <a
            href={content.profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-norm-600 hover:text-norm-800 transition-colors"
          >
            LinkedIn
          </a>
        </p>
      </div>

      </div>
    </footer>
  );
};

export default Footer;
