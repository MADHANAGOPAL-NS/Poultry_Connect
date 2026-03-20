import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MonitoringSystem from '@/components/MonitoringSystem';
import Marketplace from '@/components/Marketplace';
import HealthPredictor from '@/components/HealthPredictor/index';
import PredictionCriteria from '@/components/PredictionCriteria';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import AlertsBanner from '@/components/AlertsBanner';

const Index = () => {
  return (
    <div className="min-h-screen">
      <AlertsBanner />
      <Header />
      <HeroSection />
      <MonitoringSystem />
      <HealthPredictor hideHistory={true} />
      <PredictionCriteria />
      <Marketplace />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
