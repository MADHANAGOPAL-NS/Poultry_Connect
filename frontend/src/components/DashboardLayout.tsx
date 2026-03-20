import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';
import {
    Menu, Bell, User as UserIcon,
    LayoutDashboard, Edit, List, Settings
} from 'lucide-react';

interface PredictionRecord {
    _id: string;
    healthStatus: string;
    stressLevel: string;
    createdAt: string;
    analysis: string | null;
}
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const DashboardLayout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) => {
    const { user, signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const { data: history } = useQuery({
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

    const alerts = (history || []).filter(r => r.healthStatus === 'critical' || r.healthStatus === 'warning');
    // Sort descending chronologically
    const sortedAlerts = [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const displayAlerts = sortedAlerts.slice(0, 5);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'predictor', label: 'Predictor', icon: Edit },
        { id: 'history', label: 'History', icon: List },
        { id: 'account', label: 'Account', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex">
            {/* Sidebar */}
            <aside className={cn(
                "bg-green-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50",
                collapsed ? "w-[80px]" : "w-[250px]"
            )}>
                <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
                    <div className="flex items-center gap-2 select-none">
                        {!collapsed ? (
                            <span className="text-xl font-bold tracking-tight text-white">Poultry Connect</span>
                        ) : (
                            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-white">PC</div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors relative",
                                        isActive ? "bg-green-700 text-white shadow-inner" : "text-white/70 hover:text-white hover:bg-white/10",
                                        collapsed && "justify-center px-0"
                                    )}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={cn("flex-1 transition-all duration-300 flex flex-col min-h-screen", collapsed ? "ml-[80px]" : "ml-[250px]")}>
                {/* Top Navbar */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="text-gray-500 hover:text-gray-700 relative transition-transform hover:scale-105">
                                    <Bell className="h-5 w-5" />
                                    {alerts.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in fade-in duration-300">
                                            {alerts.length > 99 ? '99+' : alerts.length}
                                        </span>
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                                <div className="p-4 border-b">
                                    <h4 className="font-semibold text-sm leading-none flex items-center justify-between">
                                        Recent Alerts
                                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{alerts.length} Total</span>
                                    </h4>
                                </div>
                                <div className="p-2 max-h-[350px] overflow-auto flex flex-col gap-2">
                                    {displayAlerts.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-6">No active alerts. Your flock is healthy!</p>
                                    ) : (
                                        displayAlerts.map(alert => (
                                            <div key={alert._id} className={`p-3 rounded-lg border text-sm relative overflow-hidden ${alert.healthStatus === 'critical' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.healthStatus === 'critical' ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
                                                <div className="flex justify-between items-start mb-1 pl-2">
                                                    <span className="font-semibold capitalize flex items-center gap-1.5">
                                                        <span className={`h-2 w-2 rounded-full animate-pulse ${alert.healthStatus === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                                        {alert.healthStatus} Alert
                                                    </span>
                                                    <span className="text-xs opacity-70 whitespace-nowrap">{format(new Date(alert.createdAt), 'MMM d, h:mm a')}</span>
                                                </div>
                                                <p className="opacity-90 leading-tight line-clamp-2 pl-2 mt-1.5 text-xs">
                                                    {alert.analysis?.replace(/<[^>]*>?/gm, '') || `High stress detected. Condition needs attention.`}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="flex items-center gap-2 pl-2 border-l hover:bg-gray-50 rounded-lg p-1 transition-colors cursor-pointer text-left">
                                    <Avatar className="h-8 w-8">
                                        {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-green-600 text-white">
                                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                                    </span>
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will end your current session and securely switch you back to the login page.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLogout} className="bg-green-600 hover:bg-green-700 text-white">
                                        Log Out
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
