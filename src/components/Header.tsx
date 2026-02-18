import { Link } from 'react-router-dom';
import { FileText, Mail, Linkedin } from 'lucide-react';
import content from '../data/content.json';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold tracking-tight text-norm-800 hover:text-norm-700 transition-colors">
            Jackson Price
          </Link>
        </div>
          <div className="flex items-center gap-4">
            <a
              href="/Jackson Price Resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-norm-700 hover:bg-slate-50 transition"
              >
              <FileText className="w-5 h-5" />
              Resume
            </a>
            <a
              href={content.profile.email}
              className="text-norm-700 hover:text-norm-800 transition-colors rounded-lg p-2.5 hover:bg-slate-100"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={content.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-norm-700 hover:text-norm-800 transition-colors rounded-lg p-2.5 hover:bg-slate-100"
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
