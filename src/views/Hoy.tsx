"use client";
import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { CheckCircle2, Circle, Plus, Heart, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Mood } from '../types';

const MOODS: { emoji: string; label: Mood }[] = [
  { emoji: '😢', label: 'triste' },
  { emoji: '😐', label: 'neutral' },
  { emoji: '🙂', label: 'bien' },
  { emoji: '😊', label: 'feliz' },
  { emoji: '🤩', label: 'genial' },
];

const Hoy: React.FC = () => {
  const { state, updateToday, user } = useJournal(); // Extraemos 'user'
  const { today, streak } = state;
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = { id: Date.now().toString(), text: newTask, completed: false };
    updateToday({ tasks: [...today.tasks, task] });
    setNewTask('');
  };

  const selectedMoodEmoji = MOODS.find(m => m.label === today.mood)?.emoji;
  
  // Obtenemos el nombre del usuario o usamos Abigail por defecto
  const firstName = user?.displayName?.split(' ')[0] || "Abigail";

  return (
    <div className="space-y-8 lg:space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl lg:text-5xl font-serif text-soft-text font-light italic leading-tight">
            Hola, {firstName}
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-deep-rose font-semibold text-sm lg:text-base tracking-wide opacity-80">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
              <Flame size={14} fill="currentColor" />
              <span>{streak} días</span>
            </div>
          </div>
        </div>
        
        {today.mood ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white/60 backdrop-blur-md p-4 rounded-[2rem] border border-rose-pastel flex items-center gap-4 shadow-sm">
            <span className="text-4xl">{selectedMoodEmoji}</span>
            <div>
              <p className="text-[10px] uppercase font-bold text-soft-text/40 tracking-widest">Hoy te sientes</p>
              <p className="text-sm font-bold text-soft-text capitalize">{today.mood}</p>
            </div>
            <button onClick={() => updateToday({ mood: null })} className="ml-2 text-deep-rose/40 hover:text-deep-rose text-xs underline">Cambiar</button>
          </motion.div>
        ) : (
          <div className="bg-white/40 backdrop-blur-sm p-5 rounded-[2rem] border border-rose-pastel/50 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest font-bold text-soft-text/40 mb-4 text-center">¿Cómo te sientes hoy?</p>
            <div className="flex justify-around gap-4">
              {MOODS.map((m) => (
                <button key={m.label} onClick={() => updateToday({ mood: m.label })} className="text-3xl hover:scale-110 transition-transform">
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] journal-shadow border border-rose-pastel/30">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles size={18} className="text-deep-rose" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-soft-text/40">Prioridades</h3>
            </div>
            <div className="space-y-4">
              {today.priorities.map((p, i) => (
                <input
                  key={i}
                  type="text"
                  value={p}
                  onChange={(e) => {
                    const newP = [...today.priorities];
                    newP[i] = e.target.value;
                    updateToday({ priorities: newP });
                  }}
                  placeholder="En qué me enfocaré..."
                  className="w-full bg-rose-pastel/10 border-none rounded-xl px-6 py-4 text-soft-text font-medium outline-none focus:bg-rose-pastel/20 transition-all"
                />
              ))}
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] journal-shadow border border-rose-pastel/30">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 size={18} className="text-deep-rose" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-soft-text/40">Tareas</h3>
            </div>
            <div className="space-y-2 mb-8">
              {today.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-rose-pastel/10 transition-all group cursor-pointer"
                  onClick={() => { updateToday({ tasks: today.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t) }); }}>
                  <div className={`transition-all ${task.completed ? 'scale-90 opacity-40' : 'group-hover:scale-110'}`}>
                    {task.completed ? <CheckCircle2 size={24} fill="#fbcfe8" className="text-white" /> : <Circle size={24} className="text-rose-pastel" />}
                  </div>
                  <span className={`flex-1 ${task.completed ? 'line-through text-soft-text/20' : 'text-soft-text font-medium'}`}>{task.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 bg-white p-2 rounded-2xl border border-rose-pastel/40">
              <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} placeholder="¿Qué más haremos hoy?" className="flex-1 bg-transparent px-4 py-3 outline-none text-soft-text" />
              <button onClick={addTask} className="bg-accent-pink text-white p-3 rounded-xl shadow-md"><Plus size={20} /></button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <section className="bg-gradient-to-br from-rose-pastel/40 to-lavender-pastel/40 p-8 rounded-[3rem] border border-white shadow-sm lg:sticky lg:top-12">
            <div className="flex flex-col items-center mb-8">
              <Heart size={24} fill="#fbcfe8" className="text-accent-pink mb-4" />
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-deep-rose/60">Gratitud</h3>
            </div>
            <div className="space-y-6">
              {today.gratitude.map((g, i) => (
                <textarea
                  key={i}
                  rows={2}
                  value={g}
                  onChange={(e) => {
                    const newG = [...today.gratitude];
                    newG[i] = e.target.value;
                    updateToday({ gratitude: newG });
                  }}
                  placeholder="Doy gracias por..."
                  className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/20 rounded-[1.5rem] p-5 outline-none focus:bg-white transition-all text-soft-text text-sm italic resize-none"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Hoy;
