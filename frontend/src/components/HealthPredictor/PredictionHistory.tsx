import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface PredictionRecord {
  _id: string;
  temperature: number;
  humidity: number;
  ammonia: number;
  co2: number;
  sound: number;
  movement: number;
  stressLevel: string;
  healthStatus: string;
  confidence: number;
  analysis: string | null;
  recommendations: string[] | null;
  createdAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'warning':
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'critical':
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'normal':
    case 'low':
      return <CheckCircle className="h-3 w-3" />;
    case 'warning':
    case 'medium':
      return <AlertTriangle className="h-3 w-3" />;
    case 'critical':
    case 'high':
      return <XCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

const PredictionHistory = () => {
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['prediction-history'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/predictions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch predictions');
      return (await res.json()) as PredictionRecord[];
    },
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Prediction History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Prediction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center py-4">Failed to load history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Prediction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!history || history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No predictions yet. Run your first analysis above!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record._id}
                  className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(record.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${getStatusColor(record.healthStatus)}`}>
                        {getStatusIcon(record.healthStatus)}
                        <span className="ml-1 capitalize">{record.healthStatus}</span>
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(record.stressLevel)}`}>
                        {getStatusIcon(record.stressLevel)}
                        <span className="ml-1 capitalize">{record.stressLevel}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span>🌡️ {record.temperature}°C</span>
                    <span>💧 {record.humidity}%</span>
                    <span>🧪 NH₃ {record.ammonia}ppm</span>
                    <span>🌫️ CO₂ {record.co2}ppm</span>
                    <span>🔊 {record.sound}dB</span>
                    <span>🐔 {record.movement}%</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${record.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{record.confidence}%</span>
                  </div>
                  {record.analysis && (
                    <div className="mt-3 text-xs bg-background p-2 rounded border">
                      <div className="font-semibold mb-1">Analysis:</div>
                      <p className="text-muted-foreground">{record.analysis}</p>
                    </div>
                  )}
                  {record.recommendations && record.recommendations.length > 0 && (
                    <div className="mt-2 text-xs bg-background p-2 rounded border">
                      <div className="font-semibold mb-1">Recommendations:</div>
                      <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                        {record.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionHistory;
