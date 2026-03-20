import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Thermometer, Droplets, Wind, Volume2, Activity, Loader2 } from 'lucide-react';

interface SensorInputs {
  temperature: string;
  humidity: string;
  ammonia: string;
  co2: string;
  sound: string;
  movement: string;
}

interface PredictionFormProps {
  inputs: SensorInputs;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onPredict: () => void;
}

const PredictionForm = ({ inputs, isLoading, onInputChange, onPredict }: PredictionFormProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Sensor Readings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-destructive" />
              Temperature (°C)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 28.5"
              value={inputs.temperature}
              onChange={(e) => onInputChange('temperature', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Humidity (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 65"
              value={inputs.humidity}
              onChange={(e) => onInputChange('humidity', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-orange-500" />
              Ammonia (ppm)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12"
              value={inputs.ammonia}
              onChange={(e) => onInputChange('ammonia', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              CO₂ (ppm)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.co2}
              onChange={(e) => onInputChange('co2', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-purple-500" />
              Sound Level (dB)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 55"
              value={inputs.sound}
              onChange={(e) => onInputChange('sound', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Bird Movement (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 70"
              value={inputs.movement}
              onChange={(e) => onInputChange('movement', e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          onClick={onPredict} 
          disabled={isLoading}
          className="w-full mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Predict Health Status
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
