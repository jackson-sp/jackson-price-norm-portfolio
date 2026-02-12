import { useState } from 'react';
import PortfolioCard from './PortfolioCard';
import PDFModal from './PDFModal';
import content from '../data/content.json';

interface PortfolioItem {
  id: string;
  title: string;
  subheader: string;
  file: string;
  thumbnail: string;
  externalUrl?: string;
}

const PortfolioGrid = () => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const handleItemClick = (item: PortfolioItem) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {content.categories.map((category) => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl font-bold text-norm-500 mb-6 pb-2 border-b-2 border-norm-100">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item: PortfolioItem) => (
                <PortfolioCard
                  key={item.id}
                  title={item.title}
                  subheader={item.subheader}
                  thumbnail={item.thumbnail}
                  isExternal={!!item.externalUrl}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <PDFModal
          file={selectedItem.file}
          title={selectedItem.title}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
};

export default PortfolioGrid;
