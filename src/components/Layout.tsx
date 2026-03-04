"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Home, BookOpen, Star, FileText, LogOut, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FloralDecoration from './FloralDecoration';
import Scene3D from './Scene3D';
import gsap from 'gsap';
import { useJournal } from '@/context/JournalContext';

const TABS = [
  { id: 'hoy', name: 'Hoy', icon: Home },
  { id: 'semana', name: 'Semana', icon: Calendar },
  { id: 'habitos', name: 'Hábitos', icon: Star },
  { id: 'devocional', name: 'Devocional', icon: BookOpen },
  { id: 'notas', name: 'Notas', icon: FileText },
];

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { logout, user, isAdmin } = useJournal();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sidebarRef.current && mainRef.current) {
      gsap.fromTo(sidebarRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#fffcf2] overflow-hidden relative selection:bg-accent-pink/40 text-soft-text">
      <Scene3D />
      <FloralDecoration />
      
      {/* SIDEBAR */}
      <aside ref={sidebarRef} className="hidden md:flex flex-col w-72 bg-white/40 backdrop-blur-2xl border-r border-rose-pastel/50 journal-shadow z-20">
        <div className="p-10">
          <h1 className="text-3xl font-serif text-deep-rose italic font-bold leading-tight">Diario de <br/> Abigail</h1>
          <div className="w-10 h-1 bg-accent-pink mt-4 rounded-full opacity-40" />
          {user?.displayName && <p className="text-[10px] uppercase tracking-widest font-bold text-soft-text/40 mt-4">{user.displayName}</p>}
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group ${activeTab === tab.id ? 'bg-white text-deep-rose font-bold shadow-sm translate-x-2' : 'text-soft-text/60 hover:bg-white/60 hover:text-soft-text'}`}>
              <tab.icon size={20} className={activeTab === tab.id ? 'text-accent-pink' : 'group-hover:text-accent-pink'} />
              <span className="text-sm font-semibold">{tab.name}</span>
            </button>
          ))}

          {/* BOTON ADMIN - Solo visible para el Admin Supremo */}
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 border-2 ${activeTab === 'admin' ? 'bg-deep-rose text-white border-deep-rose shadow-lg scale-105' : 'border-rose-pastel/30 text-deep-rose/60 hover:bg-rose-pastel/20'}`}>
              <ShieldCheck size={20} />
              <span className="text-sm font-bold uppercase tracking-tighter">Panel Admin</span>
            </button>
          )}
        </nav>

        <div className="p-10 mt-auto space-y-4">
          <button onClick={logout} className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl text-soft-text/40 hover:text-red-400 hover:bg-red-50 transition-all text-[10px] font-bold uppercase tracking-widest">
            <LogOut size={14} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main ref={mainRef} className="flex-1 flex flex-col min-h-screen relative overflow-y-auto z-10 w-full">
        <header className="md:hidden p-6 bg-white/80 backdrop-blur-md border-b border-rose-pastel flex justify-between items-center sticky top-0 z-30">
          <h1 className="text-xl font-serif text-deep-rose italic font-bold">Diario de Abigail</h1>
          <div className="flex items-center gap-2">
            {isAdmin && <button onClick={() => setActiveTab('admin')} className={`p-2 rounded-full ${activeTab === 'admin' ? 'bg-deep-rose text-white' : 'text-deep-rose/40'}`}><ShieldCheck size={20}/></button>}
            <button onClick={logout} className="p-2 text-soft-text/30"><LogOut size={20}/></button>
          </div>
        </header>

        <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-12 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="w-full">
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM NAV - MOBILE */}
        <nav className="md:hidden fixed bottom-8 left-6 right-6 bg-white/95 backdrop-blur-xl border border-rose-pastel/50 rounded-[2.5rem] flex justify-around p-3 journal-shadow z-40">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-[1.5rem] transition-all ${activeTab === tab.id ? 'text-deep-rose bg-rose-pastel/50' : 'text-soft-text/40'}`}>
              <tab.icon size={22} />
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
