import { Link } from 'react-router-dom';
import { Mail, Linkedin } from 'lucide-react';
import content from '../data/content.json';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-800">
                Jackson Price for
              </span>
              <img
                src="/Norm logo/normai.jpeg"
                alt="Norm AI"
                className="h-8 rounded"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={content.profile.email}
              className="text-gray-500 hover:text-norm-500 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={content.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-norm-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
