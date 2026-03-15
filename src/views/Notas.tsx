"use client";
import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { StickyNote, Plus, Trash2, Calendar } from 'lucide-react';

const Notas: React.FC = () => {
  const { state, addNote, deleteNote } = useJournal();
  const [newContent, setNewContent] = useState('');

  const handleAdd = () => {
    if (newContent.trim()) {
      addNote(newContent);
      setNewContent('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <header className="border-b border-[#ffd6e7] pb-6">
        <h2 className="text-4xl font-serif text-[#e11d74] font-light italic">Mis Notas</h2>
        <p className="text-[#1d1d1f]/60 font-medium text-sm mt-1">Captura tus ideas y reflexiones</p>
      </header>

      <div className="card-premium p-6 flex gap-4">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Escribe un nuevo pensamiento... 🌸"
          className="flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-[#ffd6e7] outline-none text-[#1d1d1f] resize-none h-32 italic transition-all focus:border-[#e11d74]"
        />
        <button onClick={handleAdd} className="bg-[#e11d74] text-white p-5 rounded-2xl hover:scale-105 active:scale-95 transition-all self-end shadow-lg shadow-[#e11d74]/20">
          <Plus size={28} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        {state.notes.map((note) => (
          <div key={note.id} className="card-premium p-8 relative group transition-all">
            <button 
              onClick={() => deleteNote(note.id)}
              className="absolute top-6 right-6 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
            >
              <Trash2 size={20} />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <Calendar size={14} className="text-[#e11d74] mt-0.5" />
              <span className="text-[10px] font-black text-[#1d1d1f]/40 tracking-[0.2em] uppercase">
                {new Date(note.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <p className="text-[#1d1d1f] leading-relaxed whitespace-pre-wrap italic text-base">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notas;
