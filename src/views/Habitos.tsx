"use client";
import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Plus, Check, Trash2, Edit2, Save, X } from 'lucide-react';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const Habitos: React.FC = () => {
  const { state, toggleHabitDay, addHabit, deleteHabit, updateHabit } = useJournal();
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  const currentDayIdx = (new Date().getDay() + 6) % 7;
  const habits = Array.isArray(state?.habits) ? state.habits : [];

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
    <div className="space-y-8 max-w-5xl mx-auto pb-20 px-2 sm:px-6">
      <header className="border-b border-rose-pastel/50 pb-6">
        <h2 className="text-4xl font-serif text-soft-text font-light italic">Mis Hábitos</h2>
        <p className="text-deep-rose/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Seguimiento de Disciplina</p>
      </header>

      {/* MÓVIL: CARDS */}
      <div className="block md:hidden space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white p-6 rounded-[2.5rem] journal-shadow border border-rose-pastel/50 relative">
            {editingId === habit.id ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={editEmoji} onChange={e => setEditEmoji(e.target.value)} className="w-14 text-center bg-rose-pastel/20 rounded-2xl py-3 text-2xl outline-none" />
                  <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 bg-rose-pastel/5 rounded-2xl px-4 py-3 outline-none font-bold text-soft-text" />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex-1 bg-deep-rose text-white py-3 rounded-2xl font-bold shadow-lg shadow-deep-rose/20 flex items-center justify-center gap-2"><Save size={18}/> Guardar</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-400 px-6 py-3 rounded-2xl"><X size={20}/></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-rose-pastel/30 w-12 h-12 flex items-center justify-center rounded-2xl">{habit.emoji}</span>
                    <span className="font-bold text-lg text-soft-text tracking-tight">{habit.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditing(habit)} className="p-2 text-soft-text/20 hover:text-accent-pink transition-colors"><Edit2 size={18}/></button>
                    <button onClick={() => deleteHabit(habit.id)} className="p-2 text-soft-text/20 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {(habit.completedDays || Array(7).fill(false)).map((completed: boolean, idx: number) => {
                    const isToday = idx === currentDayIdx;
                    return (
                      <div key={idx} className={`flex flex-col items-center gap-2 ${!isToday ? 'opacity-30' : ''}`}>
                        <span className={`text-[10px] font-black ${isToday ? 'text-deep-rose' : 'text-soft-text/40'}`}>{DAYS[idx][0]}</span>
                        <button disabled={!isToday} onClick={() => toggleHabitDay(habit.id, idx)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                            ${completed ? 'bg-accent-pink border-accent-pink text-white shadow-md' : 'border-rose-pastel/40'}
                            ${isToday ? 'ring-4 ring-accent-pink/10' : ''}`}>
                          {completed && <Check size={18} strokeWidth={3} />}
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

      {/* ESCRITORIO: TABLA PREMIUM */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-[3rem] journal-shadow border border-rose-pastel/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-rose-pastel/30">
              <th className="p-8 text-deep-rose font-black uppercase text-[11px] tracking-[0.2em]">Hábito</th>
              {DAYS.map((day, i) => (
                <th key={i} className={`p-8 text-center text-[11px] font-black uppercase tracking-widest ${i === currentDayIdx ? 'text-deep-rose bg-white/40' : 'text-soft-text/30'}`}>{day}</th>
              ))}
              <th className="p-8 text-center text-deep-rose font-black uppercase text-[11px] tracking-widest">Meta</th>
              <th className="p-8"></th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className="border-t border-rose-pastel/20 hover:bg-white/50 transition-all group">
                <td className="p-8">
                  {editingId === habit.id ? (
                    <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-inner border border-rose-pastel/50">
                      <input value={editEmoji} onChange={e => setEditEmoji(e.target.value)} className="w-12 text-center bg-rose-pastel/20 rounded-xl p-2 text-xl outline-none" />
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-transparent px-2 py-2 outline-none w-48 font-bold text-soft-text" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-3xl bg-rose-pastel/20 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{habit.emoji}</span>
                      <span className="font-bold text-lg text-soft-text tracking-tight">{habit.name}</span>
                    </div>
                  )}
                </td>
                {(habit.completedDays || Array(7).fill(false)).map((completed: boolean, idx: number) => {
                  const isToday = idx === currentDayIdx;
                  return (
                    <td key={idx} className={`p-4 text-center ${isToday ? 'bg-rose-pastel/5' : ''}`}>
                      <button disabled={!isToday} onClick={() => toggleHabitDay(habit.id, idx)}
                        className={`w-12 h-12 rounded-full inline-flex items-center justify-center border-2 transition-all
                          ${completed ? 'bg-accent-pink border-accent-pink text-white scale-110 shadow-lg' : 'border-rose-pastel/30 hover:border-accent-pink'}
                          ${isToday ? 'ring-8 ring-accent-pink/5' : 'opacity-20 cursor-not-allowed'}`}>
                        {completed && <Check size={20} strokeWidth={3} />}
                      </button>
                    </td>
                  );
                })}
                <td className="p-8 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-xl font-black text-deep-rose">{(habit.completedDays || []).filter(Boolean).length}</span>
                    <span className="text-[9px] font-bold text-soft-text/30 uppercase">de 7</span>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all justify-end">
                    {editingId === habit.id ? (
                      <button onClick={saveEdit} className="bg-deep-rose text-white p-3 rounded-xl shadow-md hover:scale-110 transition-transform"><Save size={18}/></button>
                    ) : (
                      <button onClick={() => startEditing(habit)} className="p-3 bg-white border border-rose-pastel/50 text-soft-text/40 hover:text-accent-pink rounded-xl shadow-sm hover:scale-110 transition-all"><Edit2 size={16}/></button>
                    )}
                    <button onClick={() => deleteHabit(habit.id)} className="p-3 bg-white border border-rose-pastel/50 text-soft-text/40 hover:text-red-400 rounded-xl shadow-sm hover:scale-110 transition-all"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORMULARIO DE CREAR: WEB Y MOVIL */}
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-white shadow-xl">
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-deep-rose/40 uppercase mb-2 ml-2">Icono</span>
            <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} className="w-20 text-center bg-rose-pastel/30 rounded-2xl py-4 text-2xl shadow-inner border border-transparent focus:border-accent-pink outline-none transition-all" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-black text-deep-rose/40 uppercase mb-2 ml-2">¿Qué nuevo hábito quieres empezar?</span>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Leer 10 páginas, Beber agua..." className="w-full bg-transparent border-none outline-none text-soft-text font-bold text-lg py-4 px-2 placeholder:text-soft-text/20 italic" />
          </div>
        </div>
        <button type="submit" className="bg-deep-rose text-white px-12 py-5 rounded-[1.5rem] hover:bg-pink-700 transition-all font-black text-sm uppercase tracking-widest shadow-lg shadow-deep-rose/20 self-center">
          Crear Hábito
        </button>
      </form>
    </div>
  );
};

export default Habitos;
