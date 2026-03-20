import { useState } from 'react';
import { Thermometer, Droplets, Wind, ChevronDown, ShieldCheck, AlertTriangle, AlertOctagon, Skull } from 'lucide-react';

type RiskLevel = 'normal' | 'early' | 'medium' | 'critical';

interface CriteriaRow {
    level: RiskLevel;
    condition: string;
    range: string;
    impact: string;
    diseases: string;
}

interface CriteriaTable {
    id: string;
    title: string;
    sensor: string;
    icon: React.ElementType;
    accentColor: string;
    headerGradient: string;
    rows: CriteriaRow[];
}

const riskConfig: Record<RiskLevel, { label: string; icon: React.ElementType; bg: string; border: string; text: string; badge: string; dot: string; glow: string }> = {
    normal: {
        label: 'Normal',
        icon: ShieldCheck,
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        glow: 'shadow-emerald-100',
    },
    early: {
        label: 'Early-Stage Risk',
        icon: AlertTriangle,
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        glow: 'shadow-amber-100',
    },
    medium: {
        label: 'Medium-Stage Risk',
        icon: AlertOctagon,
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        dot: 'bg-orange-500',
        glow: 'shadow-orange-100',
    },
    critical: {
        label: 'Late-Stage Critical',
        icon: Skull,
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-800 border-red-300',
        dot: 'bg-red-500',
        glow: 'shadow-red-100',
    },
};

const criteriaData: CriteriaTable[] = [
    {
        id: 'temperature',
        title: 'Temperature',
        sensor: 'DHT22 / LM35',
        icon: Thermometer,
        accentColor: 'text-rose-500',
        headerGradient: 'from-rose-500 to-orange-500',
        rows: [
            { level: 'normal', condition: 'Normal', range: '18–24°C', impact: 'Ideal growth conditions', diseases: 'No disease risk' },
            { level: 'early', condition: 'Early-Stage Risk', range: '25–28°C or 15–18°C', impact: 'Mild stress, reduced feed intake', diseases: 'Heat stress, mild respiratory issues' },
            { level: 'medium', condition: 'Medium-Stage Risk', range: '28–30°C or 12–15°C', impact: 'Significant stress, panting', diseases: 'Heatstroke, hypothermia' },
            { level: 'critical', condition: 'Late-Stage Critical', range: '>30°C or <12°C', impact: 'High mortality risk', diseases: 'Severe heatstroke, cold stress' },
        ],
    },
    {
        id: 'humidity',
        title: 'Humidity',
        sensor: 'DHT22 / Hygrometer',
        icon: Droplets,
        accentColor: 'text-blue-500',
        headerGradient: 'from-blue-500 to-cyan-500',
        rows: [
            { level: 'normal', condition: 'Normal', range: '50–70%', impact: 'Healthy respiratory conditions', diseases: 'No disease risk' },
            { level: 'early', condition: 'Early-Stage Risk', range: '40–50% or 70–80%', impact: 'Slight dehydration or bacterial growth', diseases: 'Respiratory infections, coccidiosis' },
            { level: 'medium', condition: 'Medium-Stage Risk', range: '30–40% or 80–90%', impact: 'Reduced immunity, discomfort', diseases: 'Aspergillosis, wet litter syndrome' },
            { level: 'critical', condition: 'Late-Stage Critical', range: '<30% or >90%', impact: 'Severe dehydration or infections', diseases: 'Severe respiratory distress' },
        ],
    },
    {
        id: 'ammonia',
        title: 'Ammonia',
        sensor: 'MQ-135 / NH3',
        icon: Wind,
        accentColor: 'text-green-500',
        headerGradient: 'from-green-500 to-teal-500',
        rows: [
            { level: 'normal', condition: 'Normal', range: '<10 ppm', impact: 'Healthy air quality', diseases: 'No disease risk' },
            { level: 'early', condition: 'Early-Stage Risk', range: '10–20 ppm', impact: 'Mild eye and lung irritation', diseases: 'Subclinical respiratory infections' },
            { level: 'medium', condition: 'Medium-Stage Risk', range: '20–40 ppm', impact: 'Labored breathing, reduced growth', diseases: 'Chronic respiratory diseases' },
            { level: 'critical', condition: 'Late-Stage Critical', range: '>40 ppm', impact: 'Severe respiratory distress', diseases: 'Infectious bronchitis, E. coli' },
        ],
    },
];

const PredictionCriteria = () => {
    const [expandedTable, setExpandedTable] = useState<string | null>('temperature');

    const toggleTable = (id: string) => {
        setExpandedTable(prev => (prev === id ? null : id));
    };

    return (
        <section id="prediction-criteria" className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-5 py-2 rounded-full mb-5 shadow-sm border border-emerald-200/50">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="font-semibold text-sm tracking-wide">Disease Risk Analysis</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
                        Prediction Criteria &{' '}
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Risk Thresholds
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        Understand how our IoT sensors classify environmental conditions into risk stages
                        — from normal to critical — and the associated diseases at each level.
                    </p>
                </div>

                {/* Risk Legend */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {(['normal', 'early', 'medium', 'critical'] as RiskLevel[]).map((level) => {
                        const config = riskConfig[level];
                        const Icon = config.icon;
                        return (
                            <div
                                key={level}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${config.badge} transition-all duration-300 hover:scale-105 hover:shadow-md`}
                            >
                                <Icon className="h-4 w-4" />
                                {config.label}
                            </div>
                        );
                    })}
                </div>

                {/* Accordion Tables */}
                <div className="space-y-5">
                    {criteriaData.map((table) => {
                        const isExpanded = expandedTable === table.id;
                        const TableIcon = table.icon;

                        return (
                            <div
                                key={table.id}
                                className={`rounded-2xl border bg-white/80 backdrop-blur-sm transition-all duration-500 ${isExpanded
                                        ? 'shadow-xl shadow-gray-200/50 border-gray-200'
                                        : 'shadow-md shadow-gray-100/50 border-gray-100 hover:shadow-lg hover:border-gray-200'
                                    }`}
                            >
                                {/* Accordion Header */}
                                <button
                                    id={`criteria-toggle-${table.id}`}
                                    onClick={() => toggleTable(table.id)}
                                    className="w-full flex items-center justify-between p-5 md:p-6 text-left group cursor-pointer"
                                    aria-expanded={isExpanded}
                                    aria-controls={`criteria-content-${table.id}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${table.headerGradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                                            <TableIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{table.title}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                Sensor: <span className="font-medium text-gray-600">{table.sensor}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Accordion Content */}
                                <div
                                    id={`criteria-content-${table.id}`}
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-5 md:px-6 pb-6">
                                        {/* Desktop Table */}
                                        <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className={`bg-gradient-to-r ${table.headerGradient}`}>
                                                        <th className="text-left px-5 py-3.5 text-white font-semibold text-sm tracking-wide">Condition</th>
                                                        <th className="text-left px-5 py-3.5 text-white font-semibold text-sm tracking-wide">Range</th>
                                                        <th className="text-left px-5 py-3.5 text-white font-semibold text-sm tracking-wide">Impact</th>
                                                        <th className="text-left px-5 py-3.5 text-white font-semibold text-sm tracking-wide">Associated Diseases</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {table.rows.map((row, idx) => {
                                                        const config = riskConfig[row.level];
                                                        const RowIcon = config.icon;
                                                        return (
                                                            <tr
                                                                key={idx}
                                                                className={`${config.bg} border-b last:border-b-0 ${config.border} transition-all duration-300 hover:shadow-sm`}
                                                            >
                                                                <td className="px-5 py-4">
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className={`w-2.5 h-2.5 rounded-full ${config.dot} ring-2 ring-offset-1 ring-${row.level === 'normal' ? 'emerald' : row.level === 'early' ? 'amber' : row.level === 'medium' ? 'orange' : 'red'}-200`} />
                                                                        <RowIcon className={`h-4 w-4 ${config.text}`} />
                                                                        <span className={`font-semibold text-sm ${config.text}`}>{row.condition}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <code className={`px-2.5 py-1 rounded-md text-sm font-mono font-medium ${config.bg} ${config.text} border ${config.border}`}>
                                                                        {row.range}
                                                                    </code>
                                                                </td>
                                                                <td className={`px-5 py-4 text-sm ${config.text} font-medium`}>{row.impact}</td>
                                                                <td className="px-5 py-4">
                                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.badge}`}>
                                                                        {row.diseases}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Cards */}
                                        <div className="md:hidden space-y-3">
                                            {table.rows.map((row, idx) => {
                                                const config = riskConfig[row.level];
                                                const RowIcon = config.icon;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`rounded-xl border-2 ${config.border} ${config.bg} p-4 transition-all duration-300 shadow-sm ${config.glow}`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                                                            <RowIcon className={`h-4 w-4 ${config.text}`} />
                                                            <span className={`font-bold text-sm ${config.text}`}>{row.condition}</span>
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex items-start">
                                                                <span className="text-gray-500 font-medium w-20 shrink-0">Range:</span>
                                                                <code className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${config.bg} ${config.text} border ${config.border}`}>
                                                                    {row.range}
                                                                </code>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <span className="text-gray-500 font-medium w-20 shrink-0">Impact:</span>
                                                                <span className={`${config.text} font-medium`}>{row.impact}</span>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <span className="text-gray-500 font-medium w-20 shrink-0">Diseases:</span>
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${config.badge}`}>
                                                                    {row.diseases}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-start gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 shadow-sm max-w-2xl">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-600 text-left leading-relaxed">
                            <span className="font-semibold text-gray-800">Note:</span> These thresholds are based on established poultry science research and our IoT sensor calibration.
                            Actual risk may vary based on breed, age, and flock density. Always consult a veterinarian for clinical decisions.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PredictionCriteria;
