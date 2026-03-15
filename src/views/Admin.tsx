"use client";
import React, { useEffect, useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Users, Eye, Search, ShieldCheck, Activity, Heart, CheckCircle2, LogIn, Sparkles, X, BookOpen, Star, FileText, Flame, Calendar, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const MOCK_LOGS = [
  { id: '1', type: 'login', text: 'Sesión iniciada', user: 'Abigail', time: 'hace 2 min', icon: <LogIn size={14} /> },
  { id: '2', type: 'mood', text: 'Estado de ánimo: "Genial"', user: 'María', time: 'hace 15 min', icon: <Activity size={14} /> },
  { id: '3', type: 'habit', text: 'Completó hábito: Beber agua', user: 'Sara', time: 'hace 45 min', icon: <CheckCircle2 size={14} /> },
  { id: '4', type: 'verse', text: 'Versículo seleccionado: Salmos 23', user: 'Rebeca', time: 'hace 1 hora', icon: <Sparkles size={14} /> },
  { id: '5', type: 'note', text: 'Nueva nota de oración creada', user: 'Esther', time: 'hace 3 horas', icon: <Heart size={14} /> },
];

const MOODS: Record<string, string> = { triste: '😢', neutral: '😐', bien: '🙂', feliz: '😊', genial: '🤩' };
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const UserDiaryModal = ({ user: u, onClose }: { user: any; onClose: () => void }) => {
  const today = u.today || {};
  const habits = Array.isArray(u.habits) ? u.habits : [];
  const notes = Array.isArray(u.notes) ? u.notes : [];
  const userName = u.user?.name || 'Sin nombre';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(45,10,30,.5)', backdropFilter: 'blur(5px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">

        <div className="bg-[#e11d74] p-6 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Auditoría de Diario</p>
            <h3 className="text-xl font-serif italic text-white font-bold">{userName}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Estado de hoy */}
          <section className="card-premium">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-4">Estado del Día</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1d1d1f]/30 mb-1">Ánimo</p>
                <p className="text-2xl">{today.mood ? `${MOODS[today.mood] || '❓'} ${today.mood}` : '— Sin registro'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1d1d1f]/30 mb-1">Racha</p>
                <div className="flex items-center gap-1.5">
                  <Flame size={16} className="text-orange-500" />
                  <span className="text-lg font-black text-orange-500">{u.streak || 0} días</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#1d1d1f]/30 mb-1">Versículo</p>
                <p className="text-sm italic text-[#1d1d1f]/70 break-words">{today.devocionalRef || '— Ninguno'}</p>
              </div>
            </div>
          </section>

          {/* Prioridades */}
          {today.priorities?.filter(Boolean).length > 0 && (
            <section className="card-premium">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-3 flex items-center gap-2"><Star size={14} /> Prioridades</p>
              <ul className="space-y-2">
                {today.priorities.filter(Boolean).map((p: string, i: number) => (
                  <li key={i} className="text-sm font-medium text-[#1d1d1f] bg-[#fff0f5] p-3 rounded-xl break-words">{p}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Gratitud */}
          {today.gratitude?.filter(Boolean).length > 0 && (
            <section className="card-premium">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-3 flex items-center gap-2"><Heart size={14} /> Gratitud</p>
              <ul className="space-y-2">
                {today.gratitude.filter(Boolean).map((g: string, i: number) => (
                  <li key={i} className="text-sm italic text-[#1d1d1f]/70 bg-white/40 p-3 rounded-xl border border-[#ffd6e7]/20 break-words">"{g}"</li>
                ))}
              </ul>
            </section>
          )}

          {/* Tareas */}
          {today.tasks?.length > 0 && (
            <section className="card-premium">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> Tareas ({today.tasks.filter((t: any) => t.completed).length}/{today.tasks.length})</p>
              <ul className="space-y-1.5">
                {today.tasks.map((t: any) => (
                  <li key={t.id} className={`text-sm p-2 rounded-lg flex items-center gap-2 ${t.completed ? 'line-through text-[#1d1d1f]/30' : 'text-[#1d1d1f] font-medium'}`}>
                    <CheckCircle2 size={14} className={t.completed ? 'text-green-400' : 'text-[#ffd6e7]'} />
                    <span className="break-words">{t.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hábitos */}
          {habits.length > 0 && (
            <section className="card-premium">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-3 flex items-center gap-2"><Calendar size={14} /> Hábitos</p>
              <div className="space-y-3">
                {habits.map((h: any) => {
                  const completed = (h.completedDays || []).filter(Boolean).length;
                  return (
                    <div key={h.id} className="flex items-center gap-3 bg-[#fff0f5]/50 p-3 rounded-xl">
                      <span className="text-xl shrink-0">{h.emoji || '🌸'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#1d1d1f] break-words">{h.name}</p>
                        <div className="flex gap-1 mt-1">
                          {DAYS.map((d, i) => (
                            <div key={i} className={`w-5 h-5 rounded-full text-[8px] flex items-center justify-center font-bold ${h.completedDays?.[i] ? 'bg-[#e11d74] text-white' : 'bg-[#ffd6e7]/30 text-[#1d1d1f]/20'}`}>{d[0]}</div>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#e11d74] shrink-0">{completed}/7</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Notas */}
          {notes.length > 0 && (
            <section className="card-premium">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-3 flex items-center gap-2"><FileText size={14} /> Notas ({notes.length})</p>
              <div className="space-y-2">
                {notes.slice(0, 5).map((n: any) => (
                  <div key={n.id} className="bg-white/40 p-3 rounded-xl border border-[#ffd6e7]/20">
                    <p className="text-[10px] font-bold text-[#1d1d1f]/30 mb-1">{new Date(n.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-sm italic text-[#1d1d1f]/70 break-words line-clamp-3">{n.content}</p>
                  </div>
                ))}
                {notes.length > 5 && <p className="text-[10px] font-black text-[#e11d74] text-center">+{notes.length - 5} notas más</p>}
              </div>
            </section>
          )}

          {/* Devocional */}
          {today.devocionalVerse && (
            <section className="card-premium">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-3 flex items-center gap-2"><BookOpen size={14} /> Devocional</p>
              <blockquote className="text-sm italic text-[#1d1d1f] leading-relaxed border-l-2 border-[#e11d74] pl-4 break-words">
                "{today.devocionalVerse}"
                <span className="block text-[10px] font-black uppercase text-[#9b4f82] mt-2">— {today.devocionalRef}</span>
              </blockquote>
              {today.devocionalReflection && <p className="text-sm text-[#1d1d1f]/60 mt-3 italic break-words">Reflexión: {today.devocionalReflection}</p>}
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { getAllUsersData, isAdmin, user } = useJournal();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // ABI-22: Estados para Palabra del Día
  const [dailyWord, setDailyWord] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendDailyWord = async () => {
    if (!dailyWord.trim() || !user) return;
    setIsSending(true);
    try {
      await addDoc(collection(db, "announcements"), {
        message: dailyWord,
        sentBy: user.uid,
        sentAt: serverTimestamp(),
        type: 'daily_word'
      });
      setDailyWord('');
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2000);
    } catch (e) {
      console.error("Error sending daily word:", e);
    } finally {
      setIsSending(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      
      // Actualizar estado local
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (e) {
      console.error("Error updating role:", e);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getAllUsersData().then(data => {
        setUsers(data);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  if (!isAdmin) return <div className="p-20 text-center">No tienes permisos para ver esto.</div>;

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return u.id.toLowerCase().includes(term) ||
      (u.user?.name && u.user.name.toLowerCase().includes(term)) ||
      (u.today?.mood && u.today.mood.toLowerCase().includes(term));
  });

  // Cálculos de Estado del Sistema
  const stats = {
    total: users.length,
    active: users.filter(u => u.today?.mood).length,
    habits: users.reduce((acc, u) => {
      const completed = u.habits?.reduce((hAcc: number, h: any) => hAcc + (h.completedDays?.filter(Boolean).length || 0), 0) || 0;
      return acc + completed;
    }, 0)
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#ffd6e7] pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#e11d74] mb-2">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Soberana de Datos</span>
          </div>
          <h2 className="text-5xl font-serif text-[#1d1d1f] italic font-light">Panel Supremo</h2>
        </div>
        <div className="relative min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por ID o Ánimo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 card-premium border border-[#ffd6e7]/50 outline-none focus:border-[#e11d74] w-full md:w-80 transition-all bg-white/60 backdrop-blur-md min-w-0"
          />
        </div>
      </header>

      {/* MÉTRICAS DE ESTADO DEL SISTEMA */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Usuarios Totales', val: stats.total, icon: <Users size={20} />, color: '#e11d74' },
          { label: 'Activos Hoy', val: stats.active, icon: <Activity size={20} />, color: '#db2777' },
          { label: 'Hábitos Logrados', val: stats.habits, icon: <CheckCircle2 size={20} />, color: '#9b4f82' }
        ].map((s, i) => (
          <div key={i} className="card-premium flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner-sm" style={{ background: '#fff0f5', color: s.color, border: '1px solid #ffd6e7' }}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 truncate">{s.label}</p>
              <p className="text-3xl font-black leading-tight" style={{ color: s.color }}>{s.val}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ABI-22: ENVIAR PALABRA DEL DÍA */}
      <section className="card-premium bg-gradient-to-br from-[#fff0f5] to-white border-[#ffd6e7]/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#e11d74] flex items-center justify-center text-white shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#e11d74]">Palabra del Día</h3>
            <p className="text-sm italic text-[#1d1d1f]/50">Envía un mensaje de aliento a todas las usuarias</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea 
              value={dailyWord}
              onChange={(e) => setDailyWord(e.target.value.slice(0, 280))}
              placeholder="Escribe aquí el mensaje de hoy..."
              className="w-full p-6 bg-white border border-[#ffd6e7] rounded-3xl outline-none focus:border-[#e11d74] transition-all font-serif italic text-lg text-[#1d1d1f] min-h-[140px] resize-none break-words"
            />
            <div className="absolute bottom-4 right-6 text-[10px] font-black uppercase tracking-widest text-[#1d1d1f]/20">
              {dailyWord.length}/280
            </div>
          </div>
          
          <button 
            onClick={handleSendDailyWord}
            disabled={!dailyWord.trim() || isSending}
            className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 shrink-0 ${
              sendSuccess 
                ? 'bg-green-500 text-white' 
                : 'bg-[#e11d74] text-white hover:bg-[#db2777] shadow-lg shadow-[#e11d74]/20 disabled:opacity-30 disabled:shadow-none'
            }`}
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </>
            ) : sendSuccess ? (
              <>
                <CheckCircle2 size={16} />
                ¡Enviado con Éxito!
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Enviar Palabra del Día
              </>
            )}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LISTADO DE USUARIOS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Users size={18} className="text-[#e11d74]" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1d1d1f]/40">Comunidad de Abigail</h3>
          </div>
          
          {loading ? (
            <div className="py-20 text-center text-[#1d1d1f]/40 animate-pulse font-medium">Conectando con la base de datos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map((u) => (
                <div key={u.id} className="card-premium group transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#fff0f5] flex items-center justify-center text-[#e11d74] text-xl shadow-sm border border-[#ffd6e7] shrink-0">
                      {u.today?.mood === 'feliz' ? '😊' : u.today?.mood === 'triste' ? '😢' : u.today?.mood === 'bien' ? '🙂' : '👤'}
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4 min-w-0">
                      <p className="text-sm font-bold text-[#1d1d1f] truncate w-full text-right">{u.user?.name || 'Sin nombre'}</p>
                      <span className="text-[10px] font-mono text-[#1d1d1f]/30 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#ffd6e7]/30 truncate w-full text-right">ID: {u.id.slice(0,8)}</span>
                      {u.role === 'admin' && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-[#e11d74] text-white px-2 py-0.5 rounded-full shadow-sm">Admin</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] font-black text-[#1d1d1f]/30 uppercase tracking-[0.2em] mb-1">Estado de Hoy</p>
                      <p className="text-lg font-bold text-[#1d1d1f] capitalize truncate">{u.today?.mood || 'Silencio'}</p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-black text-[#1d1d1f]/30 uppercase tracking-[0.2em] mb-2">Destellos de Gratitud</p>
                      <div className="space-y-2">
                        {u.today?.gratitude?.filter(Boolean).slice(0,1).map((g: string, i: number) => (
                          <p key={i} className="text-sm text-[#1d1d1f]/70 italic leading-relaxed break-words bg-white/40 p-3 rounded-xl border border-[#ffd6e7]/20">"{g}"</p>
                        )) || <p className="text-sm text-[#1d1d1f]/20 italic">Corazón en espera...</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button onClick={() => setSelectedUser(u)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#fff0f5] text-[#e11d74] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#e11d74] hover:text-white transition-all duration-300 border border-[#ffd6e7] shrink-0 min-w-0">
                      <Eye size={14} /> <span className="truncate">Auditar</span>
                    </button>
                    {u.id !== user?.uid && (
                      <button
                        onClick={() => toggleRole(u.id, u.role || 'user')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border shrink-0 min-w-0 ${
                          u.role === 'admin'
                            ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'
                            : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white'
                        }`}
                      >
                        {u.role === 'admin' ? (
                          <><ShieldAlert size={14} /> <span className="truncate">Quitar Admin</span></>
                        ) : (
                          <><ShieldCheck size={14} /> <span className="truncate">Hacer Admin</span></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVIDAD RECIENTE (LOGS) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 mb-2 px-2">
            <Activity size={18} className="text-[#e11d74]" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1d1d1f]/40">Actividad Reciente</h3>
          </div>

          <div className="card-premium space-y-1">
            {MOCK_LOGS.map((log, idx) => (
              <div key={log.id} className={`flex items-start gap-4 p-4 transition-colors hover:bg-[#fff0f5]/50 rounded-2xl ${idx !== MOCK_LOGS.length - 1 ? 'border-b border-[#ffd6e7]/20' : ''}`}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff0f5', color: '#e11d74' }}>
                  {log.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#1d1d1f] break-words leading-tight">{log.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-[#e11d74] bg-[#fff0f5] px-1.5 py-0.5 rounded uppercase">{log.user}</span>
                    <span className="text-[10px] text-[#1d1d1f]/30 font-medium tracking-tight">• {log.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full pt-4 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] hover:underline transition-all">Ver todos los eventos</button>
          </div>

          {/* ESTADO DE SERVIDORES */}
          <div className="card-premium bg-gradient-to-br from-[#e11d74]/5 to-transparent border-[#ffd6e7]/30">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e11d74] mb-4">Salud de Red</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-[#1d1d1f]">Firestore Cloud</span>
              </div>
              <span className="text-[10px] font-mono text-green-600 font-bold">ACTIVO</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && <UserDiaryModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
