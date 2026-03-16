"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useJournal } from "../context/JournalContext";
import {
  Palette, User, Shield, Save, Loader2,
  ChevronRight, Type, Smartphone, Lock,
  Users, Activity, Wifi, WifiOff, Trash2, Key,
  MessageSquare, CheckCircle2, Flame, Calendar,
  FileText, BarChart3, Camera
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { applyTheme } from "../components/Layout";
import { HexColorPicker } from "react-colorful";

type Tab = 'visual' | 'perfil' | 'admin';

const THEME_PALETTES = [
  { id: 'rose',     name: 'Rosa Clásico',  color: '#e11d74' },
  { id: 'lavender', name: 'Lavanda',       color: '#7c3aed' },
  { id: 'ocean',    name: 'Océano',        color: '#0ea5e9' },
  { id: 'emerald',  name: 'Esmeralda',     color: '#059669' },
  { id: 'sunset',   name: 'Atardecer',     color: '#ea580c' },
  { id: 'gold',     name: 'Dorado',        color: '#d97706' },
  { id: 'crimson',  name: 'Carmesí',       color: '#dc2626' },
  { id: 'slate',    name: 'Elegante',      color: '#475569' },
];

const Configuracion: React.FC = () => {
  const { state, updateProfile, updateSettings, isAdmin, getAllUsersData, user } = useJournal();
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [saving, setSaving] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const rafRef = useRef<number | null>(null);
  const pendingColorRef = useRef<string | null>(null);

  const handlePickerChange = useCallback((color: string) => {
    pendingColorRef.current = color;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingColorRef.current) {
          const c = pendingColorRef.current;
          applyTheme(c);
          setForm(prev => ({ ...prev, themeColor: c }));
          pendingColorRef.current = null;
        }
        rafRef.current = null;
      });
    }
  }, []);

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

  // Sincronizar formulario solo en la primera carga real de datos
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && (state?.user?.name || state?.settings?.fontSize)) {
      initializedRef.current = true;
      setForm({
        userName: state?.user?.name || "Abigail",
        userBio: state?.user?.bio || "Tu espacio seguro y personal ✨",
        fontSize: state?.settings?.fontSize || "medium",
        fontFamily: state?.settings?.fontFamily || "Lora",
        themeColor: state?.settings?.themeColor || "#e11d74",
      });
    }
  }, [state?.user?.name, state?.settings?.fontSize]);

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

  // Efecto para preview en tiempo real del tema (presets y carga inicial)
  const prevThemeRef = useRef(form.themeColor);
  useEffect(() => {
    if (form.themeColor && form.themeColor !== prevThemeRef.current) {
      prevThemeRef.current = form.themeColor;
      applyTheme(form.themeColor);
    }
  }, [form.themeColor]);

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
      <div className="bg-theme-pastel/50 px-8 py-5 border-b border-theme-border/30 backdrop-blur-md flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-theme-border/50">
          <Icon size={20} className="text-theme-primary" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-soft-text">{title}</h3>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-32 px-4 relative">
      <header className="mb-12 text-center md:text-left relative">
        <h2 className="text-6xl font-serif text-soft-text italic font-light mb-3">Ajustes</h2>
        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-theme-primary/60">Personaliza tu experiencia premium</p>
        
        {/* Espirales decorativas */}
        <div className="absolute -left-12 top-0 hidden xl:flex flex-col gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-7 h-7 rounded-full bg-theme-border border-2 border-theme-border shadow-sm" />
          ))}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-10">
        {/* TABS */}
        <aside className="w-full md:w-56 shrink-0 space-y-3">
          <button onClick={() => setActiveTab('perfil')} className={`w-full flex items-center gap-4 px-7 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'perfil' ? 'bg-theme-primary text-white shadow-xl shadow-theme-primary/20 scale-105' : 'bg-white/60 backdrop-blur-md text-soft-text/60 hover:bg-white journal-shadow border border-white/40'}`}>
            <User size={18} /> Perfil
          </button>
          <button onClick={() => setActiveTab('visual')} className={`w-full flex items-center gap-4 px-7 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'visual' ? 'bg-theme-primary text-white shadow-xl shadow-theme-primary/20 scale-105' : 'bg-white/60 backdrop-blur-md text-soft-text/60 hover:bg-white journal-shadow border border-white/40'}`}>
            <Palette size={18} /> Estilo
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center gap-4 px-7 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'admin' ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 scale-105' : 'bg-white/60 backdrop-blur-md text-soft-text/60 hover:bg-white journal-shadow border border-white/40'}`}>
              <Shield size={18} /> Sistema
            </button>
          )}
          
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1">
          {activeTab === 'perfil' && (() => {
            // -- Estadisticas calculadas --
            const activeDays = (state.history?.length || 0) + (state.today?.mood ? 1 : 0);
            const currentStreak = (state as any).streak?.current || (typeof state.streak === 'number' ? state.streak : 0);
            const todayCompleted = state.today?.tasks?.filter((t: any) => t.done || t.completed)?.length || 0;
            const historyCompleted = state.history?.reduce((acc: number, day: any) =>
              acc + (day.tasks?.filter((t: any) => t.done || t.completed)?.length || 0), 0) || 0;
            const totalTasksCompleted = todayCompleted + historyCompleted;
            const totalNotes = state.notes?.length || 0;

            // -- Mood distribution --
            const moodCounts: Record<string, number> = {};
            state.history?.forEach((day: any) => {
              if (day.mood) moodCounts[day.mood] = (moodCounts[day.mood] || 0) + 1;
            });
            if (state.today?.mood) moodCounts[state.today.mood] = (moodCounts[state.today.mood] || 0) + 1;
            const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);

            const MOOD_META: Record<string, { emoji: string; label: string }> = {
              triste:  { emoji: '\u{1F622}', label: 'Triste' },
              neutral: { emoji: '\u{1F610}', label: 'Neutral' },
              bien:    { emoji: '\u{1F642}', label: 'Bien' },
              feliz:   { emoji: '\u{1F60A}', label: 'Feliz' },
              genial:  { emoji: '\u{1F929}', label: 'Genial' },
            };

            const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
            const topMood = sortedMoods[0];

            const profileInitials = (form.userName || 'A')
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            const statsData = [
              { label: 'Dias Activos', value: activeDays, Icon: Calendar, accent: 'text-blue-500' },
              { label: 'Racha Actual', value: currentStreak, Icon: Flame, accent: 'text-orange-500' },
              { label: 'Tareas Hechas', value: totalTasksCompleted, Icon: CheckCircle2, accent: 'text-green-500' },
              { label: 'Notas Escritas', value: totalNotes, Icon: FileText, accent: 'text-purple-500' },
            ];

            return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

              {/* ===== A. HEADER DEL PERFIL ===== */}
              <div className="card-premium overflow-hidden">
                <div className="bg-theme-pastel/40 px-6 py-10 sm:px-10 sm:py-12 border-b border-theme-border/20">
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] border-4 border-theme-primary/30 overflow-hidden bg-white/60 flex items-center justify-center shadow-xl">
                        {(state?.user?.avatar || user?.photoURL) ? (
                          <img
                            src={state?.user?.avatar || user?.photoURL || ''}
                            alt={form.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl sm:text-5xl font-serif italic font-bold text-theme-primary/70 select-none">
                            {profileInitials}
                          </span>
                        )}
                      </div>
                      {/* Botón cambiar foto */}
                      <label className="absolute bottom-1 left-1 w-10 h-10 rounded-full bg-theme-primary text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border-2 border-white">
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 500_000) {
                              alert('La imagen debe ser menor a 500KB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const base64 = ev.target?.result as string;
                              updateProfile({ avatar: base64 });
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {isAdmin && (
                        <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-4 border-white shadow-lg">
                          Admin
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left flex-1 min-w-0">
                      <h3 className="text-3xl sm:text-4xl font-serif italic font-light text-soft-text leading-tight break-words">
                        {form.userName || 'Sin nombre'}
                      </h3>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-theme-primary/60 mt-2">
                        {user?.email || ''}
                      </p>
                      {form.userBio && (
                        <p className="text-sm italic text-soft-text/50 mt-3 font-medium break-words">
                          {form.userBio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== B. STATS GRID ===== */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((s, i) => (
                  <div
                    key={i}
                    className="card-premium overflow-hidden flex flex-col items-center justify-center text-center py-7 px-4 transition-all hover:scale-[1.02]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-theme-pastel/60 border border-theme-border/40 flex items-center justify-center mb-3 shadow-sm">
                      <s.Icon size={22} className={s.accent} />
                    </div>
                    <p className="text-3xl sm:text-4xl font-serif italic font-bold text-soft-text tracking-tight">
                      {s.value}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-soft-text/40 mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ===== C. RESUMEN EMOCIONAL ===== */}
              <ConfigCard title="Resumen Emocional" icon={BarChart3}>
                {totalMoods === 0 ? (
                  <p className="text-sm italic text-soft-text/40 font-medium text-center py-4">
                    Aun no hay registros de mood. Registra tu primer estado de animo en la vista Hoy.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {/* Mood mas frecuente */}
                    {topMood && (
                      <div className="flex items-center gap-4 p-5 bg-theme-pastel/40 rounded-2xl border border-theme-border/30">
                        <span className="text-4xl">{MOOD_META[topMood[0]]?.emoji || topMood[0]}</span>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-soft-text/40">Mood mas frecuente</p>
                          <p className="text-lg font-serif italic font-bold text-soft-text">
                            {MOOD_META[topMood[0]]?.label || topMood[0]} &mdash; {topMood[1]} {topMood[1] === 1 ? 'vez' : 'veces'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Barras de distribucion */}
                    <div className="space-y-3">
                      {['genial', 'feliz', 'bien', 'neutral', 'triste'].map(mood => {
                        const count = moodCounts[mood] || 0;
                        const pct = totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0;
                        return (
                          <div key={mood} className="flex items-center gap-3">
                            <span className="text-xl w-8 text-center shrink-0">{MOOD_META[mood]?.emoji}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-soft-text/50 w-16 shrink-0">
                              {MOOD_META[mood]?.label}
                            </span>
                            <div className="flex-1 h-5 bg-theme-pastel/40 rounded-full overflow-hidden border border-theme-border/20">
                              <div
                                className="h-full bg-theme-primary/60 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-soft-text/50 w-10 text-right shrink-0">
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </ConfigCard>

              {/* ===== D. EDITAR IDENTIDAD ===== */}
              <ConfigCard title="Tu Identidad" icon={User}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-soft-text/40 ml-3 tracking-widest">Nombre en el Diario</label>
                    <input value={form.userName} onChange={e => set('userName', e.target.value)} className="w-full bg-white/40 backdrop-blur-sm border-2 border-theme-border/30 rounded-2xl p-5 font-bold text-soft-text outline-none focus:border-theme-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-soft-text/40 ml-3 tracking-widest">Tu frase inspiradora</label>
                    <textarea value={form.userBio} onChange={e => set('userBio', e.target.value)} rows={3} className="w-full bg-white/40 backdrop-blur-sm border-2 border-theme-border/30 rounded-2xl p-5 font-bold text-soft-text outline-none focus:border-theme-primary transition-all resize-none italic" />
                  </div>
                </div>
              </ConfigCard>

              {/* ===== BUZON DE SUGERENCIAS ===== */}
              <ConfigCard title="Buzon de Sugerencias" icon={MessageSquare}>
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={suggestion}
                      onChange={e => setSuggestion(e.target.value.slice(0, 500))}
                      placeholder="Escribe tu sugerencia o idea..."
                      rows={4}
                      className="w-full bg-white/40 backdrop-blur-sm border-2 border-theme-border/30 rounded-2xl p-5 font-medium text-soft-text outline-none focus:border-theme-primary transition-all resize-none"
                    />
                    <div className="absolute bottom-4 right-5 text-[10px] font-black uppercase tracking-widest text-soft-text/20">
                      {suggestion.length}/500
                    </div>
                  </div>
                  <button
                    onClick={handleSendSuggestion}
                    disabled={!suggestion.trim() || sendingSuggestion}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                      suggestionSent
                        ? 'bg-green-500 text-white'
                        : 'bg-theme-primary text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-theme-primary/10 disabled:opacity-30 disabled:hover:scale-100'
                    }`}
                  >
                    {sendingSuggestion ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : suggestionSent ? (
                      <><CheckCircle2 size={18} /> Enviado!</>
                    ) : (
                      <><MessageSquare size={18} /> Enviar Sugerencia</>
                    )}
                  </button>
                </div>
              </ConfigCard>
            </div>
            );
          })()}

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
                    <button key={font.id} onClick={() => set('fontFamily', font.id)} className={`p-5 rounded-2xl border-2 transition-all text-left shadow-sm ${form.fontFamily === font.id ? 'border-theme-primary bg-theme-pastel' : 'border-theme-border/30 bg-white/60 hover:border-theme-primary/30'}`}>
                      <p className="font-bold text-base text-soft-text" style={{ fontFamily: font.id }}>{font.name}</p>
                      <p className="text-[11px] text-soft-text/40 mt-1 font-medium">{font.desc}</p>
                    </button>
                  ))}
                </div>
              </ConfigCard>

              <ConfigCard title="Tamaño de Lectura" icon={Smartphone}>
                <div className="flex gap-5">
                  {['Pequeña', 'Normal', 'Grande'].map((size, i) => (
                    <button key={size} onClick={() => set('fontSize', ['small', 'medium', 'large'][i])} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all journal-shadow border border-white/40 ${form.fontSize === ['small', 'medium', 'large'][i] ? 'bg-theme-primary text-white scale-105' : 'bg-white/60 text-soft-text/40'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </ConfigCard>

              <ConfigCard title="Tema de Color" icon={Palette}>
                <p className="text-[10px] font-black uppercase tracking-widest text-soft-text/30 mb-5">Paletas sugeridas</p>
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 mb-8">
                  {THEME_PALETTES.map(palette => (
                    <div key={palette.id} className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => set('themeColor', palette.color)}
                        className={`w-12 h-12 rounded-full border-2 border-white shadow-md transition-all ${form.themeColor === palette.color ? 'ring-4 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: palette.color, '--tw-ring-color': palette.color } as React.CSSProperties}
                      />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-center opacity-40">{palette.name}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-theme-border/20 pt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-soft-text/30 mb-4">O elige tu propio color</p>
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setShowPicker(!showPicker)}
                      className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0"
                      style={{ backgroundColor: form.themeColor }}
                    />
                    <div>
                      <p className="text-sm font-bold text-soft-text">{form.themeColor.toUpperCase()}</p>
                      <p className="text-[10px] text-soft-text/40">{showPicker ? 'Toca el cuadro para cerrar' : 'Toca el cuadro para abrir la paleta'}</p>
                    </div>
                  </div>
                  {showPicker && (
                    <div className="relative z-10 w-full max-w-[300px] rounded-2xl overflow-hidden border border-theme-border/30 shadow-lg" style={{ marginBottom: '1rem' }}>
                      <HexColorPicker
                        color={form.themeColor}
                        onChange={handlePickerChange}
                        style={{ width: '100%', height: '220px' }}
                      />
                    </div>
                  )}
                </div>

                {form.themeColor !== '#e11d74' && (
                  <button
                    onClick={() => set('themeColor', '#e11d74')}
                    className="mt-8 text-[11px] font-bold text-theme-primary underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    Restablecer colores originales
                  </button>
                )}
              </ConfigCard>
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
              <ConfigCard title="Usuarios del Sistema" icon={Users}>
                <div className="divide-y divide-theme-border/20">
                  {loadingAdmin ? (
                    <p className="text-center py-6 text-sm italic text-soft-text/40 font-medium animate-pulse">Conectando con la base de datos...</p>
                  ) : (
                    users.map(u => (
                      <div key={u.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-theme-pastel border border-theme-border flex items-center justify-center text-xs font-black text-theme-primary">{(u.user?.name || 'U')[0]}</div>
                          <p className="text-sm font-bold text-soft-text">{u.user?.name || 'Sin nombre'}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase px-3 py-1.5 bg-white/60 border border-theme-border/30 rounded-lg text-soft-text/60">{u.role || 'USER'}</span>
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

      {/* Botón Guardar flotante esquina */}
      <div className="fixed bottom-28 md:bottom-10 right-6 md:right-10 z-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-14 h-14 rounded-2xl bg-theme-primary text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-theme-primary/30 border-2 border-white/20"
          title="Guardar"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Configuracion;
