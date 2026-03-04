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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-pastel pb-6">
        <div>
          <div className="flex items-center gap-2 text-deep-rose mb-1">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Panel de Control</span>
          </div>
          <h2 className="text-4xl font-serif text-soft-text italic">Admin Supremo</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-text/30" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por ID o Ánimo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 bg-white rounded-2xl border border-rose-pastel/50 outline-none focus:border-accent-pink w-full md:w-64 transition-all"
          />
        </div>
      </header>

      {loading ? (
        <div className="py-20 text-center text-soft-text/40 animate-pulse">Cargando base de datos maestra...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <div key={u.id} className="bg-white p-6 rounded-[2rem] journal-shadow border border-rose-pastel/30 group hover:border-accent-pink transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-lavender-pastel flex items-center justify-center text-deep-rose font-bold">
                  {u.today?.mood === 'feliz' ? '😊' : u.today?.mood === 'triste' ? '😢' : '👤'}
                </div>
                <span className="text-[9px] font-mono text-soft-text/20 bg-gray-50 px-2 py-1 rounded-md">{u.id.slice(0,8)}...</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-soft-text/30 uppercase tracking-widest">Estado de Hoy</p>
                  <p className="text-sm font-bold text-soft-text capitalize">{u.today?.mood || 'No registrado'}</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-soft-text/30 uppercase tracking-widest">Últimos Agradecimientos</p>
                  <div className="space-y-1 mt-1">
                    {u.today?.gratitude?.filter(Boolean).slice(0,2).map((g: string, i: number) => (
                      <p key={i} className="text-[11px] text-soft-text/60 italic leading-tight line-clamp-1">"{g}"</p>
                    )) || <p className="text-[11px] text-soft-text/20">Sin registros</p>}
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-rose-pastel/20 text-deep-rose rounded-xl text-xs font-bold hover:bg-rose-pastel transition-colors">
                <Eye size={14} /> Ver Diario Completo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
