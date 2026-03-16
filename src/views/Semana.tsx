"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournal } from '../context/JournalContext';
import { Calendar, CheckCircle2, Circle, Star, Sparkles, TrendingUp, Heart, BookOpen, X, Flame, ArrowRight } from 'lucide-react';
import { DayData, Mood } from '../types';

const MOOD_EMOJIS: Record<string, string> = {
  triste: '😢',
  neutral: '😐',
  bien: '🙂',
  feliz: '😊',
  genial: '🤩',
};

const DayDetailModal = ({ day, onClose }: { day: { date: Date; data: DayData; dayName: string; dayNum: number; isToday: boolean }; onClose: () => void }) => {
  const { state, updateToday } = useJournal();
  const [passed, setPassed] = useState(false);
  const d = day.data;
  const dateStr = day.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const completedTasks = d.tasks?.filter(t => t.completed) || [];
  const pendingTasks = d.tasks?.filter(t => !t.completed) || [];

  const handlePassToToday = async () => {
    if (pendingTasks.length === 0) return;
    
    const newTasks = pendingTasks.map((t, index) => ({
      id: Date.now().toString() + index,
      text: t.text,
      completed: false
    }));

    const currentTasks = state.today.tasks || [];
    await updateToday({ tasks: [...currentTasks, ...newTasks] });
    
    setPassed(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(45,10,30,.45)', backdropFilter: 'blur(5px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="bg-theme-primary p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{day.isToday ? 'Hoy' : 'Historial'}</p>
            <h3 className="text-lg sm:text-xl font-serif italic text-white font-bold capitalize truncate">{dateStr}</h3>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {d.mood && <span className="text-3xl">{MOOD_EMOJIS[d.mood]}</span>}
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Prioridades */}
          {d.priorities?.filter(Boolean).length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-theme-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-text/40">Prioridades</p>
              </div>
              <div className="space-y-2">
                {d.priorities.filter(Boolean).map((p, i) => (
                  <p key={i} className="text-sm font-medium text-soft-text bg-theme-pastel/50 p-3 rounded-xl break-words">{p}</p>
                ))}
              </div>
            </section>
          )}

          {/* Tareas completadas */}
          {completedTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-green-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600/60">Completadas ({completedTasks.length})</p>
              </div>
              <div className="space-y-1.5">
                {completedTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 border border-green-100/50">
                    <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                    <span className="text-sm text-soft-text/50 line-through break-words">{t.text}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tareas pendientes */}
          {pendingTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Circle size={14} className="text-theme-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-primary/60">Pendientes ({pendingTasks.length})</p>
              </div>
              <div className="space-y-1.5">
                {pendingTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-theme-pastel/50 border border-theme-border/50">
                    <Circle size={14} className="text-theme-primary/30 shrink-0" />
                    <span className="text-sm font-medium text-soft-text break-words">{t.text}</span>
                  </div>
                ))}

                {!day.isToday && (
                  <button
                    onClick={handlePassToToday}
                    disabled={passed}
                    className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      passed ? 'bg-green-500 text-white' : 'bg-theme-primary text-white'
                    }`}
                  >
                    {passed ? (
                      <><CheckCircle2 size={14} /> ¡Pasadas a hoy!</>
                    ) : (
                      <><ArrowRight size={14} /> Pasar pendientes a hoy</>
                    )}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Sin tareas */}
          {(!d.tasks || d.tasks.length === 0) && (
            <p className="text-sm italic text-soft-text/30 text-center py-2">Sin tareas registradas</p>
          )}

          {/* Gratitud */}
          {d.gratitude?.filter(Boolean).length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Heart size={14} className="text-theme-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-text/40">Gratitud</p>
              </div>
              <div className="space-y-2">
                {d.gratitude.filter(Boolean).map((g, i) => (
                  <p key={i} className="text-sm italic text-soft-text/70 bg-white/40 p-3 rounded-xl border border-theme-border/20 break-words">"{g}"</p>
                ))}
              </div>
            </section>
          )}

          {/* Devocional */}
          {d.devocionalRef && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={14} className="text-theme-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-text/40">Devocional</p>
              </div>
              <blockquote className="text-sm italic text-soft-text leading-relaxed border-l-2 border-theme-primary pl-4 break-words">
                {d.devocionalVerse && `"${d.devocionalVerse}"`}
                <span className="block text-[10px] font-black uppercase text-theme-primary/40 mt-2">— {d.devocionalRef}</span>
              </blockquote>
              {d.devocionalReflection && (
                <p className="text-sm text-soft-text/50 mt-3 italic break-words">Reflexión: {d.devocionalReflection}</p>
              )}
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Semana: React.FC = () => {
  const { state, getHistory } = useJournal();
  const history = getHistory() || [];
  const today = state.today;
  const [selectedDay, setSelectedDay] = useState<any | null>(null);

  const allData = useMemo(() => {
    const combined = [...history];
    const todayISO = new Date(today.date).toISOString().split('T')[0];
    const exists = combined.some(d => new Date(d.date).toISOString().split('T')[0] === todayISO);
    if (!exists) combined.push(today);
    return combined;
  }, [history, today]);

  const weekDays = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dISO = d.toISOString().split('T')[0];
      const dayData = allData.find(data => new Date(data.date).toISOString().split('T')[0] === dISO);
      days.push({
        date: d,
        isToday: i === 0,
        data: dayData || null,
        dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
        dayNum: d.getDate(),
      });
    }
    return days;
  }, [allData]);

  const stats = useMemo(() => {
    const activeDays = weekDays.filter(d => d.data && d.data.mood).length;
    let totalTasks = 0;
    let completedTasks = 0;
    const moodCounts: Record<string, number> = {};
    weekDays.forEach(d => {
      if (d.data) {
        totalTasks += d.data.tasks?.length || 0;
        completedTasks += d.data.tasks?.filter(t => t.completed).length || 0;
        if (d.data.mood) {
          moodCounts[d.data.mood] = (moodCounts[d.data.mood] || 0) + 1;
        }
      }
    });
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as Mood;
    return { activeDays, completedTasks, totalTasks, dominantMood };
  }, [weekDays]);

  const dateRangeStr = useMemo(() => {
    const start = weekDays[0].date;
    const end = weekDays[6].date;
    const startMonth = start.toLocaleDateString('es-ES', { month: 'long' });
    const endMonth = end.toLocaleDateString('es-ES', { month: 'long' });
    if (startMonth === endMonth) {
      return `${start.getDate()} — ${end.getDate()} de ${endMonth}`;
    }
    return `${start.getDate()} de ${startMonth.split(' ')[0]} — ${end.getDate()} de ${endMonth}`;
  }, [weekDays]);

  if (stats.activeDays === 0 && !today.mood) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center shadow-sm border border-theme-border">
          <Calendar size={32} className="text-theme-primary/30" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif italic text-2xl text-soft-text">Tu semana está por florecer</h2>
          <p className="text-sm text-soft-text/60 max-w-[280px]">Completa tus días para ver tu resumen y progreso aquí</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-soft-text/40 font-black mb-2">
          {dateRangeStr}
        </p>
        <h1 className="font-serif italic text-theme-primary text-4xl lg:text-5xl leading-tight">Esta semana</h1>
      </header>

      {/* Grid de días */}
      <section className="card-premium overflow-hidden">
        <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:gap-4">
          {weekDays.map((day, idx) => {
            const hasTasks = day.data && day.data.tasks && day.data.tasks.length > 0;
            const hasData = day.data && (day.data.mood || (day.data.tasks && day.data.tasks.length > 0));
            return (
              <button
                key={idx}
                onClick={() => hasData ? setSelectedDay(day) : null}
                className={`
                  flex-1 min-w-[75px] sm:min-w-[85px] aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-32
                  rounded-[2rem] p-3 sm:p-4 text-center transition-all flex flex-col justify-between items-center
                  ${hasData ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
                  ${day.isToday
                    ? "bg-white border-2 border-theme-primary shadow-md scale-105 z-10"
                    : day.data?.mood
                      ? "bg-white/80 border border-theme-border shadow-sm hover:shadow-md"
                      : "bg-white/30 border border-white/40 opacity-60"
                  }
                `}
              >
                <div className="space-y-0.5">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${day.isToday ? 'text-theme-primary' : 'text-soft-text/30'}`}>
                    {day.dayName}
                  </p>
                  <p className={`font-serif text-lg sm:text-xl font-bold ${day.isToday ? 'text-theme-primary' : 'text-soft-text'}`}>
                    {day.dayNum}
                  </p>
                </div>

                <div className="text-xl sm:text-2xl h-8 flex items-center justify-center">
                  {day.data?.mood ? MOOD_EMOJIS[day.data.mood] : '—'}
                </div>

                {hasTasks && (
                  <div className="w-full h-1 bg-theme-pastel/30 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-theme-primary/40"
                      style={{ width: `${(day.data!.tasks.filter(t => t.completed).length / day.data!.tasks.length) * 100}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-soft-text/30 text-center mt-4 italic">Toca un día para ver el detalle</p>
      </section>

      {/* Resumen Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={18} className="text-theme-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-text/40">Resumen de Actividad</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-pastel/50 p-5 rounded-3xl border border-theme-border/50">
              <p className="text-[10px] uppercase font-black text-theme-primary/40 tracking-wider mb-2">Días Activos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif text-theme-primary">{stats.activeDays}</span>
                <span className="text-[10px] text-theme-primary/60 font-bold">/ 7</span>
              </div>
            </div>

            <div className="bg-white/60 p-5 rounded-3xl border border-theme-border/50">
              <p className="text-[10px] uppercase font-black text-soft-text/30 tracking-wider mb-2">Tareas</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif text-soft-text">{stats.completedTasks}</span>
                <span className="text-[10px] text-soft-text/40 font-bold">/ {stats.totalTasks}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={18} className="text-theme-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-soft-text/40">Tu Brillo</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-4xl shadow-inner-sm border border-theme-border shrink-0">
              {stats.dominantMood ? MOOD_EMOJIS[stats.dominantMood] : '✨'}
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-soft-text/30 tracking-wider mb-1">Ánimo Predominante</p>
              <p className="text-lg font-bold text-soft-text capitalize">
                {stats.dominantMood || '¡Pronto lo sabremos!'}
              </p>
              <p className="text-[11px] text-soft-text/40 italic mt-1">
                {stats.activeDays > 3 ? '¡Estás teniendo una gran semana!' : 'Sigue registrando tus momentos.'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Nota de pie */}
      <footer className="text-center pb-10">
        <p className="text-[11px] text-soft-text/30 italic flex items-center justify-center gap-2">
          <Star size={12} fill="currentColor" />
          Cada paso cuenta en tu camino
          <Star size={12} fill="currentColor" />
        </p>
      </footer>

      {/* Modal detalle del día */}
      <AnimatePresence>
        {selectedDay && selectedDay.data && (
          <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Semana;
