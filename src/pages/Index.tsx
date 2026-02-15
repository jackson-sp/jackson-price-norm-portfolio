import Header from '../components/Header';
import Hero from '../components/Hero';
import CaseStudies from '../components/CaseStudies';
import HomeGenerators from '../components/HomeGenerators';
import PortfolioGrid from '../components/PortfolioGrid';
import Workflow from '../components/Workflow';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <Hero />
        <CaseStudies />
        <PortfolioGrid />
        <HomeGenerators />
        <Workflow />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
