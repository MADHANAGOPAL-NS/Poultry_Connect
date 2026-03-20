import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    Menu, Search, HelpCircle, Bell, User as UserIcon,
    LayoutDashboard, Edit, List, UserCircle, CheckCircle,
    AlertTriangle, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const DashboardLayout = ({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) => {
    const { user, signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'predictor', label: 'Predictor', icon: Edit },
        { id: 'history', label: 'History', icon: List },
        { id: 'profile', label: 'Profile', icon: UserCircle },
        { id: 'results', label: 'Result', icon: CheckCircle },
        { id: 'alerts', label: 'Exception', icon: AlertTriangle },
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
                    <Link to="/" className="flex items-center gap-2">
                        {!collapsed ? (
                            <img src="/lovable-uploads/fb536fca-43f9-4b55-b779-0502499b7ab3.png" alt="Logo" className="h-8 w-auto brightness-0 invert" />
                        ) : (
                            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-white">PC</div>
                        )}
                    </Link>
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
                        <button className="text-gray-500 hover:text-gray-700">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                            <HelpCircle className="h-5 w-5" />
                        </button>
                        <div className="relative">
                            <button className="text-gray-500 hover:text-gray-700 relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    8
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 pl-2 border-l">
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
                        </div>
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
