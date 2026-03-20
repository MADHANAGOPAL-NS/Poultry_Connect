import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, Calendar } from 'lucide-react';

const mockVisits = [
    { name: 'Mon', uv: 4000, pv: 2400 },
    { name: 'Tue', uv: 3000, pv: 1398 },
    { name: 'Wed', uv: 2000, pv: 9800 },
    { name: 'Thu', uv: 2780, pv: 3908 },
    { name: 'Fri', uv: 1890, pv: 4800 },
    { name: 'Sat', uv: 2390, pv: 3800 },
    { name: 'Sun', uv: 3490, pv: 4300 },
];

const mockPayments = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 200 },
    { name: 'May', value: 600 },
    { name: 'Jun', value: 400 },
];

const mockStoreSales = [
    { name: '2017', val1: 45, val2: 36, val3: 33 },
    { name: '2018', val1: 27, val2: 30, val3: 33 },
    { name: '2019', val1: 30, val2: 56, val3: 40 },
    { name: '2020', val1: 27, val2: 35, val3: 40 },
];

const DashboardContent = () => {
    return (
        <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Predictions</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">154,430</div>
                        <div className="text-xs text-gray-500 mt-2 flex gap-4">
                            <span className="flex items-center gap-1">
                                Week ratio 13% <span className="text-red-500">▲</span>
                            </span>
                            <span className="flex items-center gap-1">
                                Day ratio 10% <span className="text-green-500">▼</span>
                            </span>
                        </div>
                        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                            Day Predictions 15,443
                        </div>
                    </CardContent>
                </Card>

                {/* Visits Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">System Activity</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">6,480</div>
                        <div className="h-[60px] mt-2 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockVisits}>
                                    <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.8} />
                                    <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex justify-between border-t pt-4">
                            <span>Day active 4,280</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Alerts Triggered</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">5,320</div>
                        <div className="h-[60px] mt-2 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockPayments}>
                                    <Bar dataKey="value" fill="#16a34a" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex justify-between border-t pt-4">
                            <span>Alert rate 5%</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Operation Effect Card */}
                <Card className="rounded-xl shadow-sm border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Operation Effect</CardTitle>
                        <Info className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold mt-4">88%</div>
                        <div className="mt-8 text-xs text-gray-500 w-full flex justify-center border-t pt-4">
                            <span>Performance 88%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart Row */}
            <Card className="rounded-xl shadow-sm border-0">
                <div className="border-b px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-6">
                        <button className="text-green-600 font-medium border-b-2 border-green-600 pb-4 -mb-4">Predictions</button>
                        <button className="text-gray-500 font-medium hover:text-gray-800 pb-4 -mb-4">Alerts</button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <button className="text-gray-500 hover:text-gray-800">All day</button>
                        <button className="text-gray-500 hover:text-gray-800">All week</button>
                        <button className="text-gray-500 hover:text-gray-800">All month</button>
                        <button className="text-green-600">All year</button>
                        <div className="flex border rounded-md items-center px-3 py-1.5 bg-white">
                            <span className="text-gray-500 text-sm">2020-01-01</span>
                            <span className="mx-2 text-gray-300">~</span>
                            <span className="text-gray-500 text-sm">2020-12-31</span>
                            <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 p-6 gap-8">
                    <div className="col-span-2">
                        <h3 className="font-medium text-gray-700 mb-6">Prediction Trends</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockStoreSales}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="val1" fill="#bbf7d0" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="val2" fill="#22c55e" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="val3" fill="#86efac" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-medium text-gray-700 mb-6">Top Flocks (Health)</h3>
                        <div className="space-y-4">
                            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs text-white ${i < 3 ? 'bg-green-700' : 'bg-[#f0f2f5] text-gray-500'}`}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-gray-600">No. {i} Flock</span>
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">432,641</span>
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
