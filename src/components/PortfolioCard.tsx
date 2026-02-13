import { FileText, ExternalLink } from 'lucide-react';

interface PortfolioCardProps {
  title: string;
  subheader: string;
  thumbnail: string;
  isExternal?: boolean;
  onClick: () => void;
  hideThumbnail?: boolean;
}

const PortfolioCard = ({ title, subheader, thumbnail, isExternal, onClick, hideThumbnail }: PortfolioCardProps) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden h-full flex flex-col border border-gray-100"
      onClick={onClick}
    >
      {!hideThumbnail && (
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.placeholder-icon')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-icon absolute inset-0 flex items-center justify-center';
                placeholder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;
                parent.appendChild(placeholder);
              }
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
        </div>
      )}
      <div className={`p-5 flex-1 flex flex-col ${hideThumbnail ? 'min-h-0' : 'min-h-[120px]'}`}>
        <h3 className="text-lg font-semibold text-norm-500 mb-1 line-clamp-2">
          {title}
        </h3>
        {subheader && (
          <p className="text-sm text-gray-500 mb-4">{subheader}</p>
        )}
        <div className="mt-auto">
          <span className="inline-flex items-center text-sm font-medium text-accent hover:text-norm-500 transition-colors">
            View
            {isExternal ? (
              <ExternalLink className="w-4 h-4 ml-1" />
            ) : (
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
