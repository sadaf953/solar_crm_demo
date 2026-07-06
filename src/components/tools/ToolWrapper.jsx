import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Wrench, Sun, LogOut } from 'lucide-react';

const ToolWrapper = ({ children, title }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FCFBFA] flex">
            {/* --- RECREATED SIDEBAR --- */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-100 flex flex-col hidden lg:flex">
                <div className="p-5 border-b border-stone-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                        <Sun size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-stone-800 uppercase tracking-tight">SolarFlow</h1>
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Portal</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold mb-0.5 text-stone-600 hover:bg-stone-100 transition-colors">
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button onClick={() => navigate('/tools')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold mb-0.5 bg-stone-900 text-white shadow-sm">
                        <Wrench size={18} /> Tools
                    </button>
                </div>

                <div className="p-3 border-t border-stone-100">
                    <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-2 px-3 py-2 text-stone-500 hover:bg-stone-50 rounded-xl text-xs font-semibold transition-colors">
                        <LogOut className="w-4 h-4" /> Exit Tools
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* GLOBAL TOOL HEADER */}
                <header className="h-16 bg-white/90 backdrop-blur-md border-b border-stone-100 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/tools')}
                            className="p-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-400 hover:text-stone-800"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="font-bold text-stone-800 uppercase tracking-tight text-sm">
                            {title}
                        </h2>
                    </div>
                </header>

                {/* THE TOOL CONTENT */}
                <div className="flex-1 p-4 lg:p-10">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ToolWrapper;