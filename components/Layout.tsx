
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  PlusSquare, 
  BookCheck, 
  Menu, 
  X,
  Leaf,
  Settings
} from 'lucide-react';
import { resetData } from '../lib/storage';

const SidebarItem: React.FC<{ 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
  onClick?: () => void;
}> = ({ to, icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-schneider text-white' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { label: 'Dashboard', to: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Library', to: '/library', icon: <Library size={20} /> },
    { label: 'Add Reference', to: '/admin/new', icon: <PlusSquare size={20} /> },
    { label: 'Standards', to: '/standards', icon: <BookCheck size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="h-1 bg-schneider w-full" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 lg:hidden text-slate-600"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-schneider text-white p-1 rounded">
                <Leaf size={24} />
              </div>
              <h1 className="font-bold text-xl tracking-tight hidden sm:block">
                Reference<span className="text-schneider">Library</span>
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs text-slate-500 font-medium">Internal Demo</p>
              <p className="text-sm font-semibold text-schneider">Sustainability Focus</p>
            </div>
            <button 
              onClick={resetData}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Reset Demo Data"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative max-w-screen-2xl mx-auto w-full">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            {navigation.map((item) => (
              <SidebarItem 
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                onClick={() => setIsSidebarOpen(false)}
              />
            ))}
            
            <div className="mt-10 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Impact Goal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empowering all to make the most of our energy and resources.
              </p>
              <div className="mt-3 flex items-center gap-2 text-schneider">
                <Leaf size={14} />
                <span className="text-[10px] font-bold">NET-ZERO 2050</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
