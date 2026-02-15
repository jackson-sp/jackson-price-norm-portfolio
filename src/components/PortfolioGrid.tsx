import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioCard from './PortfolioCard';
import PDFModal from './PDFModal';
import PageContainer from './layout/PageContainer';
import ResponsiveGrid from './layout/ResponsiveGrid';
import content from '../data/content.json';

interface PortfolioItem {
  id: string;
  title: string;
  subheader: string;
  file?: string;
  thumbnail: string;
  externalUrl?: string;
  route?: string;
}

const PortfolioGrid = () => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const navigate = useNavigate();

  const handleItemClick = (item: PortfolioItem) => {
    if (item.route) {
      navigate(item.route);
      return;
    }
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (item.file) {
      setSelectedItem(item);
    }
  };

  return (
    <section className="pb-8">
      <PageContainer>
      {content.categories.map((category, idx) => (
  <div
    key={category.id}
    className={idx === content.categories.length - 1 ? 'mb-0' : 'mb-12'}
  >
            <h2 className="text-2xl font-bold text-norm-500 mb-6 pb-2 border-b-2 border-norm-100">
              {category.title}
            </h2>
            <ResponsiveGrid>
              {category.items.map((item: PortfolioItem) => (
                <PortfolioCard
                  key={item.id}
                  title={item.title}
                  subheader={item.subheader}
                  thumbnail={
                    item.id === 'enterprise-blockchain'
                      ? '/portfolio-assets/benchmark-reports/casper-labs.png'
                      : item.thumbnail
                  }
                  isExternal={!!item.externalUrl || !!item.route}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </ResponsiveGrid>
          </div>
        ))}
      </PageContainer>

      {selectedItem && selectedItem.file && (
        <PDFModal
          file={encodeURI(selectedItem.file)}
          title={selectedItem.title}
          onClose={() => setSelectedItem(null)}
        />

      )}
    </section>
  );
};

export default PortfolioGrid;
