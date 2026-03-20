import { useState } from 'react';
import { Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { predictHealth, type Prediction } from '@/lib/predictionEngine';
import PredictionForm from './PredictionForm';
import PredictionResults from './PredictionResults';
import PredictionHistory from './PredictionHistory';

const HealthPredictor = ({ hideHistory = false }: { hideHistory?: boolean }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [inputs, setInputs] = useState({
    temperature: '',
    humidity: '',
    ammonia: '',
    co2: '',
    sound: '',
    movement: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const savePrediction = async (pred: Prediction) => {
    if (!user) return null;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          temperature: parseFloat(inputs.temperature),
          humidity: parseFloat(inputs.humidity),
          ammonia: parseFloat(inputs.ammonia),
          co2: parseFloat(inputs.co2),
          sound: parseFloat(inputs.sound),
          movement: parseFloat(inputs.movement),
          stressLevel: pred.stress_level,
          healthStatus: pred.health_status,
          confidence: pred.confidence,
          analysis: pred.analysis,
          recommendations: pred.recommendations
        })
      });

      if (!res.ok) {
        throw new Error("Failed to push the prediction record to history.");
      }

      queryClient.invalidateQueries({ queryKey: ['prediction-history'] });
      return await res.json();
    } catch (err: any) {
      console.error('Failed to save prediction:', err);
      toast({
        title: "History Save Error",
        description: err.message || "An unexpected error occurred while saving the prediction.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handlePredict = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to use the predictor.",
        variant: "destructive"
      });
      return;
    }

    const { temperature, humidity, ammonia, co2, sound, movement } = inputs;

    if (!temperature || !humidity || !ammonia || !co2 || !sound || !movement) {
      toast({
        title: "Missing Data",
        description: "Please fill in all sensor readings",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      // Simulate brief processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Run local prediction engine
      const result = predictHealth({
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        ammonia: parseFloat(ammonia),
        co2: parseFloat(co2),
        sound: parseFloat(sound),
        movement: parseFloat(movement),
      });

      setPrediction(result);

      // Save prediction to history (non-blocking)
      const savedPrediction = await savePrediction(result);

      // Alerts API mock or create logic here
      if (result.health_status === 'critical' || result.health_status === 'warning') {
        try {
          // Placeholder for future POST /api/alerts implementation
        } catch (alertErr) {
          console.error('Failed to save alert:', alertErr);
        }
      }

      toast({
        title: result.health_status === 'critical'
          ? "🚨 CRITICAL Alert!"
          : result.health_status === 'warning'
            ? "⚠️ Warning Detected"
            : "✅ Prediction Complete",
        description: `Health Status: ${result.health_status.toUpperCase()} | Stress: ${result.stress_level.toUpperCase()}`,
        variant: result.health_status === 'critical' ? 'destructive' : 'default',
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Failed to get prediction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-predictor" className="py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <Brain className="h-5 w-5" />
            <span className="font-medium">AI-Powered Prediction</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Poultry Health Predictor
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enter your sensor readings and let our AI model predict stress levels and health status based on trained patterns.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <PredictionForm
            inputs={inputs}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onPredict={handlePredict}
          />
          <PredictionResults prediction={prediction} isLoading={isLoading} />
        </div>

        {!hideHistory && (
          <div className="mt-8">
            <PredictionHistory />
          </div>
        )}
      </div>
    </section>
  );
};

export default HealthPredictor;
