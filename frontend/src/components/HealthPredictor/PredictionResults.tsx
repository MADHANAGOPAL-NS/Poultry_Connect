import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain, AlertTriangle, CheckCircle, XCircle, Loader2,
  Thermometer, Droplets, Wind, Volume2, Activity, ShieldCheck,
  AlertOctagon, Skull, TrendingUp, TrendingDown, ArrowRight
} from 'lucide-react';
import type { Prediction, SensorAnalysis, RiskLevel } from '@/lib/predictionEngine';

interface PredictionResultsProps {
  prediction: Prediction | null;
  isLoading: boolean;
}

const riskColors: Record<RiskLevel, { bg: string; border: string; text: string; dot: string; badge: string; barColor: string; glowRing: string }> = {
  normal: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    barColor: 'bg-emerald-500',
    glowRing: 'ring-emerald-200',
  },
  early: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    barColor: 'bg-amber-500',
    glowRing: 'ring-amber-200',
  },
  medium: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    barColor: 'bg-orange-500',
    glowRing: 'ring-orange-200',
  },
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-800 border-red-300',
    barColor: 'bg-red-500',
    glowRing: 'ring-red-200',
  },
};

const riskIcons: Record<RiskLevel, React.ElementType> = {
  normal: ShieldCheck,
  early: AlertTriangle,
  medium: AlertOctagon,
  critical: Skull,
};

const riskLabels: Record<RiskLevel, string> = {
  normal: 'Normal',
  early: 'Early Risk',
  medium: 'Medium Risk',
  critical: 'Critical',
};

const sensorIcons: Record<string, React.ElementType> = {
  'Temperature': Thermometer,
  'Humidity': Droplets,
  'Ammonia (NH₃)': Wind,
  'CO₂': Wind,
  'Sound Level': Volume2,
  'Bird Movement': Activity,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
    case 'low':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'warning':
    case 'medium':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'critical':
    case 'high':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'normal':
    case 'low':
      return <CheckCircle className="h-5 w-5 text-emerald-600" />;
    case 'warning':
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    case 'critical':
    case 'high':
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return null;
  }
};

const getHealthGradient = (status: string) => {
  switch (status) {
    case 'normal': return 'from-emerald-500 to-green-600';
    case 'warning': return 'from-amber-500 to-orange-600';
    case 'critical': return 'from-red-500 to-rose-700';
    default: return 'from-gray-400 to-gray-500';
  }
};

const getStressGradient = (level: string) => {
  switch (level) {
    case 'low': return 'from-emerald-500 to-teal-600';
    case 'medium': return 'from-amber-500 to-yellow-600';
    case 'high': return 'from-red-500 to-pink-600';
    default: return 'from-gray-400 to-gray-500';
  }
};

/* ─── Sensor Breakdown Card ─────────────────────────────────────── */
const SensorBreakdownCard = ({ sensor }: { sensor: SensorAnalysis }) => {
  const colors = riskColors[sensor.riskLevel];
  const RiskIcon = riskIcons[sensor.riskLevel];
  const SensorIcon = sensorIcons[sensor.parameter] || Activity;
  const riskPercent = (sensor.score / 3) * 100;

  return (
    <div
      className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SensorIcon className={`h-4 w-4 ${colors.text}`} />
          <span className="font-semibold text-sm text-gray-800">{sensor.parameter}</span>
        </div>
        <Badge className={`text-xs border ${colors.badge} flex items-center gap-1`}>
          <RiskIcon className="h-3 w-3" />
          {riskLabels[sensor.riskLevel]}
        </Badge>
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-2xl font-bold ${colors.text}`}>{sensor.value}</span>
        <span className="text-sm text-gray-500">{sensor.unit}</span>
      </div>

      {/* Risk bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${colors.barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(riskPercent, 8)}%` }}
        />
      </div>

      <div className="space-y-1 mt-2">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Range:</span>{' '}
          <code className={`px-1.5 py-0.5 rounded text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
            {sensor.range}
          </code>
        </p>
        <p className="text-xs text-gray-600">
          <span className="font-medium">Impact:</span> {sensor.impact}
        </p>
        {sensor.diseases !== 'No disease risk' && (
          <p className="text-xs">
            <span className="font-medium text-gray-600">Diseases:</span>{' '}
            <span className={`font-medium ${colors.text}`}>{sensor.diseases}</span>
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── Risk Distribution Chart ───────────────────────────────────── */
const RiskDistributionChart = ({ distribution }: { distribution: { normal: number; early: number; medium: number; critical: number } }) => {
  const total = distribution.normal + distribution.early + distribution.medium + distribution.critical;
  const items: { level: RiskLevel; count: number; label: string }[] = [
    { level: 'normal', count: distribution.normal, label: 'Normal' },
    { level: 'early', count: distribution.early, label: 'Early Risk' },
    { level: 'medium', count: distribution.medium, label: 'Medium Risk' },
    { level: 'critical', count: distribution.critical, label: 'Critical' },
  ];

  return (
    <div className="p-4 bg-white/80 rounded-xl border border-gray-200">
      <p className="text-sm font-semibold text-gray-700 mb-3">Risk Distribution</p>
      {/* Stacked bar */}
      <div className="flex rounded-full overflow-hidden h-4 mb-3">
        {items.map(item => {
          if (item.count === 0) return null;
          const width = (item.count / total) * 100;
          return (
            <div
              key={item.level}
              className={`${riskColors[item.level].barColor} transition-all duration-500`}
              style={{ width: `${width}%` }}
              title={`${item.label}: ${item.count}/${total}`}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {items.map(item => {
          if (item.count === 0) return null;
          return (
            <div key={item.level} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${riskColors[item.level].dot}`} />
              <span className="text-xs text-gray-600">
                {item.label}: <strong>{item.count}</strong>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Overall Score Gauge ───────────────────────────────────────── */
const ScoreGauge = ({ score, maxScore }: { score: number; maxScore: number }) => {
  const percentage = (score / maxScore) * 100;
  const healthPercentage = 100 - percentage;

  let color = 'text-emerald-600';
  let bgColor = 'bg-emerald-500';
  let label = 'Excellent';
  if (percentage > 55) {
    color = 'text-red-600';
    bgColor = 'bg-red-500';
    label = 'Critical';
  } else if (percentage > 35) {
    color = 'text-orange-600';
    bgColor = 'bg-orange-500';
    label = 'Moderate Risk';
  } else if (percentage > 15) {
    color = 'text-amber-600';
    bgColor = 'bg-amber-500';
    label = 'Mild Risk';
  }

  return (
    <div className="p-4 bg-white/80 rounded-xl border border-gray-200 text-center">
      <p className="text-sm font-semibold text-gray-700 mb-2">Overall Health Score</p>
      <div className={`text-3xl font-bold ${color} mb-1`}>
        {Math.round(healthPercentage)}%
      </div>
      <p className={`text-xs font-medium ${color} mb-3`}>{label}</p>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Risk Score: {score}/{maxScore}</p>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────────────────── */
const PredictionResults = ({ prediction, isLoading }: PredictionResultsProps) => {
  return (
    <Card className="shadow-lg lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Prediction Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Empty state */}
        {!prediction && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="relative inline-block">
              <Brain className="h-20 w-20 mx-auto mb-4 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full opacity-0"></div>
              </div>
            </div>
            <p className="text-lg font-medium mb-2">Ready to Analyze</p>
            <p className="text-sm max-w-md mx-auto">
              Enter your sensor readings on the left and click <strong>"Predict Health Status"</strong> to see a comprehensive AI analysis of your flock's health.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temperature</span>
              <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> Humidity</span>
              <span className="flex items-center gap-1"><Wind className="h-3 w-3" /> Ammonia</span>
              <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Movement</span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <Loader2 className="h-20 w-20 mx-auto mb-4 animate-spin text-purple-500" />
            </div>
            <p className="text-lg font-medium text-foreground mb-1">Analyzing Sensor Data...</p>
            <p className="text-sm text-muted-foreground">Running health prediction model</p>
            <div className="flex justify-center gap-1 mt-4">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {prediction && !isLoading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* ── Status Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${getHealthGradient(prediction.health_status)} text-white shadow-lg`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <p className="text-xs font-medium text-white/80 mb-1 uppercase tracking-wide">Health Status</p>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(prediction.health_status)}
                  <span className="text-2xl font-bold capitalize">{prediction.health_status}</span>
                </div>
                <p className="text-xs text-white/70">
                  {prediction.health_status === 'normal' && 'All conditions optimal'}
                  {prediction.health_status === 'warning' && 'Intervention recommended'}
                  {prediction.health_status === 'critical' && 'Immediate action required'}
                </p>
              </div>

              <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${getStressGradient(prediction.stress_level)} text-white shadow-lg`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <p className="text-xs font-medium text-white/80 mb-1 uppercase tracking-wide">Stress Level</p>
                <div className="flex items-center gap-2 mb-2">
                  {prediction.stress_level === 'low' && <TrendingDown className="h-5 w-5" />}
                  {prediction.stress_level === 'medium' && <ArrowRight className="h-5 w-5" />}
                  {prediction.stress_level === 'high' && <TrendingUp className="h-5 w-5" />}
                  <span className="text-2xl font-bold capitalize">{prediction.stress_level}</span>
                </div>
                <p className="text-xs text-white/70">
                  {prediction.stress_level === 'low' && 'Birds are comfortable'}
                  {prediction.stress_level === 'medium' && 'Some stress indicators'}
                  {prediction.stress_level === 'high' && 'High stress detected'}
                </p>
              </div>
            </div>

            {/* ── Confidence + Score ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <p className="text-sm font-semibold text-purple-800 mb-2">Model Confidence</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <span className="font-bold text-purple-800 text-lg">{prediction.confidence}%</span>
                </div>
              </div>
              <ScoreGauge score={prediction.overallRiskScore} maxScore={18} />
            </div>

            {/* ── Risk Distribution ── */}
            <RiskDistributionChart distribution={prediction.riskDistribution} />

            {/* ── Sensor Breakdown ── */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                Sensor-by-Sensor Analysis
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {prediction.sensorBreakdown.map((sensor, idx) => (
                  <SensorBreakdownCard key={idx} sensor={sensor} />
                ))}
              </div>
            </div>

            {/* ── Analysis ── */}
            <div className={`p-5 rounded-xl border-2 ${prediction.health_status === 'critical'
                ? 'bg-red-50 border-red-200'
                : prediction.health_status === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
              <p className={`text-sm font-semibold mb-2 flex items-center gap-2 ${prediction.health_status === 'critical'
                  ? 'text-red-800'
                  : prediction.health_status === 'warning'
                    ? 'text-amber-800'
                    : 'text-blue-800'
                }`}>
                <Brain className="h-4 w-4" />
                AI Analysis
              </p>
              <p className="text-sm text-foreground leading-relaxed">{prediction.analysis}</p>
            </div>

            {/* ── Recommendations ── */}
            {prediction.recommendations && prediction.recommendations.length > 0 && (
              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                <p className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Recommendations ({prediction.recommendations.length})
                </p>
                <ul className="space-y-2.5">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResults;
