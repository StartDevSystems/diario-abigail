"use client";
import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Plus, Check, Trash2, Edit2, Save, X } from 'lucide-react';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const Habitos: React.FC = () => {
  const { state, toggleHabitDay, addHabit, deleteHabit, updateHabit } = useJournal();
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');
  
  // Estado para edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  // Lógica para saber qué día es hoy (0 = Lunes, 6 = Domingo)
  const currentDayIdx = (new Date().getDay() + 6) % 7;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addHabit(newName, newEmoji);
      setNewName('');
    }
  };

  const startEditing = (habit: any) => {
    setEditingId(habit.id);
    setEditName(habit.name);
    setEditEmoji(habit.emoji);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateHabit(editingId, editName, editEmoji);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 px-2 sm:px-4">
      <header className="border-b border-rose-pastel pb-4">
        <h2 className="text-3xl font-serif text-soft-text font-light italic">Mis Hábitos</h2>
        <p className="text-soft-text/60 text-xs font-bold uppercase tracking-widest mt-1">Disciplina y Constancia</p>
      </header>

      {/* VISTA MÓVIL: Tarjetas */}
      <div className="block md:hidden space-y-4">
        {state.habits.map((habit) => (
          <div key={habit.id} className="bg-white p-5 rounded-[2rem] journal-shadow border border-rose-pastel/50 relative group">
            {editingId === habit.id ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={editEmoji} onChange={e => setEditEmoji(e.target.value)} className="w-12 text-center bg-rose-pastel/20 rounded-xl p-2" />
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 bg-rose-pastel/10 rounded-xl px-3 outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex-1 bg-accent-pink text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={16}/> Guardar</button>
                  <button onClick={() => setEditingId(null)} className="bg-soft-text/10 text-soft-text px-4 py-2 rounded-xl"><X size={16}/></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.emoji}</span>
                    <span className="font-bold text-soft-text">{habit.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEditing(habit)} className="text-soft-text/20 hover:text-accent-pink p-1"><Edit2 size={14}/></button>
                    <button onClick={() => deleteHabit(habit.id)} className="text-soft-text/20 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {habit.completedDays.map((completed, idx) => {
                    const isToday = idx === currentDayIdx;
                    return (
                      <div key={idx} className={`flex flex-col items-center gap-1 ${!isToday ? 'opacity-40' : ''}`}>
                        <span className={`text-[9px] font-bold ${isToday ? 'text-deep-rose' : 'text-soft-text/40'}`}>{DAYS[idx]}</span>
                        <button
                          disabled={!isToday}
                          onClick={() => toggleHabitDay(habit.id, idx)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                            ${completed ? 'bg-accent-pink border-accent-pink text-white' : 'border-rose-pastel/30'}
                            ${isToday ? 'ring-2 ring-accent-pink/20 shadow-sm' : 'cursor-not-allowed'}`}
                        >
                          {completed && <Check size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* VISTA DESKTOP: Tabla */}
      <div className="hidden md:block bg-white rounded-[2.5rem] journal-shadow border border-rose-pastel/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-rose-pastel/20">
              <th className="p-6 text-deep-rose font-bold uppercase text-[10px] tracking-widest">Hábito</th>
              {DAYS.map((day, i) => (
                <th key={i} className={`p-6 text-center text-[10px] font-bold ${i === currentDayIdx ? 'text-deep-rose scale-110' : 'text-soft-text/40'}`}>{day}</th>
              ))}
              <th className="p-6 text-center text-deep-rose font-bold uppercase text-[10px] tracking-widest">Progreso</th>
              <th className="p-6"></th>
            </tr>
          </thead>
          <tbody>
            {state.habits.map((habit) => (
              <tr key={habit.id} className="border-t border-rose-pastel/10 hover:bg-lavender-pastel/5 transition-colors group">
                <td className="p-6">
                  {editingId === habit.id ? (
                    <div className="flex gap-2">
                      <input value={editEmoji} onChange={e => setEditEmoji(e.target.value)} className="w-10 text-center bg-rose-pastel/20 rounded-lg p-1" />
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-rose-pastel/10 rounded-lg px-2 outline-none w-32" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.emoji}</span>
                      <span className="font-medium text-soft-text">{habit.name}</span>
                    </div>
                  )}
                </td>
                {habit.completedDays.map((completed, idx) => {
                  const isToday = idx === currentDayIdx;
                  return (
                    <td key={idx} className="p-4 text-center">
                      <button
                        disabled={!isToday}
                        onClick={() => toggleHabitDay(habit.id, idx)}
                        className={`w-10 h-10 rounded-full inline-flex items-center justify-center border-2 transition-all
                          ${completed ? 'bg-accent-pink border-accent-pink text-white scale-110 shadow-sm' : 'border-rose-pastel/30 hover:border-accent-pink'}
                          ${isToday ? 'ring-4 ring-accent-pink/10' : 'opacity-30 cursor-not-allowed'}`}
                      >
                        {completed && <Check size={16} />}
                      </button>
                    </td>
                  );
                })}
                <td className="p-6 text-center">
                  <span className="bg-lavender-pastel text-deep-rose px-4 py-2 rounded-full text-xs font-bold">
                    {habit.completedDays.filter(Boolean).length}/7
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === habit.id ? (
                      <button onClick={saveEdit} className="text-accent-pink hover:scale-110"><Save size={18}/></button>
                    ) : (
                      <button onClick={() => startEditing(habit)} className="text-soft-text/30 hover:text-accent-pink"><Edit2 size={16}/></button>
                    )}
                    <button onClick={() => deleteHabit(habit.id)} className="text-soft-text/30 hover:text-red-400"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario de añadir */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 bg-white/60 backdrop-blur-sm p-4 rounded-[2rem] border border-rose-pastel/30 shadow-sm">
        <div className="flex gap-2 flex-1">
          <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} className="w-14 text-center bg-white rounded-2xl p-3 text-xl shadow-inner" placeholder="✨" />
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="¿Qué nueva disciplina quieres cultivar?" className="flex-1 bg-transparent border-none outline-none text-soft-text font-medium px-2 placeholder:text-soft-text/20 italic" />
        </div>
        <button type="submit" className="bg-accent-pink text-white px-10 py-4 rounded-2xl hover:bg-deep-rose transition-all font-bold shadow-lg shadow-accent-pink/20">
          Crear Hábito
        </button>
      </form>
    </div>
  );
};

export default Habitos;
