import { FileText } from 'lucide-react';

interface PortfolioCardProps {
  title: string;
  subheader: string;
  thumbnail: string;
  publication?: string;
  isExternal?: boolean; // keep for compatibility even if unused
  onClick: () => void;
  hideThumbnail?: boolean;
}

const PortfolioCard = ({
  title,
  subheader,
  thumbnail,
  publication,
  onClick,
  hideThumbnail,
}: PortfolioCardProps) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 ${
        hideThumbnail ? '' : 'h-full flex flex-col'
      }`}
      onClick={onClick}
    >
      {/* Only show thumbnail for non-press cards */}
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
                placeholder.className =
                  'placeholder-icon absolute inset-0 flex items-center justify-center';
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

      {/* Content */}
      {hideThumbnail ? (
        // PRESS: compact text-only
        <div className="p-4 min-h-[120px] flex flex-col">
          {publication && (
            <div className="font-semibold text-norm-800 text-sm leading-snug">
              {publication}
            </div>
          )}

          <div className="mt-1 text-sm text-norm-800 leading-snug">
            {title}
          </div>

          {subheader && (
            <div className="mt-auto pt-3 text-xs text-gray-500">
              {subheader}
            </div>
          )}
        </div>
      ) : (
        // DEFAULT: all other cards (no "View" CTA)
        <div className="p-5 flex-1 flex flex-col min-h-[110px]">
          <h3 className="text-lg font-semibold text-norm-800 mb-1 line-clamp-2">
            {title}
          </h3>
          {subheader && (
            <p className="text-sm text-gray-500 mb-0">{subheader}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioCard;