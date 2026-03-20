
import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Smart Poultry Management for 
              <span className="text-green-600"> Modern Farmers</span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              Monitor your poultry health in real-time with IoT sensors, predict diseases before they spread, 
              and connect directly with buyers through our integrated marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Start Monitoring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">24°C</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">65%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">Normal</div>
                  <div className="text-sm text-gray-600">Air Quality</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">42dB</div>
                  <div className="text-sm text-gray-600">Sound Level</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-green-600 font-semibold">✓ All Systems Healthy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
