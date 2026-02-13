import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

const stages = [
  {
    number: 1,
    tool: 'Claude Project',
    label: 'Create knowledge base',
    bullets: [],
  },
  {
    number: 2,
    tool: 'Claude Chat',
    label: 'Set up tooling & draft initial PRD',
    bullets: [],
  },
  {
    number: 3,
    tool: 'Lovable',
    label: 'Generate V1 prototype',
    bullets: [],
  },
  {
    number: 4,
    tool: 'Claude Code in VS Code',
    label: 'Build & refine full site',
    bullets: ['Alternate with ChatGPT and Cursor when credits run out'],
  },
  {
    number: 5,
    tool: 'GitHub',
    label: 'Store & back up code',
    bullets: [],
  },
  {
    number: 6,
    tool: 'Vercel',
    label: 'Deploy site',
    bullets: [],
  },
];

const Workflow = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <>
      <div className="flex justify-center py-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-norm-500 text-white font-medium rounded-lg hover:bg-norm-600 transition-colors shadow-sm"
        >
          How I Created This Site
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-norm-500">How I Created This Site</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Stages */}
            <div className="p-6 sm:p-8">
              {stages.map((stage, index) => (
                <div
                  key={stage.number}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-4 items-start">
                    {/* Number circle */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-norm-500 text-white flex items-center justify-center font-bold text-sm">
                      {stage.number}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-semibold text-norm-500">{stage.tool}</span>
                        <span className="text-sm text-gray-500">- {stage.label}</span>
                      </div>
                      {stage.bullets.length > 0 && (
                        <ul className="space-y-1 mb-2">
                          {stage.bullets.map((bullet, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Arrow between stages */}
                  {index < stages.length - 1 && (
                    <div className="flex justify-center py-2 ml-5">
                      <ChevronDown className="w-5 h-5 text-norm-400 animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Workflow;
