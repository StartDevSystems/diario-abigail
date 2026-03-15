"use client";
import React, { useEffect, useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Users, Eye, Search, ShieldCheck } from 'lucide-react';

const Admin: React.FC = () => {
  const { getAllUsersData, isAdmin } = useJournal();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) {
      getAllUsersData().then(data => {
        setUsers(data);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  if (!isAdmin) return <div className="p-20 text-center">No tienes permisos para ver esto.</div>;

  const filteredUsers = users.filter(u => 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.today?.mood && u.today.mood.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ffd6e7] pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#e11d74] mb-2">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Panel de Control</span>
          </div>
          <h2 className="text-5xl font-serif text-[#1d1d1f] italic font-light">Admin Supremo</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por ID o Ánimo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 card-premium !rounded-2xl border border-[#ffd6e7]/50 outline-none focus:border-[#e11d74] w-full md:w-80 transition-all bg-white/60 backdrop-blur-md"
          />
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center text-[#1d1d1f]/40 animate-pulse font-medium">Cargando base de datos maestra...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUsers.map((u) => (
            <div key={u.id} className="card-premium p-8 group transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#fff0f5] flex items-center justify-center text-[#e11d74] text-xl shadow-sm border border-[#ffd6e7]">
                  {u.today?.mood === 'feliz' ? '😊' : u.today?.mood === 'triste' ? '😢' : '👤'}
                </div>
                <span className="text-[10px] font-mono text-[#1d1d1f]/30 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#ffd6e7]/30">{u.id.slice(0,8)}...</span>
              </div>
              
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-[#1d1d1f]/30 uppercase tracking-[0.2em] mb-1">Estado de Hoy</p>
                  <p className="text-lg font-bold text-[#1d1d1f] capitalize">{u.today?.mood || 'No registrado'}</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-black text-[#1d1d1f]/30 uppercase tracking-[0.2em] mb-2">Últimos Agradecimientos</p>
                  <div className="space-y-2">
                    {u.today?.gratitude?.filter(Boolean).slice(0,2).map((g: string, i: number) => (
                      <p key={i} className="text-sm text-[#1d1d1f]/70 italic leading-relaxed line-clamp-1 bg-white/40 p-2 rounded-xl">"{g}"</p>
                    )) || <p className="text-sm text-[#1d1d1f]/20 italic">Sin registros</p>}
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-[#fff0f5] text-[#e11d74] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#e11d74] hover:text-white transition-all duration-300 border border-[#ffd6e7]">
                <Eye size={16} /> Ver Diario Completo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
