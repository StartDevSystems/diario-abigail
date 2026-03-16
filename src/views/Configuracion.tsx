"use client";
import React, { useState, useEffect } from "react";
import { useJournal } from "../context/JournalContext";
import { 
  Palette, User, Shield, Save, Loader2, 
  ChevronRight, Type, Smartphone, Lock, 
  Users, Activity, Wifi, WifiOff, Trash2, Key,
  MessageSquare, CheckCircle2
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

type Tab = 'visual' | 'perfil' | 'admin';

const Configuracion: React.FC = () => {
  const { state, updateProfile, updateSettings, isAdmin, getAllUsersData, user } = useJournal();
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [saving, setSaving] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  // Estado para el buzón de sugerencias
  const [suggestion, setSuggestion] = useState("");
  const [sendingSuggestion, setSendingSuggestion] = useState(false);
  const [suggestionSent, setSuggestionSent] = useState(false);

  const handleSendSuggestion = async () => {
    if (!suggestion.trim() || !user || !state?.user?.name) return;
    setSendingSuggestion(true);
    try {
      await addDoc(collection(db, "suggestions"), {
        message: suggestion.trim(),
        userId: user.uid,
        userName: state.user.name,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setSuggestion("");
      setSuggestionSent(true);
      setTimeout(() => setSuggestionSent(false), 2000);
    } catch (e) {
      console.error("Error al enviar sugerencia:", e);
    } finally {
      setSendingSuggestion(false);
    }
  };

  // Formulario local (inicializado con datos del estado)
  const [form, setForm] = useState({
    userName: state?.user?.name || "Abigail",
    userBio: state?.user?.bio || "Tu espacio seguro y personal ✨",
    fontSize: state?.settings?.fontSize || "medium",
    fontFamily: state?.settings?.fontFamily || "Lora",
    themeColor: state?.settings?.themeColor || "#e11d74",
  });

  // Sincronizar formulario si el estado cambia (útil en la primera carga)
  useEffect(() => {
    if (state?.user || state?.settings) {
      setForm({
        userName: state?.user?.name || "Abigail",
        userBio: state?.user?.bio || "Tu espacio seguro y personal ✨",
        fontSize: state?.settings?.fontSize || "medium",
        fontFamily: state?.settings?.fontFamily || "Lora",
        themeColor: state?.settings?.themeColor || "#e11d74",
      });
    }
  }, [state]);

  // Carga de datos de admin si es necesario
  useEffect(() => {
    if (isAdmin && activeTab === 'admin') {
      setLoadingAdmin(true);
      getAllUsersData().then(data => {
        setUsers(data);
        setLoadingAdmin(false);
      });
    }
  }, [isAdmin, activeTab]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: form.userName, bio: form.userBio });
      await updateSettings({ 
        fontSize: form.fontSize as any, 
        fontFamily: form.fontFamily, 
        themeColor: form.themeColor 
      });
      // Pequeño delay visual para feedback
      setTimeout(() => setSaving(false), 500);
    } catch (e) {
      console.error("Error al guardar:", e);
      setSaving(false);
    }
  };

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  // Helper para componentes de UI tipo Abigail
  const ConfigCard = ({ title, icon: Icon, children }: any) => (
    <div className="card-premium overflow-hidden mb-8">
      <div className="bg-[#fff0f5]/50 px-8 py-5 border-b border-[#ffd6e7]/30 backdrop-blur-md flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-[#ffd6e7]/50">
          <Icon size={20} className="text-[#e11d74]" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1d1d1f]">{title}</h3>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <header className="mb-12 text-center md:text-left relative">
        <h2 className="text-6xl font-serif text-[#1d1d1f] italic font-light mb-3">Ajustes</h2>
        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#e11d74]/60">Personaliza tu experiencia premium</p>
        
        {/* Espirales decorativas */}
        <div className="absolute -left-12 top-0 hidden xl:flex flex-col gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-7 h-7 rounded-full bg-[#ffd6e7] border-2 border-[#ffb3d1] shadow-sm" />
          ))}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-10">
        {/* TABS */}
        <aside className="w-full md:w-56 shrink-0 space-y-3">
          <button onClick={() => setActiveTab('perfil')} className={`w-full flex items-center gap-4 px-7 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'perfil' ? 'bg-[#e11d74] text-white shadow-xl shadow-[#e11d74]/20 scale-105' : 'bg-white/60 backdrop-blur-md text-[#1d1d1f]/60 hover:bg-white journal-shadow border border-white/40'}`}>
            <User size={18} /> Perfil
          </button>
          <button onClick={() => setActiveTab('visual')} className={`w-full flex items-center gap-4 px-7 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'visual' ? 'bg-[#e11d74] text-white shadow-xl shadow-[#e11d74]/20 scale-105' : 'bg-white/60 backdrop-blur-md text-[#1d1d1f]/60 hover:bg-white journal-shadow border border-white/40'}`}>
            <Palette size={18} /> Estilo
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center gap-4 px-7 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 scale-105' : 'bg-white/60 backdrop-blur-md text-[#1d1d1f]/60 hover:bg-white journal-shadow border border-white/40'}`}>
              <Shield size={18} /> Sistema
            </button>
          )}
          
          <button onClick={handleSave} disabled={saving} className="w-full mt-10 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-[#e11d74] text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#e11d74]/20">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Guardar Todo
          </button>
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1">
          {activeTab === 'perfil' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ConfigCard title="Tu Identidad" icon={User}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#1d1d1f]/40 ml-3 tracking-widest">Nombre en el Diario</label>
                    <input value={form.userName} onChange={e => set('userName', e.target.value)} className="w-full bg-white/40 backdrop-blur-sm border-2 border-[#ffd6e7]/30 rounded-2xl p-5 font-bold text-[#1d1d1f] outline-none focus:border-[#e11d74] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#1d1d1f]/40 ml-3 tracking-widest">Tu frase inspiradora</label>
                    <textarea value={form.userBio} onChange={e => set('userBio', e.target.value)} rows={3} className="w-full bg-white/40 backdrop-blur-sm border-2 border-[#ffd6e7]/30 rounded-2xl p-5 font-bold text-[#1d1d1f] outline-none focus:border-[#e11d74] transition-all resize-none italic" />
                  </div>
                </div>
              </ConfigCard>

              <ConfigCard title="Buzón de Sugerencias" icon={MessageSquare}>
                <div className="space-y-4">
                  <div className="relative">
                    <textarea 
                      value={suggestion}
                      onChange={e => setSuggestion(e.target.value.slice(0, 500))}
                      placeholder="Escribe tu sugerencia o idea..."
                      rows={4}
                      className="w-full bg-white/40 backdrop-blur-sm border-2 border-[#ffd6e7]/30 rounded-2xl p-5 font-medium text-[#1d1d1f] outline-none focus:border-[#e11d74] transition-all resize-none"
                    />
                    <div className="absolute bottom-4 right-5 text-[10px] font-black uppercase tracking-widest text-[#1d1d1f]/20">
                      {suggestion.length}/500
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSendSuggestion}
                    disabled={!suggestion.trim() || sendingSuggestion}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                      suggestionSent 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[#e11d74] text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#e11d74]/10 disabled:opacity-30 disabled:hover:scale-100'
                    }`}
                  >
                    {sendingSuggestion ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : suggestionSent ? (
                      <><CheckCircle2 size={18} /> ¡Enviado!</>
                    ) : (
                      <><MessageSquare size={18} /> Enviar Sugerencia</>
                    )}
                  </button>
                </div>
              </ConfigCard>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <ConfigCard title="Tipografía Sagrada" icon={Type}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { id: 'Lora', name: 'Lora (Legible)', desc: 'Ideal para lectura larga.' },
                    { id: 'Playfair Display', name: 'Playfair (Elegante)', desc: 'Clásica y sofisticada.' },
                    { id: 'Inter', name: 'Inter (Moderna)', desc: 'Limpia y minimalista.' },
                    { id: 'Great Vibes', name: 'Cursiva (Femenina)', desc: 'Toque personal.' }
                  ].map(font => (
                    <button key={font.id} onClick={() => set('fontFamily', font.id)} className={`p-5 rounded-2xl border-2 transition-all text-left shadow-sm ${form.fontFamily === font.id ? 'border-[#e11d74] bg-[#fff0f5]' : 'border-[#ffd6e7]/30 bg-white/60 hover:border-[#e11d74]/30'}`}>
                      <p className="font-bold text-base text-[#1d1d1f]" style={{ fontFamily: font.id }}>{font.name}</p>
                      <p className="text-[11px] text-[#1d1d1f]/40 mt-1 font-medium">{font.desc}</p>
                    </button>
                  ))}
                </div>
              </ConfigCard>

              <ConfigCard title="Tamaño de Lectura" icon={Smartphone}>
                <div className="flex gap-5">
                  {['Pequeña', 'Normal', 'Grande'].map((size, i) => (
                    <button key={size} onClick={() => set('fontSize', ['small', 'medium', 'large'][i])} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all journal-shadow border border-white/40 ${form.fontSize === ['small', 'medium', 'large'][i] ? 'bg-[#e11d74] text-white scale-105' : 'bg-white/60 text-[#1d1d1f]/40'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </ConfigCard>
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <ConfigCard title="Usuarios del Sistema" icon={Users}>
                <div className="divide-y divide-[#ffd6e7]/20">
                  {loadingAdmin ? (
                    <p className="text-center py-6 text-sm italic text-[#1d1d1f]/40 font-medium animate-pulse">Conectando con la base de datos...</p>
                  ) : (
                    users.map(u => (
                      <div key={u.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#fff0f5] border border-[#ffd6e7] flex items-center justify-center text-xs font-black text-[#e11d74]">{(u.user?.name || 'U')[0]}</div>
                          <p className="text-sm font-bold text-[#1d1d1f]">{u.user?.name || 'Sin nombre'}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase px-3 py-1.5 bg-white/60 border border-[#ffd6e7]/30 rounded-lg text-[#1d1d1f]/60">{u.role || 'USER'}</span>
                      </div>
                    ))
                  )}
                </div>
              </ConfigCard>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <button className="flex items-center gap-4 p-5 bg-blue-50/50 backdrop-blur-sm rounded-2xl border-2 border-blue-100 text-blue-600 font-black text-xs uppercase tracking-widest transition-all hover:scale-105">
                  <Wifi size={18} /> Estado del Servidor
                </button>
                <button className="flex items-center gap-4 p-5 bg-red-50/50 backdrop-blur-sm rounded-2xl border-2 border-red-100 text-red-600 font-black text-xs uppercase tracking-widest transition-all hover:scale-105">
                  <Activity size={18} /> Logs de Auditoría
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Configuracion;
