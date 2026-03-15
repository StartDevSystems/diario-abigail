"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Home, BookOpen, Star, FileText, LogOut, ShieldCheck, Settings, ChevronDown, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FloralDecoration from './FloralDecoration';
import Scene3D from './Scene3D';
import gsap from 'gsap';
import { useJournal } from '@/context/JournalContext';
import Image from 'next/image';

const TABS = [
  { id: 'hoy', name: 'Hoy', icon: Home },
  { id: 'semana', name: 'Semana', icon: Calendar },
  { id: 'habitos', name: 'Hábitos', icon: Star },
  { id: 'devocional', name: 'Devocional', icon: BookOpen },
  { id: 'notas', name: 'Notas', icon: FileText },
];

const MOODS = [
  { emoji: '😢', label: 'triste' },
  { emoji: '😐', label: 'neutral' },
  { emoji: '🙂', label: 'bien' },
  { emoji: '😊', label: 'feliz' },
  { emoji: '🤩', label: 'genial' },
];

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { state, updateToday, logout, user, isAdmin } = useJournal();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  const firstName = state?.user?.name || user?.displayName?.split(' ')[0] || "Abigail";
  const selectedMoodEmoji = MOODS.find(m => m.label === state?.today?.mood)?.emoji;

  const fontMap: Record<string, string> = {
    'Lora': 'var(--font-lora)',
    'Playfair Display': 'var(--font-playfair)',
    'Inter': 'var(--font-inter)',
    'Great Vibes': 'var(--font-great-vibes)',
  };

  const currentFont = fontMap[state?.settings?.fontFamily || 'Lora'] || 'var(--font-lora)';
  
  const sizeMap: Record<string, string> = {
    'small': '0.9rem',
    'medium': '1rem',
    'large': '1.1rem',
  };
  const currentSize = sizeMap[state?.settings?.fontSize || 'medium'] || '1rem';

  return (
    <div className="flex min-h-screen bg-[#fffcf2] overflow-hidden relative selection:bg-accent-pink/40 text-soft-text"
         style={{ fontFamily: currentFont, fontSize: currentSize }}>
      <Scene3D />
      <FloralDecoration />
      
      <aside ref={sidebarRef} className="hidden md:flex flex-col w-72 bg-white/40 backdrop-blur-2xl border-r border-rose-pastel/50 journal-shadow z-20">
        <div className="p-10 flex flex-col items-center text-center">
          <div className="mb-6 relative w-24 h-24 rounded-full overflow-hidden border-2 border-rose-pastel shadow-sm bg-white p-1">
            <Image src="/logo-full.png" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-serif text-deep-rose italic font-bold leading-tight">Diario de <br/> Abigail</h1>
          <div className="w-10 h-1 bg-accent-pink mt-4 rounded-full opacity-40" />
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group ${activeTab === tab.id ? 'bg-white text-deep-rose font-bold shadow-sm translate-x-2' : 'text-soft-text/60 hover:bg-white/60 hover:text-soft-text'}`}>
              <tab.icon size={20} className={activeTab === tab.id ? 'text-accent-pink' : 'group-hover:text-accent-pink'} />
              <span className="text-sm font-semibold">{tab.name}</span>
            </button>
          ))}

          {isAdmin && (
            <button onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 border-2 mt-4 ${activeTab === 'admin' ? 'bg-deep-rose text-white border-deep-rose shadow-lg scale-105' : 'border-rose-pastel/30 text-deep-rose/60 hover:bg-rose-pastel/20'}`}>
              <ShieldCheck size={20} />
              <span className="text-sm font-bold uppercase tracking-tighter">Panel Admin</span>
            </button>
          )}
        </nav>

        <div className="p-10 mt-auto space-y-4 text-center">
          <p className="text-[10px] font-black uppercase text-deep-rose/30 tracking-widest leading-relaxed">Hecho con amor <br/> para Abigail</p>
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 flex flex-col min-h-screen relative overflow-y-auto z-10 w-full">
        
        <header className="p-6 md:px-12 md:py-8 bg-transparent flex justify-between items-center sticky top-0 z-30">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-pastel shadow-sm bg-white p-0.5 relative">
              <Image src="/logo-full.png" alt="Logo" fill className="object-contain" />
            </div>
            <h1 className="text-xl font-serif text-deep-rose italic font-bold leading-none">Abigail</h1>
          </div>

          <div className="hidden md:block" />

          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1.5 pr-4 rounded-full border border-rose-pastel shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-deep-rose/20 bg-rose-pastel/20 flex items-center justify-center shadow-inner">
                {user?.photoURL ? (
                  <Image src={user.photoURL} alt="Perfil" fill className="object-cover" unoptimized />
                ) : (
                  <span className="text-lg font-black text-deep-rose">{firstName[0]}</span>
                )}
                {selectedMoodEmoji && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm border border-rose-pastel">
                    {selectedMoodEmoji}
                  </div>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[8px] font-black uppercase text-deep-rose/40 tracking-widest leading-none mb-0.5">Mi Espacio</p>
                <p className="text-[11px] font-bold text-soft-text">{firstName}</p>
              </div>
              <ChevronDown size={12} className={`text-soft-text/30 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-60 bg-white rounded-[2rem] border border-rose-pastel shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-5 bg-rose-pastel/10 border-b border-rose-pastel/20">
                      <p className="text-[9px] font-black uppercase text-deep-rose/40 tracking-widest mb-3 text-center">¿Cómo te sientes hoy?</p>
                      <div className="flex justify-around">
                        {MOODS.map((m) => (
                          <button 
                            key={m.label} 
                            onClick={() => { updateToday({ mood: m.label as any }); setShowProfileMenu(false); }} 
                            className={`text-2xl transition-transform hover:scale-125 ${state?.today?.mood === m.label ? 'drop-shadow-md' : 'opacity-60 hover:opacity-100'}`}
                          >
                            {m.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => { setActiveTab('configuracion'); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-pastel/20 text-soft-text font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        <Settings size={16} className="text-deep-rose" /> Ajustes
                      </button>
                      <div className="h-px bg-rose-pastel/10 mx-4 my-1" />
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        <LogOut size={16} /> Salir
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:px-12 md:pb-32 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="w-full">
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <nav className="md:hidden fixed bottom-8 left-6 right-6 bg-white/95 backdrop-blur-xl border border-rose-pastel/50 rounded-[2.5rem] flex justify-around p-3 journal-shadow z-40 ring-8 ring-rose-pastel/5">
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
