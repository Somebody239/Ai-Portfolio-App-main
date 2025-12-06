import React from 'react';
import {
    LayoutDashboard,
    GraduationCap,
    Target,
    FileText,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';

interface DashboardLayoutProps {
    children: React.ReactNode;
    user?: any;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user }) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row font-sans selection:bg-[#FF6B35] selection:text-white">
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B] flex items-center justify-center">
                        <span className="font-bold text-white">U</span>
                    </div>
                    <span className="font-bold text-lg">Path2Uni</span>
                </div>
                <button className="p-2 hover:bg-zinc-900 rounded-lg">
                    <Menu size={20} />
                </button>
            </div>

            {/* Left Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 p-6 h-screen sticky top-0">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
                        <span className="font-bold text-xl text-white">U</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">Path2Uni</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
                    <NavItem icon={<GraduationCap size={20} />} label="Academics" />
                    <NavItem icon={<Target size={20} />} label="Universities" />
                    <NavItem icon={<FileText size={20} />} label="Applications" />
                </nav>

                <div className="pt-6 border-t border-zinc-800 space-y-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.email?.split('@')[0] || 'User'}</p>
                            <p className="text-xs text-zinc-500 truncate">Free Plan</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors w-full">
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 transition-colors w-full">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
    <button
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
            ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`}
    >
        <span className={`${active ? 'text-[#FF6B35]' : 'text-zinc-500 group-hover:text-white'}`}>
            {icon}
        </span>
        {label}
    </button>
);
