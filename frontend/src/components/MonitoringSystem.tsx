
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, Bell, Zap } from 'lucide-react';

const MonitoringSystem = () => {
  const features = [
    {
      icon: Shield,
      title: 'Disease Prediction',
      description: 'AI-powered analysis to predict potential health issues before they become critical',
      status: 'Active'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: '24/7 continuous monitoring of temperature, humidity, air quality, and sound levels',
      status: 'Live'
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Instant notifications via SMS and app when environmental thresholds are exceeded',
      status: 'Enabled'
    },
    {
      icon: Zap,
      title: 'Automated Actions',
      description: 'Trigger ventilation, heating, or cooling systems based on sensor readings',
      status: 'Ready'
    }
  ];

  return (
    <section id="monitoring" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Advanced Monitoring System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protect your poultry investment with cutting-edge IoT sensors and AI-powered health analytics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <feature.icon className="h-8 w-8 text-green-600 mr-3" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {feature.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Early Disease Detection</h3>
              <p className="text-green-100 mb-6">
                Our AI algorithms analyze patterns in environmental data and poultry behavior to 
                predict potential health issues up to 48 hours before symptoms appear.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">87%</div>
                  <div className="text-sm text-green-100">Disease Prevention Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">$2,500</div>
                  <div className="text-sm text-green-100">Avg. Loss Prevention</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Common Alerts</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-sm">Temperature fluctuation detected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  <span className="text-sm">Abnormal sound patterns</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-sm">Humidity threshold exceeded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonitoringSystem;
