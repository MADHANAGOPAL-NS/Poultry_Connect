import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, Volume2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLatestMeasurements } from '@/hooks/useMeasurements';

const DashboardPreview = () => {
  const { data: measurements, isLoading, error } = useLatestMeasurements();

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return Thermometer;
      case 'humidity':
        return Droplets;
      case 'air_quality':
        return Wind;
      case 'sound_level':
        return Volume2;
      default:
        return Thermometer;
    }
  };

  const getSensorColor = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return 'text-green-600';
      case 'humidity':
        return 'text-blue-600';
      case 'air_quality':
        return 'text-green-600';
      case 'sound_level':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatSensorLabel = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return 'Temperature';
      case 'humidity':
        return 'Humidity';
      case 'air_quality':
        return 'Air Quality';
      case 'sound_level':
        return 'Sound Level';
      default:
        return sensorType;
    }
  };

  const formatValue = (value: number, unit: string, sensorType: string) => {
    if (sensorType === 'air_quality') {
      // Convert numeric air quality to readable format
      if (value >= 80) return 'Excellent';
      if (value >= 60) return 'Good';
      if (value >= 40) return 'Fair';
      return 'Poor';
    }
    return `${value}${unit}`;
  };

  if (isLoading) {
    return (
      <section id="dashboard" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real-Time Monitoring Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant insights into your poultry environment with our IoT-powered monitoring system
            </p>
          </div>
          <div className="text-center">Loading sensor data...</div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
  }

  // Fallback data for demo purposes if no real data is available
  const fallbackData = [
    { sensor_type: 'temperature', value: 24, unit: '°C' },
    { sensor_type: 'humidity', value: 65, unit: '%' },
    { sensor_type: 'air_quality', value: 85, unit: '' },
    { sensor_type: 'sound_level', value: 42, unit: 'dB' },
  ];

  const displayData = measurements && measurements.length > 0 ? measurements : fallbackData;

  return (
    <section id="dashboard" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real-Time Monitoring Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant insights into your poultry environment with our IoT-powered monitoring system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayData.map((sensor, index) => {
            const SensorIcon = getSensorIcon(sensor.sensor_type);
            const sensorColor = getSensorColor(sensor.sensor_type);
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {formatSensorLabel(sensor.sensor_type)}
                  </CardTitle>
                  <SensorIcon className={`h-4 w-4 ${sensorColor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatValue(sensor.value, sensor.unit, sensor.sensor_type)}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Within normal range
                  </p>
                  {sensor.recorded_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {new Date(sensor.recorded_at).toLocaleTimeString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Health Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Health Score</span>
                  <span className="text-2xl font-bold text-green-600">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <div className="text-sm text-gray-500">
                  Based on environmental conditions and behavioral patterns
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <div className="text-sm font-medium">All systems normal</div>
                    <div className="text-xs text-gray-500">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <div className="text-sm font-medium">Humidity slightly elevated</div>
                    <div className="text-xs text-gray-500">1 hour ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
