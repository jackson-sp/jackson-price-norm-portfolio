import content from '../data/content.json';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-gray-500">
          {content.profile.name} &middot;{' '}
          <a
            href={content.profile.email}
            className="text-norm-500 hover:text-norm-600 transition-colors"
          >
            jprice26@mit.edu
          </a>{' '}
          &middot;{' '}
          <a
            href={content.profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-norm-500 hover:text-norm-600 transition-colors"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
