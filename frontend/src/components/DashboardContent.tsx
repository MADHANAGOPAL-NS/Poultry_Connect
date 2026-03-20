import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Info, Calendar, Loader2 } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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

const DashboardContent = () => {
    const [timeRange, setTimeRange] = React.useState<'day' | 'week' | 'month' | 'year' | 'custom'>('week');
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
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
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center p-8 text-red-500 bg-red-50 rounded-lg">
                <p>Failed to load dashboard statistics.</p>
            </div>
        );
    }

    const records = history || [];
    const today = new Date();

    // Stats Calculations
    const totalPredictions = records.length;
    const todayPredictions = records.filter(r => isSameDay(new Date(r.createdAt), today)).length;

    const alertsCount = records.filter(r => r.healthStatus === 'critical' || r.healthStatus === 'warning').length;

    const normalCount = records.filter(r => r.healthStatus === 'normal' || r.healthStatus === 'low').length;
    const healthPercentage = totalPredictions === 0 ? 0 : Math.round((normalCount / totalPredictions) * 100);

    // Activity Data (last 7 days)
    const systemActivityData = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(today, 6 - i);
        const count = records.filter(r => isSameDay(new Date(r.createdAt), d)).length;
        return { name: format(d, 'EEE'), pv: count }; // using 'pv' for the area chart
    });

    // Alerts Data (last 7 days)
    const dailyAlerts = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(today, 6 - i);
        const count = records.filter(r => isSameDay(new Date(r.createdAt), d) && (r.healthStatus === 'critical' || r.healthStatus === 'warning')).length;
        return { name: format(d, 'EEE'), value: count };
    });

    // Trend Data (Averages) Based on Time Range
    let trendData: any[] = [];
    let chartTitle = '';

    if (timeRange === 'day' || timeRange === 'custom') {
        const targetDate = timeRange === 'custom' && selectedDate ? selectedDate : today;
        chartTitle = timeRange === 'custom' ? `Averages for ${format(targetDate, 'MMM d, yyyy')}` : "Today's Averages (by hour)";
        trendData = Array.from({ length: 24 }).map((_, i) => {
            const hourRecords = records.filter(r => isSameDay(new Date(r.createdAt), targetDate) && new Date(r.createdAt).getHours() === i);
            const avg = (key: keyof PredictionRecord) => hourRecords.length ? Math.round(hourRecords.reduce((acc, curr) => acc + (curr[key] as number), 0) / hourRecords.length) : 0;
            return {
                name: `${i.toString().padStart(2, '0')}:00`,
                Temperature: avg('temperature'),
                Humidity: avg('humidity'),
                Ammonia: avg('ammonia'),
            };
        });
    } else if (timeRange === 'week') {
        chartTitle = '7-Day Averages';
        trendData = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(today, 6 - i);
            const dayRecords = records.filter(r => isSameDay(new Date(r.createdAt), d));
            const avg = (key: keyof PredictionRecord) => dayRecords.length ? Math.round(dayRecords.reduce((acc, curr) => acc + (curr[key] as number), 0) / dayRecords.length) : 0;
            return {
                name: format(d, 'MMM dd'),
                Temperature: avg('temperature'),
                Humidity: avg('humidity'),
                Ammonia: avg('ammonia'),
            };
        });
    } else if (timeRange === 'month') {
        chartTitle = '30-Day Averages';
        trendData = Array.from({ length: 30 }).map((_, i) => {
            const d = subDays(today, 29 - i);
            const dayRecords = records.filter(r => isSameDay(new Date(r.createdAt), d));
            const avg = (key: keyof PredictionRecord) => dayRecords.length ? Math.round(dayRecords.reduce((acc, curr) => acc + (curr[key] as number), 0) / dayRecords.length) : 0;
            return {
                name: format(d, 'MMM dd'),
                Temperature: avg('temperature'),
                Humidity: avg('humidity'),
                Ammonia: avg('ammonia'),
            };
        });
    } else if (timeRange === 'year') {
        chartTitle = '12-Month Averages';
        trendData = Array.from({ length: 12 }).map((_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
            const monthRecords = records.filter(r => {
                const rd = new Date(r.createdAt);
                return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
            });
            const avg = (key: keyof PredictionRecord) => monthRecords.length ? Math.round(monthRecords.reduce((acc, curr) => acc + (curr[key] as number), 0) / monthRecords.length) : 0;
            return {
                name: format(d, 'MMM yyyy'),
                Temperature: avg('temperature'),
                Humidity: avg('humidity'),
                Ammonia: avg('ammonia'),
            };
        });
    }

    // Overall Averages
    const overallAvg = (key: keyof PredictionRecord) => {
        if (!records.length) return "0";
        const sum = records.reduce((acc, curr) => acc + (curr[key] as number), 0);
        return (sum / records.length).toFixed(1);
    };

    return (
        <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Predictions Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Predictions</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalPredictions}</div>
                        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                            Today's Predictions: <span className="font-semibold text-gray-700">{todayPredictions}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Weekly Activity</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{records.filter(r => new Date(r.createdAt) >= subDays(today, 7)).length}</div>
                        <div className="h-[40px] mt-2 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={systemActivityData}>
                                    <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Alerts Triggered</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{alertsCount}</div>
                        <div className="h-[40px] mt-2 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyAlerts}>
                                    <Bar dataKey="value" fill="#ef4444" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Overall Health Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Overall Flock Health</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <div className={`text-4xl font-bold mt-2 ${healthPercentage > 80 ? 'text-green-600' : healthPercentage > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {healthPercentage}%
                        </div>
                        <div className="mt-6 text-xs text-gray-500 w-full flex justify-center border-t pt-4">
                            <span>Percentage of normal statuses</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart Row */}
            <Card className="rounded-xl shadow-sm border-0">
                <div className="border-b px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-6">
                        <button className="text-green-600 font-medium border-b-2 border-green-600 pb-4 -mb-4">Environmental Trends</button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <button onClick={() => setTimeRange('day')} className={timeRange === 'day' ? "text-green-600 font-medium" : "text-gray-500 hover:text-gray-800"}>All day</button>
                        <button onClick={() => setTimeRange('week')} className={timeRange === 'week' ? "text-green-600 font-medium" : "text-gray-500 hover:text-gray-800"}>All week</button>
                        <button onClick={() => setTimeRange('month')} className={timeRange === 'month' ? "text-green-600 font-medium" : "text-gray-500 hover:text-gray-800"}>All month</button>
                        <button onClick={() => setTimeRange('year')} className={timeRange === 'year' ? "text-green-600 font-medium" : "text-gray-500 hover:text-gray-800"}>All year</button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`flex border rounded-md items-center px-3 py-1.5 transition-colors ${timeRange === 'custom' ? 'bg-green-50 text-green-700 border-green-200 font-medium' : 'bg-white text-gray-500 hover:text-gray-800'}`}>
                                    <span className="text-sm">
                                        {timeRange === 'custom' && selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select Date'}
                                    </span>
                                    <Calendar className="h-4 w-4 ml-2" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <CalendarComponent
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        if (date) {
                                            setSelectedDate(date);
                                            setTimeRange('custom');
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 p-6 gap-8">
                    <div className="col-span-2">
                        <h3 className="font-medium text-gray-700 mb-6">{chartTitle}</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="Temperature" fill="#f87171" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="Humidity" fill="#60a5fa" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="Ammonia" fill="#fbbf24" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-medium text-gray-700 mb-6">All-Time Averages</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Temperature', value: overallAvg('temperature') + ' °C', color: 'bg-red-500' },
                                { label: 'Humidity', value: overallAvg('humidity') + ' %', color: 'bg-blue-500' },
                                { label: 'Ammonia', value: overallAvg('ammonia') + ' ppm', color: 'bg-yellow-500' },
                                { label: 'CO2', value: overallAvg('co2') + ' ppm', color: 'bg-gray-500' },
                                { label: 'Sound Level', value: overallAvg('sound') + ' dB', color: 'bg-purple-500' },
                                { label: 'Bird Movement', value: overallAvg('movement') + ' %', color: 'bg-green-500' },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-3 h-3 rounded-full ${stat.color}`}></span>
                                        <span className="text-sm text-gray-700">{stat.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DashboardContent;
